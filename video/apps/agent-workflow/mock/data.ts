// Made-up jobs for the mock factory dashboard. A fictional storefront app (packages api/, web/, admin/);
// every ticket, branch, PR and review here is invented.

export interface MockJob {
  job: Record<string, unknown>;
  /** Minutes since the job last changed; the server turns it into `updated`. */
  ago: number;
  /** Files under jobs/<id>/, by path. */
  docs?: Record<string, string>;
  /** Screenshot folders (e.g. "design-2/ux") -> PNG names in shots/. */
  shots?: Record<string, string[]>;
  diff?: string;
}

const PENDING = { ux: "pending", ui: "pending", code: "pending", security: "pending" };
const cost = (stage: string, agent: string, usd: number, seconds: number) => ({ stage, agent, round: 0, usd, seconds });
const job = (id: string, title: string, stage: string, extra: Record<string, unknown> = {}) => {
  const ticket = id.match(/^\d{3}-(eng-\d+)/)![1].toUpperCase();
  return {
    version: 2,
    id,
    feature: `${ticket}: ${title}`,
    title,
    branch: id.slice(4),
    stage,
    risk: "",
    reviews: PENDING,
    checkFixes: 0,
    designRound: 0,
    reviewRound: 0,
    findings: {},
    costs: [],
    note: "",
    pr: "",
    linear: { identifier: ticket, url: `https://linear.app/example/issue/${ticket}` },
    trail: ["backlog"],
    history: [],
    ...extra,
  };
};
const checks = (results: { name: string; ok: boolean; skipped?: boolean; reason?: string }[]) =>
  JSON.stringify({ ok: results.every((r) => r.ok), developRed: "", results: results.map((r) => ({ new: [], ...r })) });
const GREEN = [
  { name: "api/rubocop", ok: true },
  { name: "api/rspec", ok: true },
  { name: "web/typecheck", ok: true },
  { name: "web/lint", ok: true },
  { name: "web/vitest", ok: true },
  { name: "seeds", ok: true },
];

// ---------- The showcase: a PR the factory opened after two loop-backs ----------

const SAVED_SPEC = `# Let shoppers save their cart for later (ENG-405)

## Goal
Signed-in shoppers can move items out of the cart into a **Saved for later** list, and back,
so the cart only holds what they mean to buy today.

## Triage
Risk: medium
User-facing: yes
UI: yes

## Files
- api/app/models/saved_item.rb
- api/app/graphql/mutations/save_for_later.rb
- web/app/components/cart/CartLine.tsx
- web/app/components/cart/SavedForLater.tsx

## Acceptance criteria
- [ ] AC1: Each cart line has a **Save for later** link. It moves the line to a Saved for later list under the cart and updates the subtotal.
- [ ] AC2: Each saved item has **Move to cart**, which puts it back with its quantity.
- [ ] AC3: Saved items stay with the account across devices and sessions.
- [ ] AC4: Guests don't see the link; the cart works as it does today.
- [ ] AC5: Typecheck, lint and the related specs pass.

## Out of scope
- Price-drop alerts on saved items.
- Sharing a saved list.
`;

