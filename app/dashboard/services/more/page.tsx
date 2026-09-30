"use client";

import { ArrowLeft, Grid2X2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MoreServicesPage() {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 text-slate-900 transition-colors dark:text-white">
      <header className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-[#0F766E] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-teal-800 dark:hover:bg-teal-950/40 dark:hover:text-teal-400"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <p className="text-sm font-medium text-[#0F766E] dark:text-teal-400">
            Services
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            More Services
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Explore more services available on Covenant.
          </p>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
          <Grid2X2 size={26} />
        </div>

        <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
          More services
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Additional payment and account services will appear here.
        </p>
      </section>
    </div>
  );
}