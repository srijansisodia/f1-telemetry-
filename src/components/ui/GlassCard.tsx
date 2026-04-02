"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  teamColor?: string;
  hoverable?: boolean;
  onClick?: () => void;
  as?: "div" | "article" | "section";
}

export default function GlassCard({
  children,
  className,
  teamColor,
  hoverable = false,
  onClick,
}: GlassCardProps) {
  const style: CSSProperties = teamColor
    ? ({ "--team-color": teamColor } as CSSProperties)
    : {};

  return (
    <motion.div
      className={cn("glass-card", hoverable && "glass-card-hover cursor-pointer", className)}
      style={style}
      whileHover={
        hoverable
          ? {
              y: -4,
              boxShadow: teamColor
                ? `0 12px 40px ${teamColor}33, 0 0 20px ${teamColor}22`
                : "0 12px 40px rgba(139,92,246,0.25)",
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
