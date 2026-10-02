import { useEffect, useRef, useState, type CSSProperties } from "react";
import { choreograph } from "@/lib/brand-animation";

/**
 * Full-screen brand preloader that assembles the official B.R.P. Foundation logo.
 *
 * It animates the designer-exported, layered SVG at `src` (see docs/brand-preloader.md for
 * the required layer ids). Nothing is traced or redrawn here: the SVG is injected as-is and
 * only its existing layers are revealed, each leaf individually and in its original place.
 *
 * Fail-safe by design: if the SVG is missing, fails to load, or lacks the required layers,
 * the loader dismisses immediately. A CSS timeout also removes it if JavaScript never runs.
 */

type Props = {
  /** Layered SVG exported from the official logo source. */
  src?: string;
  /** Length of the build-up animation (ms), before the hold. */
  duration?: number;
  /** How long the finished logo is held before fading into the site (ms). */
  hold?: number;
  /** Fade-out into the website (ms). */
  exit?: number;
  /** Leaves in the official logo (24 in the reference); a mismatch is logged, never "fixed". */
  expectedLeaves?: number;
  onComplete?: () => void;
};

const REQUIRED = ["brp-ring", "brp-trunk", "brp-leaves", "brp-ground", "brp-text"];
export function BrandPreloader({
  src = "/brand/brp-logo-layered.svg",
  duration = 3200,
  hold = 500,
  exit = 600,
  expectedLeaves = 24,
  onComplete,
}: Props) {
  const [phase, setPhase] = useState<"active" | "leaving" | "done">("active");
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let finished = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      setPhase("leaving");
      later(() => {
        setPhase("done");
        document.documentElement.classList.remove("brand-preloading");
        onComplete?.();
      }, exit);
    };
    const bail = (reason: string) => {
      console.warn(`[BrandPreloader] skipped: ${reason}`);
      finish();
    };

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // CSS already hides the overlay for these visitors; just clean up.
      setPhase("done");
      return;
    }

    document.documentElement.classList.add("brand-preloading");
    // Never wait on the network for long: give up if the SVG hasn't arrived in time.
    later(() => bail("SVG took too long to load"), 2500);

    fetch(src)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((markup) => {
        if (cancelled || finished) return;
        const stage = stageRef.current;
        if (!stage || !markup.includes("<svg")) return bail("not an SVG");
        stage.innerHTML = markup;
        const svg = stage.querySelector("svg");
        const missing = REQUIRED.filter((id) => !svg?.querySelector(`#${id}`));
        if (!svg || missing.length) return bail(`missing layers: ${missing.join(", ")}`);

        timers.forEach(clearTimeout); // loaded in time: cancel the slow-network bail-out
        timers.length = 0;
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.setAttribute("aria-hidden", "true");
        svg.classList.add("bp-armed");
        choreograph(svg, duration, expectedLeaves);
        later(finish, duration + hold);
      })
      .catch((err: unknown) => bail(err instanceof Error ? err.message : "load failed"));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      document.documentElement.classList.remove("brand-preloading");
    };
  }, [src, duration, hold, exit, expectedLeaves, onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={phase === "leaving" ? "brand-preloader is-leaving" : "brand-preloader"}
      role="status"
      aria-label="Loading BRP Foundation"
      style={
        {
          "--bp-exit": `${exit}ms`,
          "--bp-failsafe": `${duration + hold + 3000}ms`,
        } as CSSProperties
      }
    >
      <div ref={stageRef} className="brand-preloader-stage" />
    </div>
  );
}
