"use client";

import React, { useState } from "react";

interface GramMatrixHeatmapProps {
  gramMatrix: number[][];
  pairLabels: string[];
}

export const GramMatrixHeatmap: React.FC<GramMatrixHeatmapProps> = ({
  gramMatrix,
  pairLabels,
}) => {
  const [hovered, setHovered] = useState<{ i: number; j: number; val: number } | null>(null);

  if (!gramMatrix || gramMatrix.length === 0) return null;
  const N = gramMatrix.length;

  // Compute off-diagonal average (mean cross-talk)
  let offDiagSum = 0;
  let offDiagCount = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (i !== j) {
        offDiagSum += Math.abs(gramMatrix[i][j]);
        offDiagCount++;
      }
    }
  }
  const meanOffDiag = offDiagCount > 0 ? offDiagSum / offDiagCount : 0;

  return (
    <div className="bg-[#11141B] border border-white/10 rounded-xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Gram Matrix G = K Kᵀ ∈ ℝ^(N × N)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inner products Gᵢⱼ = kᵢᵀ kⱼ. Off-diagonal elements measure cross-talk overlap.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400">Mean Cross-Talk (ρ)</span>
            <div className="text-sm font-mono font-bold text-amber-400">{meanOffDiag.toFixed(3)}</div>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="flex items-center justify-center mt-3">
          <div
            className="grid gap-[2px] bg-black/40 p-2 rounded-lg border border-white/5"
            style={{
              gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))`,
              width: N <= 6 ? "220px" : N <= 12 ? "280px" : "320px",
              height: N <= 6 ? "220px" : N <= 12 ? "280px" : "320px",
            }}
          >
            {gramMatrix.map((row, i) =>
              row.map((val, j) => {
                const isDiag = i === j;
                const isHovered = hovered?.i === i && hovered?.j === j;
                const absVal = Math.abs(val);

                // Color calculation: Diagonal is white/cyan, off-diagonal is amber/crimson based on magnitude
                let bg = "rgba(26, 30, 39, 0.6)";
                if (isDiag) {
                  bg = "rgba(0, 229, 255, 0.9)";
                } else if (absVal > 0.001) {
                  bg = `rgba(255, 184, 0, ${0.15 + absVal * 0.85})`;
                }

                return (
                  <div
                    key={`${i}-${j}`}
                    onMouseEnter={() => setHovered({ i, j, val })}
                    onMouseLeave={() => setHovered(null)}
                    className={`rounded flex items-center justify-center transition-all cursor-pointer ${
                      isHovered ? "ring-2 ring-white z-10 scale-105" : ""
                    }`}
                    style={{ backgroundColor: bg }}
                  >
                    {N <= 8 && (
                      <span
                        className={`text-[9px] font-mono font-bold select-none ${
                          isDiag ? "text-slate-900" : "text-white"
                        }`}
                      >
                        {val.toFixed(2)}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Explanation */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-3 text-slate-400">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span>
            <span>Diagonal (kᵢᵀ kᵢ = 1.0)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
            <span>Off-Diagonal (Cross-Talk)</span>
          </div>
        </div>

        <div className="text-amber-300 font-medium">
          {hovered ? (
            <span>
              {hovered.i === hovered.j ? (
                <span>
                  Diagonal G[{hovered.i}, {hovered.i}]: k_{pairLabels[hovered.i]?.slice(-1) || hovered.i} · k_{pairLabels[hovered.i]?.slice(-1) || hovered.i} = {hovered.val.toFixed(2)} (Unit Self-Norm)
                </span>
              ) : (
                <span>
                  Off-Diagonal G[{hovered.i}, {hovered.j}]: k_{pairLabels[hovered.i]?.slice(-1) || hovered.i} · k_{pairLabels[hovered.j]?.slice(-1) || hovered.j} = {hovered.val.toFixed(3)} (Non-orthogonal cross-talk overlap)
                </span>
              )}
            </span>
          ) : (
            <span className="text-slate-500">Hover cell to inspect pairwise key similarity</span>
          )}
        </div>
      </div>
    </div>
  );
};
