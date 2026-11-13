// The job's flow graph on job.html's Workflow tab: build() draws the nodes once, draw(j, first) marks
// the job's state on them. Needs drawer.js (esc, stageBadge) and, for motion, Motion.dev.

// Flow order (machine.STAGES minus needs-human and closed): [stage, label, kind, caption].
const NODES = [["spec", "Spec", "agent", "agent · spec-writer"], ["signoff", "Sign-off", "human", "human · signs off the spec"],
  ["queued", "Queued", "wait", "driver · waiting for a slot"], ["build", "Build", "agent", "agent · builder"], ["checks", "Checks", "code", "code · checks.py"],
  ["design", "Design", "agent", "agents · review-ux + ui"], ["review", "Code & security", "agent", "agents · review-code + security"],
  ["approve", "Approve", "agent", "agent · approver"], ["pr-open", "PR open", "wait", "GitHub · CI and preview"],
  ["ready", "Ready to merge", "human", "human · merges on GitHub"]];
const NH = ["needs-human", "Needs human", "human", "human · decides the next step"];
const VERDICTS = { design: ["ux", "ui"], review: ["code", "security"] };
// Loop-backs: [from, to, label, job.json count, how far the arc bulges, where it lands on the target].
const LOOPS = [["signoff", "spec", "comment", "", 44, 0], ["checks", "build", "failed", "checkFixes", 44, -15],
  ["design", "build", "changes", "designRound", 80, -5], ["review", "build", "changes", "reviewRound", 116, 5],
  ["pr-open", "build", "rework", "", 152, 15]];
const ESCALATE = ["spec", "build", "checks", "design", "review", "approve"];

// Geometry (viewBox units): one column of nodes, Needs human beside it, loop arcs on the right.
const NW = 220, NHT = 52, PITCH = 70, TOP = 8, X = 320, R = X + NW, NHX = 24;
const pos = {};
NODES.forEach(([s], i) => pos[s] = [X, TOP + i * PITCH]);
pos[NH[0]] = [NHX, TOP + 5 * PITCH];
const mid = s => pos[s][1] + NHT / 2;

function icon(kind, x, y) {
  if (kind === "human") return `<circle class="icon" cx="${x}" cy="${y - 4}" r="3.2"/><path class="icon" d="M${x - 6} ${y + 7}a6 6 0 0 1 12 0"/>`;
  if (kind === "code") return `<text class="icon" x="${x}" y="${y + 3}" text-anchor="middle">&lt;/&gt;</text>`;
  if (kind === "agent") return `<path class="icon solid" d="M${x} ${y - 6}l1.7 4.3 4.3 1.7-4.3 1.7-1.7 4.3-1.7-4.3-4.3-1.7 4.3-1.7z"/>`;
  return `<circle class="icon" cx="${x}" cy="${y}" r="5.5"/><path class="icon" d="M${x} ${y - 3}v3h2.5"/>`;
}

function nodeSvg([s, label, kind, cap], nh) {
  const [x, y] = pos[s], chips = VERDICTS[s], ty = chips ? y + 17 : y + 23;
  return `<g class="node ${nh ? "nh" : ""}" id="n-${s}">
    <rect class="box" x="${x}" y="${y}" width="${NW}" height="${NHT}" rx="${kind === "human" ? NHT / 2 : kind === "code" ? 4 : 10}"/>
    ${icon(kind, x + 20, ty - 4)}
    <text class="label" x="${x + 36}" y="${ty}">${esc(label)}</text>
    <text class="cap" x="${x + 36}" y="${ty + 14}">${esc(cap)}</text>
    <text class="state" x="${x + NW - 14}" y="${ty}" text-anchor="end"></text>
    ${chips ? `<g class="verdicts"></g>` : ""}</g>`;
}

// One marker per arrow colour: a marker doesn't take its path's stroke.
const arrow = ["", "on", "nh"].map(k => `<marker id="arrow${k && "-" + k}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
  <path class="arrow ${k}" d="M0 0L8 4L0 8z"/></marker>`).join("");

// An escalation arc into Needs human, ending `gap` short of its box.
const fanPath = (s, gap) => `M${X} ${mid(s)}C${X - 36} ${mid(s)} ${NHX + NW + 36} ${mid(NH[0])} ${NHX + NW + gap} ${mid(NH[0])}`;

