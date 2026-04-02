export type TeamId =
  | "red_bull"
  | "mercedes"
  | "ferrari"
  | "mclaren"
  | "aston_martin"
  | "alpine"
  | "williams"
  | "rb"
  | "haas"
  | "sauber";

export type EliteLabel =
  | "WORLD CHAMPION"
  | "POINTS LEADER"
  | "FASTEST QUALIFIER"
  | "TIRE WHISPERER"
  | "COMEBACK KING"
  | null;

export type FormTrend = "up" | "down" | "stable";

export interface DriverTraits {
  aggression: number;
  brakingStyle: number;
  tireManagement: number;
  consistency: number;
  racecraft: number;
}

export interface FormDelta {
  aggression?: number;
  brakingStyle?: number;
  tireManagement?: number;
  consistency?: number;
  racecraft?: number;
}

export interface DriverStats {
  avgQualifyingPosition: number;
  avgRacePace: number;
  polePositions: number;
  wins: number;
  podiums: number;
  points: number;
  fastestLaps: number;
  dnfs: number;
  strategyScore: number;
}

export interface Driver {
  id: string;
  driverCode: string;
  number: number;
  firstName: string;
  lastName: string;
  teamId: TeamId;
  nationality: string;
  imageUrl: string;
  narrativeTag: string;
  traits: DriverTraits;
  formDelta: FormDelta;
  eliteLabel: EliteLabel;
  formTrend: FormTrend;
  stats: DriverStats;
}

export interface Team {
  id: TeamId;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
}

export interface DriverStanding {
  position: number;
  driverId: string;
  points: number;
  wins: number;
  gap: number | null;
  gapToAhead: number | null;
  deltaToPreviousRace?: number;
}

export interface ConstructorStanding {
  position: number;
  teamId: TeamId;
  points: number;
  wins: number;
  gap: number | null;
}

export type SectorId = "S1" | "S2" | "S3";

export interface SectorDataPoint {
  driverId: string;
  driverCode: string;
  teamId: TeamId;
  sectorId: SectorId;
  bestTime: number;
  avgTime: number;
  consistency: number;
  clutchScore: number;
  timeGainVsLeader?: number;
}

export interface BattleMetric {
  label: string;
  driverA: number;
  driverB: number;
  unit?: string;
  weight: number;
}

export interface BattleBreakdown {
  qualifying: { driverA: number; driverB: number };
  racePace: { driverA: number; driverB: number };
  strategy: { driverA: number; driverB: number };
}

export interface BattleScore {
  driverAId: string;
  driverBId: string;
  driverAScore: number;
  driverBScore: number;
  winnerId: string;
  metrics: BattleMetric[];
  breakdown: BattleBreakdown;
}

export interface APIError {
  status: number;
  message: string;
}

export interface LatestRace {
  round: number;
  raceName: string;
  raceSlug: string;
}
