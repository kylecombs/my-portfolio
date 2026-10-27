import { MotionConfig, motion } from "motion/react";
import { SectionHeading } from "./Experience";

const ease = [0.22, 1, 0.36, 1] as const;

const groups = [
  {
    title: "Frontend",
    note: "Where I spend most days",
    items: [
      "React",
      "TypeScript",
      "JavaScript",
      "Redux",
      "Remix",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend",
    note: "The APIs behind the UI",
    items: [
      "Ruby on Rails",
      "Node.js",
      "Express",
      "PostgreSQL",
      "GraphQL",
      "Redis",
      "Python",
    ],
  },
  {
    title: "Data",
    note: "Pipelines people can trust",
    items: ["dbt", "Snowflake", "Fivetran", "Looker / LookML", "SQL"],
  },
  {
    title: "Platforms & Tools",
    note: "Integrations and quality",
    items: [
      "Shopify",
      "AWS (S3, Lambda, MediaConvert)",
      "IPFS",
      "Web Audio API",
      "Cypress",
      "Jest",
      "Storybook",
    ],
  },
];

export function Skills() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="skills" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="04" title="Skills" />

          <motion.div
            className="mt-16 grid border-l border-t border-dark-green/20 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            {groups.map((g, i) => (
              <motion.div
                key={g.title}
                className="group border-b border-r border-dark-green/20 bg-white/20 p-6 backdrop-blur-md transition-colors duration-300 hover:bg-white/40 sm:p-8"
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease },
                  },
                }}
              >
                <p className="font-neue-haas text-sm tracking-widest text-dark-green/70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-6 font-neue-haas text-2xl font-medium italic text-dark-green">
                  {g.title}
                </h3>
                <p className="mt-1 font-neue-haas text-sm text-gray-700">
                  {g.note}
                </p>
                <ul className="mt-6 space-y-2">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 font-neue-haas text-base text-gray-800"
                    >
                      <span
                        aria-hidden="true"
                        className="h-px w-3 shrink-0 bg-dark-green/50 transition-all duration-300 group-hover:w-5"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
