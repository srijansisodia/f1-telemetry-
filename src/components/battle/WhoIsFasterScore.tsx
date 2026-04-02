"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { BattleScore } from "@/types";

interface WhoIsFasterScoreProps {
  battle: BattleScore;
  colorA: string;
  colorB: string;
  nameA: string;
  nameB: string;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0);
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

export default function WhoIsFasterScore({
  battle,
  colorA,
  colorB,
  nameA,
  nameB,
}: WhoIsFasterScoreProps) {
  const scoreA = useCountUp(battle.driverAScore);
  const scoreB = useCountUp(battle.driverBScore);
  const winnerIsA = battle.driverAScore >= battle.driverBScore;

  return (
    <div className="flex items-center justify-center gap-6">
      {/* Driver A score */}
      <div className="text-center">
        <motion.div
          className="font-heading text-5xl font-black"
          style={{
            color: colorA,
            textShadow: winnerIsA ? `0 0 20px ${colorA}88` : "none",
          }}
          animate={{ scale: winnerIsA ? [1, 1.04, 1] : 1 }}
          transition={{ duration: 0.4, delay: 1.3 }}
        >
          {scoreA}
        </motion.div>
        <div className="font-heading text-[10px] text-text-muted tracking-widest mt-1">
          {nameA}
        </div>
        {winnerIsA && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="font-heading text-[9px] tracking-widest mt-1"
            style={{ color: colorA }}
          >
            ▲ FASTER
          </motion.div>
        )}
      </div>

      {/* Divider */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-px h-8 bg-white/10" />
        <span className="font-heading text-xs text-text-muted">VS</span>
        <div className="w-px h-8 bg-white/10" />
      </div>

      {/* Driver B score */}
      <div className="text-center">
        <motion.div
          className="font-heading text-5xl font-black"
          style={{
            color: colorB,
            textShadow: !winnerIsA ? `0 0 20px ${colorB}88` : "none",
          }}
          animate={{ scale: !winnerIsA ? [1, 1.04, 1] : 1 }}
          transition={{ duration: 0.4, delay: 1.3 }}
        >
          {scoreB}
        </motion.div>
        <div className="font-heading text-[10px] text-text-muted tracking-widest mt-1">
          {nameB}
        </div>
        {!winnerIsA && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="font-heading text-[9px] tracking-widest mt-1"
            style={{ color: colorB }}
          >
            ▲ FASTER
          </motion.div>
        )}
      </div>
    </div>
  );
}
