import { Suspense } from "react";
import Link from "next/link";
import { listEvents } from "@/application/dashboard/queries";
import { formatDate } from "@/lib/utils";
import { SkeletonLine } from "@/components/layout/loading-ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <div>
      <h1 className="display text-4xl">Events</h1>
      <p className="mt-2 text-muted">Build, Ignite, I/O, re:Invent, KubeCon, CES, and more.</p>
      <Suspense
        fallback={
          <ul className="mt-8 divide-y divide-line">
            {Array.from({ length: 8 }).map((_, index) => (
              <li key={index} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                <SkeletonLine className="h-6 w-56" />
                <SkeletonLine className="h-3 w-40" />
              </li>
            ))}
          </ul>
        }
      >
        <EventLists />
      </Suspense>
    </div>
  );
}

async function EventLists() {
  const events = await listEvents();
  const now = new Date();
  const upcoming = events.filter((event) => event.startsAt >= now);
  const past = events.filter((event) => event.startsAt < now);

  return (
    <div className="content-fade-in">
      <section className="mt-8">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-accent">Upcoming</h2>
        <ul className="mt-4 divide-y divide-line">
          {upcoming.map((event) => (
            <li key={event.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
              <Link href={`/events/${event.slug}`} className="display text-2xl hover:text-accent">
                {event.name}
              </Link>
              <span className="text-sm text-muted">
                {formatDate(event.startsAt)} · {event.location}
              </span>
            </li>
          ))}
        </ul>
      </section>
      {past.length ? (
        <section className="mt-10">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">Past</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {past.map((event) => (
              <li key={event.id}>
                <Link href={`/events/${event.slug}`} className="hover:text-accent">
                  {event.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
