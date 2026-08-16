"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArcLogo } from "@/components/common/ArcLogo";
import { useArcWallet } from "@/hooks/useArcWallet";
import {
  LayoutDashboard,
  Send,
  KeyRound,
  History,
  Settings,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Broadcast", href: "/broadcast", icon: Send },
  { name: "Secret Pay", href: "/secret-pay", icon: KeyRound },
  { name: "Activity", href: "/history", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isConnected, shortAddress, balanceUSDC } = useArcWallet();

  const isSettingsActive = pathname.startsWith("/settings");

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/[0.08] bg-[#0C0D12] p-5 sticky top-0 h-screen z-30 shrink-0">
      {/* Brand Header */}
      <Link href="/" className="px-2 mb-8 block hover:opacity-90 transition-opacity">
        <ArcLogo size="md" withText />
      </Link>

      {/* Main Navigation */}
      <nav className="space-y-1 flex-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[15px] font-medium transition-colors duration-150",
                isActive
                  ? "bg-white/[0.09] text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-blue-400" : "text-slate-400"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Navigation Link */}
      <div className="pt-3 mb-4 border-t border-white/[0.06]">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[15px] font-medium transition-colors duration-150",
            isSettingsActive
              ? "bg-white/[0.09] text-white"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          )}
        >
          <Settings
            className={cn(
              "w-5 h-5 shrink-0",
              isSettingsActive ? "text-blue-400" : "text-slate-400"
            )}
          />
          <span>Settings</span>
        </Link>
      </div>

      {/* Bottom Wallet Session Indicator */}
      <div className="pt-3 border-t border-white/[0.06]">
        {isConnected ? (
          <div className="p-3 rounded-lg bg-[#141722] border border-white/[0.08] flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white/[0.06] flex items-center justify-center text-slate-300">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="font-mono text-white text-xs sm:text-sm font-medium">{shortAddress}</span>
            </div>
            <span className="font-mono text-xs sm:text-sm text-slate-300">{balanceUSDC} USDC</span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 px-1 font-mono">
            Arc Testnet (5042002)
          </div>
        )}
      </div>
    </aside>
  );
}
