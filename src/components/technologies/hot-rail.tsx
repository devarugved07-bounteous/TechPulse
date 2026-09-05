import Link from "next/link";

export function HotTechRail({
  items,
}: {
  items: { slug: string; name: string; rank: number; delta?: number }[];
}) {
  return (
    <aside className="border border-line bg-elev p-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Hot technologies</h2>
      <ol className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.slug} className="flex items-baseline justify-between gap-3">
            <Link href={`/technology/${item.slug}`} className="hover:text-accent">
              <span className="mr-2 font-mono text-xs text-muted">{item.rank || "–"}</span>
              {item.name}
            </Link>
            {item.delta ? (
              <span className={item.delta > 0 ? "text-xs text-accent" : "text-xs text-accent-2"}>
                {item.delta > 0 ? `↑${item.delta}` : `↓${Math.abs(item.delta)}`}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </aside>
  );
}
