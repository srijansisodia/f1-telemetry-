"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatBarProps {
  value: number;
  max?: number;
  color?: string;
  index?: number;
  className?: string;
  height?: number;
}

export default function StatBar({
  value,
  max = 100,
  color = "#8B5CF6",
  index = 0,
  className,
  height = 4,
}: StatBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn("relative rounded-full overflow-hidden bg-white/5", className)}
      style={{ height }}
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: "0%" }}
        animate={{ width: `${pct}%` }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 18,
          delay: index * 0.08,
        }}
      />
      {/* Shine */}
      <div
        className="absolute inset-y-0 left-0 right-0 rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
