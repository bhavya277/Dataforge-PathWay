"use client";

import React from "react";
import { KeyValuePair } from "@/lib/types";

interface KeyGeometryPlotProps {
  pairs: KeyValuePair[];
  correlationParam: number;
}

export const KeyGeometryPlot: React.FC<KeyGeometryPlotProps> = ({ pairs, correlationParam }) => {
  if (!pairs || pairs.length === 0) return null;

  // Project keys onto first 2 principal components / 2D projection
  // For synthetic vectors, [k[0], k[1]] or dot products with reference vectors
  const projectedPoints = pairs.map((p, idx) => {
    const x = p.keyVector[0] || 0;
    const y = p.keyVector[1] || 0;
    return { id: p.id, label: p.label, x, y, color: p.color };
  });

  // Calculate bounding box and center
  const width = 220;
  const height = 220;
  const cx = width / 2;
  const cy = height / 2;
  const scale = 75;

  return (
    <div className="border border-white/[0.08] bg-[#0B0D12] p-5 font-mono text-xs flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/[0.08] pb-3 mb-3 gap-1">
          <span className="text-xs font-bold tracking-widest text-white uppercase">
            KEY GEOMETRY &amp; 2D SUBSPACE PROJECTION
          </span>
          <span className="text-[10px] text-slate-400">
            k_i ∈ ℝ^d → ℝ²
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-3">
          ρ controls the shared-component structure; observed pairwise cosine values are empirical observations.
        </p>

        {/* 2D Unit Subspace Scatter Visualizer */}
        <div className="flex items-center justify-center my-2">
          <svg
            width={width}
            height={height}
            className="bg-black/80 border border-white/10"
          >
            {/* Unit circle reference */}
            <circle
              cx={cx}
              cy={cy}
              r={scale}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeDasharray="3 3"
            />
            {/* Axis Lines */}
            <line
              x1={cx}
              y1={10}
              x2={cx}
              y2={height - 10}
              stroke="rgba(255, 255, 255, 0.08)"
            />
            <line
              x1={10}
              y1={cy}
              x2={width - 10}
              y2={cy}
              stroke="rgba(255, 255, 255, 0.08)"
            />

            {/* Key Vectors from Origin */}
            {projectedPoints.map((pt) => {
              const px = Number((cx + pt.x * scale).toFixed(2));
              const py = Number((cy - pt.y * scale).toFixed(2));
              const tx = Number((px + (px >= cx ? 6 : -18)).toFixed(2));
              const ty = Number((py + (py >= cy ? 10 : -4)).toFixed(2));
              return (
                <g key={pt.id}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={px}
                    y2={py}
                    stroke={pt.color}
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                  />
                  <circle
                    cx={px}
                    cy={py}
                    r="4"
                    fill={pt.color}
                  />
                  <text
                    x={tx}
                    y={ty}
                    fill="#F1F5F9"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    k_{pt.id + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/[0.08] text-[10px] text-slate-400 flex justify-between">
        <span>
          {correlationParam === 0
            ? "Orthonormal Base (Independent Subspaces)"
            : correlationParam > 0.5
            ? "Clustered Alignment (High Overlap)"
            : "Moderate Shared Component"}
        </span>
        <span className="text-cyan-300 font-bold">ρ = {correlationParam.toFixed(2)}</span>
      </div>
    </div>
  );
};
