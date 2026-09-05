import { getEventBySlug } from "@/application/dashboard/queries";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return (
    <div className="max-w-2xl">
      <p className="text-[11px] uppercase tracking-[0.2em] text-accent">Event</p>
      <h1 className="display break-words text-3xl sm:text-4xl">{event.name}</h1>
      <p className="mt-4 text-muted">
        {formatDate(event.startsAt)}
        {event.endsAt ? ` – ${formatDate(event.endsAt)}` : ""} · {event.location}
      </p>
      {event.description ? <p className="mt-4">{event.description}</p> : null}
      {event.company ? (
        <p className="mt-4 text-sm">
          Host:{" "}
          <Link href={`/companies/${event.company.slug}`} className="text-accent">
            {event.company.name}
          </Link>
        </p>
      ) : null}
      {event.url ? (
        <a href={event.url} className="mt-6 inline-block text-accent" target="_blank" rel="noreferrer">
          Official site
        </a>
      ) : null}
    </div>
  );
}
