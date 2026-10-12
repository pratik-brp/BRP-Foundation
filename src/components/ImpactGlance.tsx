import type { PointerEvent } from "react";
import { School, Users } from "lucide-react";
import { Eyebrow } from "./SiteChrome";
import { TreeMark } from "./TreeMark";
import { BlurText, CountUp, ScrollHighlight, useScrollProgress } from "./Motion";

// Gentle 3D tilt with a glare that follows the pointer (fine pointers only, via CSS).
function tilt(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--ry", `${(x - 0.5) * 7}deg`);
  el.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
  el.style.setProperty("--gx", `${x * 100}%`);
  el.style.setProperty("--gy", `${y * 100}%`);
}

function untilt(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}

// "Impact at a glance": photo with frosted stat cards beside a framed districts card.
// Same layout as the original, with motion layered on. Section scroll progress (--p)
// drives the photo parallax and the pinwheel's rotation.
export function ImpactGlance() {
  const sectionRef = useScrollProgress<HTMLElement>(1, 0);

  return (
    <section ref={sectionRef} id="impact" className="section narrow impact" style={{ scrollMarginTop: "100px" }}>
      <Eyebrow className="rise">Impact at a glance</Eyebrow>
      <BlurText text="Creating change across Nepal." />
      <p className="impact-intro rise">
        Every number represents a child reached, a school strengthened, a family supported, or a
        community given greater room to thrive.
      </p>
      <div className="impact-grid scroll-reveal">
        <div className="impact-photo tilt" onPointerMove={tilt} onPointerLeave={untilt}>
          <img
            src="/gallery/007.jpg"
            alt="Children reading at a school library supported by Project आभा"
            loading="lazy"
          />
          <div className="stat-glass">
            <div className="sg-icon" aria-hidden="true">
              <School />
            </div>
            <strong>
              <CountUp end={50} suffix="+" />
            </strong>
            <span>Government schools partnered</span>
            <i className="sg-bar" aria-hidden="true" />
          </div>
          <div className="stat-glass">
            <div className="sg-icon" aria-hidden="true">
              <Users />
            </div>
            <strong>
              <CountUp end={12000} suffix="+" />
            </strong>
            <span>Students impacted</span>
            <i className="sg-bar" aria-hidden="true" />
          </div>
        </div>
        <article className="impact-card tilt" onPointerMove={tilt} onPointerLeave={untilt}>
          <div className="impact-card-panel">
            <TreeMark className="impact-logo" />
            <strong>
              <CountUp end={4} suffix="+" />
            </strong>
            <span>Districts covered</span>
            <div className="district-dots" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <ScrollHighlight text="Growing impact through thoughtful action, trusted partnerships, and a long-term commitment to communities." />
        </article>
      </div>
    </section>
  );
}
