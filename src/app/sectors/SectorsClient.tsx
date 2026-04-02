"use client";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useSectorData } from "@/hooks/useSectorData";
import SectorPanel from "@/components/sector/SectorPanel";
import LoadingPulse from "@/components/ui/LoadingPulse";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { DEFAULT_RACE_SLUG } from "@/lib/constants";
import { skeletonToContentVariants } from "@/hooks/useAnimationVariants";
import type { SectorId } from "@/types";
import { useRouter } from "next/navigation";

const RACE_OPTIONS = [
  { label: "Bahrain", slug: "bahrain" },
  { label: "Saudi Arabia", slug: "saudi" },
  { label: "Australia", slug: "australia" },
  { label: "Japan", slug: "japan" },
  { label: "China", slug: "china" },
  { label: "Miami", slug: "miami" },
  { label: "Monaco", slug: "monaco" },
  { label: "Canada", slug: "canada" },
  { label: "Spain", slug: "spain" },
  { label: "Austria", slug: "austria" },
  { label: "Silverstone", slug: "silverstone" },
  { label: "Hungary", slug: "hungary" },
];

const SECTORS: SectorId[] = ["S1", "S2", "S3"];

export default function SectorsClient() {
  const params = useSearchParams();
  const router = useRouter();
  const race = params.get("race") ?? DEFAULT_RACE_SLUG;

  const { sectors, loading, error, refetch } = useSectorData(race);

  const handleRaceChange = (slug: string) => {
    router.replace(`/sectors?race=${slug}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Race selector */}
      <div>
        <p className="font-heading text-[10px] text-text-muted tracking-widest mb-3">
          RACE
        </p>
        <div className="flex flex-wrap gap-2">
          {RACE_OPTIONS.map((r) => (
            <button
              key={r.slug}
              onClick={() => handleRaceChange(r.slug)}
              className={`px-3 py-1.5 rounded-lg font-heading text-[10px] tracking-widest transition-all border ${
                race === r.slug
                  ? "bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan"
                  : "bg-white/3 border-white/10 text-text-muted hover:border-white/20 hover:text-text-secondary"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sector panels */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            variants={skeletonToContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6">
                <LoadingPulse lines={5} height={18} />
              </div>
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            variants={skeletonToContentVariants}
            initial="hidden"
            animate="visible"
          >
            <ErrorState
              message={`Failed to load sector data: ${error}. Make sure the backend is running.`}
              onRetry={refetch}
            />
          </motion.div>
        ) : sectors.length === 0 ? (
          <motion.div
            key="empty"
            variants={skeletonToContentVariants}
            initial="hidden"
            animate="visible"
          >
            <EmptyState message="No telemetry available for this session" icon="◌" />
          </motion.div>
        ) : (
          <motion.div
            key={`${race}-content`}
            variants={skeletonToContentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {SECTORS.map((sectorId) => {
              const sectorData = sectors.filter((s) => s.sectorId === sectorId);
              if (sectorData.length === 0) return null;
              return (
                <SectorPanel key={sectorId} sectorId={sectorId} data={sectorData} />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
