export function Tags({
  items,
  label = "Technologies",
}: {
  items: string[];
  label?: string;
}) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2" aria-label={label}>
      {items.map((t) => (
        <li
          key={t}
          className="rounded-full border border-dark-green/25 px-3 py-1 font-neue-haas text-xs tracking-wide text-dark-green"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Small-caps label, matching the hero's NOW / ALSO strip. */
export const smallLabelClass =
  "font-neue-haas text-[0.6875rem] uppercase tracking-[0.14em] text-[#3d5a4d]";
