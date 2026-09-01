"use client";

import React from "react";
import { PRESETS } from "@/lib/presets";
import { Sliders, RotateCcw, Sparkles, ShieldCheck } from "lucide-react";

interface ControlPanelProps {
  d: number;
  setD: (d: number) => void;
  N: number;
  setN: (n: number) => void;
  correlation: number;
  setCorrelation: (c: number) => void;
  decay: number;
  setDecay: (decay: number) => void;
  useBDH: boolean;
  setUseBDH: (bdh: boolean) => void;
  selectedPresetId: string | null;
  onSelectPreset: (presetId: string) => void;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  d,
  setD,
  N,
  setN,
  correlation,
  setCorrelation,
  decay,
  setDecay,
  useBDH,
  setUseBDH,
  selectedPresetId,
  onSelectPreset,
  onReset,
}) => {
  return (
    <div className="bg-[#11141B] border border-white/10 rounded-xl p-5 shadow-xl space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Learner Control Variables</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 4 Scientific Presets */}
      <div>
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
          1-Click Empirical Presets
        </span>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                className={`text-left p-2.5 rounded-lg border text-xs font-mono transition-all ${
                  isSelected
                    ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 ring-1 ring-cyan-500/30"
                    : "bg-black/30 border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="font-semibold text-slate-100">{preset.title.split("—")[1] || preset.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{preset.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders & Variables */}
      <div className="space-y-4 font-mono text-xs">
        {/* Variable 1: Key Correlation rho */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 flex items-center space-x-1">
              <span className="font-bold text-amber-400">ρ (Key Correlation)</span>
              <span className="text-slate-500">[{correlation.toFixed(2)}]</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {correlation === 0 ? "Orthogonal (No Bleed)" : correlation < 0.5 ? "Partial Bleed" : "High Cross-Talk"}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.95"
            step="0.05"
            value={correlation}
            onChange={(e) => setCorrelation(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Variable 2: Memory Load N */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 flex items-center space-x-1">
              <span className="font-bold text-cyan-400">N (Stored Pairs)</span>
              <span className="text-slate-500">[{N}]</span>
            </span>
            <span className="text-[10px] text-slate-400">
              Load Ratio N/d = {(N / d).toFixed(2)} {N > d ? "(Rank Over-Capacity)" : "(Within Rank)"}
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="16"
            step="1"
            value={N}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Variable 3: State Dimension d */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 flex items-center space-x-1">
              <span className="font-bold text-violet-400">d (State Dimension)</span>
              <span className="text-slate-500">[{d} × {d}]</span>
            </span>
            <span className="text-[10px] text-slate-400">{d * d} Synaptic Weights</span>
          </div>
          <input
            type="range"
            min="4"
            max="16"
            step="2"
            value={d}
            onChange={(e) => setD(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
          />
        </div>

        {/* Variable 4: Retention Decay lambda */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 flex items-center space-x-1">
              <span className="font-bold text-slate-300">λ (Retention Factor)</span>
              <span className="text-slate-500">[{decay.toFixed(2)}]</span>
            </span>
            <span className="text-[10px] text-slate-400">{decay === 1.0 ? "Exact Summation" : "Exponential Forgetting"}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.05"
            value={decay}
            onChange={(e) => setDecay(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
          />
        </div>
      </div>

      {/* BDH Sparse Plasticity Toggle */}
      <div className="pt-3 border-t border-white/10">
        <label className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 cursor-pointer hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-xs font-mono font-bold text-emerald-300">
                Sparse Positive Plasticity <span className="text-[10px] text-emerald-400 font-normal">[TEACHING SIMPLIFICATION]</span>
              </div>
              <div className="text-[10px] text-emerald-400/80">
                Non-negative ReLU + Top-K synaptic gating (inspired by BDH mechanisms)
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={useBDH}
            onChange={(e) => setUseBDH(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-white/20 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
