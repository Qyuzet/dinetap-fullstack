// @ts-nocheck
"use client";

import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function PortalLayout({
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
        {children}
        <Toaster />
      </div>
    </Providers>
  );
}
