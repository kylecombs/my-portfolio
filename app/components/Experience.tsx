import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useId, useState } from "react";
import { reveal } from "~/utils/reveal";
import {
  companyLogos,
  experience,
  experienceLinks,
  isPlaceholder,
  type Job,
} from "~/data/portfolio";

export function Experience() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="experience" className="relative py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="05" title="Experience" />

          <ol className="relative mt-16 border-l border-dark-green/20">
            {experience.map((job, i) => (
              <motion.li
                key={`${job.company}-${job.role}`}
                className="group relative pl-8 md:pl-12"
                {...reveal(
                  { opacity: 0, y: 24 },
                  { delay: i * 0.05, duration: 0.7 }
                )}
                viewport={{ once: true, amount: 0.3 }}
              >
                <JobRow job={job} />
              </motion.li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col gap-2 font-neue-haas text-lg text-gray-800 sm:flex-row sm:justify-end sm:gap-10">
            <a
              href={experienceLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-3 transition-colors hover:text-dark-green"
            >
              Full history on LinkedIn
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            {isPlaceholder(experienceLinks.resume) ? (
              <p className="inline-flex min-h-11 items-center gap-3">
                Download résumé (PDF) {experienceLinks.resume}
              </p>
            ) : (
              <a
                href={experienceLinks.resume}
                download
                className="group inline-flex min-h-11 items-center gap-3 transition-colors hover:text-dark-green"
              >
                Download résumé (PDF)
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </a>
            )}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

function JobRow({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      {/* Timeline marker: dot that becomes ☺ on hover, echoing the hero nav */}
      <span
        aria-hidden="true"
        className="absolute -left-3 top-[1.125rem] flex h-6 w-6 items-center justify-center sm:top-5"
      >
        <span className="h-2 w-2 rounded-full bg-dark-green transition-opacity duration-200 group-focus-within:opacity-0 group-hover:opacity-0" />
        <span className="drop-shadow-glow absolute text-xl text-dark-green opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100">
          ☺
        </span>
      </span>

      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-start justify-between gap-4 py-4 text-left font-neue-haas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark-green"
        >
          <span className="flex flex-col gap-x-3 gap-y-1 md:flex-row md:flex-wrap md:items-baseline">
            <span className="text-xl font-medium text-dark-green sm:text-2xl">
              {job.role}
            </span>
            <span className="inline-flex flex-wrap items-center gap-x-2 text-lg italic text-gray-800">
              {companyLogos[job.company] && (
                <img
                  src={companyLogos[job.company]}
                  alt=""
                  className="h-5 w-auto"
                />
              )}
              {job.company}
              <span className="not-italic text-gray-600">· {job.type}</span>
            </span>
            <span className="text-sm uppercase tracking-widest text-dark-green/70">
              {job.dates.replace(/ (?=\d)/g, "\u00a0")}
            </span>
          </span>

          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className={`mt-2 h-4 w-4 shrink-0 fill-none stroke-dark-green stroke-[1.5] transition-transform duration-300 ${open ? "rotate-45" : ""}`}
            strokeLinecap="round"
          >
            <path d="M8 2v12M2 8h12" />
          </svg>
        </button>
      </h3>

      {/* Stays mounted so aria-controls always resolves */}
      <div id={panelId}>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="panel"
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pb-8 pt-1">
                <p className="font-neue-haas text-sm text-gray-600">
                  {job.location}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
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
