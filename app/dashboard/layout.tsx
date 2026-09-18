import type { ReactNode } from "react";
import Sidebar from "@/components/common/Sidebar";
import MobileNav from "@/components/MobileNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Desktop */}
      <div className="fixed inset-y-0 left-0 z-40 hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile */}
      <div className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900 px-4 md:hidden">
        <MobileNav />
      </div>

      {/* Content */}
      <main className="min-h-screen overflow-x-hidden md:ml-20 lg:ml-64">
        {children}
      </main>
    </div>
  );
}