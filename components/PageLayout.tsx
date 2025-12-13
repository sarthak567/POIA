"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { WelcomeBanner } from "./WelcomeBanner";
import { NetworkStatus } from "./NetworkStatus";
import { Footer } from "./Footer";

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <WelcomeBanner />
      <NetworkStatus />
      <main className="pt-16 flex-1">{children}</main>
      <Footer />
    </div>
  );
}

