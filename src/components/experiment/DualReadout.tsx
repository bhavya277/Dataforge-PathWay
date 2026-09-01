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

  return (
    <div className="bg-[#101217] border border-white/[0.08] rounded-lg p-4 font-mono text-xs">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-3 gap-2">
        <div>
          <span className="text-xs font-bold text-white tracking-wider">RETRIEVAL READOUT & DECOMPOSITION</span>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Query: <strong className="text-cyan-400">{queryLabel}</strong> (q = k_{queryLabel.slice(-1)})
          </div>
        </div>

        {/* Quantitative Metrics Bar */}
        <div className="flex items-center space-x-2 text-[11px]">
          <div className="bg-black/50 px-2.5 py-1 rounded border border-white/5 text-right">
            <span className="text-[9px] text-slate-400 block uppercase">Cosine Error (1-cos)</span>
            <span
              className={`font-bold ${
                cosineError < 0.05
                  ? "text-emerald-400"
                  : cosineError < 0.3
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {cosineError.toFixed(4)}
            </span>
          </div>

          <div className="bg-black/50 px-2.5 py-1 rounded border border-white/5 text-right">
            <span className="text-[9px] text-slate-400 block uppercase">Raw L2 Error (||ŷ - v||)</span>
            <span className="font-bold text-cyan-300">{rawL2Error.toFixed(4)}</span>
          </div>

          <div className="bg-black/50 px-2.5 py-1 rounded border border-white/5 text-right">
            <span className="text-[9px] text-slate-400 block uppercase">ISR (Interference/Signal)</span>
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

      {/* Vector Decomposition Grid */}
      <div className="mt-4 space-y-3">
        {/* Row 1: Target vs Retrieved */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Target Value Vector */}
          <div className="bg-black/30 p-2.5 rounded border border-cyan-500/20">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
              <span className="text-cyan-400 font-bold">Target Vector v_target (||v|| = 1.0)</span>
              <span>d = {dim}</span>
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${Math.min(dim, 16)}, minmax(0, 1fr))` }}
            >
              {groundTruthValue.slice(0, dim).map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full bg-[#161a22] h-8 rounded-[1px] flex items-end justify-center overflow-hidden">
                    <div
                      className="w-full bg-cyan-400"
                      style={{ height: `${(Math.abs(val) / maxBar) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[8px] text-slate-400 mt-0.5">{val.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Retrieved Output */}
          <div className="bg-black/30 p-2.5 rounded border border-white/10">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
              <span className="text-white font-bold">Retrieved Output ŷ = S q</span>
              <span>Signal + Cross-Talk</span>
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${Math.min(dim, 16)}, minmax(0, 1fr))` }}
            >
              {retrievedValue.slice(0, dim).map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full bg-[#161a22] h-8 rounded-[1px] flex items-end justify-center overflow-hidden">
                    <div
                      className="w-full bg-slate-200"
                      style={{ height: `${(Math.abs(val) / maxBar) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[8px] text-slate-400 mt-0.5">{val.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Exact Algebraic Decomposition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Target Signal Component */}
          <div className="bg-black/20 p-2 rounded border border-emerald-500/20">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span className="text-emerald-400 font-bold">Target Signal Component (λ^(t-j) v_j (k_jᵀ q))</span>
              <span>Mag: {retrieval.signalMagnitude.toFixed(2)}</span>
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${Math.min(dim, 16)}, minmax(0, 1fr))` }}
            >
              {signalComponent.slice(0, dim).map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full bg-[#161a22] h-6 rounded-[1px] flex items-end justify-center overflow-hidden">
                    <div
                      className="w-full bg-emerald-400"
                      style={{ height: `${(Math.abs(val) / maxBar) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[8px] text-slate-400 mt-0.5">{val.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Talk Contamination */}
          <div className="bg-black/20 p-2 rounded border border-amber-500/20">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span className="text-amber-400 font-bold">Cross-Talk Interference (∑_{`i ≠ j`} λ^(t-i) v_i (k_iᵀ q))</span>
              <span>Mag: {retrieval.crosstalkMagnitude.toFixed(2)}</span>
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${Math.min(dim, 16)}, minmax(0, 1fr))` }}
            >
              {interferenceComponent.slice(0, dim).map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full bg-[#161a22] h-6 rounded-[1px] flex items-end justify-center overflow-hidden">
                    <div
                      className="w-full bg-amber-400"
                      style={{ height: `${(Math.abs(val) / maxBar) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[8px] text-slate-400 mt-0.5">{val.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Footnote */}
      <div className="mt-3 pt-2 border-t border-white/[0.06] text-[10px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span>
          <strong>Metric Distinction:</strong> Cosine error measures pure angular deviation; Raw L2 error accounts for un-normalized magnitude growth in linear recurrence.
        </span>
        <span className="text-cyan-300 font-semibold">
          ŷ = Target Signal + Cross-Talk (Exact)
        </span>
      </div>
    </div>
  );
};
