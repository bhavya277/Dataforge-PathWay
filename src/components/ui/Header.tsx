"use client";

import React from "react";
import { ActiveMode } from "@/lib/types";

interface HeaderProps {
  activeMode: ActiveMode;
  setActiveMode: (mode: ActiveMode) => void;
  isLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  setActiveMode,
  isLive = true,
}) => {
  const navItems: { id: ActiveMode; label: string; mobileLabel: string }[] = [
    { id: "lab", label: "LEARNING JOURNEY", mobileLabel: "JOURNEY" },
    { id: "guided", label: "GUIDED REPLAY", mobileLabel: "REPLAY" },
    { id: "research-notebook", label: "RESEARCH NOTES", mobileLabel: "NOTES" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F7F7F4]/95 backdrop-blur-sm border-b border-[#D9DCE1]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2">
        {/* Brand & Lab Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            onClick={() => setActiveMode("lab")}
            className="text-left group"
          >
            <div className="text-[11px] sm:text-xs font-bold tracking-tight text-[#111318] uppercase">
              DATAFORGE × PATHWAY
            </div>
            <div className="text-[9px] sm:text-[10px] text-[#626873] tracking-wider sm:tracking-widest uppercase -mt-0.5">
              ASSOCIATIVE MEMORY
            </div>
          </button>
        </div>

        {/* Clean Editorial Navigation Tabs */}
        <nav className="flex items-center space-x-2 sm:space-x-6">
          {navItems.map((item) => {
            const isActive = activeMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMode(item.id)}
                className={`py-1 px-1 sm:px-0 text-[11px] sm:text-xs font-semibold tracking-wider transition-colors relative whitespace-nowrap ${
                  isActive
                    ? "text-[#111318]"
                    : "text-[#626873] hover:text-[#111318]"
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.mobileLabel}</span>
                {isActive && (
                  <span className="absolute bottom-[-16px] left-0 right-0 h-[2px] bg-[#111318]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Computation Badge */}
        <div className="hidden md:flex items-center space-x-1.5 text-[11px] font-mono text-[#626873] shrink-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-pulse" />
          <span className="tracking-wide uppercase text-[10px]">COMPUTATION LIVE</span>
        </div>
      </div>
    </header>
  );
};
