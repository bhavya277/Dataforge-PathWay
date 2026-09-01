"use client";

import React from "react";
import { RetrievalBreakdown } from "@/lib/types";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";

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
    l2Error,
    interferenceToSignalRatio,
  } = retrieval;

  // Determine retrieval quality status
  let statusBadge = (
    <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-mono font-medium">
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>EXACT RECALL</span>
    </span>
  );

  if (cosineSimilarity < 0.5) {
    statusBadge = (
      <span className="flex items-center space-x-1 text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2.5 py-1 rounded-full text-xs font-mono font-medium">
        <XCircle className="w-3.5 h-3.5" />
        <span>INTERFERENCE COLLAPSE</span>
      </span>
    );
  } else if (cosineSimilarity < 0.95) {
    statusBadge = (
      <span className="flex items-center space-x-1 text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-mono font-medium">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>CROSS-TALK NOISE</span>
      </span>
    );
  }

  // Max value for bar chart normalization
  let maxBar = 0.001;
  for (let i = 0; i < dim; i++) {
    maxBar = Math.max(
      maxBar,
      Math.abs(groundTruthValue[i] || 0),
      Math.abs(retrievedValue[i] || 0),
      Math.abs(interferenceComponent[i] || 0)
    );
  }

  return (
    <div className="bg-[#11141B] border border-white/10 rounded-xl p-5 shadow-xl">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-white">Dual Readout: Ground Truth vs Retrieved</h3>
            {statusBadge}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Query: <span className="font-mono text-cyan-300 font-semibold">{queryLabel}</span> (q = k_{queryLabel.slice(-1)})
          </p>
        </div>

        {/* Quantitative Metric Badges */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Cosine Similarity (Direction)</span>
            <span
              className={`font-bold text-sm ${
                cosineSimilarity > 0.95
                  ? "text-emerald-400"
                  : cosineSimilarity > 0.5
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {cosineSimilarity.toFixed(4)}
            </span>
          </div>

          <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Raw L2 Error (||ŷ - v||)</span>
            <span className="font-bold text-sm text-cyan-300">{l2Error.toFixed(4)}</span>
          </div>

          <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">ISR (Interference/Signal)</span>
            <span
              className={`font-bold text-sm ${
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

      {/* Educational Note on Vector Magnitude Normalization */}
      <div className="mt-3 p-2 bg-black/30 border border-white/5 rounded text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>
          <strong className="text-slate-200">Note:</strong> Ground truth vector v is normalized (||v|| = 1.0), whereas retrieved vector ŷ accumulates unnormalized energy across associations. Cosine similarity measures pure directional fidelity; Raw L2 error measures total Euclidean divergence.
        </span>
      </div>

      {/* Vector Comparison Bars */}
      <div className="mt-5 space-y-4 font-mono text-xs">
        {/* Ground Truth Vector */}
        <div>
          <div className="flex justify-between text-slate-400 text-[11px] mb-1">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-slate-200 font-semibold">Ground Truth Vector (v_target)</span>
            </span>
            <span>d = {dim}</span>
          </div>
          <div className="grid grid-cols-8 gap-1.5 bg-black/40 p-2.5 rounded-lg border border-cyan-500/20">
            {groundTruthValue.slice(0, dim).map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-full bg-[#1A1E27] h-10 rounded flex items-end justify-center overflow-hidden p-0.5">
                  <div
                    className="w-full bg-cyan-400 rounded-sm transition-all"
                    style={{ height: `${(Math.abs(val) / maxBar) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{val.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Retrieved Model Output Vector */}
        <div>
          <div className="flex justify-between text-slate-400 text-[11px] mb-1">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              <span className="text-slate-200 font-semibold">Model Retrieved Output (ŷ = S q)</span>
            </span>
            <span>ŷ = Signal + Interference</span>
          </div>
          <div className="grid grid-cols-8 gap-1.5 bg-black/40 p-2.5 rounded-lg border border-violet-500/20">
            {retrievedValue.slice(0, dim).map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-full bg-[#1A1E27] h-10 rounded flex items-end justify-center overflow-hidden p-0.5">
                  <div
                    className="w-full bg-violet-400 rounded-sm transition-all"
                    style={{ height: `${(Math.abs(val) / maxBar) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{val.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Talk Interference Vector */}
        <div>
          <div className="flex justify-between text-slate-400 text-[11px] mb-1">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-slate-200 font-semibold">Cross-Talk Contamination (∑_{`i ≠ target`} v_i (k_iᵀ q))</span>
            </span>
            <span>{interferenceToSignalRatio > 0.5 ? "Dominant" : "Suppressed"}</span>
          </div>
          <div className="grid grid-cols-8 gap-1.5 bg-black/40 p-2.5 rounded-lg border border-rose-500/20">
            {interferenceComponent.slice(0, dim).map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-full bg-[#1A1E27] h-8 rounded flex items-end justify-center overflow-hidden p-0.5">
                  <div
                    className="w-full bg-rose-500 rounded-sm transition-all"
                    style={{ height: `${(Math.abs(val) / maxBar) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{val.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
