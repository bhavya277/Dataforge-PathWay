"use client";

import React, { useState, useMemo } from "react";
import { generateSyntheticPairs, LiveAssociativeEngine } from "@/lib/math-engine";

type MetricType = "cosineError" | "l2Error" | "isr" | "observedCosine";

export const StressTestExplorer: React.FC = () => {
  const [d, setD] = useState<number>(8);
  const [rho, setRho] = useState<number>(0.35);
  const [lambdaDecay, setLambdaDecay] = useState<number>(1.0);
  const [useBDH, setUseBDH] = useState<boolean>(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("cosineError");

  // Live sweep over sequence length N from 2 to 24
  const sweepResults = useMemo(() => {
    const results = [];
    for (let n = 2; n <= 24; n += 2) {
      const { pairs, stats } = generateSyntheticPairs(n, d, rho, 42 + n * 7);
      const engine = new LiveAssociativeEngine(d, lambdaDecay, 1.0, useBDH);
      pairs.forEach((p) => engine.storePair(p));

      let totalCosErr = 0;
      let totalL2 = 0;
      let totalISR = 0;

      for (let i = 0; i < n; i++) {
        const ret = engine.retrieve(pairs[i].keyVector, i);
        totalCosErr += ret.cosineError;
        totalL2 += ret.rawL2Error;
        totalISR += ret.interferenceToSignalRatio;
      }

      results.push({
        N: n,
        loadRatio: n / d,
        cosineError: totalCosErr / n,
        l2Error: totalL2 / n,
        isr: totalISR / n,
        observedCosine: stats.meanCosine,
        observedStd: stats.stdCosine,
      });
    }
    return results;
  }, [d, rho, lambdaDecay, useBDH]);

  // Compute SVG coordinates for real empirical chart
  const chartWidth = 760;
  const chartHeight = 240;
  const padding = 50;

  const maxVal = useMemo(() => {
    const vals = sweepResults.map((r) => r[selectedMetric]);
    return Math.max(0.01, Math.max(...vals) * 1.15);
  }, [sweepResults, selectedMetric]);

  const minLoad = sweepResults[0]?.loadRatio || 0.25;
  const maxLoad = sweepResults[sweepResults.length - 1]?.loadRatio || 3.0;

  const points = sweepResults.map((r) => {
    const x = Number((padding + ((r.loadRatio - minLoad) / (maxLoad - minLoad)) * (chartWidth - 2 * padding)).toFixed(2));
    const y = Number((chartHeight - padding - (r[selectedMetric] / maxVal) * (chartHeight - 2 * padding)).toFixed(2));
    return { x, y, load: r.loadRatio, val: r[selectedMetric], N: r.N };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  return (
    <div className="py-6 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9DCE1] pb-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
            05 / STRESS TEST
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] mt-1">
            EMPIRICAL CAPACITY &amp; LOAD INVESTIGATION
          </h2>
          <p className="text-sm text-[#626873] mt-1 max-w-2xl">
            Change memory load and key overlap. Measure what happens across the dimensionless ratio γ = N / d.
          </p>
        </div>

        <div className="text-xs font-mono bg-[#FFFFFF] px-3.5 py-1.5 border border-[#D9DCE1] shadow-sm">
          Rank Bound: <strong className="text-[#111318]">Rank(S) ≤ {d}</strong>
        </div>
      </div>

      {/* Experiment Controls Bar */}
      <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-4 sm:p-5 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div>
          <label className="text-xs font-medium text-[#626873] block mb-1">State Dimension d:</label>
          <select
            value={d}
            onChange={(e) => setD(parseInt(e.target.value))}
            className="w-full bg-[#F7F7F4] border border-[#D9DCE1] px-3 py-1.5 text-xs font-mono font-bold text-[#111318] focus:outline-none"
          >
            <option value={4}>d = 4 (Rank limit 4)</option>
            <option value={8}>d = 8 (Rank limit 8)</option>
            <option value={12}>d = 12 (Rank limit 12)</option>
            <option value={16}>d = 16 (Rank limit 16)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-[#626873] block mb-1">
            Key Correlation ρ: <strong className="text-[#D97706] font-mono">{rho.toFixed(2)}</strong>
          </label>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.1"
            value={rho}
            onChange={(e) => setRho(parseFloat(e.target.value))}
            className="w-full mt-1.5"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#626873] block mb-1">
            Retention Factor λ: <strong className="text-[#111318] font-mono">{lambdaDecay.toFixed(2)}</strong>
          </label>
          <input
            type="range"
            min="0.6"
            max="1.0"
            step="0.05"
            value={lambdaDecay}
            onChange={(e) => setLambdaDecay(parseFloat(e.target.value))}
            className="w-full mt-1.5"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 p-2 bg-[#F7F7F4] border border-[#D9DCE1] cursor-pointer w-full">
            <input
              type="checkbox"
              checked={useBDH}
              onChange={(e) => setUseBDH(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-[#111318] accent-[#111318]"
            />
            <span className="text-xs font-medium text-[#111318]">Sparse Plasticity [ABSTRACTION]</span>
          </label>
        </div>
      </div>

      {/* Large Clean SVG Empirical Chart */}
      <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-6 shadow-sm space-y-4">
        {/* Metric Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E4E8] pb-3">
          <span className="text-xs font-bold text-[#111318] uppercase tracking-wider">
            Empirical Curve (Live Client In-Browser Computation):
          </span>
          <div className="flex space-x-1.5">
            {[
              { id: "cosineError", label: "COSINE ERROR" },
              { id: "l2Error", label: "L2 ERROR" },
              { id: "isr", label: "ISR (CROSSTALK/SIGNAL)" },
              { id: "observedCosine", label: "KEY OVERLAP" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMetric(m.id as MetricType)}
                className={`px-3 py-1 text-xs font-mono font-medium transition-all ${
                  selectedMetric === m.id
                    ? "bg-[#111318] text-white"
                    : "bg-[#F0F1ED] text-[#626873] hover:text-[#111318]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real Empirical SVG Plot on Paper Background */}
        <div className="overflow-x-auto py-2 flex justify-center">
          <svg width={chartWidth} height={chartHeight} className="bg-[#F7F7F4] border border-[#E2E4E8]">
            {/* Grid & Axis Lines */}
            <line
              x1={padding}
              y1={chartHeight - padding}
              x2={chartWidth - padding}
              y2={chartHeight - padding}
              stroke="#D9DCE1"
              strokeWidth="1.5"
            />
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={chartHeight - padding}
              stroke="#D9DCE1"
              strokeWidth="1.5"
            />

            {/* γ = 1 Reference Vertical Line */}
            {1.0 >= minLoad && 1.0 <= maxLoad && (
              <g>
                <line
                  x1={Number((padding + ((1.0 - minLoad) / (maxLoad - minLoad)) * (chartWidth - 2 * padding)).toFixed(2))}
                  y1={padding}
                  x2={Number((padding + ((1.0 - minLoad) / (maxLoad - minLoad)) * (chartWidth - 2 * padding)).toFixed(2))}
                  y2={chartHeight - padding}
                  stroke="#D97706"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={Number((padding + ((1.0 - minLoad) / (maxLoad - minLoad)) * (chartWidth - 2 * padding)).toFixed(2)) + 4}
                  y={padding + 12}
                  fill="#D97706"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  γ = 1 Reference
                </text>
              </g>
            )}

            {/* Empirical Curve Line */}
            <path d={pathD} fill="none" stroke="#0284C7" strokeWidth="2.5" />

            {/* Empirical Data Points */}
            {points.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#0284C7"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            ))}

            {/* Axis Labels */}
            <text
              x={chartWidth / 2}
              y={chartHeight - 12}
              fill="#626873"
              fontSize="11"
              textAnchor="middle"
              fontFamily="monospace"
              fontWeight="600"
            >
              Dimensionless Memory Load Ratio γ = N / d
            </text>
            <text
              x={16}
              y={chartHeight / 2}
              fill="#626873"
              fontSize="11"
              textAnchor="middle"
              transform={`rotate(-90 16 ${chartHeight / 2})`}
              fontFamily="monospace"
              fontWeight="600"
            >
              {selectedMetric}
            </text>
          </svg>
        </div>

        {/* Observation Block */}
        <div className="p-4 bg-[#F7F7F4] border border-[#D9DCE1] space-y-1 text-xs text-[#111318]">
          <strong className="text-xs font-bold uppercase tracking-wider block">
            EMPIRICAL OBSERVATION:
          </strong>
          <p className="text-xs text-[#626873] leading-relaxed">
            In this synthetic sweep, increasing memory load and controlled key overlap is associated with higher observed retrieval error under the specified experimental setup. These curves reflect empirical measurements under isotropic Gaussian key distributions, serving as a memory-load diagnostic rather than an assertion of guaranteed failure.
          </p>
        </div>
      </div>
    </div>
  );
};
