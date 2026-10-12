import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/PolicyPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — BRP Foundation" },
      { name: "description", content: "How BRP Foundation collects, uses, and protects personal information." },
      { property: "og:title", content: "Privacy Policy — BRP Foundation" },
      { property: "og:description", content: "How BRP Foundation collects, uses, and protects personal information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: () => <PolicyPage kind="privacy-policy" />,
});