const ADDRESS_DIFF = `diff --git a/web/app/components/checkout/AddressForm.tsx b/web/app/components/checkout/AddressForm.tsx
index 4c1e9a2..b7d03f1 100644
--- a/web/app/components/checkout/AddressForm.tsx
+++ b/web/app/components/checkout/AddressForm.tsx
@@ -1,12 +1,15 @@
 import { useState } from "react";
 import { Field } from "~/components/ui/Field";
+import { validateAddress, type AddressErrors } from "~/helpers/validateAddress";

 export function AddressForm({ onSubmit }: { onSubmit: (a: Address) => void }) {
   const [address, setAddress] = useState<Address>(EMPTY);
-  const [error, setError] = useState("");
+  const [errors, setErrors] = useState<AddressErrors>({});
+  const [touched, setTouched] = useState<Record<string, boolean>>({});

-  const submit = () => {
-    if (!address.line1 || !address.zip) return setError("Please fill in all fields.");
-    onSubmit(address);
+  const blur = (name: keyof Address) => {
+    setTouched((t) => ({ ...t, [name]: true }));
+    setErrors(validateAddress(address));
   };
@@ -24,18 +27,28 @@ export function AddressForm({ onSubmit }: { onSubmit: (a: Address) => void }) {
   return (
-    <form onSubmit={submit}>
-      {error && <p className="error">{error}</p>}
-      <Field label="Address" value={address.line1} onChange={set("line1")} />
-      <Field label="ZIP code" value={address.zip} onChange={set("zip")} />
+    <form onSubmit={submit} noValidate>
+      <Field
+        label="Address"
+        value={address.line1}
+        onChange={set("line1")}
+        onBlur={() => blur("line1")}
+        error={touched.line1 ? errors.line1 : undefined}
+      />
+      <Field
+        label="ZIP code"
+        inputMode="numeric"
+        value={address.zip}
+        onChange={set("zip")}
+        onBlur={() => blur("zip")}
+        error={touched.zip ? errors.zip : undefined}
+      />
       <button type="submit">Continue to shipping</button>
     </form>
   );
diff --git a/web/app/helpers/validateAddress.ts b/web/app/helpers/validateAddress.ts
new file mode 100644
index 0000000..9e2c4d7
--- /dev/null
+++ b/web/app/helpers/validateAddress.ts
@@ -0,0 +1,16 @@
+export type AddressErrors = Partial<Record<"line1" | "city" | "zip", string>>;
+
+const ZIP = /^\\d{5}(-\\d{4})?$/;
+
+export function validateAddress(a: Address): AddressErrors {
+  const errors: AddressErrors = {};
+  if (!a.line1.trim()) errors.line1 = "Enter a street address.";
+  if (!a.city.trim()) errors.city = "Enter a city.";
+  if (!a.zip.trim()) errors.zip = "Enter a ZIP code.";
+  else if (!ZIP.test(a.zip.trim())) errors.zip = "Enter a 5-digit ZIP code, like 10001.";
+  return errors;
+}
diff --git a/web/app/helpers/validateAddress.test.ts b/web/app/helpers/validateAddress.test.ts
new file mode 100644
index 0000000..3f81b2a
--- /dev/null
+++ b/web/app/helpers/validateAddress.test.ts
@@ -0,0 +1,14 @@
+import { describe, expect, it } from "vitest";
+import { validateAddress } from "./validateAddress";
+
+const ok = { line1: "12 Main St", city: "Springfield", zip: "10001" };
+
+describe("validateAddress", () => {
+  it("passes a full address", () => expect(validateAddress(ok)).toEqual({}));
+  it("flags a short ZIP", () =>
+    expect(validateAddress({ ...ok, zip: "100" }).zip).toBe("Enter a 5-digit ZIP code, like 10001."));
+  it("flags a missing street", () =>
+    expect(validateAddress({ ...ok, line1: " " }).line1).toBe("Enter a street address."));
+});
`;

