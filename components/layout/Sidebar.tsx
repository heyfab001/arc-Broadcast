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

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Broadcast", href: "/broadcast", icon: Send },
  { name: "Secret Pay", href: "/secret-pay", icon: KeyRound },
  { name: "Activity", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isConnected, shortAddress, balanceUSDC } = useArcWallet();

  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-white/[0.08] bg-[#0C0D12] p-4 sticky top-0 h-screen z-30 shrink-0">
      {/* Brand Header */}
      <Link href="/" className="px-2 mb-6 block">
        <ArcLogo size="md" withText />
      </Link>

      {/* Navigation */}
      <nav className="space-y-0.5 flex-1">
        {navItems.map((item) => {
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
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                isActive
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4",
                  isActive ? "text-blue-400" : "text-slate-400"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Wallet Session Indicator */}
      <div className="pt-3 border-t border-white/[0.06]">
        {isConnected ? (
          <div className="p-2.5 rounded-lg bg-[#13151D] border border-white/[0.06] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white/[0.05] flex items-center justify-center text-slate-300">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-white text-[11px] font-medium">{shortAddress}</span>
            </div>
            <span className="font-mono text-[11px] text-slate-300">{balanceUSDC} USDC</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 px-1 font-mono">
            Arc Testnet (5042002)
          </div>
        )}
      </div>
    </aside>
  );
}
