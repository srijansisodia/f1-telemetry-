import { Suspense } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeader from "@/components/layout/SectionHeader";
import DriverSelector from "@/components/battle/DriverSelector";
import BattleLayout from "@/components/battle/BattleLayout";
import CopyLinkButton from "@/components/ui/CopyLinkButton";
import { getDriverStandings, getAllRaceResults } from "@/services/ergast";
import { mapDrivers } from "@/services/transform";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Teammate Battle" };
export const revalidate = 3600;

export default async function BattlePage() {
  const [standingsData, allRaces] = await Promise.all([
    getDriverStandings(),
    getAllRaceResults(),
  ]);
  const drivers = mapDrivers(standingsData, allRaces);
  const driverMap = Object.fromEntries(drivers.map((d) => [d.id, d]));

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <SectionHeader
          title="Teammate Battle"
          subtitle="Head-to-head performance breakdown"
          accent="purple"
          right={<CopyLinkButton />}
        />

        {/* Pair selector */}
        <div className="mb-6">
          <p className="font-heading text-[10px] text-text-muted tracking-widest mb-3">
            SELECT PAIR
          </p>
          <Suspense>
            <DriverSelector />
          </Suspense>
        </div>

        {/* Battle layout (client, reads URL params) */}
        <Suspense
          fallback={
            <div className="glass-card p-8 text-center">
              <p className="text-text-muted font-data text-sm">Loading battle data...</p>
            </div>
          }
        >
          <BattleLayout driverMap={driverMap} />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
