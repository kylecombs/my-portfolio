import type { MetaFunction } from "@remix-run/node";
import { Projects } from "~/components/Projects";

export const meta: MetaFunction = () => {
  return [
    { title: "Projects - Kyle Combs" },
    {
      name: "description",
      content:
        "Projects by Kyle Combs: reservations and ticketing, Shopify extensions, analytics pipelines, NFC tap-to-open tooling, and more.",
    },
  ];
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-8">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="inline-flex min-h-11 items-center gap-2 font-neue-haas text-lg text-gray-800 transition-colors hover:text-dark-green"
        >
          <span aria-hidden="true">←</span> Kyle Combs
        </a>
      </nav>
      <Projects headingAs="h1" />
    </div>
  );
}
