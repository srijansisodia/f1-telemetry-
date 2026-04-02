import { TEAM_COLORS } from "@/lib/teamColors";
import type { Driver } from "@/types";

interface SectorLegendProps {
  drivers: Driver[];
}

export default function SectorLegend({ drivers }: SectorLegendProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {drivers.map((d) => {
        const color = TEAM_COLORS[d.teamId];
        return (
          <div key={d.id} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="font-data text-[11px] text-text-secondary">
              {d.driverCode}
            </span>
          </div>
        );
      })}
    </div>
  );
}
