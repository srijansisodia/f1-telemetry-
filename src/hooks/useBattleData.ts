"use client";
import { useState, useEffect } from "react";
import type { BattleScore } from "@/types";
import { getBattleMetrics } from "@/services/fastf1";
import { CURRENT_SEASON } from "@/lib/constants";
import { computeBattleScore } from "@/lib/battleScore";

interface BattleState {
  battle: BattleScore | null;
  loading: boolean;
  error: string | null;
}

export function useBattleData(driverA: string, driverB: string): BattleState & { refetch: () => void } {
  const [state, setState] = useState<BattleState>({
    battle: null,
    loading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!driverA || !driverB) return;
    let cancelled = false;
    setState({ battle: null, loading: true, error: null });

    async function load() {
      try {
        const data = await getBattleMetrics(driverA, driverB, CURRENT_SEASON);
        if (!cancelled) setState({ battle: data, loading: false, error: null });
      } catch (e) {
        // Fallback: build a score from Ergast standings if FastF1 backend is down
        if (!cancelled) {
          try {
            const res = await fetch("/api/battle?" + new URLSearchParams({ d1: driverA, d2: driverB }));
            if (res.ok) {
              const data = await res.json();
              setState({ battle: data, loading: false, error: null });
            } else {
              setState({ battle: null, loading: false, error: (e as Error).message });
            }
          } catch {
            setState({ battle: null, loading: false, error: (e as Error).message });
          }
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [driverA, driverB, tick]);

  return { ...state, refetch: () => setTick((t) => t + 1) };
}
