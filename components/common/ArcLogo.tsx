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
    sm: { box: "w-8 h-8", img: 26, text: "text-base font-semibold" },
    md: { box: "w-9 h-9", img: 32, text: "text-lg font-semibold" },
    lg: { box: "w-11 h-11", img: 40, text: "text-xl font-semibold" },
    xl: { box: "w-14 h-14", img: 50, text: "text-2xl font-semibold" },
  };

  const currentSize = sizeMap[size];

  const logoIcon = (
    <div
      className={cn(
        currentSize.box,
        "rounded-lg bg-white border border-gray-200 shadow-2xs flex items-center justify-center overflow-hidden shrink-0",
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
    <div className="flex items-center gap-3">
      {logoIcon}
      <div>
        <span className={cn("text-gray-900 tracking-tight block leading-tight", currentSize.text)}>
          Arc Broadcast
        </span>
        {subtitle && (
          <span className="text-sm text-gray-500 block leading-tight mt-0.5 font-normal">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
