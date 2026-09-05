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
      <h1 className="display text-3xl sm:text-4xl">Events</h1>
      <p className="mt-2 text-muted">Build, Ignite, I/O, re:Invent, KubeCon, CES, and more.</p>
      <Suspense
        fallback={
          <ul className="mt-8 divide-y divide-line">
            {Array.from({ length: 8 }).map((_, index) => (
              <li
                key={index}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-2"
              >
                <SkeletonLine className="h-6 w-56 max-w-full" />
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
            <li
              key={event.id}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-2"
            >
              <Link
                href={`/events/${event.slug}`}
                className="display min-w-0 break-words text-xl hover:text-accent sm:text-2xl"
              >
                {event.name}
              </Link>
              <span className="shrink-0 text-sm text-muted">
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
                <Link href={`/events/${event.slug}`} className="break-words hover:text-accent">
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
