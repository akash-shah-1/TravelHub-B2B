import { createFileRoute } from "@tanstack/react-router";
import { FlightMarkupPage } from "@/features/markup-page/page";

export const Route = createFileRoute("/flight-markup")({
  head: () => ({
    meta: [
      { title: "Flight Markup Rules · Travel-Hub Super Admin" },
      { name: "description", content: "Configure platform-wide flight markup rules: priority, route, trip type, caps and agent permissions." },
    ],
  }),
  component: FlightMarkupPage,
});
