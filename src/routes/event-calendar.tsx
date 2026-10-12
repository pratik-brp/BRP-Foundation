import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/event-calendar")({
  beforeLoad: () => {
    throw redirect({ to: "/gallery" });
  },
});