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
    if (Math.abs(val) < 1e-6) {
      return "rgba(22, 26, 34, 0.9)";
    }
    const ratio = Math.min(1, Math.abs(val) / maxAbs);

    if (isBDH) {
      return `rgba(16, 185, 129, ${0.2 + ratio * 0.8})`;
    }
    if (val > 0) {
      return `rgba(0, 229, 255, ${0.15 + ratio * 0.85})`;
    } else {
      return `rgba(244, 63, 94, ${0.15 + ratio * 0.85})`;
    }
  };

  return (
    <div className="bg-[#101217] border border-white/[0.08] rounded-lg p-4 flex flex-col justify-between">
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-white tracking-wider">{title}</span>
            {isBDH && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                SPARSE POSITIVE
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
            <span>S ∈ ℝ^({d}×{d})</span>
            <span>•</span>
            <span>t = {t}</span>
            <span>•</span>
            <span>λ = {decay.toFixed(2)}</span>
          </div>
        </div>

        {/* Dynamic Formula Reminder */}
        <div className="text-[10px] font-mono text-slate-400 my-2">
          {decay === 1.0 ? (
            <span>Sₜ = Sₜ₋₁ + vₜ kₜᵀ = ∑ᵢ vᵢ kᵢᵀ</span>
          ) : (
            <span>Sₜ = {decay.toFixed(2)}·Sₜ₋₁ + vₜ kₜᵀ = ∑ᵢ ({decay.toFixed(2)})^(t-i) vᵢ kᵢᵀ</span>
          )}
        </div>

        {/* Heatmap Grid */}
        <div className="mt-3 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="text-[9px] font-mono text-cyan-400/70 mb-1">
              ← Key Dimension kᵀ (1..{d}) →
            </div>

            <div className="flex items-center">
              <div className="text-[9px] font-mono text-slate-400/80 mr-1.5 -rotate-90 origin-center whitespace-nowrap">
                ← Value v (1..{d}) →
              </div>

              <div
                className="grid gap-[1px] bg-black/60 p-1.5 rounded border border-white/5"
                style={{
                  gridTemplateColumns: `repeat(${d}, minmax(0, 1fr))`,
                  width: d <= 8 ? "240px" : d <= 12 ? "280px" : "320px",
                  height: d <= 8 ? "240px" : d <= 12 ? "280px" : "320px",
                }}
              >
                {matrix.map((row, r) =>
                  row.map((val, c) => {
                    const isHovered = hovered?.r === r && hovered?.c === c;
                    return (
                      <div
                        key={`${r}-${c}`}
                        onMouseEnter={() => setHovered({ r, c, val })}
                        onMouseLeave={() => setHovered(null)}
                        className={`rounded-[1px] flex items-center justify-center transition-all cursor-crosshair ${
                          isHovered ? "ring-1 ring-white scale-105 z-10" : ""
                        }`}
                        style={{ backgroundColor: getCellColor(val) }}
                      >
                        {d <= 8 && (
                          <span className="text-[8px] font-mono text-white/90 drop-shadow select-none">
                            {Math.abs(val) < 0.01 ? "0" : val.toFixed(1)}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cell Value Readout */}
      <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center space-x-3 text-slate-400 text-[10px]">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-[1px] bg-cyan-400"></span>
            <span>+ Weight</span>
          </span>
          {!isBDH && (
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-[1px] bg-rose-500"></span>
              <span>- Weight</span>
            </span>
          )}
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-[1px] bg-[#161a22]"></span>
            <span>0</span>
          </span>
        </div>

        <div className="text-cyan-300 font-semibold text-[10px]">
          {hovered ? (
            <span>
              S[{hovered.r}, {hovered.c}] = {hovered.val.toFixed(4)}
            </span>
          ) : (
            <span className="text-slate-400">Hover cell to inspect</span>
          )}
        </div>
      </div>
    </div>
  );
};
