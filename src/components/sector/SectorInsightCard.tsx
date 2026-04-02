"use client";
import { motion } from "framer-motion";
import { TEAM_COLORS } from "@/lib/teamColors";
import { insightCardVariants } from "@/hooks/useAnimationVariants";
import type { SectorDataPoint, SectorId } from "@/types";

interface SectorInsightCardProps {
  sectorData: SectorDataPoint[];
  sectorId: SectorId;
}

export default function SectorInsightCard({ sectorData, sectorId }: SectorInsightCardProps) {
  // Find the driver with the best (lowest) time
  const sorted = [...sectorData].sort((a, b) => a.bestTime - b.bestTime);
  const leader = sorted[0];
  const second = sorted[1];

  if (!leader) return null;

  const color = TEAM_COLORS[leader.teamId];
  const gainVsSecond =
    second ? ((second.bestTime - leader.bestTime) / 1000).toFixed(3) : null;

  return (
    <motion.div
      variants={insightCardVariants}
      initial="hidden"
      animate="visible"
      className="glass-card px-4 py-3 flex items-center gap-3"
      style={{
        borderLeft: `2px solid ${color}`,
        animation: "pulseGlow 2s ease-in-out infinite",
      }}
    >
      <span
        className="font-heading text-[10px] tracking-widest flex-shrink-0"
        style={{ color }}
      >
        {sectorId}
      </span>
      <div className="h-3 w-px bg-white/10 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="font-data text-sm" style={{ color }}>
          {leader.driverCode}
        </span>
        <span className="text-text-secondary text-xs ml-2">
          fastest at {(leader.bestTime / 1000).toFixed(3)}s
        </span>
        {gainVsSecond && (
          <span className="font-data text-xs ml-2 text-neon-green">
            (+{gainVsSecond}s vs {second?.driverCode})
          </span>
        )}
      </div>
      <span className="font-heading text-[9px] text-text-muted tracking-widest flex-shrink-0">
        FASTEST
      </span>
    </motion.div>
  );
}
