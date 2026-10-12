import { createFileRoute, notFound } from "@tanstack/react-router";
import { EventDetail } from "@/components/DetailPages";
import { events } from "@/lib/edefy-data";

export const Route = createFileRoute("/event/$slug")({
  beforeLoad: ({ params }) => {
    if (!events.some((x) => x.slug === params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const e = events.find((x) => x.slug === params.slug);
    const title = `${e?.title ?? "Event"} — BRP Foundation`;
    return {
      meta: [
        { title },
        { name: "description", content: e?.description ?? "Community milestone and event with BRP Foundation." },
        { property: "og:title", content: title },
        { property: "og:description", content: e?.description ?? "Community milestone and event with BRP Foundation." },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/event/${params.slug}` }],
    };
  },
  component: EventSlugPage,
});

function EventSlugPage() {
  const { slug } = Route.useParams();
  return <EventDetail slug={slug} />;
}