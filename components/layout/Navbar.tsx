"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";
import { WalletButton } from "@/components/wallet/WalletButton";
import { ArcLogo } from "@/components/common/ArcLogo";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/" },
  { name: "Broadcast", href: "/broadcast" },
  { name: "Secret Pay", href: "/secret-pay" },
  { name: "Activity", href: "/history" },
  { name: "Settings", href: "/settings" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/") return "Overview";
    if (pathname.startsWith("/broadcast")) return "Broadcast";
    if (pathname.startsWith("/secret-pay")) return "Secret Pay";
    if (pathname.startsWith("/history")) return "Activity";
    if (pathname.startsWith("/settings")) return "Settings";
    if (pathname.startsWith("/claim")) return "Claim";
    return "Arc Broadcast";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0C0D12]">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Toggle & Logo */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <ArcLogo size="sm" withText={false} />
            <span className="font-semibold text-xs text-white">
              Arc Broadcast
            </span>
          </Link>
        </div>

        {/* Desktop Left: Current Page Title */}
        <div className="hidden lg:block">
          <span className="text-xs font-semibold text-slate-300">
            {getPageTitle()}
          </span>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2.5">
          <NetworkBadge />
          <WalletButton />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-[#10121A] px-4 py-3 space-y-1 animate-fade-in">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
