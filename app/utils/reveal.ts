import type { Transition } from "motion/react";
import { pendingScrollSeconds } from "./scrollToSection";

const ease = [0.22, 1, 0.36, 1] as const;

// Variant functions resolve when the reveal starts, not at render, so a reveal
// triggered mid link-scroll waits until the page has stopped moving.

/** Props for an element that fades/slides in when scrolled into view. */
export function reveal(
  from: { opacity: number; x?: number; y?: number },
  { delay = 0, duration = 0.8 }: { delay?: number; duration?: number } = {}
) {
  return {
    initial: "hidden",
    whileInView: "show",
    variants: {
      hidden: from,
      show: () => ({
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          ease,
          delay: delay + pendingScrollSeconds(),
        } satisfies Transition,
      }),
    },
  } as const;
}

/** Parent "show" variant that staggers its children, after any link-scroll. */
export function staggerShow(stagger: number, delayChildren = 0) {
  return () => ({
    transition: {
      staggerChildren: stagger,
      delayChildren: delayChildren + pendingScrollSeconds(),
    },
  });
}
