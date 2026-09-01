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
    <div className="bg-[#101217] border border-white/[0.08] rounded-lg p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
          <div>
            <span className="font-mono text-xs font-bold text-white tracking-wider">KEY OVERLAP (GRAM MATRIX G)</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            <span>G = K Kᵀ ∈ ℝ^({N}×{N})</span>
          </div>
        </div>

        {/* Observed Pairwise Stats */}
        <div className="grid grid-cols-2 gap-2 my-2.5 bg-black/40 p-2 rounded border border-white/5 text-[10px] font-mono">
          <div>
            <span className="text-slate-400 block">Controlled Parameter ρ:</span>
            <span className="font-bold text-amber-400">{correlationParam.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Observed Pairwise Cosine:</span>
            <span className="font-bold text-white">
              {stats.meanCosine.toFixed(2)} ± {stats.stdCosine.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Grid Canvas */}
        <div className="flex items-center justify-center my-2">
          <div
            className="grid gap-[1px] bg-black/60 p-1.5 rounded border border-white/5"
            style={{
              gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))`,
              width: N <= 6 ? "200px" : N <= 10 ? "240px" : "280px",
              height: N <= 6 ? "200px" : N <= 10 ? "240px" : "280px",
            }}
          >
            {gramMatrix.map((row, i) =>
              row.map((val, j) => {
                const isDiag = i === j;
                const isHovered = hovered?.i === i && hovered?.j === j;
                const absVal = Math.abs(val);

                let bg = "rgba(22, 26, 34, 0.8)";
                if (isDiag) {
                  bg = "rgba(0, 229, 255, 0.9)";
                } else if (absVal > 0.01) {
                  bg = `rgba(245, 158, 11, ${0.15 + absVal * 0.85})`;
                }

                return (
                  <div
                    key={`${i}-${j}`}
                    onMouseEnter={() => setHovered({ i, j, val })}
                    onMouseLeave={() => setHovered(null)}
                    className={`rounded-[1px] flex items-center justify-center transition-all cursor-pointer ${
                      isHovered ? "ring-1 ring-white scale-105 z-10" : ""
                    }`}
                    style={{ backgroundColor: bg }}
                  >
                    {N <= 8 && (
                      <span
                        className={`text-[8px] font-mono font-bold select-none ${
                          isDiag ? "text-slate-950" : "text-white/90"
                        }`}
                      >
                        {val.toFixed(1)}
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
      <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] font-mono min-h-[32px] flex items-center justify-between">
        {hovered ? (
          hovered.i === hovered.j ? (
            <span className="text-cyan-300">
              Diagonal G[{hovered.i + 1},{hovered.j + 1}]: k_{hovered.i + 1} · k_{hovered.j + 1} = {hovered.val.toFixed(2)} (Unit Self-Norm)
            </span>
          ) : (
            <span className="text-amber-300">
              k_{hovered.i + 1} · k_{hovered.j + 1} = {hovered.val.toFixed(3)} — Keys overlap, contributing cross-talk.
            </span>
          )
        ) : (
          <span className="text-slate-400">Hover cell to inspect pairwise inner product kᵢᵀ kⱼ</span>
        )}
      </div>
    </div>
  );
};
