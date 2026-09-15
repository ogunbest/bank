"use client";

import { useEffect, useState } from "react";
import { getDashboardData } from "@/lib/actions/dashboard.actions";

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const dashboardData = await getDashboardData();

        if (isMounted) {
          setData(dashboardData);
          setError(null);
        }
      } catch (loadError) {
        console.error("DASHBOARD DATA ERROR:", loadError);

        if (isMounted) {
          setError("We could not load your account data. Please refresh and try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, error, loading };
}
