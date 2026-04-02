"use client";
import { motion } from "framer-motion";
import { TEAM_COLORS } from "@/lib/teamColors";
import type { SectorDataPoint } from "@/types";

interface ClutchScoreCardProps {
  data: SectorDataPoint[];
}

export default function ClutchScoreCard({ data }: ClutchScoreCardProps) {
  const sorted = [...data].sort((a, b) => b.clutchScore - a.clutchScore).slice(0, 5);

  return (
    <div className="space-y-2">
      <p className="font-heading text-[9px] text-text-muted tracking-widest">
        CLUTCH SCORE
      </p>
      {sorted.map((d, i) => {
        const color = TEAM_COLORS[d.teamId];
        return (
          <motion.div
            key={d.driverCode}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center gap-2"
          >
            <span className="font-data text-[10px] text-text-muted w-3">{i + 1}</span>
            <span
              className="font-heading text-[10px] tracking-widest w-8"
              style={{ color }}
            >
              {d.driverCode}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: "0%" }}
                animate={{ width: `${d.clutchScore}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.07, ease: "easeOut" }}
              />
            </div>
            <span className="font-data text-[11px] w-6 text-right" style={{ color }}>
              {d.clutchScore}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
