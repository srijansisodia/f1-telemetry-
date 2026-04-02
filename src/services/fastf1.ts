import type { SectorDataPoint, BattleScore } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

class APIError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "APIError";
  }
}

async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new APIError(res.status, `API error ${res.status}: ${url}`);
    return res;
  } catch (e) {
    clearTimeout(id);
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new APIError(408, "Request timed out");
    }
    throw e;
  }
}

export async function getSectorData(
  season: number,
  race: string
): Promise<SectorDataPoint[]> {
  const res = await fetchWithTimeout(`${API}/sectors/${season}/${race}`);
  return res.json();
}

export async function getBattleMetrics(
  driverA: string,
  driverB: string,
  season: number
): Promise<BattleScore> {
  const res = await fetchWithTimeout(
    `${API}/battle/${driverA}/${driverB}?season=${season}`
  );
  return res.json();
}

export interface TelemetryData {
  driverCode: string;
  speed: number[];
  throttle: number[];
  brake: number[];
  lapTimes: number[];
  distance: number[];
}

export async function getTelemetry(
  season: number,
  race: string,
  driver: string
): Promise<TelemetryData> {
  const res = await fetchWithTimeout(`${API}/telemetry/${season}/${race}/${driver}`);
  return res.json();
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${API}/health`, 3000);
    const data = await res.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}
