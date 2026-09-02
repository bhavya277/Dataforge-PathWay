"use client";

import React from "react";
import { PROTOCOL_PRESETS } from "@/lib/presets";
import { RotateCcw, Play } from "lucide-react";

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
  selectedProtocolId: string | null;
  onSelectProtocol: (protocolId: string) => void;
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
  selectedProtocolId,
  onSelectProtocol,
  onReset,
}) => {
  return (
    <div className="border border-white/[0.08] bg-[#0B0D12] p-5 font-mono text-xs space-y-4">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <span className="text-xs font-bold tracking-widest text-white uppercase">
          EXPERIMENT PARAMETERS
        </span>
        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors text-[10px]"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET DEFAULTS</span>
        </button>
      </div>

      {/* Scientific Protocol Presets */}
      <div>
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
          Curated Scientific Protocols:
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PROTOCOL_PRESETS.map((p) => {
            const active = selectedProtocolId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProtocol(p.id)}
                className={`text-left p-2 border transition-all ${
                  active
                    ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300"
                    : "bg-black/40 border-white/5 text-slate-300 hover:bg-white/5"
                }`}
              >
                <div className="font-bold text-[11px] text-white">{p.title}</div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">{p.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameter Controls */}
      <div className="space-y-3.5 pt-1">
        {/* Param 1: State Dimension d */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">
              Dimension <strong className="text-white">d</strong>:
            </span>
            <span className="font-bold text-cyan-400 bg-black/60 px-2 py-0.5 border border-white/10">
              d = {d}
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="16"
            step="2"
            value={d}
            onChange={(e) => setD(parseInt(e.target.value))}
            className="w-full"
            aria-label="State dimension d"
          />
          <div className="text-[10px] text-slate-400">Embedding vector dimensionality (Matrix S ∈ ℝ^(d×d)).</div>
        </div>

        {/* Param 2: Memory Load N */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">
              Memory Load <strong className="text-white">N</strong>:
            </span>
            <span className="font-bold text-cyan-400 bg-black/60 px-2 py-0.5 border border-white/10">
              N = {N} (N/d = {(N / d).toFixed(2)})
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="16"
            step="1"
            value={N}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full"
            aria-label="Number of stored associations N"
          />
          <div className="text-[10px] text-slate-400">Total number of key-value associations stored in S.</div>
        </div>

        {/* Param 3: Key Correlation rho */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">
              Key Correlation <strong className="text-white">ρ</strong>:
            </span>
            <span className="font-bold text-amber-400 bg-black/60 px-2 py-0.5 border border-white/10">
              ρ = {correlation.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.9"
            step="0.05"
            value={correlation}
            onChange={(e) => setCorrelation(parseFloat(e.target.value))}
            className="w-full"
            aria-label="Controlled correlation parameter rho"
          />
          <div className="text-[10px] text-slate-400">Controls shared directional component across synthetic keys.</div>
        </div>

        {/* Param 4: Retention Factor lambda */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">
              Retention Factor <strong className="text-white">λ</strong>:
            </span>
            <span className="font-bold text-slate-200 bg-black/60 px-2 py-0.5 border border-white/10">
              λ = {decay.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.05"
            value={decay}
            onChange={(e) => setDecay(parseFloat(e.target.value))}
            className="w-full"
            aria-label="Retention factor lambda"
          />
          <div className="text-[10px] text-slate-400">Recurrent decay factor Sₜ = λ Sₜ₋₁ + vₜ kₜᵀ.</div>
        </div>
      </div>

      {/* BDH Sparse Plasticity Toggle */}
      <div className="pt-2 border-t border-white/[0.08]">
        <label className="flex items-center justify-between p-3 bg-emerald-950/20 border border-emerald-500/30 cursor-pointer hover:bg-emerald-950/30 transition-colors">
          <div>
            <div className="text-xs font-bold text-emerald-300">
              Sparse Positive Plasticity
            </div>
            <div className="text-[9px] text-emerald-400/80">
              [BDH-INSPIRED TEACHING ABSTRACTION]
            </div>
          </div>
          <input
            type="checkbox"
            checked={useBDH}
            onChange={(e) => setUseBDH(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-white/20 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
