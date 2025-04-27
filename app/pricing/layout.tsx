// @ts-nocheck
"use client";

import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { MainHeader } from "@/components/layout/main-header";
import { Footer } from "@/components/layout/footer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <MainHeader />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster />
      </div>
    </Providers>
  );
}
