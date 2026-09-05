export type TrendMetrics = {
  mentionCount: number;
  uniqueSources: number;
  authoritySum: number;
  recencyScore: number;
};

export function trendScore(metrics: TrendMetrics) {
  return (
    metrics.mentionCount * 1.0 +
    metrics.uniqueSources * 1.5 +
    metrics.authoritySum * 1.0 +
    metrics.recencyScore * 2.0
  );
}

export function recencyWeight(publishedAt: Date, now = new Date()) {
  const ageHours = Math.max(0, (now.getTime() - publishedAt.getTime()) / 3_600_000);
  return Math.exp(-ageHours / 24);
}
