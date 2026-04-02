"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { TEAM_COLORS } from "@/lib/teamColors";
import EliteBadge from "./EliteBadge";
import FormIndicator from "./FormIndicator";
import StatBar from "@/components/ui/StatBar";
import { itemVariants } from "@/hooks/useAnimationVariants";
import type { Driver } from "@/types";

interface DriverMiniCardProps {
  driver: Driver;
  index: number;
}

export default function DriverMiniCard({ driver, index }: DriverMiniCardProps) {
  const teamColor = TEAM_COLORS[driver.teamId];

  return (
    <motion.div variants={itemVariants} custom={index}>
      <Link href={`/drivers/${driver.id}`}>
        <motion.div
          className="glass-card p-4 cursor-pointer"
          whileHover={{
            y: -4,
            boxShadow: `0 12px 40px ${teamColor}33`,
            borderColor: `${teamColor}44`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ borderTop: `2px solid ${teamColor}` }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-data text-xs text-text-muted">#{driver.number}</span>
                <span
                  className="font-heading text-[10px] tracking-widest"
                  style={{ color: teamColor }}
                >
                  {driver.driverCode}
                </span>
              </div>
              <p className="text-text-primary text-sm font-medium leading-tight">
                {driver.firstName}{" "}
                <span className="font-semibold">{driver.lastName}</span>
              </p>
            </div>
            <FormIndicator trend={driver.formTrend} />
          </div>

          {/* Elite badge */}
          {driver.eliteLabel && (
            <div className="mb-3">
              <EliteBadge label={driver.eliteLabel} />
            </div>
          )}

          {/* Key traits */}
          <div className="space-y-2">
            {(["consistency", "racecraft"] as const).map((key, i) => (
              <div key={key} className="flex items-center gap-2">
                <span className="font-heading text-[9px] text-text-muted w-12 flex-shrink-0 tracking-wider">
                  {key === "consistency" ? "CON" : "RACE"}
                </span>
                <StatBar
                  value={driver.traits[key]}
                  color={teamColor}
                  index={i}
                  height={3}
                  className="flex-1"
                />
                <span className="font-data text-xs text-text-secondary w-6 text-right">
                  {driver.traits[key]}
                </span>
              </div>
            ))}
          </div>

          {/* Points */}
          <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
            <span className="font-data text-xs text-text-muted">{driver.stats.points} pts</span>
            <span className="font-data text-xs text-text-muted">{driver.stats.wins}W</span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
