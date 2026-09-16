import type { ReactNode } from "react";
import Sidebar from "@/components/common/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-auto relative z-10">
        {children}
      </div>
    </div>
  );
}
