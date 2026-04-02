"use client";
import { motion } from "framer-motion";
import type { BattleScore } from "@/types";

interface BattleScoreBreakdownProps {
  battle: BattleScore;
  colorA: string;
  colorB: string;
}

const ROWS = [
  { key: "qualifying" as const, label: "QUALIFYING", pct: "40%" },
  { key: "racePace" as const, label: "RACE PACE", pct: "40%" },
  { key: "strategy" as const, label: "STRATEGY", pct: "20%" },
];

export default function BattleScoreBreakdown({
  battle,
  colorA,
  colorB,
}: BattleScoreBreakdownProps) {
  return (
    <div className="space-y-4">
      <p className="font-heading text-[10px] text-text-muted tracking-widest">SCORE BREAKDOWN</p>
      {ROWS.map((row, i) => {
        const d = battle.breakdown[row.key];
        const total = d.driverA + d.driverB;
        const pctA = total > 0 ? (d.driverA / total) * 100 : 50;
        const pctB = 100 - pctA;
        return (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="space-y-1.5"
          >
            <div className="flex justify-between items-center">
              <span className="font-heading text-[10px] text-text-muted tracking-widest">
                {row.label}
              </span>
              <span className="font-data text-[10px] text-text-muted">{row.pct}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-data text-xs w-8 text-right" style={{ color: colorA }}>
                {d.driverA}
              </span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5 flex">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: colorA }}
                  initial={{ width: "50%" }}
                  animate={{ width: `${pctA}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                />
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: colorB }}
                  initial={{ width: "50%" }}
                  animate={{ width: `${pctB}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                />
              </div>
              <span className="font-data text-xs w-8" style={{ color: colorB }}>
                {d.driverB}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
