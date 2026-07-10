"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* TopNavBar */}
      <header 
        className="bg-surface/60 backdrop-blur-xl font-display-lg text-display-lg font-headline-md text-headline-md font-label-caps text-label-caps top-0 shadow-[0_0_15px_rgba(34,211,238,0.2)] flex justify-between items-center w-full px-margin-safe h-16 z-50 fixed border-b-0 border-transparent pb-0 mb-0" 
        style={{ borderBottom: "1px solid transparent", boxShadow: "0 4px 15px -3px rgba(34,211,238,0.1)" }}
      >
        {/* Brand */}
        <div className="font-display-lg text-headline-md tracking-[0.2em] text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
          AETHER[OS]
        </div>
        {/* Trailing Actions (Web only) */}
        <div className="hidden md:flex items-center gap-unit">
          <button className="p-2 text-outline hover:text-primary-container transition-all duration-300 hover:scale-95 active:scale-95 opacity-80 rounded-full" title="Profile">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          <button className="p-2 text-outline hover:text-primary-container transition-all duration-300 hover:scale-95 active:scale-95 opacity-80 rounded-full" title="Achievements">
            <span className="material-symbols-outlined">military_tech</span>
          </button>
          <button className="p-2 text-outline hover:text-primary-container transition-all duration-300 hover:scale-95 active:scale-95 opacity-80 rounded-full" title="Power">
            <span className="material-symbols-outlined">electric_bolt</span>
          </button>
          <button className="p-2 text-outline hover:text-primary-container transition-all duration-300 hover:scale-95 active:scale-95 opacity-80 rounded-full" title="Data Sync">
            <span className="material-symbols-outlined">database</span>
          </button>
        </div>
      </header>

      {/* SideNavBar (Web only) */}
      <Sidebar />

      {/* Main Content Canvas */}
      <main className="pt-[96px] pb-[100px] md:pb-margin-safe px-gutter md:pl-[112px] md:pr-margin-safe max-w-7xl mx-auto flex flex-col gap-gutter">
        {children}
      </main>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <MobileNav />
    </div>
  );
}