export const JOBS: MockJob[] = [
  // Queue: tickets pulled in from the tracker, not started.
  { job: job("034-eng-421-export-orders-as-csv", "Export orders as CSV from the admin", "backlog"), ago: 50 },
  { job: job("035-eng-424-dark-mode-account-settings", "Dark mode toggle in account settings", "backlog"), ago: 50 },
  { job: job("036-eng-427-low-stock-email-alerts", "Email a store manager when stock runs low", "backlog"), ago: 50 },

  // Spec
  {
    job: job("031-eng-405-save-cart-for-later", "Let shoppers save their cart for later", "signoff", {
      risk: "medium",
      costs: [cost("spec", "spec-writer", 0.61, 102)],
      trail: ["backlog", "spec", "signoff"],
      history: [{ action: "write-spec", at: "2026-11-03T14:02:11Z", stage_before: "backlog" }],
    }),
    ago: 6,
    docs: {
      "ticket.md": "# ENG-405 Save cart for later\n\nShoppers keep deleting items they still want, just to see a smaller total. Let them park items in a list under the cart instead.\n",
      "spec.md": SAVED_SPEC,
    },
  },
  {
    job: job("033-eng-418-rate-limit-password-reset", "Rate-limit the password reset endpoint", "spec", {
      trail: ["backlog", "spec"],
    }),
    ago: 1,
  },

  // In progress
  {
    job: job("028-eng-398-delivery-estimates", "Show estimated delivery dates on product pages", "build", {
      risk: "medium",
      checkFixes: 1,
      buildFor: "checks",
      costs: [cost("spec", "spec-writer", 0.55, 90), cost("build", "builder", 2.41, 540)],
      trail: ["backlog", "spec", "signoff", "queued", "build", "checks", "build"],
    }),
    ago: 3,
  },
  {
    job: job("029-eng-401-orders-empty-state", "Empty state for the account orders page", "design", {
      risk: "low",
      reviews: { ux: "PASS", ui: "pending", code: "pending", security: "skipped" },
      costs: [cost("spec", "spec-writer", 0.38, 70), cost("build", "builder", 1.62, 400)],
      trail: ["backlog", "spec", "signoff", "queued", "build", "checks", "design"],
    }),
    ago: 2,
  },
  {
    job: job("030-eng-403-admin-users-pagination", "Paginate the admin users list", "review", {
      risk: "low",
      reviews: { ux: "skipped", ui: "skipped", code: "PASS", security: "pending" },
      costs: [cost("spec", "spec-writer", 0.41, 66), cost("build", "builder", 1.88, 460)],
      trail: ["backlog", "spec", "signoff", "queued", "build", "checks", "review"],
    }),
    ago: 4,
  },

  // Review
  {
    job: job("027-eng-394-session-store-redis", "Move session storage to Redis", "needs-human", {
      risk: "high",
      escalatedFrom: "approve",
      reviews: { ux: "skipped", ui: "skipped", code: "PASS", security: "PASS" },
      note: "Approver escalated: adds a migration and a new dependency (redis-rb).",
      costs: [cost("spec", "spec-writer", 0.7, 120), cost("build", "builder", 3.9, 900), cost("approve", "approver", 0.4, 60)],
      trail: ["backlog", "spec", "signoff", "queued", "build", "checks", "review", "approve", "needs-human"],
    }),
    ago: 22,
  },
  {
    job: job("026-eng-390-checkout-address-validation", "Inline validation on the checkout address form", "pr-open", {
      risk: "medium",
      checkFixes: 1,
      designRound: 1,
      reviews: { ux: "PASS", ui: "PASS", code: "PASS", security: "PASS" },
      findings: {
        ui: [{ text: "The error text could sit 4px closer to its field to read as one group.", blocking: false }],
        code: [{ text: "validateAddress runs on every blur; fine at this size, memoize if the form grows.", blocking: false }],
      },
      pr: "https://github.com/example/storefront/pull/482",
      costs: [
        cost("spec", "spec-writer", 0.52, 95),
        cost("build", "builder", 2.2, 520),
        cost("build", "builder", 0.6, 140),
        cost("design", "review-ux", 0.48, 210),
        cost("design", "review-ui", 0.45, 190),
        cost("build", "builder", 0.9, 230),
        cost("design", "review-ux", 0.41, 180),
        cost("design", "review-ui", 0.39, 170),
        cost("review", "review-code", 0.35, 120),
        cost("review", "review-security", 0.62, 150),
        cost("approve", "approver", 0.44, 80),
      ],
      trail: [
        "backlog", "spec", "signoff", "queued", "build", "checks", "build", "checks",
        "design", "build", "checks", "design", "review", "approve", "pr-open",
      ],
      lastChecks: { n: 3, ok: true, head: "b7d03f1a92c4" },
      history: [
        { action: "write-spec", at: "2026-11-03T09:12:40Z", stage_before: "backlog" },
        { action: "approve-spec", at: "2026-11-03T09:20:03Z", stage_before: "signoff" },
      ],
      decision: "APPROVE",
    }),
    ago: 35,
    docs: {
      "ticket.md": "# ENG-390 Checkout address form errors\n\nThe address step only says \"Please fill in all fields\" after you press Continue, and doesn't say which field. Show the problem next to the field as soon as the shopper leaves it.\n",
      "spec.md": `# Inline validation on the checkout address form (ENG-390)

## Goal
Shoppers see what's wrong with each address field right after they leave it, in plain words, instead of one
generic error after they press Continue.

## Triage
Risk: medium
User-facing: yes
UI: yes

## Acceptance criteria
- [ ] AC1: Leaving an empty required field shows its own message under it ("Enter a street address.").
- [ ] AC2: A ZIP that isn't 5 digits (or ZIP+4) says so, with an example.
- [ ] AC3: Errors are announced to screen readers and linked to their field with aria-describedby.
- [ ] AC4: The generic "Please fill in all fields" banner is gone.
- [ ] AC5: Typecheck, lint and vitest pass.
`,
      "build.md": `# Build: 026-eng-390-checkout-address-validation
## Summary
The address form now checks each field when the shopper leaves it. Messages come from one helper,
\`validateAddress\`, and show under their field, linked with \`aria-describedby\`. The old banner is gone.
Round 2 moved the error color to the design system's \`--danger-700\` for contrast.

## Files changed
- web/app/components/checkout/AddressForm.tsx
- web/app/helpers/validateAddress.ts
- web/app/helpers/validateAddress.test.ts

## Manual checks
- /checkout/address: leave Address empty and tab out. "Enter a street address." shows under it.
- /checkout/address: type 100 in ZIP and tab out. The 5-digit message shows with an example.
`,
      "design-1/review-ux.md": "VERDICT: PASS\n\nEach message names the field and says how to fix it. Focus stays put when an error appears.\n",
      "design-1/review-ui.md": "VERDICT: CHANGES\n\n1. **Blocking.** The error text is #E5484D on white: 3.4:1, below the 4.5:1 AA minimum. Use the design system's `--danger-700`.\n2. Non-blocking: the message could sit 4px closer to its field.\n",
      "design-2/review-ux.md": "VERDICT: PASS\n\nAll three manual checks behave as the spec says. Screen reader announces each message once.\n",
      "design-2/review-ui.md": "VERDICT: PASS\n\nError color is now `--danger-700` (6.1:1). Spacing and type match the rest of checkout.\n\nNon-blocking:\n1. The message could sit 4px closer to its field to read as one group.\n",
      "round-1/review-code.md": "VERDICT: PASS\n\nSmall, well-tested change. One helper, three tests, no new dependencies.\n\nNon-blocking:\n1. `validateAddress` runs on every blur. Fine at this size; memoize if the form grows.\n",
      "round-1/review-security.md": "VERDICT: PASS\n\nClient-side validation only; the API still validates the address. No new inputs reach the server.\n",
      "decision.md": "APPROVE\n\nChecks are green and every reviewer passed. The one blocking finding (error contrast) was fixed in design round 2. Nothing touches payments, auth or migrations.\n",
      "checks/3.json": checks(GREEN),
    },
    shots: {
      "design-1/ux": ["0.png", "1.png"],
      "design-1/ui": ["0.png", "1.png"],
      "design-2/ux": ["0.png", "1.png"],
      "design-2/ui": ["0.png", "1.png"],
    },
    diff: ADDRESS_DIFF,
  },
  {
    job: job("025-eng-386-product-image-zoom", "Zoom product images on hover", "ready", {
      risk: "low",
      reviews: { ux: "PASS", ui: "PASS", code: "PASS", security: "skipped" },
      pr: "https://github.com/example/storefront/pull/477",
      costs: [cost("spec", "spec-writer", 0.4, 80), cost("build", "builder", 2.0, 480)],
      trail: ["backlog", "spec", "signoff", "queued", "build", "checks", "design", "review", "approve", "pr-open", "ready"],
    }),
    ago: 90,
  },
];
