import type {
  Driver,
  DriverStanding,
  ConstructorStanding,
  TeamId,
  EliteLabel,
  FormTrend,
  DriverTraits,
  FormDelta,
} from "@/types";
import type {
  ErgastDriverStandingEntry,
  ErgastConstructorStandingEntry,
  ErgastRace,
} from "./ergast";
import { ergastToCode } from "@/lib/driverCodeMap";

// Map Ergast constructorId → our TeamId
const CONSTRUCTOR_TO_TEAM_ID: Record<string, TeamId> = {
  red_bull: "red_bull",
  mercedes: "mercedes",
  ferrari: "ferrari",
  mclaren: "mclaren",
  aston_martin: "aston_martin",
  alpine: "alpine",
  williams: "williams",
  alphatauri: "rb",
  rb: "rb",
  haas: "haas",
  sauber: "sauber",
  alfa: "sauber",
};

function getTeamId(constructorId: string): TeamId {
  return CONSTRUCTOR_TO_TEAM_ID[constructorId] ?? "haas";
}

// Derive driver traits from race results
function deriveTraits(
  driverId: string,
  allRaces: ErgastRace[]
): DriverTraits {
  const results = allRaces
    .flatMap((r) => r.Results ?? [])
    .filter((r) => r.Driver.driverId === driverId);

  if (results.length === 0) {
    // Fallback defaults
    return { aggression: 70, brakingStyle: 70, tireManagement: 70, consistency: 70, racecraft: 70 };
  }

  // Racecraft: avg positions gained (grid → finish)
  const positionsGained = results.map((r) => {
    const grid = parseInt(r.grid) || 10;
    const finish = parseInt(r.position) || 10;
    return grid - finish; // positive = gained
  });
  const avgGained = positionsGained.reduce((a, b) => a + b, 0) / positionsGained.length;
  const racecraft = Math.min(100, Math.max(30, 70 + avgGained * 3));

  // Consistency: inverse of std dev of finishing positions
  const finishes = results.map((r) => parseInt(r.position) || 15);
  const meanFinish = finishes.reduce((a, b) => a + b, 0) / finishes.length;
  const variance =
    finishes.reduce((a, b) => a + Math.pow(b - meanFinish, 2), 0) / finishes.length;
  const stdDev = Math.sqrt(variance);
  const consistency = Math.min(99, Math.max(40, 95 - stdDev * 4));

  // DNF rate → aggression proxy
  const dnfCount = results.filter(
    (r) => !["Finished", "+1 Lap", "+2 Laps", "+3 Laps"].includes(r.status) && parseInt(r.position) > 10
  ).length;
  const dnfRate = dnfCount / results.length;
  const aggression = Math.min(99, Math.max(40, 75 + dnfRate * 50 - consistency * 0.1));

  // Fastest laps → braking style (proxy for pace under pressure)
  const fastestLaps = results.filter(
    (r) => r.FastestLap?.rank === "1"
  ).length;
  const brakingStyle = Math.min(99, Math.max(50, 65 + fastestLaps * 3));

  // Average finish position → tire management proxy
  const tireManagement = Math.min(99, Math.max(40, 95 - meanFinish * 2.5));

  return {
    aggression: Math.round(aggression),
    brakingStyle: Math.round(brakingStyle),
    tireManagement: Math.round(tireManagement),
    consistency: Math.round(consistency),
    racecraft: Math.round(racecraft),
  };
}

function deriveFormDelta(
  driverId: string,
  allRaces: ErgastRace[]
): FormDelta {
  // Compare last 3 races vs prior 3 races
  const results = allRaces
    .flatMap((r) => (r.Results ?? []).map((res) => ({ ...res, round: parseInt(r.round) })))
    .filter((r) => r.Driver.driverId === driverId)
    .sort((a, b) => b.round - a.round);

  if (results.length < 6) return {};

  const recent = results.slice(0, 3);
  const prior = results.slice(3, 6);

  const avgPos = (arr: typeof results) =>
    arr.reduce((a, b) => a + (parseInt(b.position) || 15), 0) / arr.length;

  const delta = avgPos(prior) - avgPos(recent); // positive = improvement
  const consistencyDelta = Math.round(delta * 1.5);

  return {
    consistency: Math.max(-5, Math.min(5, consistencyDelta)),
    racecraft: Math.max(-4, Math.min(4, Math.round(delta))),
  };
}

function deriveFormTrend(_driverId: string, _allRaces: ErgastRace[]): FormTrend {
  // Simple trend model for now (intentionally constant). Keeping this as a
  // separate function means we can improve it later without touching callers.
  return "stable";
}

