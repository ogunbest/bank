import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Sidebar />

      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        <Topbar />

        <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          {children}
        </div>
      </main>
    </div>
  );
}