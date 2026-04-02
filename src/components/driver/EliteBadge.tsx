"use client";
import { motion } from "framer-motion";
import type { EliteLabel } from "@/types";

interface EliteBadgeProps {
  label: EliteLabel;
}

const BADGE_COLORS: Record<NonNullable<EliteLabel>, { bg: string; border: string; text: string }> = {
  "WORLD CHAMPION": { bg: "rgba(255,215,0,0.12)", border: "rgba(255,215,0,0.4)", text: "#FFD700" },
  "POINTS LEADER": { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.4)", text: "#8B5CF6" },
  "FASTEST QUALIFIER": { bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.4)", text: "#06B6D4" },
  "TIRE WHISPERER": { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.4)", text: "#10B981" },
  "COMEBACK KING": { bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.4)", text: "#EC4899" },
};

export default function EliteBadge({ label }: EliteBadgeProps) {
  if (!label) return null;
  const colors = BADGE_COLORS[label];

  return (
    <motion.span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full font-heading text-[10px] tracking-widest"
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
      animate={{ boxShadow: [`0 0 8px ${colors.text}44`, `0 0 16px ${colors.text}66`, `0 0 8px ${colors.text}44`] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {label}
    </motion.span>
  );
}
