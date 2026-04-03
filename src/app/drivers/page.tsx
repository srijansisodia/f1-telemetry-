import { Suspense } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeader from "@/components/layout/SectionHeader";
import DriverMiniCard from "@/components/driver/DriverMiniCard";
import SeasonPicker from "@/components/ui/SeasonPicker";
import { getDriverStandings, getAllRaceResults } from "@/services/ergast";
import { mapDrivers } from "@/services/transform";
import { containerVariants } from "@/hooks/useAnimationVariants";
import { CURRENT_SEASON } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Driver DNA" };
export const revalidate = 3600;

export default async function DriversPage({ searchParams }: { searchParams: Promise<{ season?: string }> }) {
  const { season: seasonParam } = await searchParams;
  const season = Number(seasonParam ?? CURRENT_SEASON);
  try {
    const [standingsData, allRaces] = await Promise.all([
      getDriverStandings(season),
      getAllRaceResults(season),
    ]);
    const drivers = mapDrivers(standingsData, allRaces);

    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader
              title="Driver DNA"
              subtitle={`Performance profiles — ${season} season`}
              accent="purple"
            />
            <Suspense>
              <SeasonPicker />
            </Suspense>
          </div>
          {/* Use a plain grid — containerVariants applied via motion in RSC-friendly way */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {drivers.map((driver, i) => (
              <DriverMiniCard key={driver.id} driver={driver} index={i} />
            ))}
          </div>
        </div>
      </PageWrapper>
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="glass-card p-8 text-center" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
            <p className="text-text-secondary">Failed to load driver DNA. Please try again.</p>
            <p className="text-text-muted text-xs mt-3 break-words">{message}</p>
          </div>
        </div>
      </PageWrapper>
    );
  }
}
