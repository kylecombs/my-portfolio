import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-green": "#0F3325",
      },

      animation: {
        sparkle: 'sparkle 3s ease-in-out infinite',
        sparkleDelayed: 'sparkleDelayed 4s ease-in-out infinite 1s',
        sparkleShort: 'sparkleShort 2s ease-in-out infinite 0.5s',
        sparkleFast: 'sparkle 2.5s ease-in-out infinite 2s',
        sparkleSlow: 'sparkleDelayed 5s ease-in-out infinite 1.5s',
        sparkleQuick: 'sparkleShort 1.8s ease-in-out infinite 0.8s',
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        "neue-haas": [
          "NeueHaasGroteskDisplayPro",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        "script": [
          "EdwardianScriptITCPro",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        "retro-gothic": [
          "Stgotic",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        "pixel": [
          "BrokenConsole",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
