import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/Button";
import { SiteLayout } from "@/components/SiteChrome";
import {
  AboutAhead,
  AboutFocus,
  AboutHero,
  AboutLegacy,
  AboutMission,
  AboutPurpose,
  AboutRail,
  AboutStory,
  AboutValues,
  AboutVision,
} from "@/components/AboutSections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — BRP Foundation" },
      {
        name: "description",
        content:
          "BRP Foundation is a registered non-governmental organisation working to create meaningful, lasting change in communities across Nepal through education, healthcare, and community development.",
      },
      { property: "og:title", content: "About Us — BRP Foundation" },
      {
        property: "og:description",
        content:
          "Rooted in purpose. Committed to progress. BRP Foundation carries forward the vision of the late Dr. Babu Ram Pokharel to strengthen communities across Nepal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const closing = (
  <>
    <h2>Stronger communities begin with shared purpose.</h2>
    <p>
      We believe meaningful change is possible when people and organisations come together around a
      common goal. Whether you represent a school, a community institution, a healthcare provider,
      or an organisation looking to contribute, there is room to build something meaningful
      together.
    </p>
    <div className="button-row">
      <Button to="/gallery" variant="light">
        Explore Our Impact
      </Button>
      <Button to="/book-a-tour" variant="outline">
        Partner With Us
      </Button>
    </div>
  </>
);

function AboutPage() {
  return (
    <SiteLayout closing={closing}>
      <div className="ab-page">
        <AboutRail />
        <AboutHero />
        <AboutStory />
        <AboutPurpose />
        <AboutVision />
        <AboutMission />
        <AboutValues />
        <AboutFocus />
        <AboutLegacy />
        <AboutAhead />
      </div>
    </SiteLayout>
  );
}
