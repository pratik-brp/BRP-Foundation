import { useEffect, useRef } from "react";
import { HeartPulse, Landmark, MapPin, School, Sprout } from "lucide-react";
import { Button } from "./Button";
import { Eyebrow } from "./SiteChrome";
import { BlurText } from "./Motion";

// The three places the legacy copy names, in the order it names them. `photo` fills the
// place's card and `focus` is its object-position.
const places = [
  {
    icon: School,
    title: "Schools",
    place: "Siranchok Rural Municipality",
    photo: "/gallery/007.jpg",
    focus: "50% 68%",
  },
  {
    icon: HeartPulse,
    title: "Community Health Centre",
    place: "Chhoprak",
    photo: "/gallery/012.jpg",
    focus: "50% 45%",
  },
  {
    icon: Landmark,
    title: "Baram Community Centre",
    place: "Gorkha",
    photo: "/gallery/015.jpg",
    focus: "50% 45%",
  },
];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// "A legacy we carry forward" as a cinematic tribute: a wide darkened photo banner with
// the vision statement set on it and a "Today" card overlapping its corner. Beneath, the
// lead-in line sits beside the card as a sub-heading, and the three places follow as photo
// cards across the full width. The banner expands from a smaller frame to full
// width as it scrolls in: scroll position is written to --e on the banner (0 = small,
// 1 = full). Without JavaScript, and for reduced motion, --e keeps its CSS default of 1.
export function LegacyTribute() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = banner.getBoundingClientRect().top;
      // Expands while the banner travels from the bottom of the screen to mid-screen
      const travelled = clamp01((vh * 0.92 - top) / (vh * 0.5));
      // ...and always finishes at the end of the page, however little scroll is left
      const remaining = document.documentElement.scrollHeight - (window.scrollY + vh);
      const atPageEnd = clamp01(1 - remaining / (vh * 0.25));
      banner.style.setProperty("--e", Math.max(travelled, atPageEnd).toFixed(3));
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
    <section className="tribute" aria-label="A legacy we carry forward">
      <div className="container">
        <div className="section-heading rise">
          <Eyebrow>A legacy we carry forward</Eyebrow>
          <BlurText text="Purpose with roots." accent="Progress with vision." />
        </div>

        <div ref={bannerRef} className="tribute-banner">
          <img
            src="/gallery/021.jpg"
            alt="School leaders, students, and the BRP Foundation team at a Project आभा handover"
            loading="lazy"
          />
          <p className="tribute-statement">
            BRP Foundation continues the community-focused vision of the late{" "}
            <strong>Dr. Babu Ram Pokharel</strong>: a belief that meaningful success includes
            strengthening the lives and places around us.
          </p>
        </div>

        <div className="tribute-lower">
          <p className="tribute-lead rise">That legacy is reflected in longstanding support for:</p>
          <ul className="tribute-places scroll-reveal">
            {places.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="tribute-place">
                  {/* Decorative backdrop: the card's meaning is all in its text */}
                  <img
                    src={item.photo}
                    alt=""
                    loading="lazy"
                    style={{ objectPosition: item.focus }}
                  />
                  <span className="tribute-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <div className="tribute-place-body">
                    <h3>{item.title}</h3>
                    <span className="tribute-place-where">
                      <MapPin aria-hidden="true" />
                      {item.place}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="tribute-card rise">
            <span className="tribute-card-icon" aria-hidden="true">
              <Sprout />
            </span>
            <p>
              Today, the Foundation builds on these roots with renewed energy and a commitment to
              creating impact that lasts.
            </p>
            <Button to="/about">Learn About Our Story</Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
