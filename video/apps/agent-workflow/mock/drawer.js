// The task panel on job.html (plain script, no build step); dashboard.html uses its helpers.
// A panel page provides #drawer, #docs-view, a header.top, and two functions: poll() (refetch
// job.json into `jobs`) and closeDrawer() (what a closed task does to the page).
let jobs = [], openId = null;

const REVIEWERS = ["security", "ux", "ui", "code"];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
// Agent-written markdown: render it, but never as raw HTML.
// A link or image may only point at http(s), a relative path or #anchor: a javascript: link here
// would run on this origin, which can approve and close jobs. Browsers ignore tabs, newlines and
// leading spaces in URLs, so strip them before looking for a scheme (a ":" before any / ? #).
const safeUrl = h => { const u = String(h ?? "").replace(/[\x00-\x20\x7f]/g, ""); return /^https?:/i.test(u) || !/^[^/?#]*:/.test(u); };
// marked@12 renderer methods take (href, title, text); returning false keeps marked's default output.
if (window.marked) marked.use({ renderer: {
  html: t => esc(typeof t === "string" ? t : t.text),
  link: (href, title, text) => safeUrl(href) ? false : text,  // text: the label, already rendered
  image: (href, title, text) => safeUrl(href) ? false : esc(text),
} });
const md = s => window.marked ? marked.parse(s) : `<pre>${esc(s)}</pre>`;

const v2 = j => j.version === 2;  // driven by factory/run.py; older jobs are legacy
const cost = j => (j.costs || []).reduce((s, c) => s + (Number(c.usd) || 0), 0);
// Red only for a problem: a job that needs a human, or a driver refusal/failure.
const noteIsError = j => j.stage === "needs-human" || /fail|ignored|again/i.test(j.note || "");

// The board badge: a job's stage in plain words, and its highlight (a human is waited on).
const MAX_CHECK_FIXES = 3;  // machine.MAX_CHECK_FIXES
const HIGHLIGHT = { "needs-human": "human", signoff: "signoff", questions: "signoff" };
// designRound/reviewRound count rounds sent back, so the latest round is one more. The badge and the
// card's meta line both use this.
const roundNo = n => (Number(n) || 0) + 1;
function stageBadge(j) {
  const round = n => n ? ` · round ${roundNo(n)}` : "";
  const fix = j.checkFixes ? ` · fix ${j.checkFixes}/${MAX_CHECK_FIXES}` : "";
  const text = {
    backlog: j.linear?.identifier || "Queue", questions: "Has questions",
    queued: "Queued", spec: "Writing spec", signoff: "Needs sign-off",
    build: "Building" + (j.buildFor === "checks" ? fix : j.buildFor === "rework" ? " · rework" : ""),
    checks: "Checks" + fix, design: "Design review" + round(j.designRound),
    review: (v2(j) ? "Code review" : "Review") + round(j.reviewRound), approve: "Approving",
    "pr-open": "PR open", ready: "Ready to merge", "needs-human": "Needs human",
  }[j.stage] || j.stage;
  return [text, HIGHLIGHT[j.stage] || ""];
}


// The panel's markup: the summary and actions in #drawer, the document chips and documents in #docs-view.
function mountDrawer() {
  const drawer = document.getElementById("drawer"), docs = document.getElementById("docs-view");
  drawer.innerHTML = `
  <header><div><div class="id" id="d-id"></div><div class="title" id="d-title"></div>
    <div id="d-summary"></div>
    <a class="meta" id="d-pr" target="_blank" rel="noopener" hidden>View PR ↗</a></div></header>
  <section id="run" hidden aria-live="polite"></section>
  <section id="actions" hidden aria-live="polite"></section>`;
  docs.insertAdjacentHTML("beforeend", `<nav id="tabs" role="tablist" aria-label="Documents"></nav><article id="doc"></article>`);
}

// The card's and summary's meta line: branch, rounds, risk and cost.
function metaLine(j) {
  const usd = cost(j);
  const rounds = v2(j)
    ? `${j.designRound ? ` · design round ${roundNo(j.designRound)}` : ""}${j.reviewRound ? ` · review round ${roundNo(j.reviewRound)}` : ""}`
    : j.round ? ` · round ${j.round}${j.maxRound ? "/" + j.maxRound : ""}` : "";
  return `${j.branch || ""}${rounds}${j.risk ? ` · ${j.risk} risk` : ""}${usd ? ` · $${usd.toFixed(2)}` : ""}`;
}

function filesFor(j) {
  if (!v2(j)) {
    const f = ["spec.md", "build.md", "rework.md"];
    for (let n = 1; n <= (j.round || 0); n++) REVIEWERS.forEach(r => f.push(`round-${n}/review-${r}.md`));
    return [...f, "decision.md"];
  }
  // run.py's folders; the round in progress is one past the recorded count (missing files 404).
  const f = ["ticket.md", "spec.md", "spec-answers.md", "spec-comments.md", "build.md", "rework.md"];
  for (let n = 1; n <= (j.designRound || 0) + 1; n++) ["ux", "ui"].forEach(r => f.push(`design-${n}/review-${r}.md`));
  ["ux", "ui"].forEach(r => f.push(`design-rerun/review-${r}.md`)); // manual reruns (scratch rerun_design.py)
  for (let n = 1; n <= (j.reviewRound || 0) + 1; n++) ["code", "security"].forEach(r => f.push(`round-${n}/review-${r}.md`));
  return [...f, "decision.md"];
}

// The latest checks/<n>.json the driver recorded in job.lastChecks.
function checksHtml(j, rep) {
  const dir = `jobs/${encodeURIComponent(j.id)}/checks/`;
  const row = c => {
    const [cls, word] = c.skipped ? ["skip", "skipped"] : c.ok ? ["ok", "PASS"] : ["bad", "FAIL"];
    const log = c.log ? ` · <a href="${dir}${encodeURIComponent(c.log.split("/").pop())}" target="_blank" rel="noopener">log</a>` : "";
    const fresh = (c.new || []).length ? `<div>New errors:<ul>${c.new.map(k =>
      `<li><code>${esc([].concat(k).join(" "))}</code></li>`).join("")}</ul></div>` : "";
    return `<li><span class="${cls}">${word}</span> <code>${esc(c.name)}</code>${c.reason ? ` — ${esc(c.reason)}` : ""}${log}${fresh}</li>`;
  };
  return `<h2>Checks run ${esc(j.lastChecks.n)}: <span class="${rep.ok ? "ok" : "bad"}">${rep.ok ? "green" : "red"}</span></h2>
    ${rep.developRed ? `<p class="bad">develop is red: ${esc(rep.developRed)}</p>` : ""}
    ${j.lastChecks.head ? `<p class="meta">At commit <code>${esc(String(j.lastChecks.head).slice(0, 10))}</code></p>` : ""}
    <ul class="checks">${(rep.results || []).map(row).join("")}</ul>`;
}

const historyHtml = h => `<h2>Human actions</h2><ul>${h.map(e =>
  `<li><code>${esc(e.action)}</code> in ${esc(e.stage_before)} · ${esc(e.at)}</li>`).join("")}</ul>`;

// A design review's screenshots: design-<n>/<reviewer>/<i>.png, listed by python's http.server.
async function shots(j, p) {
  const m = p.match(/^(design-(?:\d+|rerun))\/review-(ux|ui)\.md$/); if (!m) return "";
  const dir = `jobs/${encodeURIComponent(j.id)}/${m[1]}/${m[2]}/`;
  const r = await fetch(dir, { cache: "no-store" }).catch(() => null);
  const names = r?.ok ? [...(await r.text()).matchAll(/href="([^"/]+\.png)"/g)].map(x => x[1]) : [];
  names.sort((a, b) => parseInt(a) - parseInt(b));
  return names.length ? `<h2>Screenshots</h2><div class="shots">${names.map(n =>
    `<a href="${dir}${n}" target="_blank" rel="noopener"><img src="${dir}${n}" alt="${esc(m[2])} screenshot ${esc(decodeURIComponent(n))}" loading="lazy"></a>`).join("")}</div>` : "";
}

async function openJob(id, keepTab) {
  const j = jobs.find(x => x.id === id); if (!j) return;
  if (id !== openId) act = fresh();
  openId = id;
  document.getElementById("d-id").textContent = j.id;
  document.getElementById("d-title").textContent = j.title || j.id;
  const pr = document.getElementById("d-pr");
  pr.hidden = !/^https:\/\//.test(j.pr || "");
  if (!pr.hidden) pr.href = j.pr;
  const [badge, hl] = stageBadge(j);
  document.getElementById("d-summary").innerHTML = `
    <span class="badge ${hl || (j.stage === "pr-open" ? "pr" : "")}">${esc(j.stage === "closed" ? "Closed" : badge)}</span>
    <div class="meta">${esc(metaLine(j))}</div>
    ${j.note ? `<div class="note ${noteIsError(j) ? "" : "wait"}">${esc(j.note)}</div>` : ""}`;
  const results = await Promise.all(filesFor(j).map(async p => {
    const r = await fetch(`jobs/${encodeURIComponent(j.id)}/${p}`, { cache: "no-store" }).catch(() => null);
    return r?.ok ? [p, await r.text()] : null;
  }));
  const docs = results.filter(Boolean);
  if (v2(j) && j.history?.length) docs.unshift(["history", "", historyHtml(j.history)]);
  if (j.lastChecks?.n) {
    const r = await fetch(`jobs/${encodeURIComponent(j.id)}/checks/${encodeURIComponent(j.lastChecks.n)}.json`, { cache: "no-store" }).catch(() => null);
    const rep = r?.ok ? await r.json().catch(() => null) : null;
    if (rep) docs.unshift(["checks", "", checksHtml(j, rep)]);
  }
  const tabs = document.getElementById("tabs");
  const current = keepTab && tabs.querySelector('[aria-selected="true"]')?.dataset.p;
  tabs.innerHTML = docs.map(([p]) => `<button role="tab" data-p="${esc(p)}">${esc(p)}</button>`).join("");
  const show = async p => {
    const d = docs.find(x => x[0] === p), doc = document.getElementById("doc");
    tabs.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", b.dataset.p === p));
    doc.innerHTML = d ? d[2] ?? md(d[1]) : `<p class="meta">No files yet.</p>`;
    const shown = doc.dataset.shown = String(Math.random());  // a later render wins
    const extra = d ? await shots(j, p) : "";
    if (extra && doc.dataset.shown === shown) doc.insertAdjacentHTML("beforeend", extra);
  };
  tabs.onclick = e => e.target.dataset.p && show(e.target.dataset.p);
  show(docs.some(d => d[0] === current) ? current : docs.at(-1)?.[0]);
  refreshRun(j);
  refreshActions(j);
}

// "Test locally": runs the job's api + customer app via factory/server.py (absent with a plain
// static server, in which case the panel stays hidden).
const api = (id, action = "run", method = "GET") =>
  fetch(`api/jobs/${encodeURIComponent(id)}/${action}`, { method, headers: { "X-Factory": "1" }, cache: "no-store" })
    .then(async r => ({ ok: r.ok, body: await r.json().catch(() => ({})) }));
let runError = "", runBusy = false, runStarted = 0;

async function refreshRun(j) {
  const panel = document.getElementById("run");
  if (j.stage !== "needs-human") { panel.hidden = true; return; }
  const { ok, body: s } = await api(j.id).catch(() => ({ ok: false, body: {} }));
  if (!ok || !(s.eligible || s.adminEligible) || openId !== j.id) { panel.hidden = !runError || openId !== j.id; return; }
  const live = s.state === "running", busy = runBusy || s.state === "starting";
  const link = p => p.includes("<") ? `<code>${esc(p)}</code>` :
    `<a href="${esc(s.customerUrl + p)}" target="_blank" rel="noopener">${esc(p)}</a>`;
  const logs = `jobs/${encodeURIComponent(j.id)}/run/`;
  panel.innerHTML = `
    <div class="row">
      ${live || busy
        ? `<button class="secondary" data-act="stop">Stop apps</button>`
        : `${s.eligible ? `<button data-act="run">Run customer app</button>` : ""}
           ${s.adminEligible ? `<button data-act="run-admin"${s.eligible ? ` class="secondary"` : ""}>Run admin app</button>` : ""}`}
      <span>${live ? `Running at <a href="${esc(s.customerUrl + s.open)}" target="_blank" rel="noopener">${esc(s.customerUrl)}</a>${s.admin
          ? `; admin app tunneled to <a href="${esc(s.adminUrl)}" target="_blank" rel="noopener">${esc(s.adminUrl)}</a>.
            Open your dev app from Shopify admin to see it embedded.` : ""}`
        : busy ? `<span class="spin" aria-hidden="true"></span> Starting… <span id="run-elapsed" aria-hidden="true"></span>
            The first run creates and seeds this job's own database, which takes a few minutes.`
        : s.state === "crashed" ? `<span class="err">An app stopped. Check the logs.</span>`
        : `Starts this job's api and customer app from its worktree, with its own ports and seeded database.${s.adminEligible
          ? " Run admin app adds its shopify-admin app behind your ngrok domain (one job at a time)." : ""}`}</span>
    </div>
    ${runError ? `<div class="err">${esc(runError)}</div>` : ""}
    ${s.checks.length ? `<div>Pages to check:<ul>${s.checks.map(c =>
      `<li>${link(c.path)}${c.what ? ` — ${esc(c.what)}` : ""}</li>`).join("")}</ul></div>` : ""}
    ${s.state !== "stopped" ? `<div class="meta">Logs: <a href="${logs}customer.log" target="_blank">customer</a> ·
      <a href="${logs}api.log" target="_blank">api</a>${s.admin ? ` · <a href="${logs}admin.log" target="_blank">admin</a>` : ""}</div>` : ""}`;
  panel.hidden = false;
  panel.querySelectorAll("[data-act]").forEach(b => b.onclick = e =>
    e.target.dataset.act === "stop" ? stopApps(j) : runApps(j, e.target.dataset.act === "run-admin"));
}

async function runApps(j, admin = false) {
  // Open now, inside the click, so it isn't blocked. Not for the admin app: it only works embedded in Shopify admin.
  const win = admin ? null : window.open("about:blank", "_blank");
  runError = ""; runBusy = true; runStarted = Date.now(); refreshRun(j);
  const { ok, body } = await api(j.id, admin ? "run-admin" : "run", "POST");
  if (!ok) { runBusy = false; runError = body.error || "Couldn't start the apps."; win?.close(); return refreshRun(j); }
  for (let i = 0; i < 180; i++) {  // up to ~6 minutes (first run seeds a database)
    const { body: s } = await api(j.id);
    if (s.state === "running") { runBusy = false; if (win) win.location = s.customerUrl + s.open; return refreshRun(j); }
    if (s.state === "crashed" || s.state === "stopped") {
      runBusy = false; runError = s.state === "crashed" ? "An app exited while starting." : "The apps were stopped.";
      win?.close(); return refreshRun(j);
    }
    const el = document.getElementById("run-elapsed");  // not a re-render: #run is aria-live
    if (el) el.textContent = `${Math.round((Date.now() - runStarted) / 1000)}s`;
    await new Promise(r => setTimeout(r, 2000));
  }
  runBusy = false; runError = "Still not up after 6 minutes. Check the logs."; refreshRun(j);
}

async function stopApps(j) {
  runError = ""; const b = document.querySelector('#run [data-act="stop"]');
  if (b) { b.disabled = true; b.setAttribute("aria-busy", "true"); b.innerHTML = `<span class="spin" aria-hidden="true"></span>Stopping…`; }
  await api(j.id, "stop", "POST"); refreshRun(j);
}

// Human actions for idle jobs. Legacy jobs: factory/server.py does the work. v2 jobs: the server
// appends the click to the job's inbox and starts its driver (factory/run.py), which applies it.
const fresh = () => ({ id: "", busy: "", confirm: "", error: "", done: "", key: "", sha: "", specKey: "", spec: null });
let act = fresh();
const PANEL_STAGES = { legacy: ["needs-human", "pr-open"], v2: ["backlog", "questions", "signoff", "needs-human", "pr-open", "ready"] };
const CLOSE_STAGES = ["backlog", "questions", "signoff", "needs-human", "pr-open", "ready"];  // machine.ACTIONS["close"]

// The spec exactly as shown: its sha1 is the sign-off, so the driver refuses one for a spec that changed.
async function signoffSpec(j) {
  const r = await fetch(`jobs/${encodeURIComponent(j.id)}/spec.md`, { cache: "no-store" }).catch(() => null);
  if (!r?.ok) return { error: "Couldn't load spec.md." };
  const bytes = await r.arrayBuffer();
  if (!window.crypto?.subtle) return { error: "Sign-off needs the dashboard on 127.0.0.1, localhost or https." };
  const sha = [...new Uint8Array(await crypto.subtle.digest("SHA-1", bytes))]
    .map(b => b.toString(16).padStart(2, "0")).join("");
  const text = new TextDecoder().decode(bytes);
  const m = text.match(/^##[ \t]+acceptance criteria[ \t]*\r?\n([\s\S]*?)(?=^##[ \t]|(?![\s\S]))/im);
  // No criteria section: show the whole spec, so the sign-off is never of something unseen.
  return m?.[1].trim() ? { sha, criteria: m[1].trim() } : { sha, criteria: "", whole: text.trim() };
}

async function refreshActions(j) {
  const panel = document.getElementById("actions");
  const isV2 = v2(j), signoff = isV2 && j.stage === "signoff";
  if (!PANEL_STAGES[isV2 ? "v2" : "legacy"].includes(j.stage)) { panel.hidden = true; act.key = ""; return; }
  // Refetch the spec only when the job changed (the driver rewrites job.json whenever spec.md changes).
  const specKey = signoff ? JSON.stringify([j.id, j.stage, j.updated]) : "";
  if (specKey !== act.specKey) {
    const fetched = signoff ? await signoffSpec(j) : null;
    Object.assign(act, { specKey: fetched?.error ? "" : specKey, spec: fetched });  // retry a failed load
  }
  const spec = act.spec;
  // Only re-render on a real change, so polling never wipes a comment being typed.
  const key = JSON.stringify([j.id, j.stage, j.rework, j.note, spec, act.busy, act.confirm, act.error, act.done]);
  if (key === act.key) return;
  if (!(await api(j.id).catch(() => ({ ok: false }))).ok || openId !== j.id) { panel.hidden = true; return; }
  act.key = key; act.sha = spec?.sha || "";
  const busy = a => act.busy === a ? `disabled aria-busy="true"` : "";
  const spin = `<span class="spin" aria-hidden="true"></span>`;
  const working = { "write-spec": "Starting…", "approve-spec": "Signing off…", approve: isV2 ? "Sending…" : "Pushing and opening PR…",
                    ready: "Sending…", close: "Closing…" };
  const confirmRow = (a, label, cls) => act.confirm === a
    ? `<button class="${cls}" data-act="${a}" ${busy(a)}>${act.busy === a ? `${spin}${working[a]}` : `Yes, ${label.toLowerCase()}`}</button>
       <button class="secondary" data-act="cancel">Cancel</button>`
    : `<button class="${cls} secondary" data-act="ask-${a}">${label}</button>`;
  const draft = act.id === j.id ? panel.querySelector("textarea")?.value || "" : "";
  act.id = j.id;
  const commentAbout = signoff ? "Sends your note to the spec writer; you'll sign off the revised spec."
    : `Adds your note to <code>rework.md</code> and sends the job back to the builder for another round${j.stage === "pr-open" ? "; the new commits update the open PR" : ""}.`
      + (isV2 ? "" : " Needs a <code>/factory</code> session running.");
  const comment = `<div class="act">
      <label for="comment-text"><b>Comment</b></label>
      <textarea id="comment-text" placeholder="What should the ${signoff ? "spec writer" : "builder"} change?">${esc(draft)}</textarea>
      <div class="row"><button data-act="comment" ${busy("comment")}>${act.busy === "comment" ? `${spin}Sending…` : `Send to ${signoff ? "spec writer" : "builder"}`}</button></div>
      <p>${j.rework === "requested" ? `<span class="pulse" aria-hidden="true"></span> A comment is waiting for the <code>/factory</code> session to pick it up.` : commentAbout}</p>
    </div>`;
  const closeRow = `<div class="act"><div class="row">${confirmRow("close", "Close task", "danger")}</div>
      <p>Closing the task will drop the task's databases (<code>app_dev_factory_${esc(j.id.slice(0, 3))}</code>,
        <code>app_test_factory_${esc(j.id.slice(0, 3))}</code>) and destroy the task's worktree. The branch and any PR are kept.</p></div>`;
  panel.innerHTML = j.stage === "backlog" ? `<div class="act">
      ${j.linear?.url && safeUrl(j.linear.url) ? `<p><a href="${esc(j.linear.url)}" target="_blank" rel="noopener">${esc(j.linear.identifier)} in Linear ↗</a></p>` : ""}
      <div class="row"><button data-act="write-spec" ${busy("write-spec")}>${act.busy === "write-spec" ? `${spin}${working["write-spec"]}` : "Write spec"}</button></div>
      <p>Moves the ticket to Spec. The spec writer reads it and either writes the spec for your sign-off or asks you questions first.</p></div>
    ${closeRow}
    ${act.error ? `<div class="err">${esc(act.error)}</div>` : ""}` : `
    ${signoff ? `<div class="act"><b>${spec.whole ? "spec.md (it has no Acceptance criteria section)" : "Acceptance criteria"}</b>
      ${spec.error ? `<div class="err">${esc(spec.error)}</div>`
        : spec.criteria || spec.whole ? `<div class="criteria">${md(spec.criteria || spec.whole)}</div>`
        : `<div class="err">spec.md is empty.</div>`}
      ${spec.sha && (spec.criteria || spec.whole) ? `<div class="row">${confirmRow("approve-spec", "Approve spec", "")}</div>` : ""}
      <p>Signs off these acceptance criteria. Nothing is built until you do.</p></div>` : ""}
    ${j.stage === "needs-human" ? `<div class="act"><div class="row">${confirmRow("approve", "Approve and open PR", "")}</div>
      <p>Pushes <code>${esc(j.branch)}</code> and opens a PR into <code>develop</code>. A human still merges it on GitHub.</p></div>` : ""}
    ${isV2 && j.stage === "pr-open" ? `<div class="act"><div class="row">${confirmRow("ready", "Ready to merge", "")}</div>
      <p>Deletes this PR's preview seed file in one last commit. The preview keeps its data. CI's preview-seeds check passes once it's gone.</p></div>` : ""}
    ${["ready", "questions"].includes(j.stage) ? "" : comment}
    ${CLOSE_STAGES.includes(j.stage) ? closeRow : ""}
    ${act.error ? `<div class="err">${esc(act.error)}</div>` : ""}
    ${act.done ? `<div>${esc(act.done)}</div>` : ""}`;
  panel.hidden = false;
  panel.onclick = e => {
    const a = e.target.dataset?.act; if (!a) return;
    if (a === "cancel") act.confirm = "";
    else if (a.startsWith("ask-")) act.confirm = a.slice(4);
    else return runAction(j, a);
    act.error = act.done = ""; refreshActions(j);
  };
}

async function runAction(j, action) {
  const text = action === "approve-spec" ? act.sha : document.getElementById("comment-text")?.value || "";
  Object.assign(act, { busy: action, error: "", done: "" }); refreshActions(j);
  const { ok, body } = await fetch(`api/jobs/${encodeURIComponent(j.id)}/${action}`, {
    method: "POST", headers: { "X-Factory": "1", "Content-Type": "application/json" },
    body: JSON.stringify({ text }), cache: "no-store" })
    .then(async r => ({ ok: r.ok, body: await r.json().catch(() => ({})) }))
    .catch(() => ({ ok: false, body: { error: "factory server unreachable" } }));
  const done = body.queued ? "Sent. The driver applies it; if it can't, its note shows on the card."
    : { approve: "PR opened.", comment: "Comment sent.", close: "Task closed." }[action];
  Object.assign(act, { busy: "", confirm: "", error: ok ? "" : body.error || `Couldn't ${action}.`, done: ok ? done : "" });
  if (ok && action === "comment") document.getElementById("comment-text").value = "";
  if (ok && action === "close") { act = fresh(); closeDrawer(); }
  await poll(); refreshActions(jobs.find(x => x.id === j.id) || j);
}
