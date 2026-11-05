// Everything tweakable for the ORA video. Regions are CSS px in the
// 1920x1080 capture viewport; `at` strings are event labels from events.json.
import type { VideoConfig } from "../../src/types";
import capture from "../../public/ora/events.json";

const config: VideoConfig = {
  id: "ora",
  title: "ORA",
  description: "A modular synth in the browser, with live multiplayer patching",
  role: "Solo project",
  // ORA's wordmark, as in the app's toolbar (.ora-toolbar__brand), scaled up.
  titleStyle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 168,
    letterSpacing: "0.22em",
    color: "#FFE249",
    textShadow: "0.025em 0 rgba(225, 123, 125, .55), -0.025em 0 rgba(2, 87, 162, .55)",
  },
  tags: ["React", "WebAssembly", "SuperCollider", "WebSockets"],
  url: "ora-fm.fly.dev",
  colors: {
    background: "#0E0E0C",
    surface: "#161614",
    text: "#F2EFE6",
    muted: "#8C897F",
    accent: "#FFE249",
  },
  fps: 30,
  titleSeconds: 1.8,
  outroSeconds: 2,
  audio: true,
  posterAt: 16,
  beats: [
    {
      clip: "01-boot",
      start: 0.8,
      callout: {
        at: "boot",
        label: "Boot",
        text: "SuperCollider’s audio engine, compiled to WebAssembly, starts right in the tab.",
      },
    },
    {
      clip: "02-modules",
      start: { event: "modules", offset: -0.6 },
      speed: 1.5,
      zoom: [
        // The panel and the middle of the canvas, where new modules land.
        { at: 0, region: { x: 0, y: 40, w: 1500, h: 844 } },
        // Saw Osc, Output and Scope once the panel closes.
        { at: { event: "close", offset: 0.3 }, region: { x: 60, y: 70, w: 1280, h: 720 } },
      ],
      callout: {
        at: "add-saw",
        label: "Modules",
        text: "Pick from 80+ oscillators, filters and effects, then click ports to patch cables.",
      },
      board: ["add-saw", "drag-scope", { event: "patched-2", offset: 1 }],
    },
    {
      clip: "03-patch",
      speed: 1.15,
      zoom: [
        { at: 0, region: null },
        // Buchla 259 and Grain Smear, where both sliders move.
        { at: { event: "tweak", offset: -1 }, region: { x: 180, y: 200, w: 1220, h: 686 } },
      ],
      callout: {
        at: "patch",
        label: "Patching",
        text: "Load a saved patch and play it: every slider changes the sound as you move it.",
      },
      board: [{ event: "patch", offset: 1 }, "tweak-2"],
    },
    {
      clip: "04-collab",
      speed: 1.15,
      end: { event: "peer-tweak-2", offset: 1.8 },
      zoom: [
        { at: 0, region: null },
        // In on the sliders the collaborator moves.
        { at: { event: "peer-tweak", offset: -1.2 }, region: { x: 380, y: 200, w: 1100, h: 619 } },
      ],
      callout: {
        at: "joined",
        label: "Collaborate",
        text: "Share a room and patch together. Only the patch syncs; each browser makes its own audio.",
      },
      board: ["room", "peer-tweak"],
    },
  ],
  loop: {
    beat: 3,
    from: "peer-tweak",
    seconds: 5,
    region: null,
  },
  capture,
};

export default config;
