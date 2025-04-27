// @ts-nocheck
"use client";

import { usePathname } from "next/navigation";
import { MainHeader } from "@/components/layout/main-header";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { PortalHeader } from "@/components/layout/portal-header";
import { Footer } from "@/components/layout/footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine which header to show based on the current path
  const isDashboard = pathname.startsWith("/dashboard");

  // We don't need to handle portal pages here as they have their own layout
  // that doesn't include the main header

  return (
    <div className="relative flex min-h-screen flex-col">
      {isDashboard ? <DashboardHeader /> : <MainHeader />}
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
