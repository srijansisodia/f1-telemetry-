import { notFound } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import DriverDNACard from "@/components/driver/DriverDNACard";
import { getDriverStandings, getAllRaceResults } from "@/services/ergast";
import { mapDrivers } from "@/services/transform";
import { TEAM_COLORS } from "@/lib/teamColors";
import type { Metadata } from "next";

interface Props {
  params: { driverId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.driverId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export const revalidate = 3600;

export default async function DriverDetailPage({ params }: Props) {
  try {
    const [standingsData, allRaces] = await Promise.all([
      getDriverStandings(),
      getAllRaceResults(),
    ]);
    const drivers = mapDrivers(standingsData, allRaces);
    const driver = drivers.find((d) => d.id === params.driverId);

    if (!driver) notFound();

    const teamColor = TEAM_COLORS[driver.teamId];

    return (
      <PageWrapper>
        {/* Team color aura on background */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${teamColor}0D 0%, transparent 60%)`,
          }}
        />
        <div className="max-w-3xl mx-auto px-6 py-10 relative z-10">
          <DriverDNACard driver={driver} />
        </div>
      </PageWrapper>
    );
  } catch {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="glass-card p-8 text-center" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
            <p className="text-text-secondary">Failed to load driver data. Please try again.</p>
          </div>
        </div>
      </PageWrapper>
    );
  }
}
