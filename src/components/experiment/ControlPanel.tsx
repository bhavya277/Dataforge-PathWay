"use client";

import React from "react";
import { PROTOCOL_PRESETS } from "@/lib/presets";
import { RotateCcw } from "lucide-react";

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
    <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-5 shadow-sm space-y-4">
      {/* Top Bar: Title & Preset Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#E2E4E8]">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold tracking-widest text-[#111318] uppercase">
            SANDBOX EXPERIMENT CONTROLS
          </span>
          <span className="text-[11px] font-mono text-[#626873]">
            Sₜ = λSₜ₋₁ + vₜkₜᵀ
          </span>
        </div>

        {/* Protocol Shortcuts */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PROTOCOL_PRESETS.map((p) => {
            const active = selectedProtocolId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProtocol(p.id)}
                className={`px-2.5 py-1 text-xs font-medium transition-all ${
                  active
                    ? "bg-[#111318] text-white"
                    : "bg-[#F0F1ED] hover:bg-[#EAEBE5] text-[#111318]"
                }`}
              >
                {p.title}
              </button>
            );
          })}

          <button
            onClick={onReset}
            className="p-1 text-[#626873] hover:text-[#111318] transition-colors ml-1"
            title="Reset Defaults"
            aria-label="Reset Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Laboratory Parameter Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
        {/* Param 1: Dimension d */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-[#626873]">d — State Dimension</span>
            <span className="text-xs font-mono font-bold text-[#111318]">d = {d}</span>
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
          <div className="text-[10px] text-[#8A909A] font-mono">State S ∈ ℝ^({d}×{d}) • Rank ≤ {d}</div>
        </div>

        {/* Param 2: Associations N */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-[#626873]">N — Stored Associations</span>
            <span className="text-xs font-mono font-bold text-[#111318]">N = {N}</span>
          </div>
          <input
            type="range"
            min="2"
            max="16"
            step="1"
            value={N}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full"
            aria-label="Stored associations N"
          />
          <div className="text-[10px] text-[#8A909A] font-mono">
            Load Ratio N/d = {(N / d).toFixed(2)}
          </div>
        </div>

        {/* Param 3: Key Correlation rho */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-[#626873]">ρ — Controlled Key Overlap</span>
            <span className="text-xs font-mono font-bold text-[#D97706]">ρ = {correlation.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.8"
            step="0.05"
            value={correlation}
            onChange={(e) => setCorrelation(parseFloat(e.target.value))}
            className="w-full"
            aria-label="Key correlation parameter rho"
          />
          <div className="text-[10px] text-[#8A909A] font-mono">
            {correlation === 0 ? "Orthogonal keys (ρ = 0.00)" : "Controlled shared-component parameter"}
          </div>
        </div>

        {/* Param 4: Retention Decay lambda */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-[#626873]">λ — Retention Factor</span>
            <span className="text-xs font-mono font-bold text-[#111318]">λ = {decay.toFixed(2)}</span>
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
          <div className="text-[10px] text-[#8A909A] font-mono">
            {decay === 1.0 ? "No forgetting (λ=1.0)" : "Exponential temporal decay"}
          </div>
        </div>
      </div>

      {/* Model Option: BDH Sparse Plasticity */}
      <div className="pt-2 border-t border-[#E2E4E8] flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useBDH}
            onChange={(e) => setUseBDH(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-[#111318] accent-[#111318]"
          />
          <span className="text-xs font-medium text-[#111318]">
            Enable BDH-Inspired Sparse Positive Plasticity [TEACHING ABSTRACTION]
          </span>
        </label>
        <span className="text-[11px] font-mono text-[#8A909A]">
          {useBDH ? "W_t = TopK(λW + η ReLU(v)ReLU(k)ᵀ)" : "Standard Linear Fast Weights"}
        </span>
      </div>
    </div>
  );
};
