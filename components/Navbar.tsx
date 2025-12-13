"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CryptoPriceDisplay } from "./CryptoPriceDisplay";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create Intent" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/activity", label: "Activity" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <Sparkles className="w-6 h-6 text-primary-400 group-hover:text-primary-300 transition-colors" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              POIA
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-300",
                  pathname === item.href
                    ? "text-primary-400"
                    : "text-gray-300"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:block">
              <CryptoPriceDisplay symbols={["ETH", "MATIC"]} showChange={false} />
            </div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

