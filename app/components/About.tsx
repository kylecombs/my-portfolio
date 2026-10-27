import { MotionConfig, motion } from "motion/react";
import { SectionHeading } from "./Experience";

const ease = [0.22, 1, 0.36, 1] as const;

const facts = [
  { label: "Based", value: "New York · Remote" },
  { label: "Working", value: "Contract, with small teams" },
  { label: "Focus", value: "Frontend, Rails APIs, data pipelines" },
  { label: "Currently", value: "CAMP · ALEX AND ANI" },
];

const path = [
  { year: "2007", title: "BFA, Studio Art", place: "University of Oklahoma" },
  { year: "2013", title: "Preparator", place: "David Zwirner" },
  {
    year: "2021",
    title: "Engineer & Teaching Fellow",
    place: "Fullstack Academy",
  },
  { year: "2022", title: "Fullstack Engineer", place: "Rexby → Arx → CAMP" },
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

          <div className="relative mt-20">
            <motion.div
              aria-hidden="true"
              className="absolute left-0 right-0 top-0 hidden h-px origin-left bg-dark-green/25 md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, ease }}
            />
            <motion.ol
              className="grid gap-8 border-l border-dark-green/20 pl-6 md:grid-cols-4 md:border-l-0 md:pl-0"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                show: {
                  transition: { staggerChildren: 0.12, delayChildren: 0.3 },
                },
              }}
            >
              {path.map((step) => (
                <motion.li
                  key={step.year}
                  className="group relative md:pt-8"
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease },
                    },
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-[1.6rem] top-2 h-2 w-2 rounded-full bg-dark-green md:-top-1 md:left-0"
                  />
                  <p className="font-neue-haas text-sm tracking-widest text-dark-green/70">
                    {step.year}
                  </p>
                  <p className="mt-2 font-neue-haas text-xl font-medium text-dark-green">
                    {step.title}
                  </p>
                  <p className="mt-1 font-neue-haas italic text-gray-800">
                    {step.place}
                  </p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
