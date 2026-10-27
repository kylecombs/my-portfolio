import { MotionConfig, motion } from "motion/react";
import { SectionHeading } from "./Experience";

const ease = [0.22, 1, 0.36, 1] as const;

const links = [
  {
    label: "Email",
    handle: "kylecombsdev@gmail.com",
    href: "mailto:kylecombsdev@gmail.com",
  },
  {
    label: "LinkedIn",
    handle: "in/kyledavidcombs",
    href: "https://www.linkedin.com/in/kyledavidcombs/",
  },
  {
    label: "GitHub",
    handle: "@kylecombs",
    href: "https://github.com/kylecombs",
  },
];

export function Contact() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="contact" className="relative pb-12 pt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="05" title="Get in touch" />

          <div className="mt-16 grid gap-12 md:grid-cols-12 md:items-center">
            <motion.div
              className="md:col-span-7"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease }}
            >
              <p className="drop-shadow-glow font-script text-8xl font-light leading-none text-dark-green sm:text-9xl">
                Say hello<span className="ml-2 text-2xl">☺</span>
              </p>
              <p className="mt-8 max-w-md text-pretty font-neue-haas text-lg leading-relaxed text-gray-800">
                I&apos;m open to contract work with small teams: frontends,
                Rails APIs, Shopify integrations, and data pipelines. Tell me
                what you&apos;re building.
              </p>
              <p className="mt-6 inline-flex items-center gap-3 font-neue-haas text-sm uppercase tracking-widest text-dark-green/70">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-dark-green/40 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-dark-green" />
                </span>
                Available for new projects
              </p>
            </motion.div>

            <motion.ul
              className="border-t border-dark-green/20 md:col-span-5"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{
                show: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                },
              }}
            >
              {links.map((l) => (
                <motion.li
                  key={l.label}
                  className="border-b border-dark-green/20"
                  variants={{
                    hidden: { opacity: 0, x: 16 },
                    show: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.6, ease },
                    },
                  }}
                >
                  <a
                    href={l.href}
                    {...(l.href.startsWith("http") && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="group flex min-h-11 items-center justify-between gap-4 py-6 font-neue-haas text-gray-800 transition-colors hover:text-dark-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark-green"
                  >
                    <span>
                      <span className="block text-3xl font-medium italic">
                        {l.label}
                      </span>
                      <span className="mt-1 block text-sm tracking-wide text-gray-700">
                        {l.handle}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-2xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                    {l.href.startsWith("http") && (
                      <span className="sr-only">(opens in a new tab)</span>
                    )}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <footer className="mt-24 flex flex-col justify-between gap-2 border-t border-dark-green/20 pt-6 font-neue-haas text-sm text-gray-700 sm:flex-row">
            <p>© {new Date().getFullYear()} Kyle Combs</p>
            <p>Built with Remix, Tailwind, and Motion</p>
          </footer>
        </div>
      </section>
    </MotionConfig>
  );
}
