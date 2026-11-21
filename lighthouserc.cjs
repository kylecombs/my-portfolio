// Lighthouse CI: audits the production build, served by remix-serve, on
// Lighthouse's default simulated mobile device and slow 4G connection.
// Run locally with `npm run build && npm run lighthouse`.
//
// The budgets sit a little above where the site measures today, so they
// catch regressions; tighten them as the site gets faster.

// Assert on the median of the runs rather than the best one, so a lucky
// run can't hide a regression and one slow run can't fail the build.
const median = (level, options) => [
  level,
  { ...options, aggregationMethod: "median" },
];

module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm start",
      startServerReadyPattern: "remix-serve",
      url: ["http://localhost:3000/", "http://localhost:3000/projects"],
      numberOfRuns: 3,
      settings: {
        // Headless Chrome in CI containers can't use the sandbox.
        chromeFlags: "--no-sandbox --headless=new",
        // The fonts.net kit loads its license-tracking script over http://
        // and sets a cookie from it. That's the font vendor's code, so these
        // audits are skipped rather than failing every build.
        skipAudits: ["is-on-https", "inspector-issues"],
      },
    },
    assert: {
      assertions: {
        // The home page measures 0.7–0.77, held back by render-blocking font
        // stylesheets; raise this once those are fixed.
        "categories:performance": median("error", { minScore: 0.6 }),
        "categories:accessibility": median("error", { minScore: 0.95 }),
        "categories:best-practices": median("error", { minScore: 0.9 }),
        "categories:seo": median("error", { minScore: 0.9 }),

        // Page-load metrics, in milliseconds (CLS is unitless).
        "first-contentful-paint": median("error", { maxNumericValue: 2500 }),
        "largest-contentful-paint": median("error", { maxNumericValue: 5000 }),
        // TBT depends on the machine's load and swings the most between runs.
        "total-blocking-time": median("error", { maxNumericValue: 1000 }),
        "cumulative-layout-shift": median("error", { maxNumericValue: 0.1 }),

        // Page weight, in bytes.
        "resource-summary:script:size": median("error", {
          maxNumericValue: 200000,
        }),
        "resource-summary:total:size": median("warn", {
          maxNumericValue: 1000000,
        }),
      },
    },
    upload: {
      // HTML and JSON reports land in .lighthouseci/reports; CI uploads them
      // as a build artifact.
      target: "filesystem",
      outputDir: ".lighthouseci/reports",
    },
  },
};
