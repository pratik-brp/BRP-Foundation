import { useEffect, useRef, useState } from "react";
import { BookOpen, HeartPulse, Landmark } from "lucide-react";
import { Eyebrow } from "./SiteChrome";
import { BlurText, useScrollProgress } from "./Motion";
import { Button } from "./Button";

const areas = [
  {
    title: "Education",
    icon: BookOpen,
    photo: "/gallery/013.jpg",
    alt: "Students holding Kids Big Book reading materials with the BRP Foundation team",
    text: "We help create learning environments where children can grow with curiosity, confidence, and opportunity. From school libraries and educational resources to better infrastructure and digital learning spaces, our focus is on helping every learner access a fuller educational experience.",
  },
  {
    title: "Health & Wellbeing",
    icon: HeartPulse,
    photo: "/gallery/005.jpg",
    alt: "Community members and educators gathered with the BRP Foundation team",
    text: "Healthy communities are stronger communities. Through support for local healthcare infrastructure and maternity facilities, we aim to help families access the essential care they need, closer to home.",
  },
  {
    title: "Community & Heritage",
    icon: Landmark,
    photo: "/gallery/016.jpg",
    alt: "Students, teachers, and community members at a partner school",
    text: "We support the spaces, institutions, and shared traditions that connect communities. By strengthening local infrastructure and preserving community gathering places, we help foster participation, belonging, and inclusive development.",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");
// Matches the phone block in styles.css that pins the section
const PINNED_QUERY = "(max-width: 809.98px) and (prefers-reduced-motion: no-preference)";

// "Our areas of impact" as arch-shaped photo windows with a gold outline, icon badge and
// outlined number. Section scroll progress (--p) drifts the photos inside the arches.
//
// Desktop: three arches side by side (middle one lower), copy beneath each, revealed by
// the scroll-reveal class.
// Phones: a pinned scroll. The three cards are stacked in one spot so they read as a
// single arch; scrolling through the tall stage moves `active` from one area to the
// next, and CSS swaps the photo, badge, number and copy (see the phone block).
//
// `active` is exposed as data attributes, never className: the scroll-reveal hook adds
// its own class to the cards, which a changing className would wipe.
export function AreasOfImpact() {
  const sectionRef = useScrollProgress<HTMLElement>(1, 0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const pinned = matchMedia(PINNED_QUERY);
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!pinned.matches) return;
      const rect = stage.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      setActive(Math.min(areas.length - 1, Math.floor(p * areas.length)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    pinned.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      pinned.removeEventListener("change", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="arches" aria-label="Our Areas of Impact">
      <div className="container">
        <div className="section-heading rise">
          <Eyebrow>Our areas of impact</Eyebrow>
          <BlurText text="Supporting the foundations of stronger communities." />
        </div>

        <div ref={stageRef} className="arch-stage">
          <div className="arch-pin">
            {/* Phones only: which of the three areas the pinned arch is showing */}
            <ol className="arch-rail" aria-hidden="true">
              {areas.map((area, i) => (
                <li
                  key={area.title}
                  data-state={i === active ? "active" : i < active ? "done" : undefined}
                >
                  {pad(i + 1)}
                </li>
              ))}
            </ol>

            <div className="arch-grid scroll-reveal">
              {areas.map((area, i) => {
                const Icon = area.icon;
                return (
                  <article
                    key={area.title}
                    className="arch-card"
                    data-active={i === active || undefined}
                  >
                    <div className="arch-frame">
                      {/* Outline traced just outside the window: up the left side, over
                          the semicircular top, down the right */}
                      <svg
                        className="arch-line"
                        viewBox="0 0 100 125"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path d="M1 125 V50 A49 49 0 0 1 99 50 V125" pathLength={1} />
                      </svg>
                      <div className="arch-window">
                        <img src={area.photo} alt={area.alt} loading="lazy" />
                      </div>
                      <span className="arch-key" aria-hidden="true">
                        <Icon />
                      </span>
                      <span className="arch-num" aria-hidden="true">
                        {pad(i + 1)}
                      </span>
                    </div>
                    <div className="arch-copy">
                      <h3>{area.title}</h3>
                      <p>{area.text}</p>
                      <Button to="/gallery" variant="outline" className="arch-card-btn">
                        Explore Our Impact
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
