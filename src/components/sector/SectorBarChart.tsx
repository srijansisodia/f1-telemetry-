"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TEAM_COLORS } from "@/lib/teamColors";
import SectorHoverTooltip from "./SectorHoverTooltip";
import type { SectorDataPoint } from "@/types";

interface SectorBarChartProps {
  data: SectorDataPoint[];
}

export default function SectorBarChart({ data }: SectorBarChartProps) {
  // Sort by best time (fastest first)
  const sorted = [...data].sort((a, b) => a.bestTime - b.bestTime);

  const chartData = sorted.map((d) => ({
    name: d.driverCode,
    bestTime: d.bestTime,
    teamId: d.teamId,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{
            fill: "#475569",
            fontSize: 9,
            fontFamily: "var(--font-orbitron)",
          }}
          axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#475569", fontSize: 9, fontFamily: "var(--font-jetbrains-mono)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(1)}s`}
          domain={["auto", "auto"]}
          width={36}
        />
        <Tooltip
          content={<SectorHoverTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <Bar dataKey="bestTime" radius={[3, 3, 0, 0]} animationDuration={800}>
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={TEAM_COLORS[entry.teamId] ?? "#8B5CF6"}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
