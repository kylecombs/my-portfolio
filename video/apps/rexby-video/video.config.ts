// Everything tweakable for the Rexby video upload pipeline video. The capture records the replica in
// ../rexby-creator/mock (made-up creator, Wikimedia Commons photos and video, Esri map tiles). Regions are CSS px in
// the 1920x1080 capture viewport; `at` strings are event labels from events.json.
import type { VideoConfig } from "../../src/types";
import capture from "../../public/rexby-video/events.json";

const EDITOR = { x: 0, y: 72, w: 1300, h: 731 }; // spot form + the map pin
const MODAL = { x: 480, y: 270, w: 960, h: 540 }; // type picker and upload modals (upload: y 317–765)
const GRID = { x: 470, y: 80, w: 1420, h: 799 }; // guide tabs + first card rows

// The traveler view's video, drawn over the capture where it plays (box from the "preview" event).
// Fetch: cp apps/rexby-creator/mock/media/seljalandsfoss.mp4 public/rexby-video/clips/source.mp4
const PREVIEW_VIDEO = {
  src: "rexby-video/clips/source.mp4",
  box: { x: 420, y: 140, w: 450, h: 800 },
  radius: 20,
};

const config: VideoConfig = {
  id: "rexby-video",
  title: "Video Upload Pipeline",
  description: "Creators add videos to their guides, ready to stream anywhere",
  role: "Fullstack engineer",
  logo: "rexby-creator/logo.svg",
  logoHeight: 120,
  tags: ["React", "AWS S3", "Lambda", "MediaConvert"],
  url: "", // plain stage, no address bar
  colors: {
    background: "#EEF5F7",
    surface: "#FFFFFF",
    text: "#14142B",
    muted: "#6E7191",
    accent: "#1282A6",
  },
  fps: 30,
  titleSeconds: 3.3,
  outroSeconds: 2,
  posterAt: 32.5, // traveler view with the video playing
  beats: [
    {
      clip: "01-edit",
      start: 0.3,
      speed: 1.2,
      zoom: [
        { at: 0, region: GRID },
        { at: { event: "editor", offset: 0.1 }, region: EDITOR },
      ],
      board: ["edit", { event: "editor", offset: 1 }],
      callout: {
        at: "grid",
        label: "Edit spot",
        text: "A creator opens one of the spots in their guide to add a video.",
      },
    },
    {
      clip: "02-upload",
      speed: 1.3,
      zoom: [
        { at: 0, region: EDITOR },
        { at: { event: "add-media", offset: 0.3 }, region: MODAL },
      ],
      board: ["types", "file", { event: "uploaded", offset: -0.6 }],
      callout: {
        at: "add-media",
        label: "Upload video",
        text: "The phone video uploads straight from the browser to S3.",
      },
    },
    {
      clip: "03-process",
      speed: 1.3,
      zoom: [
        { at: 0, region: MODAL },
        { at: { event: "tile", offset: -0.3 }, region: EDITOR },
      ],
      board: ["transcode", { event: "processed", offset: -0.2 }, { event: "tile", offset: 1 }],
      callout: {
        at: 0,
        label: "Processing",
        text: "A Lambda sends it to MediaConvert, which makes MP4 and WebM versions plus cover frames.",
      },
    },
    {
      clip: "04-cover",
      speed: 1.4,
      zoom: [
        { at: 0, region: EDITOR },
        { at: { event: "cover", offset: 0.2 }, region: { x: 389, y: 220, w: 1142, h: 642 } }, // cover picker, down to Continue (y 823)
        { at: { event: "continue", offset: 0.2 }, region: EDITOR },
      ],
      board: [{ event: "frames", offset: 0.6 }, "pick", { event: "covered", offset: 0.8 }],
      callout: {
        at: "cover",
        label: "Cover",
        text: "The creator picks a cover from frames pulled out of the video.",
      },
    },
    {
      clip: "05-save",
      speed: 1.4,
      zoom: [
        { at: 0, region: null },
        { at: { event: "saved", offset: 0.1 }, region: GRID },
      ],
      board: ["save", { event: "saved", offset: 1 }],
      callout: {
        at: "save",
        label: "Save spot",
        text: "The guide shows the new cover with the video's length.",
      },
    },
    {
      clip: "06-play",
      speed: 1,
      zoom: [
        { at: 0, region: GRID },
        { at: { event: "open", offset: 0.2 }, region: null },
      ],
      board: [{ event: "preview", offset: 1.5 }],
      callout: {
        at: "preview",
        label: "Playback",
        text: "Travelers watch it stream from the CDN, smooth on any phone or browser.",
      },
      // The screencast drops frames while the page plays video; draw the source over it once the modal has risen.
      inset: { ...PREVIEW_VIDEO, from: { event: "preview", offset: 0.6 }, sourceAt: -2.118 }, // pv.currentTime 0.086 at "preview" (2.204s)
    },
  ],
  // Upload finishing and the processing steps ticking off.
  loop: {
    beat: 2,
    from: 1, // past the crossfade lead; 3.6s at 1.3x ends before the 5.9s clip does
    seconds: 3.6,
    region: MODAL,
  },
  capture,
};

export default config;
