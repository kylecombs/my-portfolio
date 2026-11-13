// Everything tweakable for the FM synth video. Regions are CSS px in the
// 1920x1080 capture viewport (synth lifted 68px, see capture.ts); `at` strings are event labels.
import type { VideoConfig } from "../../src/types";
import capture from "../../public/fm-synth/events.json";

// The whole synth with a little room around it.
const SYNTH = { x: 380, y: 142, w: 1160, h: 653 };

const config: VideoConfig = {
  id: "fm-synth",
  title: "Browser FM Synthesizer",
  description: "A playable FM synth with a photorealistic UI in plain CSS",
  role: "Personal project",
  tags: ["Web Audio API", "Tone.js", "React", "CSS"],
  url: "fmsynth.netlify.app",
  colors: {
    background: "#0F0D0C",
    surface: "#1A1716",
    text: "#F4EFE6",
    muted: "#8E877F",
    accent: "#97BF93", // the LCD's green
  },
  fps: 30,
  titleSeconds: 3,
  outroSeconds: 2,
  audio: true,
  posterAt: 4,
  beats: [
    {
      clip: "01-keys",
      zoom: [{ at: 0, region: SYNTH }],
      callout: {
        at: "play",
        label: "Keys",
        text: "Click a key to play it, or hold the button and sweep across the keyboard.",
      },
      board: ["play", { event: "glide", offset: 0.8 }],
    },
    {
      clip: "02-presets",
      speed: 1.1,
      zoom: [{ at: 0, region: SYNTH }],
      callout: {
        at: "kalimba",
        label: "Presets",
        text: "Ten FM voices, from marimba to slap bass, each its own carrier and modulator settings.",
      },
      board: ["kalimba-display", "bass-display"],
    },
    {
      clip: "03-octave",
      zoom: [
        // The octave slider and the low keys the riff uses. The drag starts 0.4s in, so zoom from the cut.
        { at: 0, region: { x: 470, y: 250, w: 680, h: 383 } },
      ],
      callout: {
        at: "octave",
        label: "Octave",
        text: "Shift the whole keyboard up or down two octaves.",
      },
      board: [{ event: "octave-play", offset: 0.3 }],
    },
    {
      clip: "04-bend",
      zoom: [
        { at: 0, region: SYNTH },
        // The pitch wheel, the display, the preset buttons and the held key.
        { at: { event: "held", offset: -0.3 }, region: { x: 440, y: 228, w: 820, h: 461 } },
      ],
      callout: {
        at: "bend",
        label: "Pitch bend",
        text: "Drag the wheel to bend a held note; it springs back to center on release.",
      },
      board: [{ event: "bend", offset: 0.6 }],
    },
  ],
  loop: {
    beat: 0,
    from: "glide",
    seconds: 4,
    region: SYNTH,
  },
  capture,
};

export default config;
