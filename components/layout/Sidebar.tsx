"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { ArcLogo } from "@/components/common/ArcLogo";
import {
  LayoutDashboard,
  Send,
  KeyRound,
  History,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  Send,
  KeyRound,
  History,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-white/[0.08] bg-[#07090F] p-5 sticky top-0 h-screen z-30 shrink-0">
      {/* Brand Header */}
      <Link href="/" className="px-1 mb-8 block transition-opacity hover:opacity-90">
        <ArcLogo size="md" withText subtitle="Payments on Arc" />
      </Link>

      {/* Navigation Links */}
      <div className="space-y-1 flex-1">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = iconMap[item.iconName];
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors group relative",
                isActive
                  ? "bg-arc-600/15 text-white border border-arc-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-arc-400"
                      : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-mono font-medium",
                    isActive
                      ? "bg-arc-500/20 text-arc-300"
                      : "bg-white/5 text-slate-400"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-500 font-mono">
        <span>Arc Testnet</span>
      </div>
    </aside>
  );
}
