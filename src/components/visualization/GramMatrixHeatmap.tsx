"use client";

import React, { useState } from "react";
import { KeySetStats } from "@/lib/types";

interface GramMatrixHeatmapProps {
  gramMatrix: number[][];
  pairLabels: string[];
  stats: KeySetStats;
  correlationParam: number;
}

export const GramMatrixHeatmap: React.FC<GramMatrixHeatmapProps> = ({
  gramMatrix,
  pairLabels,
  stats,
  correlationParam,
}) => {
  const [hovered, setHovered] = useState<{ i: number; j: number; val: number } | null>(null);

  if (!gramMatrix || gramMatrix.length === 0) return null;
  const N = gramMatrix.length;

  return (
    <div className="border border-white/[0.08] bg-[#0B0D12] p-5 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/[0.08] pb-3 mb-3 gap-1">
          <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            KEY OVERLAP (GRAM MATRIX G)
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            G = K Kᵀ ∈ ℝ^({N}×{N})
          </span>
        </div>

        <p className="text-[11px] text-slate-400 font-mono mb-3">
          Off-diagonal values G_ij = k_iᵀ k_j measure geometric key alignment that induces retrieval cross-talk.
        </p>

        {/* Observed Pairwise Cosine Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/60 p-2.5 border border-white/10 mb-4 font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Param ρ</span>
            <span className="font-bold text-amber-400">{correlationParam.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Observed Mean</span>
            <span className="font-bold text-white">{stats.meanCosine.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Std Dev (σ)</span>
            <span className="font-bold text-slate-300">±{stats.stdCosine.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Min / Max</span>
            <span className="font-bold text-slate-300">
              {stats.minCosine.toFixed(2)} / {stats.maxCosine.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="flex items-center justify-center my-2">
          <div
            className="grid gap-[2px] bg-black/80 p-2 border border-white/10"
            style={{
              gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))`,
              width: N <= 6 ? "220px" : N <= 10 ? "260px" : "300px",
              height: N <= 6 ? "220px" : N <= 10 ? "260px" : "300px",
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
                  const alpha = (0.2 + absVal * 0.8).toFixed(3);
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
                        className={`text-[9px] font-mono font-bold select-none ${
                          isDiag ? "text-slate-950" : "text-white drop-shadow"
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
      </div>

      {/* Dynamic Inspector Tooltip */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.08] text-xs font-mono min-h-[30px] flex items-center justify-between">
        {hovered ? (
          hovered.i === hovered.j ? (
            <span className="text-cyan-300">
              Diagonal G[{hovered.i + 1},{hovered.j + 1}]: k_{hovered.i + 1} · k_{hovered.j + 1} = {hovered.val.toFixed(2)} (Unit Self-Norm)
            </span>
          ) : (
            <span className="text-amber-300">
              k_{hovered.i + 1} · k_{hovered.j + 1} = {hovered.val.toFixed(3)} — Keys overlap, so memory {hovered.j + 1} bleeds into retrieval of memory {hovered.i + 1}.
            </span>
          )
        ) : (
          <span className="text-slate-400">Hover cell to inspect pairwise inner product kᵢᵀ kⱼ</span>
        )}
      </div>
    </div>
  );
};
