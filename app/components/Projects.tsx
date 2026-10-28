import {
  AnimatePresence,
  MotionConfig,
  motion,
  stagger,
  useAnimate,
  useReducedMotion,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { scrollWindowTo } from "~/utils/scrollToSection";

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
  const [expanded, setExpanded] = useState<string | null>(null);

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
              <ProjectCard
                key={p.title}
                project={p}
                index={i}
                expanded={expanded === p.title}
                onToggle={() =>
                  setExpanded((cur) => (cur === p.title ? null : p.title))
                }
              />
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

const ease = [0.22, 1, 0.36, 1] as const;

interface ProjectCardProps {
  project: Project;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

// Expanding spans the card across both grid columns. A right-column card also
// jumps ahead of its left partner (via `order`), so it opens in place and the
// partner and every card after it shift on by one; `layout` animates it all.
function ProjectCard({
  project: p,
  index,
  expanded,
  onToggle,
}: ProjectCardProps) {
  const mediaId = `project-media-${index}`;
  const order = expanded && index % 2 === 1 ? 2 * index - 3 : 2 * index;
  const [scope, animate] = useAnimate<HTMLElement>();
  const reduceMotion = useReducedMotion();
  const prevExpanded = useRef(expanded);

  // On toggle the content would visibly stretch and reflow with the card, so
  // hide it before paint and bring it back in sequence once the resize settles.
  useLayoutEffect(() => {
    if (prevExpanded.current === expanded) return;
    prevExpanded.current = expanded;
    const items = scope.current.querySelectorAll<HTMLElement>("[data-fade]");
    items.forEach((el) => (el.style.opacity = "0"));
    animate(
      items,
      reduceMotion ? { opacity: 1 } : { opacity: [0, 1], y: [8, 0] },
      { duration: 0.4, ease, delay: stagger(0.05, { startDelay: 0.35 }) }
    );

    if (expanded) {
      // offsetTop ignores the layout animation's transforms, so this is where
      // the card will settle; the scroll runs alongside the resize.
      let top = 0;
      for (let el: HTMLElement | null = scope.current; el; ) {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      scrollWindowTo(top);
    }
  }, [expanded, animate, scope, reduceMotion]);
  const parts = [
    { label: "Problem", text: p.problem },
    { label: "Built", text: p.built },
    { label: "Result", text: p.result },
  ].filter((part): part is { label: string; text: string } => !!part.text);

  return (
    <motion.li
      layout
      className={`md:[order:var(--order)] ${expanded ? "md:col-span-2" : ""}`}
      style={{ "--order": order } as React.CSSProperties}
      variants={{
        hidden: { opacity: 0, y: 32 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease },
        },
      }}
      transition={{
        layout: { type: "spring", visualDuration: 0.55, bounce: 0.12 },
      }}
    >
      <motion.article
        ref={scope}
        className="group relative flex h-full flex-col border border-dark-green/20 bg-white/25 p-6 backdrop-blur-md transition-colors duration-300 hover:border-dark-green/50 hover:bg-white/40 sm:p-8"
        whileHover={expanded ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Header and media toggle on click as a mouse/touch shortcut;
            keyboard users get the expand button. */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- the expand button covers keyboard */}
        <div
          className={p.media ? "cursor-pointer" : undefined}
          onClick={
            p.media
              ? (e) => {
                  // Buttons and the open carousel handle their own clicks.
                  const target = e.target as Element;
                  if (target.closest("a, button, [role=region]")) return;
                  if (window.getSelection()?.toString()) return;
                  onToggle();
                }
              : undefined
          }
        >
          <motion.div
            layout="position"
            className="flex items-center justify-between gap-4 font-neue-haas text-sm tracking-widest text-dark-green/70"
          >
            <span data-fade>{String(index + 1).padStart(2, "0")}</span>
            <span className="inline-flex items-center gap-2 text-right uppercase">
              <span data-fade className="inline-flex items-center gap-2">
                {companyLogos[p.context] && (
                  <img
                    src={companyLogos[p.context]}
                    alt=""
                    className="h-5 w-auto"
                  />
                )}
                {/* ORA's wordmark, styled like the header in the ORA app */}
                {p.title === "ORA" && (
                  <span
                    aria-hidden="true"
                    className="font-space-grotesk font-bold tracking-[0.22em] text-[#0C0C0C]"
                  >
                    ORA
                  </span>
                )}
                {p.year ? `${p.context} · ${p.year}` : p.context}
              </span>
              {p.media && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  onClick={onToggle}
                  aria-expanded={expanded}
                  aria-controls={mediaId}
                  aria-label={`${expanded ? "Collapse" : "Expand"} ${p.title}`}
                  className="-my-2 -mr-2 ml-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-dark-green transition-colors hover:bg-dark-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dark-green"
                >
                  <span data-fade className="inline-flex">
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      <path d="M7 17 17 7M9 7h8v8" />
                    </motion.svg>
                  </span>
                </motion.button>
              )}
            </span>
          </motion.div>

          {/* popLayout swaps strip and carousel in one render, so the card's layout
            spring covers the whole size change instead of snapping mid-way. */}
          <AnimatePresence initial={false} mode="popLayout">
            {p.media && (
              <motion.div
                key={expanded ? "carousel" : "thumb"}
                id={mediaId}
                className="mt-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, delay: 0.4, ease },
                }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {expanded ? (
                  <MediaCarousel media={p.media} title={p.title} />
                ) : (
                  <div className="overflow-hidden border border-dark-green/20">
                    <img
                      src={p.media[0].poster}
                      alt={p.media[0].alt}
                      loading="lazy"
                      draggable={false}
                      className="h-40 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none sm:h-48"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div layout="position" className="flex flex-1 flex-col">
          <h3
            data-fade
            className="mt-6 font-neue-haas text-2xl font-medium text-dark-green sm:text-3xl"
          >
            {p.title}
            <span
              aria-hidden="true"
              className="drop-shadow-glow ml-2 inline-block text-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              ☺
            </span>
          </h3>

          <dl data-fade className="mt-4 flex-1 space-y-4">
            {parts.map((part) => (
              <div key={part.label}>
                <dt className={smallLabelClass}>{part.label}</dt>
                <dd className="mt-1 font-neue-haas text-base leading-relaxed text-gray-800">
                  {part.text}
                </dd>
              </div>
            ))}
          </dl>

          <div data-fade>
            <Tags items={p.tags} />
          </div>

          {p.link &&
            (isPlaceholder(p.link.href) ? (
              <p
                data-fade
                className="mt-6 font-neue-haas text-base text-gray-800"
              >
                {p.link.label} {p.link.href}
              </p>
            ) : (
              <a
                data-fade
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
        </motion.div>
      </motion.article>
    </motion.li>
  );
}

interface MediaCarouselProps {
  media: Media[];
  title: string;
}

// Native scroll-snap handles swipe; the buttons and dots scroll the same track.
function MediaCarousel({ media, title }: MediaCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const next = (i + media.length) % media.length;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    track.scrollTo({
      left: next * track.clientWidth,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    setCurrent(Math.round(track.scrollLeft / track.clientWidth));
  }

  const navButton =
    "absolute top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-dark-green backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-dark-green";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} media`}
    >
      <div className="relative overflow-hidden border border-dark-green/20">
        <ul
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {media.map((m, i) => (
            <li
              key={m.src}
              className="w-full shrink-0 snap-center"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${media.length}`}
            >
              <MediaSlide media={m} />
            </li>
          ))}
        </ul>

        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              aria-label="Previous image"
              className={`${navButton} left-3`}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              aria-label="Next image"
              className={`${navButton} right-3`}
            >
              <span aria-hidden="true">→</span>
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-3 flex justify-center gap-1">
          {media.map((m, i) => (
            <button
              key={m.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === current}
              className="group/dot inline-flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`h-2 rounded-full transition-[width,background-color] duration-300 ${
                  i === current
                    ? "w-5 bg-dark-green"
                    : "w-2 bg-dark-green/25 group-hover/dot:bg-dark-green/50"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MediaSlide({ media }: { media: Media }) {
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

  return media.type === "video" ? (
    <video
      ref={video}
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={media.alt}
      className="aspect-video w-full object-cover"
    />
  ) : (
    <img
      src={media.src}
      alt={media.alt}
      loading="lazy"
      draggable={false}
      className="aspect-video w-full object-cover"
    />
  );
}
