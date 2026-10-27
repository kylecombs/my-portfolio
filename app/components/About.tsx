import { MotionConfig, motion } from "motion/react";
import { SectionHeading } from "./Experience";

const ease = [0.22, 1, 0.36, 1] as const;

const facts = [
  { label: "Based", value: "New York · Remote" },
  { label: "Working", value: "Contract, with small teams" },
  { label: "Focus", value: "Frontend, Rails APIs, data pipelines" },
  { label: "Currently", value: "CAMP · ALEX AND ANI" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
};

export function About() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="about" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="01" title="About" />

          <div className="mt-16 grid gap-12 md:grid-cols-12">
            <div className="space-y-6 md:col-span-7">
              <motion.p
                {...fadeUp}
                transition={{ duration: 0.8, ease }}
                className="text-pretty font-neue-haas text-2xl leading-snug text-dark-green sm:text-3xl"
              >
                I&apos;m a fullstack engineer who works with small teams on a
                contract basis. Right now I lead frontend at <em>CAMP</em> and
                build the analytics pipeline for <em>ALEX AND ANI</em>.
              </motion.p>
              <motion.p
                {...fadeUp}
                transition={{ duration: 0.8, ease, delay: 0.1 }}
                className="text-pretty font-neue-haas text-lg leading-relaxed text-gray-800"
              >
                I came to software from the art world. After a BFA in Studio
                Art, I spent eight years as a preparator at David Zwirner,
                installing complex exhibitions and caring for the artworks in
                them. It taught me to sweat the details people only notice when
                they&apos;re wrong.
              </motion.p>
              <motion.p
                {...fadeUp}
                transition={{ duration: 0.8, ease, delay: 0.2 }}
                className="text-pretty font-neue-haas text-lg leading-relaxed text-gray-800"
              >
                I learned to code at Fullstack Academy, stayed on to teach the
                next cohort, and have since shipped React frontends, Rails APIs,
                AWS media pipelines, and dbt/Snowflake warehouses, usually as
                one of two or three engineers who own the whole thing.
              </motion.p>
            </div>

            <motion.dl
              {...fadeUp}
              transition={{ duration: 0.8, ease, delay: 0.15 }}
              className="self-start border border-dark-green/20 bg-white/25 p-6 backdrop-blur-md sm:p-8 md:col-span-5"
            >
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col gap-1 border-b border-dark-green/10 py-4 first:pt-0 last:border-0 last:pb-0"
                >
                  <dt className="font-neue-haas text-xs uppercase tracking-widest text-dark-green/70">
                    {f.label}
                  </dt>
                  <dd className="font-neue-haas text-lg text-gray-800">
                    {f.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