function build() {
  const fwd = NODES.slice(1).map(([s], i) => {
    const a = NODES[i][0];
    return `<path class="edge fwd" id="e-${a}" pathLength="1" marker-end="url(#arrow)"
      d="M${X + NW / 2} ${pos[a][1] + NHT + 2}V${pos[s][1] - 3}"/>`;
  }).join("");
  const fan = ESCALATE.map(s => `<path class="edge fan" id="f-${s}" marker-end="url(#arrow)" d="${fanPath(s, 2)}"/>`).join("");
  const loops = LOOPS.map(([a, b, label, , d, off]) => {
    const ys = mid(a), yt = mid(b) + off;
    return `<path class="edge loop" id="l-${a}" marker-end="url(#arrow)" d="M${R} ${ys}C${R + d} ${ys} ${R + d} ${yt} ${R + 2} ${yt}"/>
      <text class="elabel halo" x="${R + 6}" y="${ys + 14}">${label}</text><g class="count" id="c-${a}"></g>`;
  }).join("");
  const svg = document.getElementById("flow");
  svg.innerHTML = `<defs>${arrow}</defs><g class="edges">${fan}${fwd}${loops}</g>
    <text class="elabel halo" x="${NHX + NW / 2}" y="${pos[NH[0]][1] - 10}" text-anchor="middle">escalate from any agent or check</text>
    ${NODES.map(n => nodeSvg(n)).join("")}${nodeSvg(NH, true)}
    <text class="note halo" id="nh-note" x="${NHX + 4}" y="${pos[NH[0]][1] + NHT + 18}"><title></title><tspan></tspan></text>
    <g id="ring" class="off"><rect x="-5" y="-5" width="${NW + 10}" height="${NHT + 10}" rx="14"/></g>`;
}

const STATE_GLYPH = { done: "✓", current: "●", pending: "○", left: "↗" };
const GLYPH = { PASS: "✓ ", CHANGES: "! " };
const short = (s, n) => s.length > n ? s.slice(0, n - 1) + "…" : s;
const verdictChips = (j, s) => {
  let x = pos[s][0] + 36;
  return VERDICTS[s].map(r => {
    const v = j.reviews?.[r] || "pending", text = (GLYPH[v] || "") + r, w = text.length * 5.6 + 12;
    const chip = `<g class="vchip ${esc(v)}"><title>${r}: ${esc(v)}</title><rect x="${x}" y="${pos[s][1] + 35}" width="${w}" height="13" rx="6.5"/>
      <text x="${x + w / 2}" y="${pos[s][1] + 44.5}" text-anchor="middle">${esc(text)}</text></g>`;
    x += w + 4;
    return chip;
  }).join("");
};

// Motion.dev when it loaded and the viewer allows motion; otherwise every change is instant.
const still = matchMedia("(prefers-reduced-motion: reduce)");
const EASE = [0.22, 1, 0.36, 1];
const stagger = (t, o) => window.Motion?.stagger ? Motion.stagger(t, o) : 0;
// A hidden tab throttles frames, which would leave an entrance half-played: show it still.
const moving = () => !!window.Motion?.animate && !still.matches && !document.hidden && !document.getElementById("flow-view")?.hidden;
function motion(el, keyframes, options) {  // true when the animation started
  if (!moving() || !el || el.length === 0) return false;
  try { Motion.animate(el, keyframes, options); return true; } catch { return false; /* the static state stays */ }
}

let lastState = {}, ringAt = null, pulsing = false;

// The ring's pulse, once it really starts: a window drawn hidden or under reduced motion starts it later.
function pulse() {
  const ring = document.getElementById("ring");
  if (pulsing || !ring || ring.classList.contains("off")) return;
  pulsing = motion(ring.querySelector("rect"), { opacity: [1, 0.6, 1], scale: [1, 1.04, 1] },
                   { duration: 1.6, repeat: Infinity, ease: "easeInOut" });
}
document.addEventListener("visibilitychange", pulse);
still.addEventListener?.("change", pulse);

