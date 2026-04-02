import type { TeamId } from "@/types";

export const TEAM_COLORS: Record<TeamId, string> = {
  red_bull: "#3671C6",
  mercedes: "#27F4D2",
  ferrari: "#E8002D",
  mclaren: "#FF8000",
  aston_martin: "#358C75",
  alpine: "#FF87BC",
  williams: "#64C4FF",
  rb: "#6692FF",
  haas: "#B6BABD",
  sauber: "#52E252",
};

export const TEAM_SECONDARY_COLORS: Record<TeamId, string> = {
  red_bull: "#1E3A5F",
  mercedes: "#00A19C",
  ferrari: "#9B0000",
  mclaren: "#CC6600",
  aston_martin: "#1A4A3A",
  alpine: "#CC5F9A",
  williams: "#3A8FCC",
  rb: "#3A5FCC",
  haas: "#7A7A7A",
  sauber: "#2A8A2A",
};

export function getTeamColor(teamId: TeamId): string {
  return TEAM_COLORS[teamId] ?? "#8B5CF6";
}
