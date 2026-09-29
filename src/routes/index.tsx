import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Laptop, Heart, Landmark, Leaf, Star } from "lucide-react";
import { Button } from "@/components/Button";
import { SiteLayout } from "@/components/SiteChrome";
import { WhoWeAre } from "@/components/WhoWeAre";
import { ImpactGlance } from "@/components/ImpactGlance";
import { CountUp, PhotoRotator } from "@/components/Motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BRP Foundation â€” Building Stronger Communities, Creating Brighter Futures" },
      { name: "description", content: "BRP Foundation is a social impact organization creating meaningful opportunities through education, essential healthcare, and community development in Nepal." },
      { property: "og:title", content: "BRP Foundation â€” Building Stronger Communities, Creating Brighter Futures" },
      { property: "og:description", content: "BRP Foundation is a social impact organization creating meaningful opportunities through education, essential healthcare, and community development in Nepal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const features = [
  [BookOpen, "Literacy & Reading Programs", "/program"],
  [Laptop, "Digital Learning & Computer Labs", "/program"],
  [Heart, "Healthcare & Maternity Support", "/gallery"],
  [Landmark, "Community Centres & Heritage", "/gallery"],
] as const;

const heroSlides = [
  ["/gallery/006.jpg", "Collaborative learning and classroom engagement"],
  ["/gallery/014.jpg", "Students receiving Kids Big Book reading materials"],
  ["/gallery/008.jpg", "Shree Bal Byabasayee Kendra Secondary School partnership"],
] as const;

function Home() {
  return (
    <SiteLayout hideFooter={true}>
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

      {/* 2. KEY INITIATIVES & 50+ SCHOOLS CARDS */}
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
        <PhotoRotator slides={heroSlides} tag="Project à¤†à¤­à¤¾" />
        <article className="hc-card hc-quote">
          <div className="hc-panel">
            <h2>
              <Star aria-hidden="true" />
              <span><CountUp end={50} suffix="+" /> Schools</span>
            </h2>
            <blockquote>
              â€œOne school, one library, one story, and one child at a time â€” creating meaningful learning opportunities across Nepal.â€
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
    </SiteLayout>
  );
}