import { NextResponse } from "next/server";
import { getDriverStandings, getAllRaceResults } from "@/services/ergast";
import { mapDrivers } from "@/services/transform";

export const revalidate = 3600;

export async function GET(
  _req: Request,
  { params }: { params: { driverId: string } }
) {
  try {
    const [standings, allRaces] = await Promise.all([
      getDriverStandings(),
      getAllRaceResults(),
    ]);
    const drivers = mapDrivers(standings, allRaces);
    const driver = drivers.find((d) => d.id === params.driverId);
    if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    return NextResponse.json(driver);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
