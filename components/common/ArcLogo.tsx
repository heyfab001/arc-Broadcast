"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ArcLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  withText?: boolean;
  subtitle?: string;
}

export function ArcLogo({
  size = "md",
  className,
  withText = false,
  subtitle,
}: ArcLogoProps) {
  const sizeMap = {
    sm: { box: "w-7 h-7", img: 24, text: "text-sm font-semibold" },
    md: { box: "w-8 h-8", img: 30, text: "text-base font-semibold" },
    lg: { box: "w-10 h-10", img: 36, text: "text-lg font-semibold" },
    xl: { box: "w-12 h-12", img: 44, text: "text-xl font-semibold" },
  };

  const currentSize = sizeMap[size];

  const logoIcon = (
    <div
      className={cn(
        currentSize.box,
        "rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0",
        className
      )}
    >
      <Image
        src="/images/arc-logo.png"
        alt="Arc Logo"
        width={currentSize.img}
        height={currentSize.img}
        className="object-cover rounded-md"
        priority
      />
    </div>
  );

  if (!withText) {
    return logoIcon;
  }

  return (
    <div className="flex items-center gap-2.5">
      {logoIcon}
      <div>
        <span className={cn("text-gray-900 tracking-tight block leading-tight", currentSize.text)}>
          Arc Broadcast
        </span>
        {subtitle && (
          <span className="text-xs text-gray-500 block leading-tight mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