function deriveEliteLabel(
  standing: ErgastDriverStandingEntry,
  allStandings: ErgastDriverStandingEntry[]
): EliteLabel {
  const pos = parseInt(standing.position);
  const wins = parseInt(standing.wins);
  if (pos === 1) return "WORLD CHAMPION";
  if (pos === 2 && parseInt(standing.points) > 150) return "POINTS LEADER";
  if (wins >= 3) return "COMEBACK KING";
  return null;
}

function deriveNarrativeTag(traits: DriverTraits): string {
  const entries = Object.entries(traits) as [keyof DriverTraits, number][];
  const top = entries.sort((a, b) => b[1] - a[1])[0];
  const tags: Record<keyof DriverTraits, string> = {
    aggression: "Aggressive overtaker, never backs down",
    brakingStyle: "Late braking specialist",
    tireManagement: "Elite tire whisperer",
    consistency: "Relentlessly consistent every lap",
    racecraft: "Masters the art of position battles",
  };
  return tags[top[0]];
}

// ─── Public Transform Functions ──────────────────────────────────────────────

export function mapStandings(
  data: ErgastDriverStandingEntry[]
): DriverStanding[] {
  return data.map((entry, index, arr) => {
    const points = parseFloat(entry.points);
    const leaderPoints = parseFloat(arr[0].points);
    const prevPoints = index > 0 ? parseFloat(arr[index - 1].points) : null;
    return {
      position: parseInt(entry.position),
      driverId: entry.Driver.driverId,
      points,
      wins: parseInt(entry.wins),
      gap: index === 0 ? null : leaderPoints - points,
      gapToAhead: prevPoints === null ? null : prevPoints - points,
    };
  });
}

export function mapConstructorStandings(
  data: ErgastConstructorStandingEntry[]
): ConstructorStanding[] {
  return data.map((entry, index, arr) => {
    const points = parseFloat(entry.points);
    const leaderPoints = parseFloat(arr[0].points);
    return {
      position: parseInt(entry.position),
      teamId: getTeamId(entry.Constructor.constructorId),
      points,
      wins: parseInt(entry.wins),
      gap: index === 0 ? null : leaderPoints - points,
    };
  });
}

export function mapDrivers(
  standings: ErgastDriverStandingEntry[],
  allRaces: ErgastRace[]
): Driver[] {
  return standings.map((entry) => {
    const d = entry.Driver;
    const constructor = entry.Constructors[0];
    const teamId = getTeamId(constructor?.constructorId ?? "haas");
    const traits = deriveTraits(d.driverId, allRaces);
    const formDelta = deriveFormDelta(d.driverId, allRaces);
    const eliteLabel = deriveEliteLabel(entry, standings);
    const narrativeTag = deriveNarrativeTag(traits);

    // Form trend: simple based on position
    const pos = parseInt(entry.position);
    const formTrend: FormTrend = pos <= 3 ? "up" : pos <= 8 ? "stable" : "down";

    // Stats
    const driverResults = allRaces.flatMap((r) =>
      (r.Results ?? []).filter((res) => res.Driver.driverId === d.driverId)
    );
    const wins = driverResults.filter((r) => r.position === "1").length;
    const podiums = driverResults.filter((r) => ["1", "2", "3"].includes(r.position)).length;
    const fastestLaps = driverResults.filter((r) => r.FastestLap?.rank === "1").length;
    const dnfs = driverResults.filter(
      (r) => !["Finished", "+1 Lap", "+2 Laps"].includes(r.status) && parseInt(r.position) > 10
    ).length;

    const gridPositions = driverResults.map((r) => parseInt(r.grid) || 10);
    const avgQualifyingPosition =
      gridPositions.length > 0
        ? gridPositions.reduce((a, b) => a + b, 0) / gridPositions.length
        : 10;

    const finishPositions = driverResults.map((r) => parseInt(r.position) || 15);
    const avgFinish =
      finishPositions.length > 0
        ? finishPositions.reduce((a, b) => a + b, 0) / finishPositions.length
        : 10;

    return {
      id: d.driverId,
      driverCode: ergastToCode(d.driverId),
      number: parseInt(d.permanentNumber) || 0,
      firstName: d.givenName,
      lastName: d.familyName,
      teamId,
      nationality: d.nationality,
      imageUrl: `/drivers/${d.driverId}.png`,
      narrativeTag,
      traits,
      formDelta,
      eliteLabel,
      formTrend,
      stats: {
        avgQualifyingPosition: Math.round(avgQualifyingPosition * 10) / 10,
        avgRacePace: Math.round(Math.max(0, 100 - avgFinish * 4)),
        polePositions: driverResults.filter((r) => r.grid === "1").length,
        wins,
        podiums,
        points: parseFloat(entry.points),
        fastestLaps,
        dnfs,
        strategyScore: Math.round(Math.min(99, 70 + (podiums - dnfs) * 3)),
      },
    };
  });
}
