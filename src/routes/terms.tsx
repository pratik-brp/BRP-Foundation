import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/PolicyPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — BRP Foundation" },
      { name: "description", content: "Terms governing use of the BRP Foundation website and digital resources." },
      { property: "og:title", content: "Terms & Conditions — BRP Foundation" },
      { property: "og:description", content: "Terms governing use of the BRP Foundation website and digital resources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => <PolicyPage kind="terms" />,
});