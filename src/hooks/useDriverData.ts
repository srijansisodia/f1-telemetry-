"use client";
import { useState, useEffect } from "react";
import type { Driver, DriverStanding, ConstructorStanding } from "@/types";

interface DriversState {
  drivers: Driver[];
  standings: DriverStanding[];
  constructorStandings: ConstructorStanding[];
  loading: boolean;
  error: string | null;
}

export function useDriverData(): DriversState {
  const [state, setState] = useState<DriversState>({
    drivers: [],
    standings: [],
    constructorStandings: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/drivers");
        if (!res.ok) throw new Error(`Failed to load drivers: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setState({ ...data, loading: false, error: null });
      } catch (e) {
        if (!cancelled)
          setState((s) => ({ ...s, loading: false, error: (e as Error).message }));
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return state;
}

export function useDriver(driverId: string) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/drivers/${driverId}`);
        if (!res.ok) throw new Error(`Driver not found: ${driverId}`);
        const data = await res.json();
        if (!cancelled) { setDriver(data); setLoading(false); }
      } catch (e) {
        if (!cancelled) { setError((e as Error).message); setLoading(false); }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [driverId]);

  return { driver, loading, error };
}
