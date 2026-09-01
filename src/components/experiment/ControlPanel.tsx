"use client";

import React from "react";
import { PROTOCOL_PRESETS } from "@/lib/presets";
import { RotateCcw, ShieldCheck } from "lucide-react";

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
    <div className="bg-[#101217] border border-white/[0.08] rounded-lg p-4 space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
        <span className="font-bold text-white tracking-wider">INSTRUMENT CONTROLS</span>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-colors text-[10px]"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET</span>
        </button>
      </div>

      {/* Protocol Presets */}
      <div>
        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Scientific Protocols:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {PROTOCOL_PRESETS.map((p) => {
            const active = selectedProtocolId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProtocol(p.id)}
                className={`text-left p-2 rounded border transition-all ${
                  active
                    ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                    : "bg-black/30 border-white/5 text-slate-300 hover:bg-white/5"
                }`}
              >
                <div className="font-bold text-[11px] text-white">{p.title}</div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">{p.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="space-y-3.5 pt-1">
        {/* Param 1: rho */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300 font-bold">
              ρ (Controlled Correlation Parameter): <span className="text-amber-400">{correlation.toFixed(2)}</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {correlation === 0 ? "Orthonormal Base" : correlation < 0.5 ? "Moderate Overlap" : "High Overlap"}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.95"
            step="0.05"
            value={correlation}
            onChange={(e) => setCorrelation(parseFloat(e.target.value))}
            className="w-full"
            aria-label="Controlled correlation parameter rho"
          />
          <div className="text-[9px] text-slate-400">Controls the shared component magnitude across key vectors.</div>
        </div>

        {/* Param 2: N (Stored associations) */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300 font-bold">
              N (Stored Associations): <span className="text-cyan-400">{N}</span>
            </span>
            <span className="text-[10px] text-slate-400">
              Load Ratio N/d = {(N / d).toFixed(2)} {N > d ? "(Exceeds Rank)" : "(Within Rank)"}
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
          <div className="text-[9px] text-slate-400">Total number of key-value pairs written into state matrix S.</div>
        </div>

        {/* Param 3: d (Dimension) */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300 font-bold">
              d (State Dimension): <span className="text-violet-400">{d}</span>
            </span>
            <span className="text-[10px] text-slate-400">Matrix Size: {d} × {d} ({d * d} weights)</span>
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
          <div className="text-[9px] text-slate-400">Dimensionality of key and value embedding vectors.</div>
        </div>

        {/* Param 4: lambda (Decay) */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300 font-bold">
              λ (Retention / Decay Factor): <span className="text-slate-200">{decay.toFixed(2)}</span>
            </span>
            <span className="text-[10px] text-slate-400">{decay === 1.0 ? "Exact Summation" : "Temporal Forgetting"}</span>
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
          <div className="text-[9px] text-slate-400">Recurrent multiplier S_t = lambda * S_(t-1) + v_t k_t^T.</div>
        </div>
      </div>

      {/* BDH Abstraction Toggle */}
      <div className="pt-2 border-t border-white/[0.06]">
        <label className="flex items-center justify-between p-2.5 rounded bg-emerald-950/20 border border-emerald-500/20 cursor-pointer hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-emerald-300">
                Sparse Positive Plasticity
              </div>
              <div className="text-[9px] text-emerald-400/80">
                [BDH-INSPIRED TEACHING ABSTRACTION • NOT FULL BDH]
              </div>
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
