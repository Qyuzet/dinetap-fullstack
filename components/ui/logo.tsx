// @ts-nocheck
"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  textClassName?: string;
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}

export function Logo({
  className,
  textClassName,
  variant = "default",
  size = "md",
  withText = true,
}: LogoProps) {
  // Size mappings
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  // Text size mappings
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  // Color mappings
  const colorClasses = {
    default: "text-indigo-600",
    light: "text-white",
    dark: "text-indigo-800",
  };

  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-full w-full", colorClasses[variant])}
        >
          {/* Simple plate icon */}
          <circle
            cx="32"
            cy="32"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
            fill="currentColor"
            fillOpacity="0.05"
          />

          {/* Stylized D for Dinetap */}
          <path
            d="M24 20H32C36.4183 20 40 23.5817 40 28V36C40 40.4183 36.4183 44 32 44H24V20Z"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />

          {/* Simple fork lines */}
          <path
            d="M36 26L36 38"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {withText && (
        <span
          className={cn(
            "font-bold tracking-tight",
            textSizeClasses[size],
            colorClasses[variant],
            textClassName
          )}
        >
          Dinetap AI
        </span>
      )}
    </Link>
  );
}
