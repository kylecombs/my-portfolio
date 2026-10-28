import { MotionConfig, motion } from "motion/react";
import { howIWork } from "~/data/portfolio";
import { SectionHeading } from "./Experience";
import { staggerShow } from "~/utils/reveal";

const ease = [0.22, 1, 0.36, 1] as const;

export function HowIWork() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="how-i-work" className="relative py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="03" title="How I work" />

          <motion.ul
            className="mt-16 grid border-l border-t border-dark-green/20 sm:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ show: staggerShow(0.1) }}
          >
            {howIWork.map((item, i) => (
              <motion.li
                key={item.title}
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
                  {item.title}
                </h3>
                <p className="mt-3 max-w-md text-pretty font-neue-haas text-lg leading-relaxed text-gray-800">
                  {item.description}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>
    </MotionConfig>
  );
}
