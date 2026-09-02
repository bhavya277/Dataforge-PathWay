"use client";

import React from "react";
import { RetrievalBreakdown } from "@/lib/types";

interface DualReadoutProps {
  retrieval: RetrievalBreakdown;
  dim: number;
}

export const DualReadout: React.FC<DualReadoutProps> = ({ retrieval, dim }) => {
  const {
    queryLabel,
    groundTruthValue,
    retrievedValue,
    signalComponent,
    interferenceComponent,
    cosineSimilarity,
    cosineError,
    rawL2Error,
    signalMagnitude,
    crosstalkMagnitude,
    interferenceToSignalRatio,
  } = retrieval;

  // Max value for bar scaling
  let maxBar = 0.001;
  for (let i = 0; i < dim; i++) {
    maxBar = Math.max(
      maxBar,
      Math.abs(groundTruthValue[i] || 0),
      Math.abs(retrievedValue[i] || 0),
      Math.abs(signalComponent[i] || 0),
      Math.abs(interferenceComponent[i] || 0)
    );
  }

  const totalEnergy = signalMagnitude + crosstalkMagnitude + 0.0001;
  const signalPercent = Number(((signalMagnitude / totalEnergy) * 100).toFixed(2));
  const crosstalkPercent = Number(((crosstalkMagnitude / totalEnergy) * 100).toFixed(2));

  return (
    <div className="border border-white/[0.08] bg-[#0B0D12] p-5 font-mono text-xs space-y-4">
      {/* Header & Probe Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/[0.08] pb-3 gap-2">
        <div>
          <span className="text-xs font-bold tracking-widest text-white uppercase">
            QUERY RETRIEVAL &amp; CAUSAL DECOMPOSITION
          </span>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Query probe: <strong className="text-cyan-400">{queryLabel}</strong> (q = k_{queryLabel.slice(-1)})
          </div>
        </div>

        {/* Quantitative Metrics */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-black/60 px-3 py-1 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Cosine Error (1-cos)</span>
            <span
              className={`font-bold ${
                cosineError < 0.05
                  ? "text-emerald-400"
                  : cosineError < 0.25
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {cosineError.toFixed(4)}
            </span>
          </div>

          <div className="bg-black/60 px-3 py-1 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Raw L2 Error (||ŷ - v||)</span>
            <span className="font-bold text-cyan-300">{rawL2Error.toFixed(4)}</span>
          </div>

          <div className="bg-black/60 px-3 py-1 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">ISR (Interference/Signal)</span>
            <span
              className={`font-bold ${
                interferenceToSignalRatio < 0.1
                  ? "text-emerald-400"
                  : interferenceToSignalRatio < 0.8
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {interferenceToSignalRatio.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Visual Comparison: Signal vs Interference Energy Ratio */}
      <div className="bg-black/50 p-3 border border-white/10 space-y-2">
        <div className="flex justify-between text-[11px] text-slate-300">
          <span>
            <strong className="text-cyan-400">TARGET SIGNAL:</strong> {signalMagnitude.toFixed(3)} ({signalPercent}%)
          </span>
          <span>
            <strong className="text-amber-400">CROSS-TALK:</strong> {crosstalkMagnitude.toFixed(3)} ({crosstalkPercent}%)
          </span>
        </div>
        <div className="w-full bg-[#161a22] h-4 flex border border-white/10 overflow-hidden">
          <div
            className="bg-cyan-400 h-full transition-all duration-300"
            style={{ width: `${signalPercent}%` }}
          />
          <div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${crosstalkPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Target Component: λ^(t-j) v_j (k_jᵀ q)</span>
          <span>Cross-Talk Contamination: ∑_{`i ≠ j`} λ^(t-i) v_i (k_iᵀ q)</span>
        </div>
      </div>

      {/* Vector Component Inspection (Target vs Retrieved) */}
      <div className="space-y-3 pt-1">
        {/* Row 1: Target Vector vs Retrieved Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/40 p-3 border border-cyan-500/30">
            <div className="flex justify-between text-[11px] mb-2">
              <span className="text-cyan-400 font-bold">Target Vector v_target (||v|| = 1.0)</span>
              <span className="text-slate-400">d = {dim}</span>
            </div>
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${Math.min(dim, 16)}, minmax(0, 1fr))` }}
            >
              {groundTruthValue.slice(0, dim).map((val, idx) => {
                const heightPct = Number(((Math.abs(val) / maxBar) * 100).toFixed(2));
                const displayVal = Math.abs(val) < 0.01 ? 0 : val;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-full bg-[#161a22] h-10 flex items-end justify-center overflow-hidden border border-white/5">
                      <div
                        className="w-full bg-cyan-400"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-slate-400 mt-1">
                      {displayVal === 0 ? "0" : displayVal.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-black/40 p-3 border border-white/15">
            <div className="flex justify-between text-[11px] mb-2">
              <span className="text-white font-bold">Retrieved Output ŷ = S q</span>
              <span className="text-slate-400">Signal + Cross-Talk</span>
            </div>
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${Math.min(dim, 16)}, minmax(0, 1fr))` }}
            >
              {retrievedValue.slice(0, dim).map((val, idx) => {
                const heightPct = Number(((Math.abs(val) / maxBar) * 100).toFixed(2));
                const displayVal = Math.abs(val) < 0.01 ? 0 : val;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-full bg-[#161a22] h-10 flex items-end justify-center overflow-hidden border border-white/5">
                      <div
                        className="w-full bg-slate-200"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-slate-400 mt-1">
                      {displayVal === 0 ? "0" : displayVal.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Footnote */}
      <div className="pt-2 border-t border-white/[0.08] text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between gap-1">
        <span>
          <strong>Metric Note:</strong> Cosine error measures pure directional disagreement; Raw L2 error captures un-normalized energy growth in linear recurrence.
        </span>
        <span className="text-cyan-300 font-bold">
          ŷ = Target Signal + Cross-Talk (Exact)
        </span>
      </div>
    </div>
  );
};
