"use client";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { TEAM_COLORS } from "@/lib/teamColors";
import { useBattleData } from "@/hooks/useBattleData";
import WhoIsFasterScore from "./WhoIsFasterScore";
import BattleScoreBreakdown from "./BattleScoreBreakdown";
import BattleStatRow from "./BattleStatRow";
import BattleRadarChart from "./BattleRadarChart";
import LoadingPulse from "@/components/ui/LoadingPulse";
import ErrorState from "@/components/ui/ErrorState";
import PressureGauge from "@/components/ui/PressureGauge";
import TraitRow from "@/components/driver/TraitRow";
import EliteBadge from "@/components/driver/EliteBadge";
import NeonBadge from "@/components/ui/NeonBadge";
import { morphVariants, skeletonToContentVariants } from "@/hooks/useAnimationVariants";
import type { Driver } from "@/types";

interface BattleLayoutProps {
  driverMap: Record<string, Driver>;
}

export default function BattleLayout({ driverMap }: BattleLayoutProps) {
  const params = useSearchParams();
  const d1 = params.get("d1") ?? "VER";
  const d2 = params.get("d2") ?? "PER";

  const { battle, loading, error, refetch } = useBattleData(d1, d2);

  const driverA = Object.values(driverMap).find((d) => d.driverCode === d1);
  const driverB = Object.values(driverMap).find((d) => d.driverCode === d2);

  const colorA = driverA ? TEAM_COLORS[driverA.teamId] : "#8B5CF6";
  const colorB = driverB ? TEAM_COLORS[driverB.teamId] : "#06B6D4";

  const renderDriverPanel = (driver: Driver | undefined, code: string, side: "left" | "right") => {
    if (!driver) return (
      <div className="glass-card p-5 flex-1">
        <p className="text-text-muted text-sm text-center">{code}</p>
      </div>
    );
    const color = TEAM_COLORS[driver.teamId];
    return (
      <div
        className="glass-card p-5 flex-1"
        style={{
          borderTop: `2px solid ${color}`,
          boxShadow: `0 0 30px ${color}12`,
        }}
      >
        <div className={`flex items-start gap-2 mb-3 ${side === "right" ? "flex-row-reverse text-right" : ""}`}>
          <div>
            <div className={`flex items-center gap-1.5 mb-0.5 ${side === "right" ? "justify-end" : ""}`}>
              <NeonBadge color={color} size="sm">{driver.driverCode}</NeonBadge>
              <EliteBadge label={driver.eliteLabel} />
            </div>
            <p className="font-heading text-base text-text-primary">
              {driver.firstName} <span style={{ color }}>{driver.lastName}</span>
            </p>
            <p className="text-text-secondary text-xs italic mt-0.5">{driver.narrativeTag}</p>
          </div>
        </div>
        <div className="space-y-3 mt-4">
          {(["aggression", "consistency", "racecraft"] as const).map((key, i) => (
            <TraitRow
              key={key}
              label={key.toUpperCase().slice(0, 5)}
              value={driver.traits[key]}
              delta={driver.formDelta[key]}
              color={color}
              index={i}
            />
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/5">
          <PressureGauge
            value={driver.stats.strategyScore}
            color={color}
            size={72}
            label="STRATEGY"
          />
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${d1}-${d2}`}
        variants={morphVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-6"
      >
        {/* Driver panels */}
        <div className="flex gap-4 items-stretch">
          {renderDriverPanel(driverA, d1, "left")}

          {/* Center glowing divider */}
          <div className="flex flex-col items-center justify-center gap-2 px-2 flex-shrink-0">
            <div className="w-px flex-1" style={{ background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.4), transparent)" }} />
            <span className="font-heading text-xs text-text-muted">VS</span>
            <div className="w-px flex-1" style={{ background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.4), transparent)" }} />
          </div>

          {renderDriverPanel(driverB, d2, "right")}
        </div>

        {/* Score card */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" variants={skeletonToContentVariants} initial="hidden" animate="visible" exit="exit">
              <div className="glass-card p-6"><LoadingPulse lines={4} height={20} /></div>
            </motion.div>
          ) : error ? (
            <motion.div key="error" variants={skeletonToContentVariants} initial="hidden" animate="visible">
              <ErrorState message={error} onRetry={refetch} />
            </motion.div>
          ) : battle ? (
            <motion.div key="content" variants={skeletonToContentVariants} initial="hidden" animate="visible">
              <div className="glass-card p-6 space-y-6">
                {/* Who is faster */}
                <WhoIsFasterScore
                  battle={battle}
                  colorA={colorA}
                  colorB={colorB}
                  nameA={d1}
                  nameB={d2}
                />

                <div className="h-px bg-white/5" />

                {/* Metrics */}
                <div className="space-y-4">
                  {battle.metrics.map((m, i) => (
                    <BattleStatRow
                      key={m.label}
                      metric={m}
                      colorA={colorA}
                      colorB={colorB}
                      index={i}
                    />
                  ))}
                </div>

                <div className="h-px bg-white/5" />

                {/* Breakdown */}
                <BattleScoreBreakdown battle={battle} colorA={colorA} colorB={colorB} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Radar chart */}
        {driverA && driverB && (
          <div className="glass-card p-5">
            <p className="font-heading text-[10px] text-text-muted tracking-widest mb-4">
              DNA COMPARISON
            </p>
            <BattleRadarChart
              driverA={driverA}
              driverB={driverB}
              colorA={colorA}
              colorB={colorB}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
