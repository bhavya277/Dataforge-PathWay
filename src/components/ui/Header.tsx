"use client";

import React from "react";
import { ActiveMode } from "@/lib/types";
import { Sliders, Compass, BarChart3, Cpu, BookOpen } from "lucide-react";

interface HeaderProps {
  activeMode: ActiveMode;
  setActiveMode: (mode: ActiveMode) => void;
  isLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeMode, setActiveMode, isLive }) => {
  const modes: { id: ActiveMode; label: string; icon: React.ReactNode }[] = [
    { id: "lab", label: "LAB", icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: "guided", label: "GUIDED", icon: <Compass className="w-3.5 h-3.5" /> },
    { id: "stress-test", label: "STRESS TEST", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "bdh-abstraction", label: "BDH ABSTRACTION", icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: "research-notebook", label: "RESEARCH NOTEBOOK", icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="border-b border-white/[0.08] bg-[#090A0D]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand Eyebrow */}
          <div className="flex items-center space-x-3">
            <div className="font-mono text-xs font-bold px-2 py-1 rounded bg-white/5 border border-white/10 text-cyan-400">
              Sₜ
            </div>
            <div className="leading-tight">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-semibold text-white tracking-wide">
                  DATAFORGE × PATHWAY
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.2 rounded border border-white/5">
                  2026
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">Associative Memory Research Instrument</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <nav className="hidden md:flex items-center space-x-1 bg-black/40 p-1 rounded-md border border-white/[0.08]">
            {modes.map((m) => {
              const active = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                    active
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Precision Status */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{isLive ? "LIVE IN-BROWSER MATH" : "BENCHMARK DATA"}</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden overflow-x-auto py-1.5 space-x-1 border-t border-white/5">
          {modes.map((m) => {
            const active = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap ${
                  active ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400"
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
