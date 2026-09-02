"use client";

import React from "react";
import { ActiveMode } from "@/lib/types";

interface HeaderProps {
  activeMode: ActiveMode;
  setActiveMode: (mode: ActiveMode) => void;
  isLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeMode, setActiveMode, isLive }) => {
  const modes: { id: ActiveMode; label: string; num: string }[] = [
    { id: "lab", label: "LAB INSTRUMENT", num: "01" },
    { id: "guided", label: "GUIDED DISCOVERY", num: "02" },
    { id: "stress-test", label: "STRESS TEST", num: "03" },
    { id: "bdh-abstraction", label: "BDH CONNECTION", num: "04" },
    { id: "research-notebook", label: "RESEARCH NOTEBOOK", num: "05" },
  ];

  return (
    <header className="border-b border-white/[0.08] bg-[#08090C]/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Technical Eyebrow */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-7 h-7 bg-white/5 border border-white/10 text-cyan-400 font-mono text-xs font-bold">
              Sₜ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold tracking-wider text-white uppercase">
                  DATAFORGE × PATHWAY
                </span>
                <span className="text-[10px] font-mono text-slate-400 border-l border-white/10 pl-2">
                  2026 HACKATHON
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Linear Fast-Weight Recurrence Lab
              </div>
            </div>
          </div>

          {/* Editorial Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {modes.map((m) => {
              const active = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id)}
                  className={`text-xs font-mono transition-colors relative py-1 flex items-center space-x-1.5 ${
                    active
                      ? "text-cyan-300 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-[10px] text-slate-400">{m.num}</span>
                  <span>{m.label}</span>
                  {active && (
                    <span className="absolute bottom-[-14px] left-0 right-0 h-[2px] bg-cyan-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Engine Status */}
          <div className="flex items-center space-x-2 text-[10px] font-mono">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300">
              {isLive ? "LIVE CLIENT MATH (<5ms)" : "READY"}
            </span>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto space-x-4 py-2 border-t border-white/5 text-[11px] font-mono">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`whitespace-nowrap pb-1 ${
                activeMode === m.id
                  ? "text-cyan-300 font-bold border-b-2 border-cyan-400"
                  : "text-slate-400"
              }`}
            >
              {m.num} {m.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
