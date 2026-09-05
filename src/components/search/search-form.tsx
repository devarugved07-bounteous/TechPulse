"use client";

import { useFormStatus } from "react-dom";
import { useAppLoading } from "@/components/layout/app-loading";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-ink px-4 py-2 text-sm text-bg disabled:opacity-60"
    >
      {pending ? "Searching…" : "Search"}
    </button>
  );
}

export function SearchForm({ q }: { q: string }) {
  const { startLoading } = useAppLoading();
  return (
    <form
      action="/search"
      className="flex gap-2"
      onSubmit={() => {
        startLoading();
      }}
    >
      <input
        name="q"
        defaultValue={q}
        placeholder="Search Kubernetes, Azure, Build…"
        className="w-full rounded-md border border-line bg-elev px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
      />
      <SubmitButton />
    </form>
  );
}
