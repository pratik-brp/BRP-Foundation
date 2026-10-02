import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Laptop, Heart, Landmark, Leaf, Star } from "lucide-react";
import { assets } from "@/assets/edefy/manifest";
import { Button } from "@/components/Button";
import { SiteLayout, Eyebrow } from "@/components/SiteChrome";
import { BlurText, CountUp, PhotoRotator } from "@/components/Motion";
import { WhoWeAre } from "@/components/WhoWeAre";
import { ProjectAabha } from "@/components/ProjectAabha";
import { ImpactGlance } from "@/components/ImpactGlance";

export const Route = createFileRoute("/")({ head: () => ({ meta: [{ title: "BRP Foundation — Building Stronger Communities, Creating Brighter Futures" }, { name: "description", content: "BRP Foundation is a social impact organization creating meaningful opportunities through education, essential healthcare, and community development in Nepal." }, { property: "og:title", content: "BRP Foundation — Building Stronger Communities, Creating Brighter Futures" }, { property: "og:description", content: "BRP Foundation is a social impact organization creating meaningful opportunities through education, essential healthcare, and community development in Nepal." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/" }] }), component: Home });
const features = [[BookOpen, "Literacy & Reading Programs", "/program"], [Laptop, "Digital Learning & Computer Labs", "/program"], [Heart, "Healthcare & Maternity Support", "/gallery"], [Landmark, "Community Centres & Heritage", "/gallery"]] as const;
const heroSlides = [["/gallery/006.jpg", "Collaborative learning and classroom engagement"], ["/gallery/014.jpg", "Students receiving Kids Big Book reading materials"], ["/gallery/008.jpg", "Shree Bal Byabasayee Kendra Secondary School partnership"]] as const;
const areas = [
  ["Education", "/gallery/013.jpg", "Students holding Kids Big Book reading materials with the BRP Foundation team", "We help create learning environments where children can grow with curiosity, confidence, and opportunity. From school libraries and educational resources to better infrastructure and digital learning spaces, our focus is on helping every learner access a fuller educational experience."],
  ["Health & Wellbeing", "/gallery/005.jpg", "Community members and educators gathered with the BRP Foundation team", "Healthy communities are stronger communities. Through support for local healthcare infrastructure and maternity facilities, we aim to help families access the essential care they need, closer to home."],
  ["Community & Heritage", "/gallery/016.jpg", "Students, teachers, and community members at a partner school", "We support the spaces, institutions, and shared traditions that connect communities. By strengthening local infrastructure and preserving community gathering places, we help foster participation, belonging, and inclusive development."],
] as const;
function Home() {
  return (
    <SiteLayout hideFooter={true}>
      {/* ========================================== */}
      {/* 1. HERO SECTION (CURRENTLY VISIBLE)       */}
      {/* ========================================== */}
      <section id="hero" className="home-hero">
        <div className="home-hero-content reveal">
          <div className="hero-pill-badge">
            <Leaf className="badge-leaf-icon" size={15} />
            <span>An emerging force for good in Nepal</span>
          </div>
          <h1>
            Building stronger<br />
            communities.<br />
            <span className="hero-text-accent">Creating brighter futures.</span>
          </h1>
          <p className="home-hero-desc">
            BRP Foundation is a social impact organization creating meaningful opportunities through education, essential healthcare, and community development. Rooted in Nepal and guided by purpose, we work alongside communities to help lasting change take shape.
          </p>
          <div className="button-row">
            <Button to="/gallery">Explore Our Impact</Button>
            <Button to="/program" variant="outline">Discover Project Aabha</Button>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. KEY INITIATIVES & 50+ SCHOOLS CARDS     */}
      {/* ========================================== */}
      <section className="hero-cards container scroll-reveal">
        <article className="hc-card hc-initiatives">
          <div className="hc-panel">
            <h2>Key Initiatives</h2>
            <ul className="hc-list">
              {features.map(([Icon, label, to]) => (
                <li key={label}>
                  <Link to={to}>
                    <span className="hc-icon"><Icon aria-hidden="true" /></span>
                    <span>{label}</span>
                    <ArrowUpRight className="hc-arrow" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="hc-foot">
            <Link to="/gallery" className="text-link">
              Explore Our Impact<ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </article>
        <PhotoRotator slides={heroSlides} tag="Project आभा" />
        <article className="hc-card hc-quote">
          <div className="hc-panel">
            <h2>
              <Star aria-hidden="true" />
              <span><CountUp end={50} suffix="+" /> Schools</span>
            </h2>
            <blockquote>
              “One school, one library, one story, and one child at a time — creating meaningful learning opportunities across Nepal.”
            </blockquote>
          </div>
          <div className="hc-foot hc-person">
            <img src="/brp-logo.png" alt="" />
            <span>
              BRP Foundation
              <small>Continuing Dr. Babu Ram Pokharel's Vision</small>
            </span>
          </div>
        </article>
      </section>

      <WhoWeAre />

      {/* ========================================== */}
      {/* 4. IMPACT AT A GLANCE (UNHIDDEN)           */}
      {/* ========================================== */}
      <ImpactGlance />

      {/* ========================================== */}
      {/* 5. PROJECT AABHA (UNHIDDEN)                */}
      {/* ========================================== */}
      <ProjectAabha />

      {/* ========================================== */}
      {/* 6. OUR AREAS OF IMPACT (UNHIDDEN)          */}
      {/* ========================================== */}
      <section className="areas">
        <div className="container">
          <div className="areas-head rise">
            <Eyebrow>Our areas of impact</Eyebrow>
            <h2>Supporting the foundations of stronger communities.</h2>
          </div>
          <div className="areas-grid scroll-reveal">
            {areas.map(([title, src, alt, text]) => (
              <article key={title} className="area-card">
                <img src={src} alt={alt} loading="lazy" />
                <div className="area-panel">
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <Link to="/gallery" className="text-link">
                    Explore Our Impact<ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO_HIDE_START */}
      {/*

      <section className="section container legacy">
        <div className="section-heading rise">
          <Eyebrow>A legacy we carry forward</Eyebrow>
          <h2>Purpose with roots. Progress with vision.</h2>
        </div>
        <div className="legacy-grid scroll-reveal">
          <figure className="legacy-photo">
            <img
              src="/gallery/021.jpg"
              alt="School leaders, students, and the BRP Foundation team at a Project आभा handover"
              loading="lazy"
            />
            <blockquote>
              BRP Foundation continues the community-focused vision of the late Dr. Babu Ram Pokharel: a belief that meaningful success includes strengthening the lives and places around us.
            </blockquote>
          </figure>
          <article className="legacy-card">
            <div className="legacy-card-panel">
              <p>
                That legacy is reflected in longstanding support for schools in Siranchok Rural Municipality, the community health centre in Chhoprak, and the Baram Community Centre in Gorkha. Today, the Foundation builds on these roots with renewed energy and a commitment to creating impact that lasts.
              </p>
            </div>
            <div className="legacy-card-foot">
              <Link to="/about" className="text-link">
                Learn About Our Story<ArrowRight size={16} aria-hidden="true" />
              </Link>
              <span aria-hidden="true">✠</span>
            </div>
          </article>
        </div>
      </section>
      */}
      {/* DEMO_HIDE_END */}
    </SiteLayout>
  );
}
