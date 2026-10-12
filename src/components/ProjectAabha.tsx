import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
// (--f), a large आभा watermark drifts behind (--p). Touch swipe & click-to-focus ensure
// an effortless, desktop-grade experience on mobile too.
export function ProjectAabha() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
  const centresRef = useRef<number[]>([]);
  const travelRef = useRef<number>(0);

  const scrollToPage = (index: number) => {
    const stage = stageRef.current;
    const centres = centresRef.current;
    const travel = travelRef.current;
    if (!stage || !centres.length || travel <= 0) return;
    const first = centres[0] ?? 0;
    const last = centres[centres.length - 1] ?? 0;
    const targetCentre = centres[index];
    if (targetCentre === undefined) return;
    const p = clamp01((targetCentre - first) / Math.max(1, last - first));
    const stageTop = stage.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: stageTop + p * travel,
      behavior: "smooth",
    });
  };

  const goToChapter = (chapterNum: number) => {
    const target = Math.max(1, Math.min(CHAPTERS, chapterNum));
    const pageIdx = pages.findIndex((p, i) => p.kind === "text" && chapterAt(i) === target);
    if (pageIdx !== -1) {
      scrollToPage(pageIdx);
    }
  };

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
        travelRef.current = 0;
        centresRef.current = [];
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
      travelRef.current = travel;
      centresRef.current = centres;
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

    // Touch swipe support on track so horizontal thumb swipes translate the sticky track 1:1
    let touchStartX = 0;
    let touchStartY = 0;
    let isHorizontalSwipe = false;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (e.touches.length !== 1 || !touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      isHorizontalSwipe = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (e.touches.length !== 1 || !touch || travel <= 0) return;
      const curX = touch.clientX;
      const curY = touch.clientY;
      const dx = touchStartX - curX;
      const dy = touchStartY - curY;

      if (!isHorizontalSwipe) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 7) {
          isHorizontalSwipe = true;
        }
      }

      if (isHorizontalSwipe) {
        const stageRect = stage.getBoundingClientRect();
        // Only drive scroll if the section is currently within the active pinned viewport
        if (stageRect.top <= 10 && stageRect.bottom >= window.innerHeight - 10) {
          if (e.cancelable) e.preventDefault();
          window.scrollBy({ top: dx * 1.15, behavior: "instant" });
          touchStartX = curX;
          touchStartY = curY;
        }
      }
    };

    const onTouchEnd = () => {
      isHorizontalSwipe = false;
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    pinned.addEventListener("change", onResize);

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: false });
    track.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      pinned.removeEventListener("change", onResize);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="program" className="storybook" aria-label="Our Hallmark Initiative: Project Aabha" style={{ scrollMarginTop: "100px" }}>
      <div ref={stageRef} className="sb-stage">
        <div className="sb-pin">
          <header className="sb-head container">
            <div className="rise">
              <Eyebrow>Our hallmark initiative</Eyebrow>
              <BlurText text="Project आभा" />
              <p className="sb-subtitle">Lighting young minds, one story at a time.</p>
            </div>
            <div className="sb-progress">
              <div className="sb-progress-top">
                <span className="sb-count">
                  {String(current).padStart(2, "0")}
                  <small> / {String(CHAPTERS).padStart(2, "0")}</small>
                </span>
                <div className="sb-nav-arrows" aria-label="Chapter navigation">
                  <button
                    type="button"
                    className="sb-arrow-btn"
                    onClick={() => goToChapter(current - 1)}
                    disabled={current <= 1}
                    aria-label="Previous chapter"
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="sb-arrow-btn"
                    onClick={() => goToChapter(current + 1)}
                    disabled={current >= CHAPTERS}
                    aria-label="Next chapter"
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <span className="sb-bar" aria-hidden="true">
                <i />
              </span>
            </div>
          </header>

          <div ref={trackRef} className="sb-track">
            {pages.map((page, i) =>
              page.kind === "text" ? (
                <article
                  key={i}
                  className="sb-page sb-text"
                  onClick={() => scrollToPage(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") scrollToPage(i);
                  }}
                  aria-label={`Storybook chapter ${page.label}`}
                >
                  <span className="sb-label">{page.label}</span>
                  <p>{page.body}</p>
                  {page.cta && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <Button to="/program">Explore Project Aabha</Button>
                    </div>
                  )}
                </article>
              ) : (
                <figure
                  key={i}
                  className={`sb-page sb-photo${photoIndex(i) % 2 ? " is-low" : ""}`}
                  onClick={() => scrollToPage(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") scrollToPage(i);
                  }}
                  aria-label={page.caption}
                >
                  <img src={page.src} alt={page.caption} loading="lazy" />
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
