import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArticleDetail } from "@/components/DetailPages";
import { articles } from "@/lib/edefy-data";

export const Route = createFileRoute("/blog/$slug")({
  beforeLoad: ({ params }) => {
    if (!articles.some((x) => x.slug === params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const a = articles.find((x) => x.slug === params.slug);
    const title = `${a?.title ?? "Article"} — BRP Foundation`;
    return {
      meta: [
        { title },
        { name: "description", content: "Insights and stories from BRP Foundation initiatives." },
        { property: "og:title", content: title },
        { property: "og:description", content: "Insights and stories from BRP Foundation initiatives." },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
    };
  },
  component: BlogSlugPage,
});

function BlogSlugPage() {
  const { slug } = Route.useParams();
  return <ArticleDetail slug={slug} />;
}