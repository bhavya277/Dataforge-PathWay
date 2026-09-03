"use client";

import React from "react";
import { RetrievalBreakdown } from "@/lib/types";
import { vectorNorm } from "@/lib/math-engine";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

interface RetrievalDecompositionProps {
  retrieval: RetrievalBreakdown;
  dim: number;
  correlation: number;
  useBDH: boolean;
}

export const RetrievalDecomposition: React.FC<RetrievalDecompositionProps> = ({
  retrieval,
  dim,
  correlation,
  useBDH,
}) => {
  const {
    queryIdx,
    signalComponent,
    interferenceComponent,
    retrievedValue,
    signalMagnitude,
    crosstalkMagnitude,
    decompositionResidual,
    isExactLinear,
  } = retrieval;

  const totalEnergy = signalMagnitude + crosstalkMagnitude + 0.00001;
  const signalPercent = Number(((signalMagnitude / totalEnergy) * 100).toFixed(1));
  const crosstalkPercent = Number(((crosstalkMagnitude / totalEnergy) * 100).toFixed(1));

  // Max value for bar scaling
  let maxBar = 0.001;
  for (let i = 0; i < dim; i++) {
    maxBar = Math.max(
      maxBar,
      Math.abs(signalComponent[i] || 0),
      Math.abs(interferenceComponent[i] || 0),
      Math.abs(retrievedValue[i] || 0)
    );
  }

  return (
    <section className="space-y-6 pt-4 border-t border-[#D9DCE1]">
      {/* Header */}
      <div className="border-b border-[#D9DCE1] pb-4">
        <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
          04 / SEE CROSS-TALK
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] mt-1">
          WHERE DID THE UNWANTED PART OF THE RETRIEVAL COME FROM?
        </h2>
        <p className="text-sm text-[#626873] mt-1 max-w-3xl leading-relaxed">
          Because the keys are not perfectly orthogonal, a query for one key can have non-zero projection onto other stored keys. Those projections contribute non-target terms to the retrieved value.
        </p>
      </div>

      {/* Causal Chain Banner */}
      <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-4 shadow-sm">
        <div className="text-[10px] font-mono font-bold text-[#626873] uppercase tracking-wider mb-2">
          THE CAUSAL CHAIN UNDER NON-ORTHOGONAL KEYS
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
          <div className="p-2 bg-[#F7F7F4] border border-[#E2E4E8] text-center w-full sm:w-auto flex-1">
            <span className="text-[#626873] block text-[10px]">1. CONTROLLED OVERLAP</span>
            <span className="font-bold text-[#D97706]">ρ = {correlation.toFixed(2)}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#8A909A] shrink-0 hidden sm:block" />
          <div className="p-2 bg-[#F7F7F4] border border-[#E2E4E8] text-center w-full sm:w-auto flex-1">
            <span className="text-[#626873] block text-[10px]">2. NON-ZERO INNER PRODUCTS</span>
            <span className="font-bold text-[#111318]">k_iᵀ q ≠ 0 (for i ≠ j)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#8A909A] shrink-0 hidden sm:block" />
          <div className="p-2 bg-[#F7F7F4] border border-[#E2E4E8] text-center w-full sm:w-auto flex-1">
            <span className="text-[#626873] block text-[10px]">3. NON-TARGET CONTRIBUTIONS</span>
            <span className="font-bold text-[#D97706]">Cross-Talk Accumulates</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#8A909A] shrink-0 hidden sm:block" />
          <div className="p-2 bg-[#F7F7F4] border border-[#E2E4E8] text-center w-full sm:w-auto flex-1">
            <span className="text-[#626873] block text-[10px]">4. MEASURED RETRIEVAL</span>
            <span className="font-bold text-[#111318]">y_t Contaminated</span>
          </div>
        </div>
      </div>

      {/* Exact Recurrence Decomposition Card */}
      <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E2E4E8] pb-3">
          <div>
            <span className="text-xs font-mono font-bold text-[#626873] uppercase tracking-wider block">
              EXACT ALGEBRAIC DECOMPOSITION
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-[#111318] mt-0.5">
              Total Retrieved Vector (y) = Target Contribution + Cross-Talk Contribution
            </div>
          </div>

          {/* Linear Invariant Check */}
          {isExactLinear ? (
            <div className="flex items-center space-x-1.5 text-xs font-mono text-[#059669] bg-[#ECFDF5] px-2.5 py-1 border border-[#A7F3D0]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Exact Equality Verified (Residual: {decompositionResidual.toExponential(2)})</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-xs font-mono text-[#D97706] bg-[#FFFBEB] px-2.5 py-1 border border-[#FDE68A]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>[BDH-INSPIRED TEACHING ABSTRACTION: Nonlinear TopK Pruning]</span>
            </div>
          )}
        </div>

        {/* Visual Energy Ratio Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline text-xs sm:text-sm font-mono">
            <span className="text-[#0284C7] font-bold">
              TARGET CONTRIBUTION: {signalMagnitude.toFixed(3)} ({signalPercent}%)
            </span>
            <span className="text-[#D97706] font-bold">
              CROSS-TALK CONTRIBUTION: {crosstalkMagnitude.toFixed(3)} ({crosstalkPercent}%)
            </span>
          </div>

          <div className="w-full bg-[#F0F1ED] h-6 flex overflow-hidden border border-[#D9DCE1]">
            <div
              className="bg-[#0284C7] h-full transition-all duration-300"
              style={{ width: `${signalPercent}%` }}
              title={`Target Contribution: ${signalPercent}%`}
            />
            <div
              className="bg-[#D97706] h-full transition-all duration-300"
              style={{ width: `${crosstalkPercent}%` }}
              title={`Cross-Talk: ${crosstalkPercent}%`}
            />
          </div>
        </div>

        {/* 3-Column Component Breakdown: Target + Cross-Talk = Total Retrieved */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
          {/* 1. Target Contribution */}
          <div className="space-y-3 bg-[#F7F7F4] p-4 border border-[#E2E4E8]">
            <div className="flex justify-between items-baseline border-b border-[#E2E4E8] pb-1.5">
              <span className="text-xs font-bold text-[#0284C7] uppercase font-mono">
                1. TARGET CONTRIBUTION
              </span>
              <span className="text-[11px] font-mono text-[#626873]">
                ||signal|| = {signalMagnitude.toFixed(3)}
              </span>
            </div>

            <div className="p-2.5 bg-[#FFFFFF] border border-[#E2E4E8] font-mono text-xs text-[#111318]">
              {"λ^(t-j) η v_j (k_jᵀ q_j)"}
            </div>

            <p className="text-[11px] text-[#626873] leading-relaxed">
              Target associative memory term, scaled by retention decay λ^(t-j) and key projection.
            </p>

            {/* Vector Profile */}
            <div
              className="grid gap-1 pt-1"
              style={{ gridTemplateColumns: `repeat(${Math.min(dim, 16)}, minmax(0, 1fr))` }}
            >
              {signalComponent.slice(0, dim).map((val, idx) => {
                const heightPct = Number(((Math.abs(val) / maxBar) * 100).toFixed(1));
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-full bg-[#EAEBE5] h-10 flex items-end justify-center">
                      <div className="w-full bg-[#0284C7]" style={{ height: `${heightPct}%` }} />
                    </div>
                    <span className="text-[8px] font-mono text-[#626873] mt-0.5 font-semibold">
                      {Math.abs(val) < 0.05 ? "0" : val.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Cross-Talk Contribution */}
          <div className="space-y-3 bg-[#F7F7F4] p-4 border border-[#E2E4E8]">
            <div className="flex justify-between items-baseline border-b border-[#E2E4E8] pb-1.5">
              <span className="text-xs font-bold text-[#D97706] uppercase font-mono">
                2. CROSS-TALK CONTRIBUTION
              </span>
              <span className="text-[11px] font-mono text-[#626873]">
                ||crosstalk|| = {crosstalkMagnitude.toFixed(3)}
              </span>
            </div>

            <div className="p-2.5 bg-[#FFFFFF] border border-[#E2E4E8] font-mono text-xs text-[#111318]">
              {"Σ_(i ≠ j) λ^(t-i) η v_i (k_iᵀ q_j)"}
            </div>

            <p className="text-[11px] text-[#626873] leading-relaxed">
              Non-target terms from stored keys having non-zero inner product with query q.
            </p>

            {/* Vector Profile */}
            <div
              className="grid gap-1 pt-1"
              style={{ gridTemplateColumns: `repeat(${Math.min(dim, 16)}, minmax(0, 1fr))` }}
            >
              {interferenceComponent.slice(0, dim).map((val, idx) => {
                const heightPct = Number(((Math.abs(val) / maxBar) * 100).toFixed(1));
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-full bg-[#EAEBE5] h-10 flex items-end justify-center">
                      <div className="w-full bg-[#D97706]" style={{ height: `${heightPct}%` }} />
                    </div>
                    <span className="text-[8px] font-mono text-[#626873] mt-0.5 font-semibold">
                      {Math.abs(val) < 0.05 ? "0" : val.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Total Retrieved Vector */}
          <div className="space-y-3 bg-[#F7F7F4] p-4 border border-[#111318]/20 bg-[#FBFBFA]">
            <div className="flex justify-between items-baseline border-b border-[#E2E4E8] pb-1.5">
              <span className="text-xs font-bold text-[#111318] uppercase font-mono">
                3. TOTAL RETRIEVED (y = S q)
              </span>
              <span className="text-[11px] font-mono text-[#111318] font-bold">
                ||y|| = {vectorNorm(retrievedValue).toFixed(3)}
              </span>
            </div>

            <div className="p-2.5 bg-[#FFFFFF] border border-[#E2E4E8] font-mono text-xs text-[#111318] font-semibold">
              {"y = Target + Cross-Talk"}
            </div>

            <p className="text-[11px] text-[#626873] leading-relaxed">
              Output vector returned by the state matrix: Target plus non-target interference.
            </p>

            {/* Vector Profile */}
            <div
              className="grid gap-1 pt-1"
              style={{ gridTemplateColumns: `repeat(${Math.min(dim, 16)}, minmax(0, 1fr))` }}
            >
              {retrievedValue.slice(0, dim).map((val, idx) => {
                const heightPct = Number(((Math.abs(val) / maxBar) * 100).toFixed(1));
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-full bg-[#EAEBE5] h-10 flex items-end justify-center">
                      <div className="w-full bg-[#111318]" style={{ height: `${heightPct}%` }} />
                    </div>
                    <span className="text-[8px] font-mono text-[#111318] mt-0.5 font-bold">
                      {Math.abs(val) < 0.05 ? "0" : val.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scientific Formulation Note */}
        {!isExactLinear && (
          <div className="p-3 bg-[#F0F1ED] border border-[#D9DCE1] text-xs text-[#626873] font-mono leading-relaxed">
            <strong>Note on BDH-Inspired Teaching Abstraction:</strong> In this simplified model, Top-K connection pruning nonlinearly zeroes out low-magnitude weights in the state matrix. The measured output reflects the sparse pruned representation, and exact linear superposition does not hold after nonlinear pruning.
          </div>
        )}
      </div>
    </section>
  );
};
