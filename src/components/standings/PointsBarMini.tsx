"use client";
import { motion } from "framer-motion";

interface PointsBarMiniProps {
  points: number;
  maxPoints: number;
  color?: string;
  index?: number;
}

export default function PointsBarMini({
  points,
  maxPoints,
  color = "#8B5CF6",
  index = 0,
}: PointsBarMiniProps) {
  const pct = maxPoints > 0 ? (points / maxPoints) * 100 : 0;

  return (
    <div className="relative h-1.5 w-24 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: "0%" }}
        animate={{ width: `${pct}%` }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 15,
          delay: 0.1 + index * 0.04,
        }}
      />
    </div>
  );
}
