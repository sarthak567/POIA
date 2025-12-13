"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { WelcomeBanner } from "./WelcomeBanner";
import { NetworkStatus } from "./NetworkStatus";

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <WelcomeBanner />
      <NetworkStatus />
      <main className="pt-16">{children}</main>
    </div>
  );
}

