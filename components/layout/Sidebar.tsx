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
    <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white p-5 sticky top-0 h-screen z-30 shrink-0">
      {/* Brand Header */}
      <Link href="/" prefetch className="px-2 mb-8 block hover:opacity-90 transition-opacity">
        <ArcLogo size="md" withText subtitle="Payments on Arc" />
      </Link>

      {/* Main Navigation */}
      <nav className="space-y-1.5 flex-1">
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
              prefetch
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-base transition-colors duration-150",
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-blue-600" : "text-gray-400"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Creator Credit (Directly Above Settings) */}
      <div className="px-3.5 py-2.5 my-1 text-sm text-[#111827] font-medium select-none">
        <a
          href="https://x.com/cd_sh73839"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
        >
          <span>Built by HeyFab</span>
          <span className="text-gray-400">·</span>
          <span className="text-xs font-mono leading-none">𝕏</span>
        </a>
      </div>

      {/* Settings Navigation Link */}
      <div className="pt-3 mb-3 border-t border-gray-100">
        <Link
          href="/settings"
          prefetch
          className={cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-base transition-colors duration-150",
            isSettingsActive
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium"
          )}
        >
          <Settings
            className={cn(
              "w-5 h-5 shrink-0",
              isSettingsActive ? "text-blue-600" : "text-gray-400"
            )}
          />
          <span>Settings</span>
        </Link>
      </div>

      {/* Bottom Wallet Session Indicator */}
      <div className="pt-3 border-t border-gray-100">
        {isConnected ? (
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between text-[15px]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-gray-700">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="font-mono text-gray-900 text-sm font-semibold">{shortAddress}</span>
            </div>
            <span className="font-mono text-sm font-semibold text-gray-700">{balanceUSDC} USDC</span>
          </div>
        ) : (
          <div className="text-sm text-gray-500 px-1 font-mono">
            Arc Testnet (5042002)
          </div>
        )}
      </div>
    </aside>
  );
}
