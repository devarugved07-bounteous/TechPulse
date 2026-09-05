import { getDigestByWeek } from "@/application/dashboard/queries";
import { DigestView } from "@/components/digest/digest-view";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DigestWeekPage({ params }: { params: Promise<{ week: string }> }) {
  const { week } = await params;
  const weekStart = new Date(`${week}T00:00:00.000Z`);
  if (Number.isNaN(weekStart.getTime())) notFound();

  const digest = await getDigestByWeek(weekStart);
  if (!digest) notFound();

  return <DigestView digest={digest} />;
}
