// Everything tweakable for the agent coding workflow video. The capture records the dashboard copy in mock/
// (made-up tickets). Regions are CSS px in the 1920x1080 capture viewport; `at` strings are event labels from events.json.
import type { VideoConfig } from "../../src/types";
import capture from "../../public/agent-workflow/events.json";

const HOST = "factory.localhost/";
const PR_PAGE = `${HOST}job.html?id=026-eng-390-checkout-address-validation`;
const DOC = { x: 0, y: 60, w: 1160, h: 653 }; // the task page's left panel, top

const config: VideoConfig = {
  id: "agent-workflow",
  title: "Agent Coding Workflow",
  description: "From ticket to reviewed pull request, with a person at every gate",
  role: "Full-stack engineer",
  tags: ["Python", "Claude Code", "Linear", "Docker", "Playwright"],
  url: `${HOST}dashboard.html`,
  colors: {
    background: "#F4F3EF",
    surface: "#FFFFFF",
    text: "#1B1B1A",
    muted: "#5E5E5A",
    accent: "#056DDC",
  },
  fps: 30,
  titleSeconds: 3.8,
  outroSeconds: 2,
  posterAt: 34.9, // the workflow graph, zoomed on its loop-backs
  beats: [
    {
      clip: "01-board",
      zoom: [
        { at: 0, region: null },
        { at: { event: "working", offset: -0.5 }, region: { x: 940, y: 40, w: 980, h: 551 } },
      ],
      callout: {
        at: { event: "board", offset: 0.6 },
        label: "The board",
        text: "Tickets move left to right. Agents work the cards; highlighted ones wait on a person.",
      },
      board: [{ event: "board", offset: 0.6 }, "human"],
    },
    {
      clip: "02-signoff",
      start: { event: "open-spec", offset: 0.4 }, // after the click: the address bar shows the job page
      url: `${HOST}job.html?id=031-eng-405-save-cart-for-later`,
      zoom: [
        { at: "open-spec", region: null },
        { at: { event: "criteria", offset: 0.2 }, region: { x: 1100, y: 70, w: 820, h: 461 } },
        { at: { event: "confirm", offset: 0.2 }, region: null }, // the actions panel empties once the job is queued
      ],
      callout: {
        at: "criteria",
        label: "Approve spec",
        text: "Nothing is built until a person signs off the spec's acceptance criteria.",
      },
      board: ["criteria", { event: "queued", offset: 0.3 }],
    },
    {
      clip: "03-building",
      start: { event: "board-link", offset: 0.3 },
      zoom: [
        { at: "board-link", region: null },
        { at: { event: "moved", offset: -0.3 }, region: { x: 480, y: 40, w: 1000, h: 562 } },
      ],
      callout: {
        at: "moved",
        label: "Building",
        text: "The job takes a free slot and the builder agent writes the code and tests.",
      },
    },
    {
      clip: "04-workflow",
      start: { event: "open-pr", offset: 0.4 },
      url: PR_PAGE,
      zoom: [
        { at: "open-pr", region: null },
        { at: { event: "loops", offset: -0.4 }, region: { x: 440, y: 320, w: 940, h: 529 } },
      ],
      callout: {
        at: { event: "graph", offset: 0.6 },
        label: "Workflow",
        text: "Failed checks and design changes looped back to the builder before review passed.",
      },
      board: [{ event: "graph", offset: 1 }, { event: "loops", offset: 0.6 }],
    },
    {
      clip: "05-reviews",
      url: `${PR_PAGE}#docs`,
      zoom: [{ at: "docs", region: DOC }],
      callout: {
        at: "blocking",
        label: "Design review",
        text: "Reviewers use the running app and back every verdict with screenshots.",
      },
      board: ["blocking", "shots"],
    },
    {
      clip: "06-diff",
      url: `${PR_PAGE}#diff`,
      zoom: [
        { at: "diff", region: { x: 0, y: 60, w: 1460, h: 821 } },
        { at: "summary", region: DOC },
      ],
      callout: {
        at: "files",
        label: "Pull request",
        text: "The diff and the approver's decision. A person still merges every PR.",
      },
      board: ["files", { event: "decision", offset: 0.6 }],
    },
  ],
  // The workflow graph drawing in and the loop-backs.
  loop: {
    beat: 3,
    from: { event: "graph", offset: -0.2 },
    seconds: 6,
    region: null,
  },
  capture,
};

export default config;
