import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/PolicyPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Contributions & Donations Policy — BRP Foundation" },
      { name: "description", content: "BRP Foundation policy regarding community contributions and donations." },
      { property: "og:title", content: "Contributions & Donations Policy — BRP Foundation" },
      { property: "og:description", content: "BRP Foundation policy regarding community contributions and donations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: () => <PolicyPage kind="refund-policy" />,
});