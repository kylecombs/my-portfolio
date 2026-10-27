// Link, not <a>: native hash entries share Remix's "default" history key, so
// ScrollRestoration restores a stale position and snaps back to the top.
import { Link } from "@remix-run/react";
import { Asterisk } from "./Asterisk";
import { useMouseMomentum } from "../hooks/useMouseMomentum";
import { Sparkles } from "./Sparkles";

interface HeroProps {
  className?: string;
}

const nav = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

// CSS, not Motion: the hero must animate before hydration, since it is the first paint
const enterClass =
  "animate-[heroEnter_0.8s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none";
const delay = (s: number) => ({ animationDelay: `${s}s` });

export function Hero({ className = "" }: HeroProps) {
  const rotation = useMouseMomentum({
    friction: 0.99,
    sensitivity: 0.3,
    maxVelocity: 5,
  });

  return (
    <section className={`relative min-h-svh overflow-hidden ${className}`}>
      {/* Page Border */}
      <div className="pointer-events-none absolute inset-4 z-20 border border-dark-green/20" />

      {/* Asterisk Background Element */}
      <Asterisk
        className="absolute bottom-16 left-20 z-0 h-80 w-80 fill-white/10"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center center",
        }}
      />

      {/* Sparkle Effect */}
      <Sparkles />

      <div className="relative z-10 flex min-h-svh flex-col px-8 py-10 sm:px-12">
        <header className="lg:absolute lg:left-12 lg:top-10">
          <h1
            style={delay(0.1)}
            className={`${enterClass} outlined-text mb-2 whitespace-nowrap font-neue-haas text-4xl font-normal italic tracking-wide sm:text-5xl lg:text-7xl`}
          >
            Kyle Combs
          </h1>
          <p
            style={delay(0.25)}
            className={`${enterClass} mb-6 font-neue-haas text-xl font-normal tracking-wider text-dark-green`}
          >
            Software Engineer
          </p>

          <nav aria-label="Sections">
            <ul className="grid w-fit grid-cols-2 gap-x-6 sm:block">
              {nav.map((item, i) => (
                <li
                  key={item.href}
                  className={enterClass}
                  style={delay(0.4 + i * 0.1)}
                >
                  <Link
                    to={item.href}
                    className="group flex min-h-11 items-center font-neue-haas text-lg text-gray-800 transition-colors duration-200 hover:text-dark-green focus-visible:text-dark-green"
                  >
                    <span
                      aria-hidden="true"
                      className="relative mr-1 flex h-6 w-6 items-center justify-center sm:mr-4"
                    >
                      <span className="h-2 w-2 rounded-full bg-dark-green transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0" />
                      <span className="drop-shadow-glow absolute text-[1.5rem] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                        ☺
                      </span>
                    </span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="flex flex-1 items-center justify-center py-16">
          <div
            style={delay(0.5)}
            className={`${enterClass} flex flex-col items-start text-dark-green sm:items-end`}
          >
            <p className="flex flex-wrap items-baseline gap-x-3 text-[clamp(1.75rem,5vw,3.75rem)] font-bold italic leading-tight sm:justify-end">
              <span className="outlined-text">Good</span>
              <strong>software</strong>
              <span className="outlined-text">should</span>
            </p>
            <p className="drop-shadow-glow font-script text-[clamp(5.5rem,25vw,15rem)] font-light leading-[0.9]">
              Feel good
              <span aria-hidden="true" className="ml-2 text-[1.5rem]">
                ☺
              </span>
            </p>
            <p className="mt-6 max-w-[32rem] text-pretty font-neue-haas text-base leading-relaxed text-gray-800 sm:text-right sm:text-xl">
              As a software engineer, I work to make the web a little more
              welcoming. My approach is simple: write solid code, respect the
              user, and remember that behind every screen is a real person. I
              bring both engineering skills and design thinking to create
              experiences that just work.
            </p>
          </div>
        </div>

        <Link
          to="#about"
          aria-label="Scroll to About"
          style={delay(1.2)}
          className={`${enterClass} absolute inset-x-0 bottom-10 mx-auto hidden w-fit flex-col items-center gap-3 font-neue-haas text-xs uppercase tracking-widest text-dark-green/70 transition-colors hover:text-dark-green lg:flex`}
        >
          Scroll
          <span
            aria-hidden="true"
            className="relative flex h-11 w-3 justify-center"
          >
            <span className="block h-10 w-px origin-top animate-[scrollLine_2.4s_ease-in-out_infinite] bg-dark-green/50 motion-reduce:animate-none" />
            {/* Tip sits at the line's end (40px); scrollArrow follows the line's scaleY */}
            <svg
              viewBox="0 0 12 7"
              className="absolute left-0 top-[34px] h-[7px] w-3 animate-[scrollArrow_2.4s_ease-in-out_infinite] fill-none stroke-dark-green/50 motion-reduce:animate-none"
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
      </div>
    </section>
  );
}
