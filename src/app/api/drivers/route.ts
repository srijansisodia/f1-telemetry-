import { NextResponse } from "next/server";
import { getDriverStandings, getConstructorStandings, getAllRaceResults } from "@/services/ergast";
import { mapDrivers, mapStandings, mapConstructorStandings } from "@/services/transform";

export const revalidate = 3600;

export async function GET() {
  try {
    const [standingsData, constructorData, allRaces] = await Promise.all([
      getDriverStandings(),
      getConstructorStandings(),
      getAllRaceResults(),
    ]);

    const drivers = mapDrivers(standingsData, allRaces);
    const standings = mapStandings(standingsData);
    const constructorStandings = mapConstructorStandings(constructorData);

    return NextResponse.json({ drivers, standings, constructorStandings });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
