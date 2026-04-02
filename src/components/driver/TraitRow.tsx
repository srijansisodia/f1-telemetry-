"use client";
import { motion } from "framer-motion";
import StatBar from "@/components/ui/StatBar";
import { cn } from "@/lib/utils";

interface TraitRowProps {
  label: string;
  value: number;
  delta?: number;
  color?: string;
  index?: number;
}

export default function TraitRow({
  label,
  value,
  delta,
  color = "#8B5CF6",
  index = 0,
}: TraitRowProps) {
  const hasDelta = delta !== undefined && delta !== 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-heading text-[10px] text-text-muted tracking-widest">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="font-data text-sm text-text-primary">{value}</span>
          {hasDelta && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.08 }}
              className={cn(
                "font-data text-[10px]",
                delta! > 0 ? "text-neon-green" : "text-red-400"
              )}
            >
              ({delta! > 0 ? "+" : ""}{delta})
            </motion.span>
          )}
        </div>
      </div>
      <StatBar value={value} color={color} index={index} height={4} />
    </div>
  );
}
