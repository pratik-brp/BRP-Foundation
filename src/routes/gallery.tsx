import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteChrome";
import { gallery } from "@/lib/edefy-data";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Our Impact & Community Gallery — BRP Foundation" },
      {
        name: "description",
        content:
          "Explore visual moments of school handovers, Kids Big Book reading sessions, and community support initiatives by BRP Foundation across Nepal.",
      },
      { property: "og:title", content: "Our Impact & Community Gallery — BRP Foundation" },
      {
        property: "og:description",
        content:
          "Photographs and stories from BRP Foundation educational partnerships, healthcare initiatives, and community spaces in Nepal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="OUR IMPACT IN ACTION"
        title="Moments of Progress & Community"
        description="Across classrooms, health centres, and community gathering spaces, each photograph represents local collaboration, joyful learning, and lasting progress in Nepal."
      />
      <section className="container gallery-grid scroll-reveal">
        {gallery.map(([src, caption]) => (
          <figure key={caption}>
            <img src={src} alt={caption} loading="lazy" />
            <figcaption>{caption}</figcaption>
          </figure>
        ))}
      </section>
    </SiteLayout>
  );
}