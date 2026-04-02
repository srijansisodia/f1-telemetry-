import type { BattleMetric, BattleScore } from "@/types";

export function computeBattleScore(
  driverAId: string,
  driverBId: string,
  metrics: BattleMetric[]
): BattleScore {
  let driverAScore = 0;
  let driverBScore = 0;

  for (const m of metrics) {
    const total = m.driverA + m.driverB;
    if (total === 0) continue;
    const aShare = (m.driverA / total) * 100 * m.weight;
    const bShare = (m.driverB / total) * 100 * m.weight;
    driverAScore += aShare;
    driverBScore += bShare;
  }

  // Normalize to 0-100
  const totalScore = driverAScore + driverBScore;
  const normalizedA = totalScore > 0 ? Math.round((driverAScore / totalScore) * 100) : 50;
  const normalizedB = 100 - normalizedA;

  const qualiMetric = metrics.find((m) => m.label.toLowerCase().includes("quali"));
  const paceMetric = metrics.find((m) => m.label.toLowerCase().includes("pace"));
  const stratMetric = metrics.find((m) => m.label.toLowerCase().includes("strat"));

  return {
    driverAId,
    driverBId,
    driverAScore: normalizedA,
    driverBScore: normalizedB,
    winnerId: normalizedA >= normalizedB ? driverAId : driverBId,
    metrics,
    breakdown: {
      qualifying: {
        driverA: qualiMetric?.driverA ?? 50,
        driverB: qualiMetric?.driverB ?? 50,
      },
      racePace: {
        driverA: paceMetric?.driverA ?? 50,
        driverB: paceMetric?.driverB ?? 50,
      },
      strategy: {
        driverA: stratMetric?.driverA ?? 50,
        driverB: stratMetric?.driverB ?? 50,
      },
    },
  };
}
