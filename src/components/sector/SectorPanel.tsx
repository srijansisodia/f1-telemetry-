"use client";
import SectorBarChart from "./SectorBarChart";
import ClutchScoreCard from "./ClutchScoreCard";
import SectorInsightCard from "./SectorInsightCard";
import type { SectorDataPoint, SectorId } from "@/types";

interface SectorPanelProps {
  sectorId: SectorId;
  data: SectorDataPoint[];
}

export default function SectorPanel({ sectorId, data }: SectorPanelProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 pt-4 pb-2 border-b border-white/5">
        <p className="font-heading text-xs text-text-primary tracking-widest">
          SECTOR{" "}
          <span className="text-neon-cyan">{sectorId.replace("S", "")}</span>
        </p>
      </div>

      {/* Insight */}
      <div className="px-4 pt-4">
        <SectorInsightCard sectorData={data} sectorId={sectorId} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Bar chart */}
        <div className="md:col-span-2 px-4 py-4">
          <SectorBarChart data={data} />
        </div>

        {/* Clutch scores */}
        <div className="px-4 py-4 border-t md:border-t-0 md:border-l border-white/5">
          <ClutchScoreCard data={data} />
        </div>
      </div>
    </div>
  );
}
