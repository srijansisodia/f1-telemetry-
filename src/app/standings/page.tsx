import { Suspense } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeader from "@/components/layout/SectionHeader";
import StandingsTable from "@/components/standings/StandingsTable";
import SeasonPicker from "@/components/ui/SeasonPicker";
import { getDriverStandings, getConstructorStandings, getAllRaceResults } from "@/services/ergast";
import { mapDrivers, mapStandings, mapConstructorStandings } from "@/services/transform";
import { TEAM_COLORS } from "@/lib/teamColors";
import { CURRENT_SEASON } from "@/lib/constants";
import type { ConstructorStanding } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Standings" };
export const revalidate = 3600;

function ConstructorRow({ s, index, max }: { s: ConstructorStanding; index: number; max: number }) {
  const color = TEAM_COLORS[s.teamId];
  const pct = max > 0 ? (s.points / max) * 100 : 0;
  const podiumStyle =
    index === 0
      ? { boxShadow: "0 0 20px rgba(255,215,0,0.25)", borderColor: "rgba(255,215,0,0.3)" }
      : index === 1
      ? { boxShadow: "0 0 20px rgba(192,192,192,0.2)", borderColor: "rgba(192,192,192,0.25)" }
      : index === 2
      ? { boxShadow: "0 0 20px rgba(205,127,50,0.25)", borderColor: "rgba(205,127,50,0.3)" }
      : {};

  const TEAM_NAMES: Record<string, string> = {
    red_bull: "Red Bull Racing",
    mercedes: "Mercedes",
    ferrari: "Ferrari",
    mclaren: "McLaren",
    aston_martin: "Aston Martin",
    alpine: "Alpine",
    williams: "Williams",
    rb: "RB",
    haas: "Haas F1",
    sauber: "Stake F1",
  };

  return (
    <div
      className="glass-card px-4 py-3 flex items-center gap-4 border"
      style={{ borderLeftWidth: 2, borderLeftColor: color, borderLeftStyle: "solid", ...podiumStyle }}
    >
      <span className="font-heading text-sm w-6 text-center flex-shrink-0" style={{ color }}>
        {s.position}
      </span>
      <div className="flex-1">
        <span className="text-text-primary text-sm font-medium">{TEAM_NAMES[s.teamId] ?? s.teamId}</span>
      </div>
      <div className="relative h-1.5 w-24 rounded-full bg-white/5 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-right w-20">
        <span className="font-data text-sm font-semibold text-text-primary">{s.points}</span>
        <span className="font-data text-xs text-text-muted ml-1">pts</span>
        {s.gap !== null && s.gap > 0 && (
          <div className="font-data text-[10px] text-text-muted">-{s.gap}</div>
        )}
      </div>
      <div className="w-8 text-right">
        <span className="font-data text-xs text-text-muted">{s.wins}W</span>
      </div>
    </div>
  );
}

export default async function StandingsPage({ searchParams }: { searchParams: Promise<{ season?: string }> }) {
  const { season: seasonParam } = await searchParams;
  const season = Number(seasonParam ?? CURRENT_SEASON);
  try {
    const [standingsData, constructorData, allRaces] = await Promise.all([
      getDriverStandings(season),
      getConstructorStandings(season),
      getAllRaceResults(season),
    ]);

    const drivers = mapDrivers(standingsData, allRaces);
    const standings = mapStandings(standingsData);
    const constructorStandings = mapConstructorStandings(constructorData);
    const maxConstructorPoints = constructorStandings[0]?.points ?? 1;

    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-xl text-text-primary tracking-wider">Standings</h1>
            <Suspense>
              <SeasonPicker />
            </Suspense>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Driver Standings */}
            <div>
              <SectionHeader
                title="Drivers"
                subtitle={`${season} World Championship`}
                accent="purple"
              />
              <StandingsTable standings={standings} drivers={drivers} />
            </div>

            {/* Constructor Standings */}
            <div>
              <SectionHeader
                title="Constructors"
                subtitle={`${season} World Championship`}
                accent="cyan"
              />
              <div className="space-y-2">
                {constructorStandings.map((s, i) => (
                  <ConstructorRow
                    key={s.teamId}
                    s={s}
                    index={i}
                    max={maxConstructorPoints}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="glass-card p-8 text-center" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
            <p className="text-text-secondary">Failed to load standings. Please try again.</p>
            <p className="text-text-muted text-xs mt-3 break-words">{message}</p>
          </div>
        </div>
      </PageWrapper>
    );
  }
}
