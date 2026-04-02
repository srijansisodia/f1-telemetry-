"use client";
import { motion } from "framer-motion";
import type { BattleMetric } from "@/types";

interface BattleStatRowProps {
  metric: BattleMetric;
  colorA: string;
  colorB: string;
  index: number;
}

export default function BattleStatRow({ metric, colorA, colorB, index }: BattleStatRowProps) {
  const total = metric.driverA + metric.driverB;
  const pctA = total > 0 ? (metric.driverA / total) * 100 : 50;
  const pctB = 100 - pctA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-[10px] font-heading text-text-muted tracking-widest">
        <span>{metric.label}</span>
        <span>{Math.round(metric.weight * 100)}%</span>
      </div>
      <div className="flex items-center gap-2">
        {/* Driver A value */}
        <span className="font-data text-sm w-8 text-right" style={{ color: colorA }}>
          {metric.driverA}
        </span>
        {/* Bar */}
        <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/5 flex">
          <motion.div
            className="h-full rounded-l-full"
            style={{ backgroundColor: colorA }}
            initial={{ width: "50%" }}
            animate={{ width: `${pctA}%` }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          />
          <motion.div
            className="h-full rounded-r-full"
            style={{ backgroundColor: colorB }}
            initial={{ width: "50%" }}
            animate={{ width: `${pctB}%` }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          />
        </div>
        {/* Driver B value */}
        <span className="font-data text-sm w-8" style={{ color: colorB }}>
          {metric.driverB}
        </span>
      </div>
    </motion.div>
  );
}
