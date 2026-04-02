"use client";
import { motion } from "framer-motion";
import { TEAM_COLORS } from "@/lib/teamColors";
import EliteBadge from "./EliteBadge";
import FormIndicator from "./FormIndicator";
import TraitRow from "./TraitRow";
import TraitRadar from "./TraitRadar";
import NeonBadge from "@/components/ui/NeonBadge";
import { containerVariants, itemVariants } from "@/hooks/useAnimationVariants";
import type { Driver } from "@/types";

interface DriverDNACardProps {
  driver: Driver;
  compact?: boolean;
}

const TRAIT_LABELS = {
  aggression: "AGGRESSION",
  brakingStyle: "BRAKING STYLE",
  tireManagement: "TYRE MGMT",
  consistency: "CONSISTENCY",
  racecraft: "RACECRAFT",
};

export default function DriverDNACard({ driver, compact = false }: DriverDNACardProps) {
  const teamColor = TEAM_COLORS[driver.teamId];

  return (
    <motion.div
      className="glass-card overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        borderTop: `2px solid ${teamColor}`,
        boxShadow: `0 0 40px ${teamColor}18`,
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-1">
              <span className="font-data text-text-muted text-xs">#{driver.number}</span>
              <NeonBadge color={teamColor} size="sm">{driver.driverCode}</NeonBadge>
              <EliteBadge label={driver.eliteLabel} />
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="font-heading text-xl text-text-primary"
            >
              {driver.firstName}
              <br />
              <span style={{ color: teamColor }}>{driver.lastName}</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-text-secondary text-xs italic mt-1"
            >
              {driver.narrativeTag}
            </motion.p>
          </div>
          <motion.div variants={itemVariants} className="text-right">
            <FormIndicator trend={driver.formTrend} />
            <div className="font-data text-xs text-text-muted mt-1">
              {driver.nationality}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Radar + Stats */}
      <div className={compact ? "px-5 py-4" : "px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-6"}>
        {/* Radar chart */}
        <motion.div variants={itemVariants}>
          <TraitRadar traits={driver.traits} color={teamColor} />
        </motion.div>

        {/* Trait bars */}
        <motion.div variants={containerVariants} className="space-y-4">
          {(Object.keys(TRAIT_LABELS) as (keyof typeof TRAIT_LABELS)[]).map(
            (key, i) => (
              <motion.div key={key} variants={itemVariants}>
                <TraitRow
                  label={TRAIT_LABELS[key]}
                  value={driver.traits[key]}
                  delta={driver.formDelta[key]}
                  color={teamColor}
                  index={i}
                />
              </motion.div>
            )
          )}
        </motion.div>
      </div>

      {/* Footer stats */}
      {!compact && (
        <motion.div
          variants={itemVariants}
          className="px-5 py-3 border-t border-white/5 grid grid-cols-4 gap-2"
        >
          {[
            { label: "WINS", value: driver.stats.wins },
            { label: "PODIUMS", value: driver.stats.podiums },
            { label: "POLES", value: driver.stats.polePositions },
            { label: "PTS", value: driver.stats.points },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-data text-sm font-semibold" style={{ color: teamColor }}>
                {stat.value}
              </div>
              <div className="font-heading text-[9px] text-text-muted tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
