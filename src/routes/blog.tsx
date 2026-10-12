import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteChrome";
import { ArticleGrid } from "@/components/PageBlocks";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Stories & Field Updates — BRP Foundation" },
      {
        name: "description",
        content:
          "Read stories, community updates, and educational insights from BRP Foundation across schools in Nepal.",
      },
      { property: "og:title", content: "Stories & Field Updates — BRP Foundation" },
      {
        property: "og:description",
        content: "Stories, community milestones, and updates from BRP Foundation initiatives in Nepal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="FIELD STORIES & INSIGHTS"
        title="Stories of Change & Learning"
        description="Reflections from classroom handovers, reading engagements, and community partnerships across Nepal."
      />
      <section className="container blog-grid scroll-reveal">
        <ArticleGrid />
      </section>
    </SiteLayout>
  );
}