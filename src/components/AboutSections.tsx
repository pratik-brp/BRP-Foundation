import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import {
  Accessibility,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Handshake,
  HeartPulse,
  Landmark,
  Layers,
  Leaf,
  ShieldCheck,
  Sprout,
  Target,
  Users,
} from "lucide-react";
import { Eyebrow } from "./SiteChrome";
import { BlurText, useScrollProgress } from "./Motion";
import { TreeMark } from "./TreeMark";

// The About page (src/routes/about.tsx), one component per section. Styles live in the
// "About page" block of styles.css, all prefixed `ab-`.
//
// Motion follows the home page's conventions: `rise` / `scroll-reveal` / BlurText are
// revealed by the scroll-reveal hook, and scroll-linked effects read a 0-1 custom
// property (--p from useScrollProgress, --t from useTravel) in CSS, where 1 is always the
// finished state, so the page is complete without JavaScript and for reduced motion.

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const pad = (n: number) => String(n).padStart(2, "0");

// Writes how far the viewport has travelled through the element to `--t`: 0 when the
// element's top reaches `anchor` × viewport height, 1 when its bottom does.
function useTravel<T extends HTMLElement>(anchor = 0.6) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--t", "1");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const t = (anchor * window.innerHeight - rect.top) / rect.height;
      el.style.setProperty("--t", clamp01(t).toFixed(3));
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
  }, [anchor]);

  return ref;
}

// ---------------------------------------------------------------------------------------
// Page furniture: a reading-progress bar along the top of the screen, and a dot rail down
// the right edge that names the section in view and jumps to any other.
// ---------------------------------------------------------------------------------------

const railSections = [
  ["story", "Our Story"],
  ["purpose", "Our Purpose"],
  ["vision", "Our Vision"],
  ["mission", "Our Mission"],
  ["values", "Our Values"],
  ["focus", "Areas of Focus"],
  ["legacy", "Our Legacy"],
  ["ahead", "Looking Ahead"],
] as const;

