import type { MetaFunction } from "@remix-run/node";
import { Hero } from "~/components/Hero";
import { Services } from "~/components/Services";
import { Projects } from "~/components/Projects";
import { HowIWork } from "~/components/HowIWork";
import { About } from "~/components/About";
import { Experience } from "~/components/Experience";
import { Contact } from "~/components/Contact";
import { selectedWorkCount } from "~/data/portfolio";

const title = "Kyle Combs — Fullstack & Shopify Engineer for Hire, NYC";
const description =
  "Part-time contract engineer for small teams: React frontends, Rails APIs, Shopify apps, and dbt/Snowflake data pipelines.";

export const meta: MetaFunction = () => {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    // TODO: add an OG image (1200×630) to /public and reference it here as og:image and twitter:image
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-transparent">
      <Hero />

      <Services />

      <Projects limit={selectedWorkCount} />

      <HowIWork />

      <About />

      <Experience />

      <Contact />
    </div>
  );
}
