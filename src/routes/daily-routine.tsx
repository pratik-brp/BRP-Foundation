import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/daily-routine")({
  beforeLoad: () => {
    throw redirect({ to: "/program" });
  },
});