import { useEffect, useRef } from "react";
import { choreograph } from "@/lib/brand-animation";

// Layers kept from the layered logo: the tree only (no ring, lettering or gold dots).
const TREE_LAYERS = ["brp-ground", "brp-trunk", "brp-branches", "brp-head", "brp-leaves"];
const DROP_LAYERS = ["brp-ring", "brp-text", "brp-accents"];

// The tree from the B.R.P. Foundation logo, building itself like the loader (trunk grows,
// leaves appear one by one) each time it scrolls into view. Uses the same layered
// SVG as the preloader, cropped to the tree. Renders nothing if the SVG is unavailable.
export function TreeMark({
  src = "/brand/brp-logo-layered.svg",
  duration = 2600,
  className = "",
}: {
  src?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let cancelled = false;
    let enter: IntersectionObserver | undefined;
    let leave: IntersectionObserver | undefined;
    let shown = false;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    fetch(src)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((markup) => {
        if (cancelled || !markup.includes("<svg")) return;
        const show = () => {
          host.innerHTML = markup;
          const svg = host.querySelector("svg");
          if (!svg) return;
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.setAttribute("aria-hidden", "true");
          // Drop the full-canvas background and everything that isn't the tree
          svg.querySelector(":scope > rect")?.remove();
          DROP_LAYERS.forEach((id) => svg.querySelector(`#${id}`)?.remove());
          // Crop the view to the tree's own bounds
          const boxes = TREE_LAYERS.map((id) => svg.querySelector<SVGGraphicsElement>(`#${id}`))
            .filter((el): el is SVGGraphicsElement => !!el)
            .map((el) => el.getBBox());
          if (boxes.length) {
            const x0 = Math.min(...boxes.map((b) => b.x));
            const y0 = Math.min(...boxes.map((b) => b.y));
            const x1 = Math.max(...boxes.map((b) => b.x + b.width));
            const y1 = Math.max(...boxes.map((b) => b.y + b.height));
            const pad = 4;
            svg.setAttribute(
              "viewBox",
              `${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}`,
            );
          }
          if (!still) {
            svg.classList.add("bp-armed");
            choreograph(svg, duration, 24);
          }
        };

        if (still || !("IntersectionObserver" in window)) return show();
        // Builds each time the tree comes into view: once it has fully left the screen it
        // is cleared, ready to grow again on the next visit
        enter = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting || shown) return;
            shown = true;
            show();
          },
          // Wait until the tree is fully on screen and clear of the bottom third, so the
          // build plays where the visitor is looking (not while the card is still rising in)
          { threshold: 1, rootMargin: "0px 0px -33% 0px" },
        );
        leave = new IntersectionObserver(([entry]) => {
          if (entry?.isIntersecting || !shown) return;
          shown = false;
          host.innerHTML = "";
        });
        enter.observe(host);
        leave.observe(host);
      })
      .catch(() => {
        /* decorative: leave the space empty if the logo can't load */
      });

    return () => {
      cancelled = true;
      enter?.disconnect();
      leave?.disconnect();
    };
  }, [src, duration]);

  return (
    <div
      ref={ref}
      className={`tree-mark ${className}`}
      role="img"
      aria-label="BRP Foundation tree"
    />
  );
}
