import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <main className="min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}