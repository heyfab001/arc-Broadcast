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
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Toggle & Logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <Link href="/" prefetch className="flex items-center gap-2">
            <ArcLogo size="sm" withText={false} />
            <span className="font-semibold text-base text-gray-900">
              Arc Broadcast
            </span>
          </Link>
        </div>

        {/* Desktop Left: Current Section Title */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {getPageTitle()}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500 font-medium">
            Payments on Arc
          </span>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <NetworkBadge />
          <WalletButton />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-3 space-y-1 animate-fade-in shadow-lg">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
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
