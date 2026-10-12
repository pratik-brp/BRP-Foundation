import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProgramDetail } from "@/components/DetailPages";
import { programs } from "@/lib/edefy-data";

export const Route = createFileRoute("/program/$slug")({
  beforeLoad: ({ params }) => {
    if (!programs.some((x) => x.slug === params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const p = programs.find((x) => x.slug === params.slug);
    const title = `${p?.title ?? "Program"} — BRP Foundation`;
    return {
      meta: [
        { title },
        { name: "description", content: p?.description ?? "Educational initiative supported by BRP Foundation." },
        { property: "og:title", content: title },
        { property: "og:description", content: p?.description ?? "Educational initiative supported by BRP Foundation." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/program/${params.slug}` }],
    };
  },
  component: ProgramSlugPage,
});

function ProgramSlugPage() {
  const { slug } = Route.useParams();
  return <ProgramDetail slug={slug} />;
}