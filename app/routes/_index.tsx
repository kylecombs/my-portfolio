import type { MetaFunction } from "@remix-run/node";
// import { GrainyNavBackground } from "~/components/GrainyNavBackground";
// import { Logo } from "~/components/Logo";
import { Hero } from "~/components/Hero";
import { About } from "~/components/About";
import { Experience } from "~/components/Experience";
import { Projects } from "~/components/Projects";
import { Skills } from "~/components/Skills";
import { Contact } from "~/components/Contact";

export const meta: MetaFunction = () => {
  return [
    { title: "Kyle Combs - Software Engineer" },
    {
      name: "description",
      content:
        "Senior Software Engineer with 3+ years experience building scalable web applications. Expert in Ruby on Rails and React with proven ability to drive business growth.",
    },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <Hero />

      <About />

      <Experience />

      <Projects limit={4} />

      <Skills />

      <Contact />
    </div>
  );
}
