import { animate } from "motion";
import type { MouseEvent } from "react";

const ease = [0.22, 1, 0.36, 1] as const;
let current: ReturnType<typeof animate> | undefined;
// Reveals start this far into a link scroll; with ease-out the page has
// covered ~90% of the distance by then, so the fade plays as it settles.
const REVEAL_AT = 0.55;
let revealAt = 0;

/** Seconds until reveals should start during a link-triggered scroll. */
export function pendingScrollSeconds() {
  return Math.max(0, (revealAt - performance.now()) / 1000);
}

/**
 * onClick for in-page "#id" links: animates the window scroll to the section
 * instead of the browser's instant jump. Modified clicks fall through.
 */
export function scrollToSection(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  const id = decodeURIComponent(event.currentTarget.hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();

  // Keep Remix's history state (its key) so ScrollRestoration never restores a stale position
  window.history.replaceState(window.history.state, "", `#${id}`);

  // Move focus for keyboard and screen-reader users without a second jump
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });

  const to = target.getBoundingClientRect().top + window.scrollY;
  current?.stop();
  revealAt = 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, to);
    return;
  }

  const distance = Math.abs(to - window.scrollY);
  const duration = Math.min(1.2, 0.6 + distance / 8000);
  revealAt = performance.now() + duration * REVEAL_AT * 1000;
  current = animate(window.scrollY, to, {
    duration,
    ease,
    onUpdate: (y) => window.scrollTo(0, y),
  });

  // Hand control back the moment the user scrolls themselves
  const cancel = () => {
    current?.stop();
    revealAt = 0;
  };
  for (const type of ["wheel", "touchstart", "keydown"] as const) {
    window.addEventListener(type, cancel, { once: true, passive: true });
  }
  current.then(() => {
    for (const type of ["wheel", "touchstart", "keydown"] as const) {
      window.removeEventListener(type, cancel);
    }
  });
}
