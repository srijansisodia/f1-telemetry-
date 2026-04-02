"use client";
import { motion } from "framer-motion";
import { containerVariants } from "@/hooks/useAnimationVariants";
import StandingsRow from "./StandingsRow";
import type { Driver, DriverStanding } from "@/types";

interface StandingsTableProps {
  standings: DriverStanding[];
  drivers: Driver[];
}

export default function StandingsTable({ standings, drivers }: StandingsTableProps) {
  const maxPoints = standings[0]?.points ?? 1;
  const driverMap = Object.fromEntries(drivers.map((d) => [d.id, d]));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {standings.map((s, i) => (
        <StandingsRow
          key={s.driverId}
          standing={s}
          driver={driverMap[s.driverId]}
          maxPoints={maxPoints}
          index={i}
        />
      ))}
    </motion.div>
  );
}
