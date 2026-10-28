import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import {
  companyLogos,
  isPlaceholder,
  projects,
  type Project,
  type ProjectMedia as Media,
} from "~/data/portfolio";
import { SectionHeading } from "./Experience";
import { Tags, smallLabelClass } from "./Tags";
import { staggerShow } from "~/utils/reveal";

interface ProjectsProps {
  limit?: number;
  title?: string;
  headingAs?: "h1" | "h2";
}

export function Projects({
  limit,
  title = "Selected Work",
  headingAs,
}: ProjectsProps) {
  const shown = limit ? projects.slice(0, limit) : projects;

  return (
    <MotionConfig reducedMotion="user">
      <section id="work" className="relative py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="02" title={title} as={headingAs} />

          <motion.ul
            className="mt-16 grid gap-6 md:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ show: staggerShow(0.08) }}
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
                <ProjectCard project={p} index={i} />
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

function ProjectCard({
  project: p,
  index,
}: {
  project: Project;
  index: number;
}) {
  const parts = [
    { label: "Problem", text: p.problem },
    { label: "Built", text: p.built },
    { label: "Result", text: p.result },
  ].filter((part): part is { label: string; text: string } => !!part.text);

  return (
    <motion.article
      className="group flex h-full flex-col border border-dark-green/20 bg-white/25 p-6 backdrop-blur-md transition-colors duration-300 hover:border-dark-green/50 hover:bg-white/40 sm:p-8"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center justify-between gap-4 font-neue-haas text-sm tracking-widest text-dark-green/70">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className="inline-flex items-center gap-2 text-right uppercase">
          {companyLogos[p.context] && (
            <img src={companyLogos[p.context]} alt="" className="h-5 w-auto" />
          )}
          {p.year ? `${p.context} · ${p.year}` : p.context}
        </span>
      </div>

      {p.media && <ProjectMedia media={p.media} />}

      <h3 className="mt-6 font-neue-haas text-2xl font-medium text-dark-green sm:text-3xl">
        {p.title}
        <span
          aria-hidden="true"
          className="drop-shadow-glow ml-2 inline-block text-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          ☺
        </span>
      </h3>

      <dl className="mt-4 flex-1 space-y-4">
        {parts.map((part) => (
          <div key={part.label}>
            <dt className={smallLabelClass}>{part.label}</dt>
            <dd className="mt-1 font-neue-haas text-base leading-relaxed text-gray-800">
              {part.text}
            </dd>
          </div>
        ))}
      </dl>

      <Tags items={p.tags} />

      {p.link &&
        (isPlaceholder(p.link.href) ? (
          <p className="mt-6 font-neue-haas text-base text-gray-800">
            {p.link.label} {p.link.href}
          </p>
        ) : (
          <a
            href={p.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link mt-6 inline-flex min-h-11 items-center gap-2 self-start font-neue-haas text-base font-medium text-dark-green"
          >
            {p.link.label}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            >
              ↗
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ))}
    </motion.article>
  );
}

function ProjectMedia({ media }: { media: Media }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  // Played from here rather than via autoPlay, so reduced-motion visitors never
  // see it start; for them the poster stays up as a still.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (reduceMotion) {
      v.pause();
      v.currentTime = 0;
      v.load();
    } else {
      v.play().catch(() => {});
    }
  }, [reduceMotion]);

  return (
    <div className="mt-6 aspect-video overflow-hidden border border-dark-green/15 bg-white/30">
      {media.type === "video" ? (
        <video
          ref={video}
          src={media.src}
          poster={media.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src={media.src}
          alt={media.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
