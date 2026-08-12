"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ArcLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  withText?: boolean;
  versionBadge?: string;
  subtitle?: string;
}

export function ArcLogo({
  size = "md",
  className,
  withText = false,
  versionBadge = "v1.0",
  subtitle = "Broadcast Payment",
}: ArcLogoProps) {
  const sizeMap = {
    sm: { box: "w-8 h-8", img: 28, text: "text-sm", badge: "text-[10px]" },
    md: { box: "w-10 h-10", img: 36, text: "text-base", badge: "text-xs" },
    lg: { box: "w-12 h-12", img: 44, text: "text-lg", badge: "text-xs" },
    xl: { box: "w-16 h-16", img: 60, text: "text-2xl", badge: "text-sm" },
  };

  const currentSize = sizeMap[size];

  const logoIcon = (
    <div
      className={cn(
        currentSize.box,
        "rounded-xl bg-gradient-to-tr from-arc-600 via-arc-500 to-arc-purple p-0.5 shadow-arc-glow flex items-center justify-center overflow-hidden shrink-0",
        className
      )}
    >
      <div className="w-full h-full bg-[#080B14] rounded-[10px] flex items-center justify-center overflow-hidden relative">
        <Image
          src="/images/arc-logo.png"
          alt="Arc Network Logo"
          width={currentSize.img}
          height={currentSize.img}
          className="object-cover rounded-[9px] w-full h-full"
          priority
        />
      </div>
    </div>
  );

  if (!withText) {
    return logoIcon;
  }

  return (
    <div className="flex items-center gap-3">
      {logoIcon}
      <div>
        <div className="flex items-center gap-1.5">
          <span className={cn("font-bold text-white tracking-tight", currentSize.text)}>
            Arc
          </span>
          {versionBadge && (
            <span
              className={cn(
                "px-1.5 py-0.5 rounded bg-arc-500/20 text-arc-400 border border-arc-500/30 font-medium",
                currentSize.badge
              )}
            >
              {versionBadge}
            </span>
          )}
        </div>
        {subtitle && (
          <span className="text-[11px] text-slate-400 font-medium block leading-tight">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
