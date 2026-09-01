"use client";

import React, { useState } from "react";

interface MemoryMatrixHeatmapProps {
  matrix: number[][];
  title?: string;
  subtitle?: string;
  isBDH?: boolean;
}

export const MemoryMatrixHeatmap: React.FC<MemoryMatrixHeatmapProps> = ({
  matrix,
  title = "Recurrent State Matrix Sₜ ∈ ℝ^(d × d)",
  subtitle = "Dynamic fast-weight synaptic matrix accumulating outer products: Sₜ = λSₜ₋₁ + vₜkₜᵀ",
  isBDH = false,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number; val: number } | null>(null);
  const [showValues, setShowValues] = useState<boolean>(true);

  if (!matrix || matrix.length === 0) return null;
  const d = matrix.length;

  // Find max absolute value for dynamic normalization
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
      return "rgba(26, 30, 39, 0.6)"; // Zero state
    }
    const ratio = Math.min(1, Math.abs(val) / maxAbs);

    if (isBDH) {
      // BDH: strictly non-negative sparse positive weights (emerald/cyan)
      return `rgba(0, 245, 160, ${0.15 + ratio * 0.85})`;
    }

    if (val > 0) {
      // Positive activation (Cyan)
      return `rgba(0, 229, 255, ${0.15 + ratio * 0.85})`;
    } else {
      // Negative activation (Violet/Crimson)
      return `rgba(255, 0, 85, ${0.15 + ratio * 0.85})`;
    }
  };

  return (
    <div className="bg-[#11141B] border border-white/10 rounded-xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <span>{title}</span>
              {isBDH && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sparse Non-Negative
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={() => setShowValues(!showValues)}
            className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
          >
            {showValues ? "Hide Numbers" : "Show Numbers"}
          </button>
        </div>

        {/* Matrix Grid Canvas */}
        <div className="relative mt-4 flex items-center justify-center">
          <div className="flex flex-col items-center">
            {/* Top axis label (Key Dim) */}
            <div className="text-[10px] font-mono text-cyan-400/80 mb-1 flex items-center space-x-1">
              <span>← Key Dimension (kᵀ) : d = {d} →</span>
            </div>

            <div className="flex items-center">
              {/* Left axis label (Value Dim) */}
              <div className="text-[10px] font-mono text-violet-400/80 mr-2 -rotate-90 origin-center whitespace-nowrap">
                ← Value Dim (v) : d = {d} →
              </div>

              {/* Grid */}
              <div
                className="grid gap-[2px] bg-black/40 p-2 rounded-lg border border-white/5"
                style={{
                  gridTemplateColumns: `repeat(${d}, minmax(0, 1fr))`,
                  width: d <= 8 ? "280px" : d <= 16 ? "340px" : "380px",
                  height: d <= 8 ? "280px" : d <= 16 ? "340px" : "380px",
                }}
              >
                {matrix.map((row, r) =>
                  row.map((val, c) => {
                    const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                    return (
                      <div
                        key={`${r}-${c}`}
                        onMouseEnter={() => setHoveredCell({ r, c, val })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`relative rounded flex items-center justify-center transition-all cursor-crosshair ${
                          isHovered ? "ring-2 ring-white z-10 scale-105" : ""
                        }`}
                        style={{ backgroundColor: getCellColor(val) }}
                      >
                        {showValues && d <= 8 && (
                          <span className="text-[9px] font-mono font-medium text-white/90 drop-shadow select-none">
                            {Math.abs(val) < 0.001 ? "0" : val.toFixed(2)}
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

      {/* Footer Info & Inspector */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <div className="text-slate-400 flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span>
            <span>+ Positive</span>
          </div>
          {!isBDH && (
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
              <span>- Negative</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#1A1E27]"></span>
            <span>0 Zero</span>
          </div>
        </div>

        <div className="text-cyan-300 font-medium">
          {hoveredCell ? (
            <span>
              Cell [{hoveredCell.r}, {hoveredCell.c}] = {hoveredCell.val.toFixed(4)}
            </span>
          ) : (
            <span className="text-slate-500">Hover cell to inspect weight</span>
          )}
        </div>
      </div>
    </div>
  );
};
