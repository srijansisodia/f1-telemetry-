import { TEAM_COLORS } from "@/lib/teamColors";
import type { TeamId } from "@/types";
import { cn } from "@/lib/utils";

const TEAM_SHORT: Record<TeamId, string> = {
  red_bull: "Red Bull",
  mercedes: "Mercedes",
  ferrari: "Ferrari",
  mclaren: "McLaren",
  aston_martin: "Aston Martin",
  alpine: "Alpine",
  williams: "Williams",
  rb: "RB",
  haas: "Haas",
  sauber: "Sauber",
};

interface ConstructorBadgeProps {
  teamId: TeamId;
  className?: string;
  showName?: boolean;
}

export default function ConstructorBadge({
  teamId,
  className,
  showName = true,
}: ConstructorBadgeProps) {
  const color = TEAM_COLORS[teamId] ?? "#8B5CF6";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="w-1 h-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}88` }}
      />
      {showName && (
        <span className="text-text-secondary text-xs">{TEAM_SHORT[teamId]}</span>
      )}
    </div>
  );
}
