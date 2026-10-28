import { Link } from "@remix-run/react";
import { MotionConfig, motion } from "motion/react";
import { services } from "~/data/portfolio";
import { SectionHeading } from "./Experience";
import { Tags } from "./Tags";
import { staggerShow } from "~/utils/reveal";
import { scrollToSection } from "~/utils/scrollToSection";

const ease = [0.22, 1, 0.36, 1] as const;

const cell = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export function Services() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="services" className="relative py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="01" title="What I can help with" />

          <motion.ul
            className="mt-16 grid border-l border-t border-dark-green/20 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ show: staggerShow(0.08) }}
          >
            {services.map((s, i) => (
              <motion.li
                key={s.title}
                className="group flex flex-col border-b border-r border-dark-green/20 bg-white/20 p-6 backdrop-blur-md transition-colors duration-300 hover:bg-white/40 sm:p-8"
                variants={cell}
              >
                <p className="font-neue-haas text-sm tracking-widest text-dark-green/70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-6 font-neue-haas text-2xl font-medium italic text-dark-green">
                  {s.title}
                  <span
                    aria-hidden="true"
                    className="drop-shadow-glow ml-2 inline-block text-xl not-italic opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  >
                    ☺
                  </span>
                </h3>
                <p className="mt-3 flex-1 font-neue-haas text-base leading-relaxed text-gray-800">
                  {s.description}
                </p>
                <Tags items={s.tags} />
              </motion.li>
            ))}

            {/* Fills the grid's last cell on desktop */}
            <motion.li
              className="flex border-b border-r border-dark-green/20 bg-white/10 backdrop-blur-md"
              variants={cell}
            >
              <Link
                to="#contact"
                onClick={scrollToSection}
                className="group flex w-full flex-col justify-end gap-2 p-6 font-neue-haas text-dark-green transition-colors duration-300 hover:bg-white/30 sm:p-8"
              >
                <span className="text-base text-gray-800">
                  Something else in mind?
                </span>
                <span className="inline-flex items-center gap-3 text-2xl font-medium italic">
                  Let&apos;s talk
                  <span
                    aria-hidden="true"
                    className="not-italic transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </motion.li>
          </motion.ul>
        </div>
      </section>
    </MotionConfig>
  );
}
