"use client";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { DriverTraits } from "@/types";

interface TraitRadarProps {
  traits: DriverTraits;
  color?: string;
}

export default function TraitRadar({ traits, color = "#8B5CF6" }: TraitRadarProps) {
  const data = [
    { subject: "AGG", value: traits.aggression, fullMark: 100 },
    { subject: "BRAKE", value: traits.brakingStyle, fullMark: 100 },
    { subject: "TYRE", value: traits.tireManagement, fullMark: 100 },
    { subject: "CON", value: traits.consistency, fullMark: 100 },
    { subject: "RACE", value: traits.racecraft, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid
          stroke="rgba(255,255,255,0.07)"
          gridType="polygon"
        />
        <PolarAngleAxis
          dataKey="subject"
          tick={{
            fill: "#475569",
            fontSize: 9,
            fontFamily: "var(--font-orbitron)",
            letterSpacing: "0.08em",
          }}
        />
        <Radar
          name="traits"
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.15}
          strokeWidth={2}
          dot={{ fill: color, r: 3 }}
          animationBegin={200}
          animationDuration={1000}
          animationEasing="ease-out"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
