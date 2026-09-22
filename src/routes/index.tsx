import { createFileRoute } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { Button } from "@/components/Button";
import { SiteLayout } from "@/components/SiteChrome";

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
    </SiteLayout>
  );
}