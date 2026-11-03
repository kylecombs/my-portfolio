import type { CaptureLog } from "./capture/recorder";

/** Seconds into the beat's clip, or the label of an event logged by the capture script (+ optional offset). */
export type At = number | string | { event: string; offset: number };

/** A rectangle in the app's CSS pixels (the capture viewport, e.g. 1920x1080). */
export interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Beat {
  clip: string;
  /** Where in the clip the beat starts/ends; defaults to the whole clip. */
  start?: At;
  end?: At;
  /** Address bar text for this beat; defaults to the config's `url`. */
  url?: string;
  /** Playback rate; >1 tightens slow stretches like page loads. */
  speed?: number;
  /** Camera moves. `region: null` returns to the full frame. Before the first one the camera holds where it was. */
  zoom?: { at: At; region: Region | null }[];
  callout?: { at: At; out?: At; label: string; text: string };
  /** A source video drawn over a page video the screencast captured jerkily (it drops frames while the page decodes video). */
  inset?: {
    /** Path under public/. */
    src: string;
    /** The page video's box, in capture CSS px. */
    box: Region;
    /** Source seconds at clip second 0 (source time = clip time + sourceAt). */
    sourceAt: number;
    /** When to show it; default the whole beat. */
    from?: At;
    to?: At;
    radius?: number;
    /** CSS filter to match the capture's color (e.g. a color-range difference). */
    filter?: string;
    /** Redraw the page player's pause button and progress bar, which the inset covers; the source's duration. */
    controls?: { duration: number };
  };
  /** Moment(s) the storyboard shows, one panel (and screenshot) each; defaults to `callout.at`, else the beat's middle. */
  board?: At | At[];
}

export interface VideoConfig {
  id: string;
  title: string;
  description: string;
  role: string;
  /** Logo at the top of the title card, a path under public/ (e.g. "camp-booking/logo.png"). */
  logo?: string;
  /** Logo height in px on the title card; default 168. Lower it for wide wordmarks. */
  logoHeight?: number;
  tags: string[];
  /** Shown in the browser frame's address bar. */
  url: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
  };
  fps: number;
  titleSeconds: number;
  outroSeconds: number;
  beats: Beat[];
  /** Seamless hover loop, cut from one beat. */
  loop: {
    beat: number;
    from: At;
    seconds: number;
    speed?: number;
    region: Region | null;
  };
  /** Seconds into the main video for the poster frame. */
  posterAt: number;
  capture: CaptureLog;
}