export function AboutRail() {
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState("");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      barRef.current?.style.setProperty(
        "scale",
        `${max > 0 ? clamp01(window.scrollY / max) : 0} 1`,
      );
      // The section in view is the last one whose top has passed the middle of the screen;
      // none before the first section, or once the closing block takes over
      let current = "";
      for (const [id] of railSections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < vh * 0.5) current = id;
      }
      const end = document.querySelector(".site-end");
      if (end && end.getBoundingClientRect().top < vh * 0.6) current = "";
      setActive(current);
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

  return (
    <>
      <span className="ab-progress" aria-hidden="true">
        <span ref={barRef} />
      </span>
      <nav className="ab-rail" aria-label="On this page" data-show={active ? "" : undefined}>
        {railSections.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}

// ---------------------------------------------------------------------------------------
// 1. Hero: the headline beside two columns of photos that roll in opposite directions.
// ---------------------------------------------------------------------------------------

const reelColumns = [
  ["/gallery/002.jpg", "/gallery/014.jpg", "/gallery/007.jpg", "/gallery/018.jpg"],
  ["/gallery/005.jpg", "/gallery/011.jpg", "/gallery/013.jpg", "/gallery/019.jpg"],
];

const heroPillars = [
  { icon: BookOpen, label: "Education" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: Landmark, label: "Community development" },
];

export function AboutHero() {
  // 0 at the top of the page, 1 once the hero has scrolled away
  const ref = useScrollProgress<HTMLElement>(0, -1);

  return (
    <section ref={ref} className="ab-hero">
      <div className="ab-hero-glow" aria-hidden="true" />
      <div className="container ab-hero-grid">
        <div className="ab-hero-copy">
          <Eyebrow className="rise">Who We Are</Eyebrow>
          <BlurText as="h1" stacked text="Rooted in purpose." accent="Committed to progress." />
          {/* The supporting text in two steps: who we are, then how we work */}
          <p className="ab-hero-lead rise">
            BRP Foundation is a registered non-governmental organisation working to create
            meaningful, lasting change in communities across Nepal.
          </p>
          <p className="ab-hero-text rise">
            Through education, healthcare, and community development, we aim to strengthen the
            foundations that help individuals, families, and communities build brighter futures.
          </p>
          <ul className="ab-hero-pillars rise">
            {heroPillars.map(({ icon: Icon, label }) => (
              <li key={label}>
                <span aria-hidden="true">
                  <Icon />
                </span>
                {label}
              </li>
            ))}
          </ul>
          <a className="ab-hero-cue rise" href="#story">
            <span aria-hidden="true" />
            Our story
          </a>
        </div>

        {/* Decorative: each column holds its photos twice, so the loop has no seam */}
        <div className="ab-hero-reel" aria-hidden="true">
          {reelColumns.map((column, c) => (
            <div key={c} className="ab-reel-col">
              <div className="ab-reel-track">
                {[...column, ...column].map((src, i) => (
                  <img key={i} src={src} alt="" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------
// 2. Our Story: four chapters on alternating sides of a line that fills as you read down.
// ---------------------------------------------------------------------------------------

const storyChapters = [
  {
    text: "BRP Foundation grew from a longstanding belief that progress means more when it creates opportunities for others. Rooted in the community-focused legacy of B.R.P. Group and the vision of the late Dr. Babu Ram Pokharel, the Foundation carries forward a commitment to supporting the people, institutions, and communities that shape Nepal's future.",
    photo: "/gallery/021.jpg",
    alt: "School leaders, students, and the BRP Foundation team at a Project आभा handover",
  },
  {
    text: "Over the years, this commitment has taken form through support for educational institutions, local healthcare infrastructure, and community spaces that bring people together. These efforts reflect a simple principle: meaningful development begins by understanding local needs and investing in solutions that make a lasting difference.",
    photo: "/gallery/005.jpg",
    alt: "Community members and educators gathered with the BRP Foundation team",
  },
  {
    text: "Today, BRP Foundation builds on this foundation of service with a dedicated organisational identity and an expanding vision for community development. By bringing together resources, partnerships, and people who share a common purpose, we seek to make support more accessible, opportunities more inclusive, and progress more sustainable.",
    photo: "/gallery/011.jpg",
    alt: "A school principal and students with educational resources",
  },
  {
    text: "Our journey continues to be guided by the belief that stronger communities are built not through isolated acts of support, but through consistent effort, shared responsibility, and a commitment to the generations that follow.",
    photo: "/gallery/019.jpg",
    alt: "Books being handed to students outside a partner school",
  },
];

export function AboutStory() {
  const lineRef = useTravel<HTMLOListElement>(0.62);

  return (
    <section id="story" className="ab-story">
      <div className="container">
        <div className="section-heading rise">
          <Eyebrow>Our Story</Eyebrow>
          <BlurText text="A legacy of service." accent="A vision for the future." />
        </div>

        <ol ref={lineRef} className="ab-timeline">
          {storyChapters.map((chapter, i) => (
            <li key={i} className="ab-chapter rise">
              <p className="ab-chapter-text">{chapter.text}</p>
              <span className="ab-chapter-node" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <figure className="ab-chapter-photo">
                <img src={chapter.photo} alt={chapter.alt} loading="lazy" />
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------
// 3. Our Purpose: a dark panel with a light that follows the pointer, three columns of
// copy, and a line of outlined words drifting along the bottom edge with the scroll.
// ---------------------------------------------------------------------------------------

const purposeColumns = [
  "We exist to support communities in building a stronger foundation for their future. We believe that access to education, essential healthcare, and inclusive community spaces should not be limited by circumstance or geography.",
  "Our work focuses on practical needs and long-term opportunities, with an emphasis on strengthening existing institutions, supporting local initiatives, and working alongside the people who understand their communities best.",
  "By directing our efforts towards areas that shape everyday lives, BRP Foundation seeks to contribute to a Nepal where individuals have greater opportunities to learn, families can access essential care, and communities are empowered to participate in their own development.",
];

export function AboutPurpose() {
  const ref = useScrollProgress<HTMLElement>(1, -0.5);

  const moveGlow = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section id="purpose" ref={ref} className="ab-purpose" onPointerMove={moveGlow}>
      <img className="ab-purpose-bg" src="/gallery/008.jpg" alt="" loading="lazy" />
      <div className="container">
        <div className="ab-head">
          <Eyebrow className="rise">Our Purpose</Eyebrow>
          <BlurText text="Creating opportunities" accent="where they matter most." />
        </div>
        <ol className="ab-purpose-cols scroll-reveal">
          {purposeColumns.map((text, i) => (
            <li key={i}>
              <span aria-hidden="true">{pad(i + 1)}</span>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
      <p className="ab-purpose-band" aria-hidden="true">
        Education · Essential healthcare · Inclusive community spaces · Education · Essential
        healthcare · Inclusive community spaces ·
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------------------
// 4. Our Vision: the sun rising over a mountain skyline as the section scrolls in.
// ---------------------------------------------------------------------------------------

export function AboutVision() {
  const ref = useScrollProgress<HTMLElement>(0.9, -0.1);

  return (
    <section id="vision" ref={ref} className="ab-vision">
      <div className="container ab-vision-head">
        <Eyebrow className="rise">Our Vision</Eyebrow>
        <BlurText text="A Nepal where every community has" accent="the opportunity to thrive." />
      </div>

      <div className="ab-vision-scene">
        <span className="ab-sun" aria-hidden="true" />
        <svg
          className="ab-ridge ab-ridge--far"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 230 L120 150 L230 205 L360 84 L470 172 L600 52 L720 160 L860 76 L980 184 L1110 104 L1240 192 L1340 138 L1440 204 V320 H0Z" />
        </svg>
        <svg
          className="ab-ridge ab-ridge--mid"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 250 L160 150 L300 232 L450 120 L610 222 L760 110 L920 236 L1080 140 L1230 240 L1440 150 V320 H0Z" />
        </svg>
        <svg
          className="ab-ridge ab-ridge--near"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 120 C200 40 380 150 600 90 S1000 30 1200 100 S1380 70 1440 90 V320 H0Z" />
        </svg>
        <div className="container ab-vision-notes scroll-reveal">
          <p>
            We envision a future where every child can access meaningful learning opportunities,
            every family can reach essential healthcare, and every community has the resources and
            support to shape its own future.
          </p>
          <p>
            We aspire to contribute to a more inclusive and resilient Nepal, where opportunity is
            shared more widely and development creates lasting value for present and future
            generations.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------
// 5. Our Mission: a deck of photos that shuffles (by itself, or on a click) beside the copy.
// ---------------------------------------------------------------------------------------

const missionDeck = [
  { src: "/gallery/014.jpg", alt: "Students receiving Kids Big Book reading materials" },
  {
    src: "/gallery/006.jpg",
    alt: "Teachers and students with the BRP Foundation team in a classroom",
  },
  { src: "/gallery/003.jpg", alt: "An educational support handover with teachers and students" },
];

// The three qualities the mission statement names
const missionTraits = [
  { icon: Target, label: "Focused" },
  { icon: Handshake, label: "Collaborative" },
  { icon: Leaf, label: "Sustainable" },
];

const DECK_INTERVAL = 4200;

export function AboutMission() {
  const [top, setTop] = useState(0);
  const [held, setHeld] = useState(false);

  // Deals the next photo while nobody is hovering the deck
  useEffect(() => {
    if (held || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setTop((t) => (t + 1) % missionDeck.length),
      DECK_INTERVAL,
    );
    return () => window.clearInterval(timer);
  }, [held]);

  return (
    <section id="mission" className="ab-mission">
      <div className="container ab-mission-grid">
        <div className="ab-deck-wrap rise">
          <button
            type="button"
            className="ab-deck"
            aria-label="Show the next photo"
            onClick={() => setTop((t) => (t + 1) % missionDeck.length)}
            onPointerEnter={() => setHeld(true)}
            onPointerLeave={() => setHeld(false)}
          >
            {missionDeck.map((photo, i) => {
              // 0 is the top of the deck
              const pos = (i - top + missionDeck.length) % missionDeck.length;
              return (
                <img
                  key={photo.src}
                  src={photo.src}
                  alt={pos === 0 ? photo.alt : ""}
                  data-pos={pos}
                  loading="lazy"
                />
              );
            })}
            <span className="ab-deck-badge" aria-hidden="true">
              <Layers />
              {pad(top + 1)} / {pad(missionDeck.length)}
            </span>
          </button>
        </div>

        <div className="ab-copy">
          <div className="ab-head">
            <Eyebrow className="rise">Our Mission</Eyebrow>
            <BlurText text="Turning purpose" accent="into meaningful action." />
          </div>
          <p className="rise">
            Our mission is to strengthen communities across Nepal through focused, collaborative,
            and sustainable initiatives in education, healthcare, and community development.
          </p>
          <p className="rise">
            We work to improve access to learning resources, support essential local infrastructure,
            and strengthen the community institutions and shared spaces that enable people to grow
            together. Through responsible partnerships and a practical understanding of local needs,
            we aim to ensure that our efforts create value beyond the immediate intervention.
          </p>
          <ul className="ab-traits scroll-reveal">
            {missionTraits.map(({ icon: Icon, label }) => (
              <li key={label}>
                <span aria-hidden="true">
                  <Icon />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------
// 6. Our Values: six cards lit by a spotlight that follows the pointer across the grid.
// ---------------------------------------------------------------------------------------

const values = [
  {
    icon: Users,
    title: "Community First",
    text: "We place people and their needs at the centre of our work. By listening to communities and recognising local perspectives, we seek to support initiatives that are relevant, inclusive, and responsive to real challenges.",
  },
  {
    icon: GraduationCap,
    title: "Education & Opportunity",
    text: "We believe education opens doors to possibility. We support learning environments and resources that encourage curiosity, build confidence, and help individuals realise their potential.",
  },
  {
    icon: Accessibility,
    title: "Inclusion & Accessibility",
    text: "We strive to make opportunities more accessible to communities that face barriers to essential resources and services, ensuring that our work recognises diverse needs and circumstances.",
  },
  {
    icon: Handshake,
    title: "Collaboration & Trust",
    text: "We believe lasting progress is built together. We value open communication, responsible partnerships, and shared commitment with the institutions and individuals who work alongside us.",
  },
  {
    icon: Sprout,
    title: "Sustainability & Responsibility",
    text: "We focus on thoughtful action and long-term value. We aim to use resources responsibly, strengthen existing community structures, and support efforts that can continue to benefit people over time.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity & Accountability",
    text: "We are committed to acting with honesty, care, and responsibility. We recognise the importance of transparency, sound stewardship, and accountability to the communities and partners who place their trust in us.",
  },
];

export function AboutValues() {
  // Every card gets the pointer's position, so the light spills across neighbours too
  const spotlight = (e: PointerEvent<HTMLUListElement>) => {
    for (const card of e.currentTarget.children) {
      const rect = card.getBoundingClientRect();
      (card as HTMLElement).style.setProperty("--mx", `${e.clientX - rect.left}px`);
      (card as HTMLElement).style.setProperty("--my", `${e.clientY - rect.top}px`);
    }
  };

  return (
    <section id="values" className="ab-values">
      <div className="container">
        <div className="section-heading rise">
          <Eyebrow>Our Values</Eyebrow>
          <BlurText text="The principles that" accent="guide our work." />
        </div>
        <ul className="ab-values-grid scroll-reveal" onPointerMove={spotlight}>
          {values.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="ab-value">
              <span className="ab-value-icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="ab-value-num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------
// 7. Our Areas of Focus: three full-width cards that stack. Each sticks near the top of
// the screen while the next slides up over it; `--cover` (0-1, how much of a card the
// next one hides) shrinks and dims the card underneath.
// ---------------------------------------------------------------------------------------

const focusAreas = [
  {
    icon: BookOpen,
    tone: "light",
    title: "Education",
    text: "We support schools and learning environments through educational resources, libraries, computer laboratories, and infrastructure improvements. Through initiatives such as Project आभा, we also work to nurture reading habits, curiosity, and lifelong learning among children.",
    photo: "/gallery/007.jpg",
    alt: "Children reading at a school library with the BRP Foundation team",
  },
  {
    icon: HeartPulse,
    tone: "green",
    title: "Health & Wellbeing",
    text: "We contribute to strengthening local healthcare infrastructure and essential facilities, including maternity services, with the aim of supporting better access to care for individuals and families.",
    photo: "/gallery/012.jpg",
    alt: "A book handover to young students in a school courtyard",
  },
  {
    icon: Landmark,
    tone: "gold",
    title: "Community Development & Heritage",
    text: "We support community infrastructure and shared spaces that encourage participation, preserve local identity, and bring people together. We believe that strong community institutions play an important role in inclusive and sustainable development.",
    photo: "/gallery/016.jpg",
    alt: "Students, teachers, and community members at a partner school",
  },
];

export function AboutFocus() {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(list.children) as HTMLElement[];
    let frame = 0;
    const update = () => {
      frame = 0;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const rect = card.getBoundingClientRect();
        const cover = clamp01((rect.bottom - next.getBoundingClientRect().top) / rect.height);
        card.style.setProperty("--cover", cover.toFixed(3));
      });
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

  return (
    <section id="focus" className="ab-focus">
      <div className="container">
        <div className="section-heading rise">
          <Eyebrow>Our Areas of Focus</Eyebrow>
          <BlurText text="Strengthening the foundations of" accent="community development." />
        </div>
        <ol ref={listRef} className="ab-focus-list">
          {focusAreas.map(({ icon: Icon, tone, title, text, photo, alt }, i) => (
            <li
              key={title}
              className="ab-focus-card"
              data-tone={tone}
              style={{ "--i": i } as CSSProperties}
            >
              <div className="ab-focus-copy">
                <div className="ab-focus-meta">
                  <span className="ab-focus-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="ab-focus-num" aria-hidden="true">
                    {pad(i + 1)} / {pad(focusAreas.length)}
                  </span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <figure className="ab-focus-photo">
                <img src={photo} alt={alt} loading="lazy" />
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------
// 8. A Legacy We Carry Forward: the tree from the logo growing at the centre of a set of
// growth rings that widen as the section scrolls in.
// ---------------------------------------------------------------------------------------

export function AboutLegacy() {
  const ref = useScrollProgress<HTMLElement>(1, 0.2);

  return (
    <section id="legacy" ref={ref} className="ab-legacy">
      <div className="container ab-legacy-grid">
        <div className="ab-rings" aria-hidden="true">
          <span className="ab-rings-orbit" />
          <span className="ab-rings-core">
            <TreeMark className="ab-legacy-tree" />
          </span>
        </div>
        <div className="ab-copy">
          <div className="ab-head">
            <Eyebrow className="rise">A Legacy We Carry Forward</Eyebrow>
            <BlurText text="Honouring our roots." accent="Building what comes next." />
          </div>
          <p className="rise">
            The vision of the late <strong>Dr. Babu Ram Pokharel</strong> continues to inform BRP
            Foundation's commitment to community development. His belief in giving back is reflected
            in initiatives that support education, healthcare, and the shared spaces through which
            communities maintain their connections and identity.
          </p>
          <p className="rise">
            For BRP Foundation, carrying this legacy forward means building on these foundations
            while remaining responsive to the needs and aspirations of today's communities. We
            honour the past not simply by preserving what has been established, but by continuing
            the work of creating opportunities for the future.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------
// 9. Looking Ahead: three steps of a staircase that climbs to the right, built step by
// step as the section scrolls in.
// ---------------------------------------------------------------------------------------

const aheadSteps = [
  "As BRP Foundation continues to develop, our focus remains on building meaningful partnerships, identifying opportunities where support can make a difference, and strengthening the initiatives that contribute to community wellbeing.",
  "We recognise that sustainable progress takes time, collaboration, and a willingness to learn. As we expand our reach, we remain committed to understanding local priorities, acting responsibly, and ensuring that our work remains connected to the people it is intended to serve.",
  "Our ambition is not simply to do more, but to create lasting value through thoughtful, consistent, and purposeful action.",
];

export function AboutAhead() {
  const ref = useScrollProgress<HTMLOListElement>(0.95, 0.25, true);

  return (
    <section id="ahead" className="ab-ahead">
      <div className="container">
        <div className="ab-head">
          <Eyebrow className="rise">Looking Ahead</Eyebrow>
          <BlurText text="Growing with purpose." accent="Moving forward together." />
        </div>
        <ol ref={ref} className="ab-steps">
          {aheadSteps.map((text, i) => (
            <li key={i} className="ab-step" style={{ "--i": i } as CSSProperties}>
              <span className="ab-step-num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <p>{text}</p>
              {i === aheadSteps.length - 1 && (
                <span className="ab-step-arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
