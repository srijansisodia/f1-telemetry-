"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TEAM_COLORS } from "@/lib/teamColors";
import ConstructorBadge from "./ConstructorBadge";
import PointsBarMini from "./PointsBarMini";
import { formatPointsGap } from "@/lib/formatters";
import type { Driver, DriverStanding } from "@/types";
import { itemVariants } from "@/hooks/useAnimationVariants";

interface StandingsRowProps {
  standing: DriverStanding;
  driver: Driver | undefined;
  maxPoints: number;
  index: number;
}

const PODIUM_CLASSES: Record<number, string> = {
  1: "podium-gold",
  2: "podium-silver",
  3: "podium-bronze",
};

const POSITION_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

export default function StandingsRow({
  standing,
  driver,
  maxPoints,
  index,
}: StandingsRowProps) {
  const teamColor = driver ? TEAM_COLORS[driver.teamId] : "#8B5CF6";
  const podiumClass = PODIUM_CLASSES[standing.position];
  const posColor = POSITION_COLORS[standing.position];

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "glass-card px-4 py-3 flex items-center gap-4 transition-all duration-200",
        "hover:border-white/15 hover:-translate-y-0.5",
        podiumClass
      )}
      style={{
        borderLeftWidth: 2,
        borderLeftColor: teamColor,
        borderLeftStyle: "solid",
      }}
    >
      {/* Position */}
      <span
        className="font-heading text-sm w-6 text-center flex-shrink-0"
        style={{ color: posColor ?? teamColor }}
      >
        {standing.position}
      </span>

      {/* Driver name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {driver && (
            <span className="font-data text-xs text-text-muted">
              {driver.driverCode}
            </span>
          )}
          <span className="text-text-primary text-sm font-medium truncate">
            {driver
              ? `${driver.firstName} ${driver.lastName}`
              : standing.driverId}
          </span>
        </div>
        {driver && (
          <ConstructorBadge teamId={driver.teamId} className="mt-0.5" />
        )}
      </div>

      {/* Points bar */}
      <PointsBarMini
        points={standing.points}
        maxPoints={maxPoints}
        color={teamColor}
        index={index}
      />

      {/* Points */}
      <div className="text-right flex-shrink-0 w-20">
        <span className="font-data text-text-primary text-sm font-semibold">
          {standing.points}
        </span>
        <span className="font-data text-xs text-text-muted ml-1">pts</span>
        {standing.gap !== null && standing.gap > 0 && (
          <div className="font-data text-[10px] text-text-muted">
            {formatPointsGap(-standing.gap)}
          </div>
        )}
        {standing.deltaToPreviousRace !== undefined &&
          standing.deltaToPreviousRace !== 0 && (
            <div
              className={cn(
                "font-data text-[10px]",
                standing.deltaToPreviousRace > 0
                  ? "text-neon-green"
                  : "text-red-400"
              )}
            >
              {standing.deltaToPreviousRace > 0 ? "+" : ""}
              {standing.deltaToPreviousRace}
            </div>
          )}
      </div>

      {/* Wins */}
      <div className="text-right w-8 flex-shrink-0">
        <span className="font-data text-xs text-text-muted">
          {standing.wins}W
        </span>
      </div>
    </motion.div>
  );
}
