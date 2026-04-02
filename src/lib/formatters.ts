/** Format milliseconds → "28.340" (sector time display) */
export function formatSectorTime(ms: number): string {
  const seconds = ms / 1000;
  return seconds.toFixed(3);
}

/** Format milliseconds gap → "+0.214s" or "-0.214s" */
export function formatGap(ms: number): string {
  const sign = ms >= 0 ? "+" : "";
  return `${sign}${(ms / 1000).toFixed(3)}s`;
}

/** Format points gap → "+84 pts" */
export function formatPointsGap(points: number): string {
  const sign = points >= 0 ? "+" : "";
  return `${sign}${points} pts`;
}

/** Format lap time ms → "1:23.456" */
export function formatLapTime(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`;
}

/** Format delta → "+3" or "-2" */
export function formatDelta(delta: number): string {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta}`;
}

/** Format number as ordinal: 1 → "1st", 2 → "2nd" */
export function formatOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}
