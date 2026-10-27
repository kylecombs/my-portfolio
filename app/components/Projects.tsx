import { MotionConfig, motion } from "motion/react";
import { companyLogos, projects } from "~/data/portfolio";
import { SectionHeading } from "./Experience";

interface ProjectsProps {
  limit?: number;
  headingAs?: "h1" | "h2";
}

export function Projects({ limit, headingAs }: ProjectsProps) {
  const shown = limit ? projects.slice(0, limit) : projects;

  return (
    <MotionConfig reducedMotion="user">
      <section id="projects" className="relative py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="03" title="Projects" as={headingAs} />

          <motion.ul
            className="mt-16 grid gap-6 md:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            {shown.map((p, i) => (
              <motion.li
                key={p.title}
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <motion.article
                  className="group flex h-full flex-col border border-dark-green/20 bg-white/25 p-6 backdrop-blur-md transition-colors duration-300 hover:border-dark-green/50 hover:bg-white/40 sm:p-8"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-center justify-between gap-4 font-neue-haas text-sm tracking-widest text-dark-green/70">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span className="inline-flex items-center gap-2 uppercase">
                      {companyLogos[p.context] && (
                        <img
                          src={companyLogos[p.context]}
                          alt=""
                          className="h-5 w-auto"
                        />
                      )}
                      {p.context} · {p.year}
                    </span>
                  </div>

                  <h3 className="mt-6 font-neue-haas text-2xl font-medium text-dark-green sm:text-3xl">
                    {p.title}
                    <span
                      aria-hidden="true"
                      className="drop-shadow-glow ml-2 inline-block text-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    >
                      ☺
                    </span>
                  </h3>

                  <p className="mt-3 flex-1 font-neue-haas text-base leading-relaxed text-gray-800">
                    {p.description}
                  </p>

                  <ul
                    className="mt-6 flex flex-wrap gap-2"
                    aria-label="Technologies"
                  >
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-dark-green/25 px-3 py-1 font-neue-haas text-xs tracking-wide text-dark-green"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </motion.li>
            ))}
          </motion.ul>

          {limit && projects.length > limit && (
            <div className="mt-12 flex justify-end">
              <a
                href="/projects"
                className="group inline-flex min-h-11 items-center gap-3 font-neue-haas text-lg text-gray-800 transition-colors hover:text-dark-green"
              >
                All projects
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
