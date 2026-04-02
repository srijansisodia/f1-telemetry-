"use client";
import { useState, useEffect } from "react";
import type { SectorDataPoint } from "@/types";
import { getSectorData } from "@/services/fastf1";
import { CURRENT_SEASON } from "@/lib/constants";

interface SectorState {
  sectors: SectorDataPoint[];
  loading: boolean;
  error: string | null;
}

export function useSectorData(race: string): SectorState & { refetch: () => void } {
  const [state, setState] = useState<SectorState>({
    sectors: [],
    loading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!race) return;
    let cancelled = false;
    setState({ sectors: [], loading: true, error: null });

    async function load() {
      try {
        const data = await getSectorData(CURRENT_SEASON, race);
        if (!cancelled) setState({ sectors: data, loading: false, error: null });
      } catch (e) {
        if (!cancelled) setState({ sectors: [], loading: false, error: (e as Error).message });
      }
    }
    load();
    return () => { cancelled = true; };
  }, [race, tick]);

  return { ...state, refetch: () => setTick((t) => t + 1) };
}
