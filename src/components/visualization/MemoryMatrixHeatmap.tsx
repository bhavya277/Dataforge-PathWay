"use client";

import React, { useState } from "react";

interface MemoryMatrixHeatmapProps {
  matrix: number[][];
  d: number;
  t: number;
  decay: number;
  isBDH?: boolean;
  showSectionHeader?: boolean;
  customTitle?: string;
  customSubtitle?: string;
}

export const MemoryMatrixHeatmap: React.FC<MemoryMatrixHeatmapProps> = ({
  matrix,
  d,
  t,
  decay,
  isBDH = false,
  showSectionHeader = true,
  customTitle,
  customSubtitle,
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
      const alpha = (0.2 + ratio * 0.8).toFixed(3);
      return `rgba(0, 229, 255, ${alpha})`;
    } else {
      const alpha = (0.2 + ratio * 0.8).toFixed(3);
      return `rgba(244, 63, 94, ${alpha})`;
    }
  };

  return (
    <div className="py-4 space-y-6">
      {/* Editorial Section Introduction */}
      {showSectionHeader && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9DCE1] pb-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
              {customTitle ? "RECURRENT STATE" : "01 / THE MEMORY"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] mt-1">
              {customTitle || "WATCH THE MEMORY FORM"}
            </h2>
            <p className="text-sm text-[#626873] mt-1 max-w-xl">
              {customSubtitle ||
                "Each stored association contributes a rank-1 outer product matrix ΔS = vₜ kₜᵀ to the fixed-size recurrent state."}
            </p>
          </div>

          {/* State Indicators */}
          <div className="flex items-center space-x-4 text-xs font-mono bg-[#FFFFFF] px-4 py-2 border border-[#D9DCE1] shadow-sm">
            <div>
              <span className="text-[#8A909A] block text-[10px]">TIME t</span>
              <span className="font-bold text-[#111318]">t = {t}</span>
            </div>
            <div className="border-l border-[#E2E4E8] pl-3">
              <span className="text-[#8A909A] block text-[10px]">DIM d</span>
              <span className="font-bold text-[#111318]">d = {d}</span>
            </div>
            <div className="border-l border-[#E2E4E8] pl-3">
              <span className="text-[#8A909A] block text-[10px]">DECAY λ</span>
              <span className="font-bold text-[#111318]">λ = {decay.toFixed(2)}</span>
            </div>
            <div className="border-l border-[#E2E4E8] pl-3">
              <span className="text-[#8A909A] block text-[10px]">RANK BOUND</span>
              <span className="font-bold text-[#0284C7]">Rank ≤ {d}</span>
            </div>
          </div>
        </div>
      )}

      {/* Large Matrix Hero Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        {/* The Matrix Hero (70% visual prominence) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-[#FFFFFF] border border-[#D9DCE1] shadow-sm">
          <div className="text-xs font-mono text-[#8A909A] mb-2 uppercase tracking-wider">
            ← Key Column Index (1..{d}) →
          </div>

          <div className="flex items-center">
            <div className="text-xs font-mono text-[#8A909A] mr-3 -rotate-90 origin-center whitespace-nowrap uppercase tracking-wider">
              ← Value Row Index (1..{d}) →
            </div>

            <div
              className="grid gap-[2px] bg-[#090B0F] p-3 border border-[#1E232E] shadow-inner"
              style={{
                gridTemplateColumns: `repeat(${d}, minmax(0, 1fr))`,
                width: d <= 8 ? "360px" : d <= 12 ? "420px" : "480px",
                height: d <= 8 ? "360px" : d <= 12 ? "420px" : "480px",
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
                        <span className="text-[10px] font-mono font-bold text-white/95 select-none drop-shadow">
                          {displayVal === 0 ? "0" : displayVal.toFixed(1)}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Matrix Weights Legend */}
          <div className="w-full flex items-center justify-between mt-4 pt-3 border-t border-[#E2E4E8] text-xs font-mono">
            <div className="flex items-center space-x-4 text-[11px] text-[#626873]">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 bg-[#00E5FF]" />
                <span>+ Weight</span>
              </span>
              {!isBDH && (
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 bg-[#F43F5E]" />
                  <span>- Weight</span>
                </span>
              )}
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 bg-[#0D1017] border border-white/20" />
                <span>0.0</span>
              </span>
            </div>

            <div className="text-xs font-mono font-bold text-[#111318]">
              {hovered ? (
                <span>
                  S[{hovered.r + 1}, {hovered.c + 1}] = {hovered.val.toFixed(4)}
                </span>
              ) : (
                <span className="text-[#8A909A] font-normal">Hover cell for exact weight</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Explanatory Column (30%) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] space-y-2">
            <span className="text-[10px] font-mono text-[#8A909A] uppercase tracking-widest block">
              STATE SPACE
            </span>
            <div className="text-sm font-bold font-mono text-[#111318]">
              {"S_t \\in \\mathbb{R}^{" + d + "\\times " + d + "}"}
            </div>
            <p className="text-xs text-[#626873] leading-relaxed">
              Stores {t} associative key-value updates in {d}×{d} = {d * d} real scalar parameters.
            </p>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] space-y-2">
            <span className="text-[10px] font-mono text-[#8A909A] uppercase tracking-widest block">
              RECURRENCE FORMULATION
            </span>
            <div className="text-xs font-mono font-bold text-[#0284C7] bg-[#F7F7F4] p-2.5 border border-[#E2E4E8]">
              {decay === 1.0 ? "Sₜ = Sₜ₋₁ + vₜ kₜᵀ" : `Sₜ = ${decay.toFixed(2)} Sₜ₋₁ + vₜ kₜᵀ`}
            </div>
            <p className="text-xs text-[#626873] leading-relaxed">
              When key vectors are mutually orthonormal, each association occupies an independent subspace with zero cross-talk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
