"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}

