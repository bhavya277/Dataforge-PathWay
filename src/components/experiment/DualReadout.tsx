"use client";

import React from "react";
import { RetrievalBreakdown } from "@/lib/types";
import { ArrowDown, ArrowRight } from "lucide-react";

interface DualReadoutProps {
  retrieval: RetrievalBreakdown;
  dim: number;
  availableKeys?: number;
  selectedQueryIdx?: number;
  onSelectQueryIdx?: (idx: number) => void;
}

export const DualReadout: React.FC<DualReadoutProps> = ({
  retrieval,
  dim,
  availableKeys = 4,
  selectedQueryIdx = 0,
  onSelectQueryIdx,
}) => {
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
    <div className="space-y-12 py-6">
      {/* ============================================================ */}
      {/* SECTION 02: ASK THE MEMORY */}
      {/* ============================================================ */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9DCE1] pb-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
              02 / ASK THE MEMORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] mt-1">
              QUERY &amp; ASSOCIATIVE RETRIEVAL
            </h2>
            <p className="text-sm text-[#626873] mt-1">
              Matrix-vector multiplication y_t = S_t q evaluates associative recall in O(1) time.
            </p>
          </div>

          {/* Query Key Selector */}
          {onSelectQueryIdx && (
            <div className="flex flex-wrap items-center gap-1.5 bg-[#FFFFFF] p-1.5 border border-[#D9DCE1] shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#626873] px-2 uppercase">
                Query Key:
              </span>
              {Array.from({ length: availableKeys }).map((_, idx) => {
                const active = selectedQueryIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectQueryIdx(idx)}
                    className={`px-3 py-1 text-xs font-mono font-semibold transition-all ${
                      active
                        ? "bg-[#111318] text-white"
                        : "bg-[#F0F1ED] hover:bg-[#EAEBE5] text-[#111318]"
                    }`}
                  >
                    k_{idx + 1}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Visual Pipeline Chain: QUERY -> RECURRENT STATE -> RETRIEVED */}
        <div className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-[#626873] uppercase tracking-wider block">
                1. QUERY PROBE
              </span>
              <div className="text-base font-mono font-bold text-[#0284C7]">
                q = k_{selectedQueryIdx + 1}
              </div>
            </div>

            <ArrowRight className="hidden sm:block w-4 h-4 text-[#8A909A]" />
            <ArrowDown className="sm:hidden w-4 h-4 text-[#8A909A]" />

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-[#626873] uppercase tracking-wider block">
                2. RECURRENT STATE
              </span>
              <div className="text-base font-mono font-bold text-[#111318]">
                Sₜ ∈ ℝ^({dim}×{dim})
              </div>
            </div>

            <ArrowRight className="hidden sm:block w-4 h-4 text-[#8A909A]" />
            <ArrowDown className="sm:hidden w-4 h-4 text-[#8A909A]" />

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-[#626873] uppercase tracking-wider block">
                3. RETRIEVED OUTPUT
              </span>
              <div className="text-base font-mono font-bold text-[#111318]">
                yₜ = Sₜ q
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side: GROUND TRUTH vs RETRIEVED FROM S_t */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Ground Truth Vector */}
          <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-baseline border-b border-[#E2E4E8] pb-2">
              <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                GROUND TRUTH (v_{selectedQueryIdx + 1})
              </span>
              <span className="text-[11px] font-mono text-[#8A909A]">||v|| = 1.00</span>
            </div>

            <div className="overflow-x-auto pb-1">
              <div
                className="min-w-[260px] grid gap-1 sm:gap-2 pt-2"
                style={{ gridTemplateColumns: `repeat(${Math.min(dim, 16)}, minmax(0, 1fr))` }}
              >
                {groundTruthValue.slice(0, dim).map((val, idx) => {
                  const heightPct = Number(((Math.abs(val) / maxBar) * 100).toFixed(2));
                  const displayVal = Math.abs(val) < 0.01 ? 0 : val;
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-full bg-[#F0F1ED] h-14 sm:h-16 flex items-end justify-center border border-[#E2E4E8]">
                        <div
                          className="w-full bg-[#0284C7]"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-[8px] sm:text-[9px] font-mono text-[#626873] mt-1 font-semibold">
                        {displayVal === 0 ? "0" : displayVal.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Retrieved Vector */}
          <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-baseline border-b border-[#E2E4E8] pb-2">
              <span className="text-xs font-bold text-[#111318] uppercase tracking-wider">
                RETRIEVED FROM Sₜ (yₜ = Sₜ q)
              </span>
              <span className="text-[11px] font-mono text-[#8A909A]">Signal + Cross-Talk</span>
            </div>

            <div className="overflow-x-auto pb-1">
              <div
                className="min-w-[260px] grid gap-1 sm:gap-2 pt-2"
                style={{ gridTemplateColumns: `repeat(${Math.min(dim, 16)}, minmax(0, 1fr))` }}
              >
                {retrievedValue.slice(0, dim).map((val, idx) => {
                  const heightPct = Number(((Math.abs(val) / maxBar) * 100).toFixed(2));
                  const displayVal = Math.abs(val) < 0.01 ? 0 : val;
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-full bg-[#F0F1ED] h-14 sm:h-16 flex items-end justify-center border border-[#E2E4E8]">
                        <div
                          className="w-full bg-[#111318]"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-[8px] sm:text-[9px] font-mono text-[#626873] mt-1 font-semibold">
                        {displayVal === 0 ? "0" : displayVal.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Big Numbers Readout (Typography Driven) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#D9DCE1]">
          <div>
            <span className="text-xs font-mono font-bold text-[#626873] block uppercase tracking-wider">
              COSINE SIMILARITY
            </span>
            <div
              className={`text-3xl sm:text-4xl font-mono font-bold mt-1 ${
                cosineSimilarity > 0.95
                  ? "text-[#0284C7]"
                  : cosineSimilarity > 0.75
                  ? "text-[#D97706]"
                  : "text-[#DC2626]"
              }`}
            >
              {cosineSimilarity.toFixed(4)}
            </div>
            <p className="text-xs text-[#626873] mt-1">
              Cosine error: {cosineError.toFixed(4)}
            </p>
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-[#626873] block uppercase tracking-wider">
              RAW L2 ERROR (||yₜ - v||)
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-[#111318] mt-1">
              {rawL2Error.toFixed(4)}
            </div>
            <p className="text-xs text-[#626873] mt-1">
              Euclidean state distance
            </p>
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-[#626873] block uppercase tracking-wider">
              INTERFERENCE RATIO (ISR)
            </span>
            <div
              className={`text-3xl sm:text-4xl font-mono font-bold mt-1 ${
                interferenceToSignalRatio < 0.1
                  ? "text-[#0284C7]"
                  : interferenceToSignalRatio < 0.8
                  ? "text-[#D97706]"
                  : "text-[#DC2626]"
              }`}
            >
              {interferenceToSignalRatio.toFixed(3)}
            </div>
            <p className="text-xs text-[#626873] mt-1">
              Cross-talk energy / Target signal
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
