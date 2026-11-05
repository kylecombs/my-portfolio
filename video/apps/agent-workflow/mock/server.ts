// Serves the factory dashboard copy in this folder with the made-up jobs in data.ts, standing in for
// factory/server.py: python http.server-style folder listings (the pages parse them) and the /api routes.
// "Approve spec" moves the job on to Queued, then Build, so the board reacts. Run alone: npx tsx server.ts
import { createServer, type Server } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { JOBS } from "./data";

const DIR = fileURLToPath(new URL("./", import.meta.url));
const TYPES: Record<string, string> = { html: "text/html", js: "text/javascript", css: "text/css", png: "image/png", json: "application/json" };
const listing = (names: string[]) => names.map((n) => `<li><a href="${encodeURIComponent(n.replace(/\/$/, ""))}${n.endsWith("/") ? "/" : ""}">${n}</a></li>`).join("");

export function startMockFactory(port = 8123): Promise<Server> {
  const jobs = structuredClone(JOBS);
  const find = (id: string) => jobs.find((j) => j.job.id === id);
  const advance = (m: (typeof jobs)[number], stage: string) => {
    m.job.stage = stage;
    (m.job.trail as string[]).push(stage);
    m.ago = 0;
  };

  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url!, "http://x").pathname);
    const send = (body: string | Buffer, type = "text/html", code = 200) => {
      res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
      res.end(body);
    };
    const json = (v: unknown, code = 200) => send(JSON.stringify(v), "application/json", code);

    if (req.method === "POST") {
      const m = path.match(/^\/api\/jobs\/([^/]+)\/([a-z-]+)$/), j = m && find(m[1]);
      if (!j) return json({ error: "no such job" }, 404);
      if (m[2] === "approve-spec" && j.job.stage === "signoff") {
        (j.job.history as object[]).push({ action: "approve-spec", at: new Date().toISOString(), stage_before: "signoff" });
        advance(j, "queued");
        setTimeout(() => advance(j, "build"), 2500);
      }
      return json({ queued: true });
    }
    if (path === "/api/activity") return json({});
    let m = path.match(/^\/api\/jobs\/([^/]+)\/(run|diff)$/);
    if (m) {
      const j = find(m[1]);
      if (!j) return json({ error: "no such job" }, 404);
      return m[2] === "diff"
        ? json({ diff: j.diff ?? "", omitted: [] })
        : json({ eligible: false, adminEligible: false, state: "stopped", checks: [] });
    }
    if (path === "/jobs/") return send(listing(jobs.map((j) => `${j.job.id}/`)));
    m = path.match(/^\/jobs\/([^/]+)\/(.*)$/);
    if (m) {
      const j = find(m[1]), file = m[2];
      if (!j) return send("not found", "text/plain", 404);
      if (file === "job.json") return json({ ...j.job, updated: new Date(Date.now() - j.ago * 60000).toISOString() });
      if (j.docs?.[file] !== undefined) return send(j.docs[file], file.endsWith(".json") ? "application/json" : "text/plain");
      const shots = j.shots?.[file.replace(/\/$/, "")];
      if (shots && file.endsWith("/")) return send(listing(shots));
      const shot = file.match(/^(.*)\/([^/]+\.png)$/);
      if (shot && j.shots?.[shot[1]]?.includes(shot[2])) return send(readFileSync(`${DIR}shots/${shot[2]}`), "image/png");
      return send("not found", "text/plain", 404);
    }
    const name = path === "/" ? "dashboard.html" : path.slice(1);
    if (!/^[\w.-]+$/.test(name)) return send("not found", "text/plain", 404); // flat folder only
    try {
      send(readFileSync(DIR + name), TYPES[name.split(".").pop()!] ?? "application/octet-stream");
    } catch {
      send("not found", "text/plain", 404);
    }
  });
  return new Promise((ok) => server.listen(port, "127.0.0.1", () => ok(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await startMockFactory();
  console.log("mock factory at http://127.0.0.1:8123/dashboard.html");
}
