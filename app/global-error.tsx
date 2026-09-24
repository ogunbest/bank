"use client";

import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
        <main className="flex min-h-screen items-center justify-center px-5 py-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertTriangle size={30} />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#0F766E]">
                Covenant Banking
              </p>

              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                Something went wrong
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                An unexpected error occurred while loading this page.
                Please try again.
              </p>

              <button
                type="button"
                onClick={() => reset()}
                className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#115E59] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
              >
                <RefreshCw size={17} />
                Try again
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              If the problem continues, please try again later.
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}