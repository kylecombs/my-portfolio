// Link, not <a>: native hash entries share Remix's "default" history key, so
// ScrollRestoration restores a stale position and snaps back to the top.
import { Link } from "@remix-run/react";
import { useState } from "react";
import { Asterisk } from "./Asterisk";
import { useMouseMomentum } from "../hooks/useMouseMomentum";
import { scrollToSection } from "../utils/scrollToSection";
import { Sparkles } from "./Sparkles";
import { experience } from "../data/portfolio";

interface HeroProps {
  className?: string;
}

const nav = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
];

// CSS, not Motion: the hero must animate before hydration, since it is the first paint
const enterClass =
  "animate-[heroEnter_0.8s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none";
const delay = (s: number) => ({ animationDelay: `${s}s` });

const current = experience.slice(0, 2);

export function Hero({ className = "" }: HeroProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rotation = useMouseMomentum({
    friction: 0.99,
    sensitivity: 0.3,
    maxVelocity: 5,
    scrollSensitivity: 0.05,
    scrollMaxVelocity: 2,
  });

  return (
    <section className={`relative min-h-svh overflow-clip ${className}`}>
      {/* Page Border */}
      <div className="pointer-events-none absolute inset-2.5 z-20 border border-dark-green/20 lg:inset-4" />

      {/* Asterisk Background Element: mouse momentum spins it; touch screens get a slow
          CSS spin on `rotate`, which stacks with the inline transform */}
      <Asterisk
        className="absolute -right-10 top-28 z-0 h-52 w-52 fill-dark-green/5 lg:bottom-14 lg:left-16 lg:right-auto lg:top-auto lg:h-80 lg:w-80 [@media(hover:none)]:motion-safe:animate-[pinwheelSpin_45s_linear_infinite]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center center",
        }}
      />

      {/* Sparkle Effect */}
      <Sparkles />

      <div className="relative z-10 flex min-h-svh flex-col px-7 pb-8 pt-6 lg:px-16 lg:pb-[3.25rem] lg:pt-12">
        <header className="relative flex items-center justify-between">
          <div
            style={delay(0.1)}
            className={`${enterClass} flex flex-col gap-0.5 font-neue-haas`}
          >
            <span className="outlined-text text-[2.5rem] italic leading-none tracking-wide lg:text-[3.5rem]">
              Kyle Combs
            </span>
            <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-dark-green lg:text-[0.8125rem]">
              Software Engineer
            </span>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="hero-nav"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-dark-green/35 bg-[#f5f5f5]/60 text-dark-green lg:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-5 w-5 fill-none stroke-current stroke-[1.5]"
              strokeLinecap="round"
            >
              <path d={menuOpen ? "M5 5l10 10M15 5L5 15" : "M3 7h14M3 13h14"} />
            </svg>
          </button>

          <nav
            id="hero-nav"
            aria-label="Sections"
            className={`${menuOpen ? "flex" : "hidden"} absolute right-0 top-full z-30 mt-3 w-56 flex-col rounded-2xl border border-dark-green/15 bg-[#f5f5f5]/95 p-2 shadow-lg backdrop-blur lg:static lg:mt-0 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none`}
          >
            {nav.map((item, i) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={(e) => {
                  setMenuOpen(false);
                  scrollToSection(e);
                }}
                style={delay(0.2 + i * 0.1)}
                className={`${enterClass} group flex min-h-11 items-center gap-2.5 px-3.5 font-neue-haas text-base text-gray-800 transition-colors duration-200 hover:text-dark-green focus-visible:text-dark-green`}
              >
                <span
                  aria-hidden="true"
                  className="relative flex h-4 w-4 items-center justify-center"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-dark-green transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0" />
                  <span className="drop-shadow-glow absolute text-[1.25rem] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    ☺
                  </span>
                </span>
                {item.label}
              </Link>
            ))}
            <Link
              to="#contact"
              onClick={(e) => {
                setMenuOpen(false);
                scrollToSection(e);
              }}
              style={delay(0.5)}
              className={`${enterClass} group flex min-h-11 items-center gap-2.5 px-3.5 font-neue-haas text-base font-medium text-dark-green lg:ml-3 lg:rounded-full lg:border lg:border-dark-green lg:px-5 lg:text-[0.9375rem] lg:transition-colors lg:hover:bg-dark-green lg:hover:text-[#f5f5f5]`}
            >
              {/* Bullet only in the mobile menu; desktop renders this as a pill button */}
              <span
                aria-hidden="true"
                className="relative flex h-4 w-4 items-center justify-center lg:hidden"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-dark-green transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0" />
                <span className="drop-shadow-glow absolute text-[1.25rem] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  ☺
                </span>
              </span>
              Get in touch
            </Link>
          </nav>
        </header>

        <div className="flex flex-1 flex-col justify-center gap-7 py-8 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6 lg:pb-10 lg:pt-0">
          <div
            style={delay(0.4)}
            className={`${enterClass} flex flex-col text-dark-green lg:col-span-8`}
          >
            <p className="ml-1 flex flex-wrap items-baseline gap-x-2 text-[clamp(1.5rem,7.5vw,2rem)] font-bold italic leading-tight lg:mb-8 lg:ml-2 lg:flex-nowrap lg:gap-x-4 lg:text-[clamp(3rem,4.7vw,4.25rem)]">
              <span className="outlined-text">Good</span>
              <strong>software</strong>
              <span className="outlined-text">should</span>
            </p>
            <h1 className="drop-shadow-glow mb-6 mt-11 flex flex-col font-script text-[clamp(6rem,34vw,9rem)] font-light leading-[0.72] lg:m-0 lg:block lg:whitespace-nowrap lg:text-[min(16vw,14.5rem)] lg:leading-[0.95]">
              <span>Feel</span>{" "}
              <span className="pl-14 lg:pl-0">
                good
                <span
                  aria-hidden="true"
                  className="ml-4 align-baseline font-neue-haas text-[1.375rem] lg:text-[2rem]"
                >
                  ☺
                </span>
              </span>
            </h1>
          </div>

          <div
            style={delay(0.6)}
            className={`${enterClass} flex flex-col gap-7 lg:col-span-4 lg:col-start-9 lg:pb-9`}
          >
            <p className="text-pretty font-neue-haas text-[1.0625rem] leading-relaxed text-gray-800 lg:text-lg">
              I work to make the web a little more welcoming. My approach is
              simple: write solid code, respect the user, and remember
              there&apos;s a real person behind every screen. I bring
              engineering, design, and product thinking together to build
              experiences that <em>just work</em>.
            </p>
            <div className="flex flex-col gap-2.5 font-neue-haas lg:flex-row lg:items-center lg:gap-3">
              <Link
                to="#projects"
                onClick={scrollToSection}
                className="flex min-h-[3.25rem] items-center justify-center whitespace-nowrap rounded-full bg-dark-green px-6 font-medium text-[#f5f5f5] transition-opacity hover:opacity-90 lg:min-h-12 lg:text-[0.9375rem]"
              >
                See projects
              </Link>
              <Link
                to="#contact"
                onClick={scrollToSection}
                className="flex min-h-[3.25rem] items-center justify-center rounded-full border border-dark-green font-medium text-dark-green lg:hidden"
              >
                Get in touch
              </Link>
              <Link
                to="#about"
                onClick={scrollToSection}
                className="group hidden min-h-12 items-center gap-2 whitespace-nowrap px-3 text-[0.9375rem] font-medium text-dark-green lg:flex"
              >
                About me
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-4 w-4 fill-none stroke-current stroke-[1.5] transition-transform group-hover:translate-x-1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <footer
          style={delay(0.8)}
          className={`${enterClass} flex items-end justify-between border-t border-dark-green/15 pt-4 font-neue-haas lg:pt-5`}
        >
          <dl className="flex flex-col gap-2.5 text-sm lg:flex-row lg:gap-12">
            {current.map((job, i) => (
              <div
                key={job.company}
                className="flex items-baseline gap-3 lg:flex-col lg:gap-1"
              >
                <dt className="w-11 text-[0.6875rem] uppercase tracking-[0.14em] text-[#3d5a4d] lg:w-auto">
                  {i === 0 ? "Now" : "Also"}
                </dt>
                <dd className="text-gray-800">
                  {job.role} ·{" "}
                  <strong className="text-dark-green">{job.company}</strong>
                </dd>
              </div>
            ))}
            <div className="hidden flex-col gap-1 lg:flex">
              <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-[#3d5a4d]">
                Based
              </dt>
              <dd className="text-gray-800">{current[0].location}</dd>
            </div>
          </dl>

          <Link
            to="#about"
            onClick={scrollToSection}
            aria-label="Scroll to About"
            className="hidden min-h-11 items-center gap-3 text-[0.6875rem] uppercase tracking-[0.2em] text-[#3d5a4d] transition-colors hover:text-dark-green lg:flex"
          >
            Scroll
            <span
              aria-hidden="true"
              className="relative flex h-11 w-3 justify-center"
            >
              <span className="block h-10 w-px origin-top animate-[scrollLine_2.4s_ease-in-out_infinite] bg-current opacity-50 motion-reduce:animate-none" />
              {/* Tip sits at the line's end (40px); scrollArrow follows the line's scaleY */}
              <svg
                viewBox="0 0 12 7"
                className="absolute left-0 top-[34px] h-[7px] w-3 animate-[scrollArrow_2.4s_ease-in-out_infinite] fill-none stroke-current opacity-50 motion-reduce:animate-none"
              >
                <polyline
                  points="1,1 6,6 11,1"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </footer>
      </div>
    </section>
  );
}
