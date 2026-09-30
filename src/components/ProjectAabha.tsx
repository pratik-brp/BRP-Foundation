import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { Eyebrow } from "./SiteChrome";
import { BlurText } from "./Motion";

type Page =
  | { kind: "text"; label: string; body: string; cta?: boolean }
  | { kind: "photo"; src: string; caption: string };

const pages: Page[] = [
  {
    kind: "text",
    label: "01",
    body: "Project आभा is BRP Foundation’s flagship education initiative, dedicated to nurturing a culture of reading and lifelong learning among children attending government schools across Nepal.",
  },
  {
    kind: "photo",
    src: "/gallery/002.jpg",
    caption: "Shree Shanti Vidyagriha Secondary School book distribution",
  },
  {
    kind: "text",
    label: "02",
    body: "Implemented in partnership with Himalayan Hopes, the initiative provides carefully selected storybooks, learning resources, and educational materials to schools where access to extracurricular reading remains limited. But its ambition reaches beyond book donations: Project आभा is helping create environments where children can explore ideas, imagine new futures, and discover the joy of learning for themselves.",
  },
  {
    kind: "photo",
    src: "/gallery/018.jpg",
    caption: "Nurturing curiosity with Kids Story World collections",
  },
  {
    kind: "text",
    label: "03",
    body: "From its initial school partnerships in Kathmandu to expansion across the valley and beyond, Project आभा continues to grow with one clear purpose — to make quality reading resources accessible to every child.",
    cta: true,
  },
  {
    kind: "photo",
    src: "/gallery/019.jpg",
    caption: "Inspiring the next generation across 4 districts",
  },
];

// Counter shows chapters (the text pages), not every page: a photo keeps the number of
// the chapter before it
const CHAPTERS = pages.filter((page) => page.kind === "text").length;
const chapterAt = (index: number) =>
  Math.max(1, pages.slice(0, index + 1).filter((page) => page.kind === "text").length);

// Position of a photo among the photos only, so photos alternate high/low in turn
const photoIndex = (index: number) =>
  pages.slice(0, index).filter((page) => page.kind === "photo").length;

const LAST_CHAPTER = pages.map((page) => page.kind).lastIndexOf("text");

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// Project आभा as a horizontal "storybook": the section pins and vertical scrolling moves
// a track of text and photo pages sideways. The page crossing the centre comes forward
// (--f), a large आभा watermark drifts behind (--p). Reduced motion gets a native swipe
// carousel instead (no pinning).
export function ProjectAabha() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    const pageEls = Array.from(track.children) as HTMLElement[];
    // Pins on every screen size; only reduced motion gets the swipe carousel instead
    const pinned = matchMedia("(prefers-reduced-motion: no-preference)");
    let travel = 0;
    let frame = 0;
    // Page centres along the track; the spotlight sweeps from the first to the last
    let centres: number[] = [];

    const measure = () => {
      if (!pinned.matches) {
        stage.style.height = "";
        track.style.transform = "";
        pageEls.forEach((el) => el.style.removeProperty("--f"));
        travel = 0;
        return;
      }
      // Measured from the last page (scrollWidth overstates it), so the final page stops
      // the same distance from the right edge as the first starts from the left
      const lastPage = pageEls[pageEls.length - 1];
      const edge = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      travel = lastPage
        ? Math.max(0, lastPage.offsetLeft + lastPage.offsetWidth + edge - track.clientWidth)
        : 0;
      stage.style.height = `${travel + window.innerHeight}px`;
      centres = pageEls.map((el) => el.offsetLeft + el.offsetWidth / 2);
    };

    const update = () => {
      frame = 0;
      if (!pinned.matches || !centres.length) return;
      const p = travel > 0 ? clamp01(-stage.getBoundingClientRect().top / travel) : 0;
      track.style.transform = `translate3d(${-p * travel}px, 0, 0)`;
      stage.style.setProperty("--p", p.toFixed(4));
      const first = centres[0] ?? 0;
      const last = centres[centres.length - 1] ?? 0;
      const focus = first + p * (last - first);
      const spacing = (last - first) / Math.max(1, centres.length - 1);
      let nearest = 0;
      let best = Infinity;
      centres.forEach((c, i) => {
        const d = Math.abs(c - focus);
        // The last chapter (with the button) stays fully lit once reached, even as the
        // spotlight moves on to its photo
        const f = i === LAST_CHAPTER && focus >= c ? 1 : clamp01(1 - d / (spacing * 1.4));
        pageEls[i]?.style.setProperty("--f", f.toFixed(3));
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      setCurrent(chapterAt(nearest));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    pinned.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      pinned.removeEventListener("change", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="storybook">
      <div ref={stageRef} className="sb-stage">
        <div className="sb-pin">
          <header className="sb-head container">
            <div className="rise">
              <Eyebrow>Our hallmark initiative</Eyebrow>
              <BlurText text="Lighting young minds, one story at a time." />
            </div>
            <div className="sb-progress" aria-hidden="true">
              <span className="sb-count">
                {String(current).padStart(2, "0")}
                <small> / {String(CHAPTERS).padStart(2, "0")}</small>
              </span>
              <span className="sb-bar">
                <i />
              </span>
            </div>
          </header>

          <div ref={trackRef} className="sb-track">
            {pages.map((page, i) =>
              page.kind === "text" ? (
                <article key={i} className="sb-page sb-text">
                  <span className="sb-label">{page.label}</span>
                  <p>{page.body}</p>
                  {page.cta && <Button to="/program">Explore Project Aabha</Button>}
                </article>
              ) : (
                <figure key={i} className={`sb-page sb-photo${photoIndex(i) % 2 ? " is-low" : ""}`}>
                  <img src={page.src} alt="" loading="lazy" />
                  <figcaption>{page.caption}</figcaption>
                </figure>
              ),
            )}
          </div>

          {/* Large आभा behind the main content */}
          <div className="sb-watermark" aria-hidden="true">
            <span>आभा</span>
          </div>
        </div>
      </div>
    </section>
  );
}
