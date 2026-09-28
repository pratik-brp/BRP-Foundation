import { useEffect, useRef, useState } from "react";
import { BookOpen, HeartPulse, School, Users } from "lucide-react";
import { Button } from "./Button";
import { Eyebrow } from "./SiteChrome";
import { BlurText } from "./Motion";

const steps = [
  {
    label: "Our belief",
    photo: "/gallery/003.jpg",
    alt: "Teachers, students, and community members with the BRP Foundation team",
  },
  {
    label: "Our focus",
    photo: "/gallery/013.jpg",
    alt: "Students holding Kids Big Book reading materials with the BRP Foundation team",
  },
  {
    label: "Our legacy",
    photo: "/gallery/008.jpg",
    alt: "School leaders, students, and the BRP Foundation team at Shree Bal Byabasayee Kendra Secondary School Project आभा handover",
  },
];

const focusAreas = [
  [BookOpen, "Books that open imaginations"],
  [School, "Better learning environments"],
  [HeartPulse, "Stronger access to care"],
  [Users, "Spaces that bring people together"],
] as const;

// "Who we are" as a pinned scroll story: the headline, photo and progress rail stay put
// while three panels scroll past (on phones the photo and rail pin at the top instead). Scroll progress through the panels drives `--p` (the
// rail fill) and which panel, photo and step are active.
export function WhoWeAre() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stepsEl = stepsRef.current;
    if (!section || !stepsEl) return;
    const rail = section.querySelector<HTMLElement>(".story-rail");
    const phone = matchMedia("(max-width: 809.98px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = stepsEl.getBoundingClientRect();
      // The "reading line" a panel must cross to become active: mid-screen on desktop;
      // on phones, just below the photo + rail pinned at the top
      const line =
        phone.matches && rail
          ? rail.getBoundingClientRect().bottom + window.innerHeight * 0.18
          : window.innerHeight * 0.5;
      const p = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
      section.style.setProperty("--p", p.toFixed(3));
      setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
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
  }, []);

  const stepClass = (i: number) => (i === active ? "story-step is-active" : "story-step");

  return (
    <section ref={sectionRef} className="section container story">
      <div className="story-grid">
        <div className="story-pin">
          <div className="story-pin-inner rise">
            <Eyebrow>WHO WE ARE</Eyebrow>
            <BlurText text="Impact begins where people are" accent="seen, heard, and supported." />
            <div className="story-photos">
              {steps.map((s, i) => (
                <img
                  key={s.photo}
                  src={s.photo}
                  alt={i === active ? s.alt : ""}
                  aria-hidden={i !== active}
                  className={i === active ? "is-active" : undefined}
                  loading="lazy"
                />
              ))}
            </div>
            <ol className="story-rail" aria-hidden="true">
              {steps.map((s, i) => (
                <li
                  key={s.label}
                  className={i === active ? "is-active" : i < active ? "is-done" : undefined}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div ref={stepsRef} className="story-steps">
          <article className={stepClass(0)}>
            <span className="story-num">01 — {steps[0]?.label}</span>
            <p className="story-lead">
              At BRP Foundation, we believe progress is most powerful when it reaches everyday
              lives. That means helping children access books that open their imaginations,
              supporting schools with better learning environments, strengthening access to care,
              and investing in the community spaces that bring people together.
            </p>
          </article>
          <article className={stepClass(1)}>
            <span className="story-num">02 — {steps[1]?.label}</span>
            <ul className="story-focus">
              {focusAreas.map(([Icon, label]) => (
                <li key={label}>
                  <span className="hc-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </article>
          <article className={stepClass(2)}>
            <span className="story-num">03 — {steps[2]?.label}</span>
            <p className="story-legacy">
              As the dedicated social-impact platform carrying forward the community legacy of
              B.R.P. Group, we are building on a foundation of service while shaping a more focused,
              inclusive, and enduring vision for the future.
            </p>
            <Button to="/about" variant="outline">
              About BRP Foundation
            </Button>
          </article>
        </div>
      </div>
    </section>
  );
}
