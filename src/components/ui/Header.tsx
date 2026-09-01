"use client";

import React from "react";
import { ActiveTab } from "@/lib/types";
import { Cpu, Compass, Sliders, BookOpen, BarChart3, FileText, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isLive }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "guide", label: "Guided Journey", icon: <Compass className="w-4 h-4" /> },
    { id: "interactive-lab", label: "Research Lab (Sandbox)", icon: <Sliders className="w-4 h-4" /> },
    { id: "bdh-architecture", label: "BDH & BDH-CQ Architecture", icon: <Cpu className="w-4 h-4" /> },
    { id: "benchmarks", label: "Empirical Sweeps", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "blog", label: "Research Blog", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-white/10 bg-[#0c0e14]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Track Info */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center font-mono font-bold text-white shadow-lg shadow-cyan-500/20">
              Sₜ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm tracking-wide text-white">DataForge × Pathway</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  2026 Track
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Associative Memory & Linear Recurrent Fast Weights</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    active
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Computation Status Indicator */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{isLive ? "LIVE COMPUTATION" : "PRECOMPUTED SWEEP"}</span>
            </div>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-white/5">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  active ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
