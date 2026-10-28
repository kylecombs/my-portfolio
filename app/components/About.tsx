import { MotionConfig, motion } from "motion/react";
import { SectionHeading } from "./Experience";
import { reveal } from "~/utils/reveal";
import { about } from "~/data/portfolio";

// "*text*" in the copy renders as <em>
function emphasize(text: string) {
  return text
    .split(/\*([^*]+)\*/)
    .map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));
}

const viewport = { once: true, amount: 0.4 };

export function About() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="about" className="relative py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="04" title="About" />

          <div className="mt-16 grid gap-12 md:grid-cols-12">
            <div className="space-y-6 md:col-span-7">
              {about.paragraphs.map((text, i) => (
                <motion.p
                  key={text}
                  {...reveal({ opacity: 0, y: 24 }, { delay: i * 0.1 })}
                  viewport={viewport}
                  className={
                    i === 0
                      ? "text-pretty font-neue-haas text-2xl leading-snug text-dark-green sm:text-3xl"
                      : "text-pretty font-neue-haas text-lg leading-relaxed text-gray-800"
                  }
                >
                  {emphasize(text)}
                </motion.p>
              ))}
            </div>

            <motion.dl
              {...reveal({ opacity: 0, y: 24 }, { delay: 0.15 })}
              viewport={viewport}
              className="self-start border border-dark-green/20 bg-white/25 p-6 backdrop-blur-md sm:p-8 md:col-span-5"
            >
              {about.facts.map((f) => (
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
