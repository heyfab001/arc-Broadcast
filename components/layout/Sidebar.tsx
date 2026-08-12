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
  Sparkles,
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
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/[0.08] bg-[#07090F]/90 backdrop-blur-2xl p-5 sticky top-0 h-screen z-30 shrink-0">
      {/* Brand Header with Real Arc Logo */}
      <Link href="/" className="px-2 mb-8 block transition-opacity hover:opacity-90">
        <ArcLogo size="md" withText versionBadge="v1.0" subtitle="Broadcast Payment" />
      </Link>

      {/* Navigation Links */}
      <div className="space-y-1.5 flex-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Menu
        </div>
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
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-gradient-to-r from-arc-600/20 to-arc-purple/10 text-white border border-arc-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <div className="flex items-center gap-3">
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
                    "text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold",
                    isActive
                      ? "bg-arc-500/30 text-arc-300"
                      : "bg-white/5 text-slate-400 group-hover:text-slate-300"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-arc-500 shadow-[0_0_8px_#3B82F6]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Ecosystem Card */}
      <div className="p-3.5 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-white">
          <Sparkles className="w-3.5 h-3.5 text-arc-cyan" />
          <span>Arc Testnet Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          High-performance settlement layer with sub-second finality.
        </p>
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Chain: 5042002</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}
