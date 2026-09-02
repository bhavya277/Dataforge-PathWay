"use client";

import React, { useState } from "react";

interface MemoryMatrixHeatmapProps {
  matrix: number[][];
  d: number;
  t: number;
  decay: number;
  title?: string;
  isBDH?: boolean;
}

export const MemoryMatrixHeatmap: React.FC<MemoryMatrixHeatmapProps> = ({
  matrix,
  d,
  t,
  decay,
  title = "RECURRENT MEMORY STATE",
  isBDH = false,
}) => {
  const [hovered, setHovered] = useState<{ r: number; c: number; val: number } | null>(null);

  if (!matrix || matrix.length === 0) return null;

  let maxAbs = 0.001;
  for (let r = 0; r < d; r++) {
    for (let c = 0; c < d; c++) {
      if (Math.abs(matrix[r][c]) > maxAbs) {
        maxAbs = Math.abs(matrix[r][c]);
      }
    }
  }

  const getCellColor = (val: number) => {
    if (Math.abs(val) < 1e-5) {
      return "#0D1017";
    }
    const ratio = Math.min(1, Math.abs(val) / maxAbs);

    if (isBDH) {
      const alpha = (0.2 + ratio * 0.8).toFixed(3);
      return `rgba(16, 185, 129, ${alpha})`;
    }
    if (val > 0) {
      const alpha = (0.15 + ratio * 0.85).toFixed(3);
      return `rgba(0, 229, 255, ${alpha})`;
    } else {
      const alpha = (0.15 + ratio * 0.85).toFixed(3);
      return `rgba(244, 63, 94, ${alpha})`;
    }
  };

  return (
    <div className="border border-white/[0.08] bg-[#0B0D12] p-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/[0.08] pb-3 mb-4 gap-2">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            {title}
          </span>
          {isBDH && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 border border-emerald-500/40 text-emerald-400">
              SPARSE POSITIVE
            </span>
          )}
        </div>
        <div className="text-[11px] font-mono text-slate-400 space-x-3">
          <span>Sₜ ∈ ℝ^({d}×{d})</span>
          <span>•</span>
          <span>t = {t}</span>
          <span>•</span>
          <span>λ = {decay.toFixed(2)}</span>
        </div>
      </div>

      {/* Recurrence Equation */}
      <div className="text-xs font-mono text-cyan-400/90 mb-4 bg-black/40 py-1.5 px-3 border-l-2 border-cyan-400">
        {decay === 1.0 ? (
          <span>Sₜ = Sₜ₋₁ + vₜ kₜᵀ = ∑ᵢ vᵢ kᵢᵀ</span>
        ) : (
          <span>Sₜ = {decay.toFixed(2)}·Sₜ₋₁ + vₜ kₜᵀ = ∑ᵢ ({decay.toFixed(2)})^(t-i) vᵢ kᵢᵀ</span>
        )}
      </div>

      {/* Matrix Canvas */}
      <div className="flex flex-col items-center my-3">
        <div className="text-[10px] font-mono text-slate-400 mb-1">
          ← Key Column Index (1..{d}) →
        </div>

        <div className="flex items-center">
          <div className="text-[10px] font-mono text-slate-400 mr-2 -rotate-90 origin-center whitespace-nowrap">
            ← Value Row Index (1..{d}) →
          </div>

          <div
            className="grid gap-[2px] bg-black/80 p-2 border border-white/10"
            style={{
              gridTemplateColumns: `repeat(${d}, minmax(0, 1fr))`,
              width: d <= 8 ? "280px" : d <= 12 ? "340px" : "400px",
              height: d <= 8 ? "280px" : d <= 12 ? "340px" : "400px",
            }}
          >
            {matrix.map((row, r) =>
              row.map((val, c) => {
                const isHovered = hovered?.r === r && hovered?.c === c;
                const displayVal = Math.abs(val) < 0.01 ? 0 : val;
                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseEnter={() => setHovered({ r, c, val })}
                    onMouseLeave={() => setHovered(null)}
                    className={`flex items-center justify-center transition-all cursor-crosshair relative ${
                      isHovered ? "ring-2 ring-white scale-105 z-20" : ""
                    }`}
                    style={{ backgroundColor: getCellColor(val) }}
                  >
                    {d <= 8 && (
                      <span className="text-[9px] font-mono text-white/90 drop-shadow select-none font-semibold">
                        {displayVal === 0 ? "0" : displayVal.toFixed(1)}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Cell Value Readout & Scientific Legend */}
      <div className="mt-4 pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
        <div className="flex items-center space-x-4 text-[10px] text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-cyan-400" />
            <span>+ Weight</span>
          </span>
          {!isBDH && (
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-rose-500" />
              <span>- Weight</span>
            </span>
          )}
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-[#0D1017] border border-white/20" />
            <span>0</span>
          </span>
        </div>

        <div className="text-cyan-300 font-mono text-xs font-bold">
          {hovered ? (
            <span>
              S[{hovered.r + 1}, {hovered.c + 1}] = {hovered.val.toFixed(4)}
            </span>
          ) : (
            <span className="text-slate-400 font-normal">Hover cell for exact Float64 weight</span>
          )}
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mt-2 font-mono">
        Each associative update writes a rank-1 outer product vₜ kₜᵀ into a fixed-size d×d memory state.
      </p>
    </div>
  );
};
