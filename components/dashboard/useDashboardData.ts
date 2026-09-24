"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getDashboardData } from "@/lib/actions/dashboard.actions";

export type DashboardData = Awaited<
  ReturnType<typeof getDashboardData>
>;

export function useDashboardData() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshDashboard = useCallback(async () => {
    try {
      setError(null);

      const dashboardData = await getDashboardData();

      if (!dashboardData) {
        router.replace("/sign-in");
        return null;
      }

      setData(dashboardData);

      return dashboardData;
    } catch (loadError) {
      console.error("DASHBOARD DATA ERROR:", loadError);

      setError(
        "We could not load your account data. Please refresh and try again.",
      );

      return null;
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);

        const dashboardData = await refreshDashboard();

        if (!isMounted) return;

        if (dashboardData) {
          setData(dashboardData);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [refreshDashboard]);

  return {
    data,
    error,
    loading,
    refreshDashboard,
  };
}