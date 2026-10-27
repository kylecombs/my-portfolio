import { MotionConfig, motion } from "motion/react";
import { reveal } from "~/utils/reveal";
import { companyLogos, experience } from "~/data/portfolio";

export function Experience() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="experience" className="relative py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="02" title="Experience" />

          <ol className="relative mt-16 border-l border-dark-green/20 md:ml-[11rem]">
            {experience.map((job, i) => (
              <motion.li
                key={`${job.company}-${job.role}`}
                className="group relative pb-14 pl-8 last:pb-0 md:pl-12"
                {...reveal(
                  { opacity: 0, y: 24 },
                  { delay: i * 0.05, duration: 0.7 }
                )}
                viewport={{ once: true, amount: 0.3 }}
              >
                {/* Timeline marker: dot that becomes ☺ on hover, echoing the hero nav */}
                <span
                  aria-hidden="true"
                  className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center"
                >
                  <span className="h-2 w-2 rounded-full bg-dark-green transition-opacity duration-200 group-hover:opacity-0" />
                  <span className="drop-shadow-glow absolute text-xl text-dark-green opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    ☺
                  </span>
                </span>

                <p className="mb-2 font-neue-haas text-sm uppercase tracking-widest text-dark-green/70 md:absolute md:-left-[11rem] md:top-1 md:mb-0 md:w-36 md:text-right">
                  {job.dates.replace(/ (?=\d)/g, "\u00a0")}
                </p>

                <h3 className="font-neue-haas text-2xl font-medium text-dark-green sm:text-3xl">
                  {job.role}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 font-neue-haas text-lg italic text-gray-800">
                  {companyLogos[job.company] && (
                    <img
                      src={companyLogos[job.company]}
                      alt=""
                      className="h-6 w-auto"
                    />
                  )}
                  <span>
                    {job.company}
                    <span className="not-italic text-gray-600">
                      {" "}
                      · {job.type} · {job.location}
                    </span>
                  </span>
                </p>

                <ul className="mt-4 max-w-3xl space-y-2 font-neue-haas text-base leading-relaxed text-gray-800">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-px w-3 shrink-0 bg-dark-green/50"
                      />
                      {h}
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Skills">
                  {job.skills.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-dark-green/25 bg-white/30 px-3 py-1 font-neue-haas text-xs tracking-wide text-dark-green backdrop-blur-sm"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </MotionConfig>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: string;
  as?: "h1" | "h2";
}) {
  return (
    <motion.div
      className="flex items-baseline gap-4 border-b border-dark-green/20 pb-6"
      {...reveal({ opacity: 0, x: 16 })}
      viewport={{ once: true, amount: 0.6 }}
    >
      <span className="font-neue-haas text-sm tracking-widest text-dark-green/70">
        {eyebrow}
      </span>
      <Heading className="outlined-text font-neue-haas text-5xl font-bold italic tracking-wide sm:text-7xl">
        {title}
      </Heading>
    </motion.div>
  );
}
