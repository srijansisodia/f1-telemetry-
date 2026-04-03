import { CURRENT_SEASON } from "@/lib/constants";

const BASE = "https://api.jolpi.ca/ergast/f1";

async function ergastFetch<T>(path: string): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 3600 } } as any);
  if (!res.ok) throw new Error(`Ergast API error: ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

// ─── Raw Ergast Types ────────────────────────────────────────────────────────

export interface ErgastDriverInfo {
  driverId: string;
  permanentNumber: string;
  code: string;
  givenName: string;
  familyName: string;
  nationality: string;
}

export interface ErgastConstructor {
  constructorId: string;
  name: string;
}

export interface ErgastDriverStandingEntry {
  position: string;
  points: string;
  wins: string;
  Driver: ErgastDriverInfo;
  Constructors: ErgastConstructor[];
}

export interface ErgastConstructorStandingEntry {
  position: string;
  points: string;
  wins: string;
  Constructor: ErgastConstructor;
}

export interface ErgastQualifyingResult {
  position: string;
  Driver: ErgastDriverInfo;
  Constructor: ErgastConstructor;
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

export interface ErgastRaceResult {
  position: string;
  grid: string;
  Driver: ErgastDriverInfo;
  Constructor: ErgastConstructor;
  Time?: { millis?: string; time?: string };
  FastestLap?: { rank: string; lap: string; Time: { time: string } };
  status: string;
}

export interface ErgastRace {
  season: string;
  round: string;
  raceName: string;
  Circuit: { circuitId: string; circuitName: string; Location: { country: string; locality: string } };
  date: string;
  Results?: ErgastRaceResult[];
  QualifyingResults?: ErgastQualifyingResult[];
}

// ─── Public Functions ────────────────────────────────────────────────────────

export async function getDriverStandings(season = CURRENT_SEASON) {
  const data = await ergastFetch<{ MRData: { StandingsTable: { StandingsLists: { DriverStandings: ErgastDriverStandingEntry[] }[] } } }>(
    `/${season}/driverStandings.json`
  );
  return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
}

export async function getConstructorStandings(season = CURRENT_SEASON) {
  const data = await ergastFetch<{ MRData: { StandingsTable: { StandingsLists: { ConstructorStandings: ErgastConstructorStandingEntry[] }[] } } }>(
    `/${season}/constructorStandings.json`
  );
  return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];
}

export async function getDrivers(season = CURRENT_SEASON) {
  const data = await ergastFetch<{ MRData: { DriverTable: { Drivers: ErgastDriverInfo[] } } }>(
    `/${season}/drivers.json?limit=30`
  );
  return data.MRData.DriverTable.Drivers;
}

export async function getRaceResults(season = CURRENT_SEASON, round: number) {
  const data = await ergastFetch<{ MRData: { RaceTable: { Races: ErgastRace[] } } }>(
    `/${season}/${round}/results.json`
  );
  return data.MRData.RaceTable.Races[0] ?? null;
}

export async function getQualifyingResults(season = CURRENT_SEASON, round: number) {
  const data = await ergastFetch<{ MRData: { RaceTable: { Races: ErgastRace[] } } }>(
    `/${season}/${round}/qualifying.json`
  );
  return data.MRData.RaceTable.Races[0] ?? null;
}

export async function getLatestRace(season = CURRENT_SEASON) {
  const data = await ergastFetch<{ MRData: { RaceTable: { Races: ErgastRace[] } } }>(
    `/${season}/results.json?limit=1`
  );
  const race = data.MRData.RaceTable.Races[0];
  if (!race) return null;
  const slug = race.Circuit.circuitId
    .replace("_", "")
    .replace("great_britain", "silverstone");
  return {
    round: parseInt(race.round),
    raceName: race.raceName,
    raceSlug: slug,
  };
}

export async function getAllRaceResults(season = CURRENT_SEASON): Promise<ErgastRace[]> {
  const data = await ergastFetch<{ MRData: { total: string; RaceTable: { Races: ErgastRace[] } } }>(
    `/${season}/results.json?limit=30`
  );
  return data.MRData.RaceTable.Races;
}

export async function getAllQualifyingResults(season = CURRENT_SEASON): Promise<ErgastRace[]> {
  const data = await ergastFetch<{ MRData: { RaceTable: { Races: ErgastRace[] } } }>(
    `/${season}/qualifying.json?limit=30`
  );
  return data.MRData.RaceTable.Races;
}