function draw(j, first) {
  // Escalated (needs-human, or closed from it): done up to the stage it left from, pending after it.
  const from = ["needs-human", "closed"].includes(j.stage) ? NODES.findIndex(([s]) => s === j.escalatedFrom) : -1;
  const at = from >= 0 ? from : NODES.findIndex(([s]) => s === j.stage);
  const state = (s, i) => {
    if (s === NH[0]) return j.stage === NH[0] ? "current" : j.stage === "closed" && from >= 0 ? "done" : "pending";
    if (from >= 0) return i < from ? "done" : i === from ? "left" : "pending";
    return j.stage === "closed" ? "done" : s === j.stage ? "current" : at >= 0 && i < at ? "done" : "pending";
  };
  const states = Object.fromEntries([...NODES, NH].map(([s], i) => [s, state(s, i)]));
  const settled = [];
  for (const [s, st] of Object.entries(states)) {
    const g = document.getElementById(`n-${s}`);
    g.classList.remove("done", "current", "pending", "left"); g.classList.add(st);
    g.querySelector(".state").textContent = STATE_GLYPH[st];
    if (VERDICTS[s]) g.querySelector(".verdicts").innerHTML = verdictChips(j, s);
    if (!first && st === "done" && lastState[s] !== "done") settled.push(g);
  }
  // The route taken, from job.trail (jobstate.save): each move between stages. A job with no moves
  // recorded yet (saved before the trail existed) falls back to the stage states and the loop counts.
  const trail = j.trail || [], idx = s => NODES.findIndex(([n]) => n === s);
  const moves = trail.slice(1).map((b, i) => [trail[i], b]);
  const took = (a, b) => moves.filter(([x, y]) => x === a && y === b).length;
  const setEdge = (el, on, marker) => { el.classList.toggle("taken", on); el.setAttribute("marker-end", `url(#arrow${on ? marker : ""})`); };
  NODES.slice(0, -1).forEach(([s], i) => {
    // a forward move skips stages it doesn't need (no design review: checks -> review), passing the edges between
    const on = moves.length ? moves.some(([x, y]) => idx(x) >= 0 && idx(x) <= i && i < idx(y)) : states[s] === "done";
    const e = document.getElementById(`e-${s}`);
    setEdge(e, on, "-on");
    e.classList.toggle("pending", !on && states[s] !== "done");
  });
  for (const [a, b, , key] of LOOPS) {
    const n = moves.length ? took(a, b) : Number(j[key]) || 0, c = document.getElementById(`c-${a}`), label = c.previousElementSibling;
    setEdge(document.getElementById(`l-${a}`), n > 0, "-on");
    const x = R + 6 + label.textContent.length * 5.6 + 4, y = mid(a) + 4;
    c.innerHTML = n > 0 ? `<title>${n} time${n > 1 ? "s" : ""}</title><rect x="${x}" y="${y}" width="16" height="13" rx="6.5"/>
      <text x="${x + 8}" y="${y + 9.5}" text-anchor="middle">${n}</text>` : "";
  }
  const human = j.stage === NH[0];
  const fanOn = s => moves.length ? took(s, NH[0]) > 0 : human && s === j.escalatedFrom;
  const anyOn = ESCALATE.some(fanOn), tip = human ? 9 : 2;  // clear of the ring around a current Needs human
  ESCALATE.forEach(s => {
    const f = document.getElementById(`f-${s}`), on = fanOn(s);
    setEdge(f, on, "-nh");
    // Beside a taken arc, the others drop their own tip and end at the back of its arrowhead (7 × its stroke width).
    if (anyOn && !on) f.setAttribute("marker-end", "none");
    f.setAttribute("d", fanPath(s, anyOn && !on ? tip + 12 : tip));
    if (on) f.parentNode.appendChild(f);  // drawn last, on top of the faint arcs
  });
  const note = document.getElementById("nh-note");
  note.querySelector("title").textContent = human ? j.note || "" : "";
  note.querySelector("tspan").textContent = human ? short(j.note || "", 40) : "";

  // The accent ring sits on the current node and springs to the next one.
  const ring = document.getElementById("ring"), target = pos[j.stage] && j.stage !== "closed" ? pos[j.stage] : null;
  ring.classList.toggle("off", !target);
  ring.classList.toggle("nh", human);
  ring.querySelector("rect").setAttribute("rx", NODES.concat([NH]).find(([s]) => s === j.stage)?.[2] === "human" ? NHT / 2 + 5 : 14);
  if (target) {
    const [x, y] = target;
    if (first || !ringAt || !moving()) ring.style.transform = `translateX(${x}px) translateY(${y}px)`;
    if (!first && ringAt && (ringAt[0] !== x || ringAt[1] !== y))
      motion(ring, { x: [ringAt[0], x], y: [ringAt[1], y] }, { type: "spring", stiffness: 300, damping: 20 });
    ringAt = target;
  }
  pulse();
  if (first) {
    motion(document.querySelectorAll("#flow .node"), { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.04), duration: 0.35, ease: EASE });
    motion(document.querySelectorAll("#flow .fwd"), { strokeDashoffset: [1, 0], opacity: [0, 1] }, { delay: stagger(0.04, { startDelay: 0.1 }), duration: 0.35, ease: EASE });
    motion(document.querySelectorAll("#flow .loop, #flow .fan, #flow .elabel"), { opacity: [0, 1] }, { delay: 0.45, duration: 0.5 });
  }
  motion(settled, { opacity: [0.55, 1], scale: [0.98, 1] }, { duration: 0.45, ease: EASE });
  lastState = states;

  // The same state in words, for screen readers.
  const [badge] = stageBadge(j);
  const words = String(badge).replace(" · ", ", ").replace(/(\d+)\/(\d+)/, "$1 of $2");
  document.getElementById("flow").setAttribute("aria-label",
    `Stage: ${j.stage === "closed" ? "closed" : words}${human && j.note ? `. ${j.note}` : ""}`);
  const extra = s => {
    const loop = LOOPS.find(l => l[0] === s), n = !loop ? 0 : moves.length ? took(s, loop[1]) : Number(j[loop[3]]) || 0;
    const v = VERDICTS[s] ? `; ${VERDICTS[s].map(r => `${r} ${j.reviews?.[r] || "pending"}`).join(", ")}` : "";
    return (n ? `; sent back to ${loop[1]} ${n} time${n > 1 ? "s" : ""} (${loop[2]})` : "") + v;
  };
  document.getElementById("flow-list").innerHTML = [...NODES, NH].map(([s, label]) =>
    `<li>${esc(label)}: ${states[s] === "current" ? "current stage" : states[s] === "left" ? "escalated to a human from here" : states[s]}${esc(extra(s))}</li>`).join("");
}
