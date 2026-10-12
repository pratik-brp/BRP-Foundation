import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";

function splitGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const Segmenter = (
      Intl as unknown as {
        Segmenter: new (
          locales?: string | string[],
          options?: { granularity?: string },
        ) => {
          segment: (input: string) => Iterable<{ segment: string }>;
        };
      }
    ).Segmenter;
    const segmenter = new Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return [...text];
}

// Heading that reveals character by character from a blur (Edefy's text effect).
// Optional `accent` text is appended and styled via .blur-accent; with `stacked` it
// starts on a line of its own.
// Screen readers get the plain text; the per-character spans are hidden from them.
export function BlurText({
  text,
  accent,
  as: Tag = "h2",
  className = "",
  stacked = false,
}: {
  text: string;
  accent?: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  stacked?: boolean;
}) {
  let i = 0;
  const textWords = text.split(" ").length;
  const words = [
    ...text.split(" ").map((word) => [word, false] as const),
    ...(accent ? accent.split(" ").map((word) => [word, true] as const) : []),
  ];
  return (
    <Tag className={`blur-text ${className}`}>
      <span className="sr-only">{accent ? `${text} ${accent}` : text}</span>
      <span aria-hidden="true">
        {words.map(([word, isAccent], w) => (
          <Fragment key={w}>
            {w > 0 && (stacked && w === textWords ? <br /> : " ")}
            <span className={isAccent ? "blur-word blur-accent" : "blur-word"}>
              {splitGraphemes(word).map((ch, c) => (
                <span key={c} style={{ "--i": i++ } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}

// Number that counts up from zero the first time it scrolls into view.
export function CountUp({
  end,
  suffix = "",
  duration = 1800,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(end);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      !("IntersectionObserver" in window) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let frame = 0;
    setValue(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          setValue(Math.round(end * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

// Auto-advancing photo slideshow with story-style progress bars. The active bar's
// CSS animation is the timer: when it ends we advance, so pausing the animation
// (hover, focus, off-screen, reduced motion) pauses the slideshow too.
export function PhotoRotator({
  slides,
  interval = 5500,
  tag,
}: {
  slides: readonly (readonly [src: string, caption: string])[];
  interval?: number;
  tag?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = slides[active];
  if (!current) return null;

  return (
    <div
      className="photo-rotator"
      style={{ "--interval": `${interval}ms` } as CSSProperties}
      data-paused={paused || undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map(([src, caption], i) => (
        <img
          key={src}
          src={src}
          alt={i === active ? caption : ""}
          aria-hidden={i !== active}
          className={i === active ? "is-active" : undefined}
        />
      ))}
      <div className="rotator-bars">
        {slides.map(([src, caption], i) => (
          <button
            key={src}
            type="button"
            aria-label={`Show photo ${i + 1} of ${slides.length}: ${caption}`}
            aria-current={i === active}
            className={i < active ? "is-done" : i === active ? "is-active" : undefined}
            onClick={() => setActive(i)}
          >
            <span
              onAnimationEnd={(e) => {
                if (e.animationName === "bar-fill") setActive((a) => (a + 1) % slides.length);
              }}
            />
          </button>
        ))}
      </div>
      <div className="rotator-caption">
        <div key={active}>
          {tag && <small>{tag}</small>}
          <p>{current[1]}</p>
        </div>
        <span className="rotator-count">
          {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

// Writes the element's scroll progress to its `--p` custom property: 0 while its top
// edge sits at `start` × viewport height, rising to 1 as the top reaches `end` × height.
// With `completeAtPageEnd`, progress also reaches 1 once the page is scrolled to the
// bottom, for elements near the end of a page that can never scroll up far enough.
export function useScrollProgress<T extends HTMLElement>(
  start = 1,
  end = 0,
  completeAtPageEnd = false,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const atPageEnd =
        completeAtPageEnd && window.scrollY + vh >= document.documentElement.scrollHeight - 2;
      const p = atPageEnd
        ? 1
        : (start * vh - el.getBoundingClientRect().top) / ((start - end) * vh);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [start, end, completeAtPageEnd]);

  return ref;
}

// Paragraph whose words brighten one after another as it scrolls up the viewport.
export function ScrollHighlight({ text, className = "" }: { text: string; className?: string }) {
  const ref = useScrollProgress<HTMLParagraphElement>(0.9, 0.5, true);
  const words = text.split(" ");
  return (
    <p
      ref={ref}
      className={`scroll-highlight ${className}`}
      style={{ "--n": words.length } as CSSProperties}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span style={{ "--i": i } as CSSProperties}>{word}</span>
        </Fragment>
      ))}
    </p>
  );
}
