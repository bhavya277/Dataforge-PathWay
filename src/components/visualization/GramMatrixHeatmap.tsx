"use client";

import React, { useState } from "react";
import { KeySetStats, KeyValuePair } from "@/lib/types";

interface GramMatrixHeatmapProps {
  gramMatrix: number[][];
  pairLabels: string[];
  stats: KeySetStats;
  correlationParam: number;
  pairs?: KeyValuePair[];
}

export const GramMatrixHeatmap: React.FC<GramMatrixHeatmapProps> = ({
  gramMatrix,
  pairLabels,
  stats,
  correlationParam,
  pairs = [],
}) => {
  const [hovered, setHovered] = useState<{ i: number; j: number; val: number } | null>(null);

  if (!gramMatrix || gramMatrix.length === 0) return null;
  const N = gramMatrix.length;

  return (
    <div className="py-6 space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-[#D9DCE1] pb-4">
        <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
          04 / KEY GEOMETRY
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] mt-1">
          KEY OVERLAP &amp; GRAM MATRIX
        </h2>
        <p className="text-sm text-[#626873] mt-1 max-w-2xl">
          Off-diagonal inner products G_ij = k_iᵀ k_j measure geometric key alignment that induces additive cross-talk interference.
        </p>
      </div>

      {/* Main Grid: Left Primary Gram Matrix | Right Observed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Primary Gram Matrix Visualization (8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#D9DCE1] p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-baseline border-b border-[#E2E4E8] pb-2">
            <span className="text-xs font-bold text-[#111318] uppercase tracking-wider">
              GRAM MATRIX G = K Kᵀ ∈ ℝ^({N}×{N})
            </span>
            <span className="text-xs font-mono text-[#D97706] font-bold">
              CONTROLLED KEY CORRELATION ρ = {correlationParam.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col items-center my-2">
            <div
              className="grid gap-[2px] bg-[#090B0F] p-3 border border-[#1E232E] shadow-inner"
              style={{
                gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))`,
                width: N <= 6 ? "260px" : N <= 10 ? "320px" : "380px",
                height: N <= 6 ? "260px" : N <= 10 ? "320px" : "380px",
              }}
            >
              {gramMatrix.map((row, i) =>
                row.map((val, j) => {
                  const isDiag = i === j;
                  const isHovered = hovered?.i === i && hovered?.j === j;
                  const absVal = Math.abs(val);
                  const displayVal = Math.abs(val) < 0.01 ? 0 : val;

                  let bg = "#0D1017";
                  if (isDiag) {
                    bg = "#00E5FF";
                  } else if (absVal > 0.01) {
                    const alpha = (0.25 + absVal * 0.75).toFixed(3);
                    bg = `rgba(245, 158, 11, ${alpha})`;
                  }

                  return (
                    <div
                      key={`${i}-${j}`}
                      onMouseEnter={() => setHovered({ i, j, val })}
                      onMouseLeave={() => setHovered(null)}
                      className={`flex items-center justify-center transition-all cursor-pointer relative ${
                        isHovered ? "ring-2 ring-white scale-105 z-20" : ""
                      }`}
                      style={{ backgroundColor: bg }}
                    >
                      {N <= 8 && (
                        <span
                          className={`text-[10px] font-mono font-bold select-none ${
                            isDiag ? "text-slate-950 font-bold" : "text-white drop-shadow"
                          }`}
                        >
                          {displayVal === 0 ? "0.0" : displayVal.toFixed(1)}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Interactive Inspection Tooltip */}
          <div className="pt-3 border-t border-[#E2E4E8] text-xs font-mono min-h-[28px] flex items-center justify-between">
            {hovered ? (
              hovered.i === hovered.j ? (
                <span className="text-[#0284C7] font-bold">
                  Diagonal G[{hovered.i + 1},{hovered.j + 1}]: k_{hovered.i + 1} · k_{hovered.j + 1} = 1.00 (Self-Norm)
                </span>
              ) : (
                <span className="text-[#D97706] font-bold">
                  G[{hovered.i + 1},{hovered.j + 1}] = {hovered.val.toFixed(3)} — Memory {hovered.j + 1} bleeds into query {hovered.i + 1}.
                </span>
              )
            ) : (
              <span className="text-[#8A909A]">Hover cell to inspect pairwise inner product kᵢᵀ kⱼ</span>
            )}
          </div>
        </div>

        {/* Right Column: Observed Pairwise Key Statistics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-5 shadow-sm space-y-4">
            <span className="text-xs font-mono font-bold text-[#111318] uppercase tracking-wider block border-b border-[#E2E4E8] pb-2">
              OBSERVED PAIRWISE COSINE
            </span>

            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#626873]">Observed Mean (μ)</span>
                <span className="text-lg font-mono font-bold text-[#111318]">{stats.meanCosine.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-[#F0F1ED] pt-2">
                <span className="text-xs text-[#626873]">Std Dev (σ)</span>
                <span className="text-sm font-mono font-semibold text-[#626873]">±{stats.stdCosine.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-[#F0F1ED] pt-2">
                <span className="text-xs text-[#626873]">Min Cosine</span>
                <span className="text-sm font-mono font-semibold text-[#111318]">{stats.minCosine.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-[#F0F1ED] pt-2">
                <span className="text-xs text-[#626873]">Max Cosine</span>
                <span className="text-sm font-mono font-bold text-[#D97706]">{stats.maxCosine.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Secondary 2D Subspace Projection Visualizer */}
          {pairs.length > 0 && (
            <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-4 shadow-sm space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#8A909A] uppercase tracking-wider block">
                2D SUBSPACE PROJECTION (k_i ∈ ℝ^d → ℝ²)
              </span>
              <div className="flex justify-center py-1">
                <svg width={160} height={160} className="bg-[#090B0F] border border-[#1E232E]">
                  <circle cx={80} cy={80} r={55} fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 2" />
                  <line x1={80} y1={8} x2={80} y2={152} stroke="rgba(255,255,255,0.08)" />
                  <line x1={8} y1={80} x2={152} y2={80} stroke="rgba(255,255,255,0.08)" />
                  {pairs.map((p) => {
                    const px = Number((80 + (p.keyVector[0] || 0) * 55).toFixed(2));
                    const py = Number((80 - (p.keyVector[1] || 0) * 55).toFixed(2));
                    return (
                      <g key={p.id}>
                        <line x1={80} y1={80} x2={px} y2={py} stroke={p.color} strokeWidth="1.5" strokeOpacity="0.8" />
                        <circle cx={px} cy={py} r="3" fill={p.color} />
                      </g>
                    );
                  })}
                </svg>
              </div>
              <p className="text-[10px] text-[#8A909A] text-center">
                {correlationParam === 0 ? "Independent Subspaces" : "Clustered Overlap"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
