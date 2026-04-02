"use client";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Driver } from "@/types";

interface BattleRadarChartProps {
  driverA: Driver;
  driverB: Driver;
  colorA: string;
  colorB: string;
}

export default function BattleRadarChart({
  driverA,
  driverB,
  colorA,
  colorB,
}: BattleRadarChartProps) {
  const data = [
    {
      subject: "AGG",
      [driverA.driverCode]: driverA.traits.aggression,
      [driverB.driverCode]: driverB.traits.aggression,
    },
    {
      subject: "BRAKE",
      [driverA.driverCode]: driverA.traits.brakingStyle,
      [driverB.driverCode]: driverB.traits.brakingStyle,
    },
    {
      subject: "TYRE",
      [driverA.driverCode]: driverA.traits.tireManagement,
      [driverB.driverCode]: driverB.traits.tireManagement,
    },
    {
      subject: "CON",
      [driverA.driverCode]: driverA.traits.consistency,
      [driverB.driverCode]: driverB.traits.consistency,
    },
    {
      subject: "RACE",
      [driverA.driverCode]: driverA.traits.racecraft,
      [driverB.driverCode]: driverB.traits.racecraft,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="rgba(255,255,255,0.07)" gridType="polygon" />
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
          name={driverA.driverCode}
          dataKey={driverA.driverCode}
          stroke={colorA}
          fill={colorA}
          fillOpacity={0.15}
          strokeWidth={2}
          animationBegin={200}
          animationDuration={900}
        />
        <Radar
          name={driverB.driverCode}
          dataKey={driverB.driverCode}
          stroke={colorB}
          fill={colorB}
          fillOpacity={0.15}
          strokeWidth={2}
          animationBegin={300}
          animationDuration={900}
        />
        <Legend
          wrapperStyle={{
            fontSize: "10px",
            fontFamily: "var(--font-orbitron)",
            letterSpacing: "0.08em",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
