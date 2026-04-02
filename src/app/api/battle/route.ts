import { NextResponse } from "next/server";
import { getAllQualifyingResults, getAllRaceResults, getDriverStandings } from "@/services/ergast";
import { computeBattleScore } from "@/lib/battleScore";
import { ergastToCode, codeToErgast } from "@/lib/driverCodeMap";
import type { BattleMetric } from "@/types";

export const revalidate = 3600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const d1 = searchParams.get("d1") ?? "VER";
  const d2 = searchParams.get("d2") ?? "PER";

  // Convert codes to ergast IDs
  const id1 = codeToErgast(d1);
  const id2 = codeToErgast(d2);

  try {
    const [allRaces, allQualifying, standings] = await Promise.all([
      getAllRaceResults(),
      getAllQualifyingResults(),
      getDriverStandings(),
    ]);

    // Qualifying head-to-head
    let qualiWinsA = 0;
    let qualiWinsB = 0;
    for (const race of allQualifying) {
      const results = race.QualifyingResults ?? [];
      const posA = results.findIndex((r) => r.Driver.driverId === id1);
      const posB = results.findIndex((r) => r.Driver.driverId === id2);
      if (posA >= 0 && posB >= 0) {
        if (posA < posB) qualiWinsA++;
        else qualiWinsB++;
      }
    }

    // Race pace: avg finish position
    const racesA = allRaces.flatMap((r) => (r.Results ?? []).filter((res) => res.Driver.driverId === id1));
    const racesB = allRaces.flatMap((r) => (r.Results ?? []).filter((res) => res.Driver.driverId === id2));
    const avgFinishA = racesA.length ? racesA.reduce((a, r) => a + (parseInt(r.position) || 15), 0) / racesA.length : 10;
    const avgFinishB = racesB.length ? racesB.reduce((a, r) => a + (parseInt(r.position) || 15), 0) / racesB.length : 10;
    const maxFinish = Math.max(avgFinishA, avgFinishB);
    const racePaceA = Math.round((1 - avgFinishA / (maxFinish + 1)) * 100);
    const racePaceB = Math.round((1 - avgFinishB / (maxFinish + 1)) * 100);

    // Strategy: positions gained
    const posGainedA = racesA.reduce((a, r) => a + ((parseInt(r.grid) || 10) - (parseInt(r.position) || 10)), 0);
    const posGainedB = racesB.reduce((a, r) => a + ((parseInt(r.grid) || 10) - (parseInt(r.position) || 10)), 0);
    const maxGained = Math.max(Math.abs(posGainedA), Math.abs(posGainedB), 1);
    const stratA = Math.round(50 + (posGainedA / maxGained) * 30);
    const stratB = Math.round(50 + (posGainedB / maxGained) * 30);

    const metrics: BattleMetric[] = [
      { label: "Qualifying H2H", driverA: qualiWinsA || 1, driverB: qualiWinsB || 1, unit: "wins", weight: 0.4 },
      { label: "Race Pace Index", driverA: racePaceA, driverB: racePaceB, unit: "", weight: 0.4 },
      { label: "Strategy Score", driverA: stratA, driverB: stratB, unit: "", weight: 0.2 },
    ];

    const score = computeBattleScore(id1, id2, metrics);
    return NextResponse.json({ ...score, driverAId: d1, driverBId: d2 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
