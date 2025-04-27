// @ts-nocheck
"use client";

import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { DashboardHeader } from "@/components/layout/dashboard-header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div
        className={cn(
          "min-h-screen bg-white font-sans antialiased light",
          fontSans.variable
        )}
      >
        <DashboardHeader />
        <div className="flex-1">{children}</div>
        <Toaster />
      </div>
    </Providers>
  );
}
