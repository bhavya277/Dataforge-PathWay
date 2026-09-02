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
    <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-4 sm:p-5 shadow-sm">
      {/* Top Bar: Title & Preset Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#E2E4E8]">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold tracking-widest text-[#111318] uppercase">
            EXPERIMENT CONTROLS
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

      {/* 4 Horizontal Laboratory Parameter Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
        {/* Param 1: Dimension d */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-[#626873]">Dimension (d)</span>
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
          <div className="text-[10px] text-[#8A909A] font-mono">State S ∈ ℝ^({d}×{d})</div>
        </div>

        {/* Param 2: Stored Associations N */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-[#626873]">Associations (N)</span>
            <span className="text-xs font-mono font-bold text-[#111318]">
              N = {N} <span className="text-[#626873] font-normal">({(N / d).toFixed(2)}d)</span>
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
          <div className="text-[10px] text-[#8A909A] font-mono">Load Ratio N/d = {(N / d).toFixed(2)}</div>
        </div>

        {/* Param 3: Key Overlap rho */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-[#626873]">Correlation (ρ)</span>
            <span className="text-xs font-mono font-bold text-[#D97706]">ρ = {correlation.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.9"
            step="0.05"
            value={correlation}
            onChange={(e) => setCorrelation(parseFloat(e.target.value))}
            className="w-full"
            aria-label="Key correlation parameter rho"
          />
          <div className="text-[10px] text-[#8A909A] font-mono">Shared directional component</div>
        </div>

        {/* Param 4: Retention lambda */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-[#626873]">Retention (λ)</span>
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
          <div className="text-[10px] text-[#8A909A] font-mono">Temporal discount factor</div>
        </div>
      </div>

      {/* Sparse Plasticity Abstraction Toggle */}
      <div className="mt-4 pt-3 border-t border-[#E2E4E8] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-[#111318]">BDH Sparse Plasticity Model:</span>
          <span className="text-[10px] font-mono text-[#626873]">[TEACHING ABSTRACTION]</span>
        </div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useBDH}
            onChange={(e) => setUseBDH(e.target.checked)}
            className="w-3.5 h-3.5 text-[#111318] rounded accent-[#111318] cursor-pointer"
          />
          <span className="text-xs font-medium text-[#111318]">
            {useBDH ? "Activated (ReLU / Top-K)" : "Standard Linear Memory"}
          </span>
        </label>
      </div>
    </div>
  );
};
