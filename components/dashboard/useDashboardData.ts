"use client";

import { useEffect, useState, useCallback } from "react";
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
      const dashboardData = await getDashboardData();

      if (!dashboardData) {
        router.replace("/sign-in");
        return;
      }

      setData(dashboardData);
      setError(null);
    } catch (loadError) {
      console.error("DASHBOARD DATA ERROR:", loadError);

      setError(
        "We could not load your account data. Please refresh and try again."
      );
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const dashboardData = await getDashboardData();

        if (!dashboardData) {
          router.replace("/sign-in");
          return;
        }

        if (isMounted) {
          setData(dashboardData);
          setError(null);
        }
      } catch (loadError) {
        console.error("DASHBOARD DATA ERROR:", loadError);

        if (isMounted) {
          setError(
            "We could not load your account data. Please refresh and try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return {
    data,
    error,
    loading,
    refreshDashboard,
  };
}