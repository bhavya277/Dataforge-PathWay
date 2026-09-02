"use client";

import React, { useState, useMemo } from "react";
import { generateSyntheticPairs, LiveAssociativeEngine } from "@/lib/math-engine";
import { BarChart3, Info } from "lucide-react";

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
  const chartWidth = 600;
  const chartHeight = 200;
  const padding = 40;

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
    <div className="border border-white/[0.08] bg-[#0B0D12] p-6 font-mono text-xs space-y-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
            <BarChart3 className="w-4 h-4" />
            <span>03 — EMPIRICAL STRESS TEST &amp; CAPACITY CONSOLE</span>
          </div>
          <h1 className="text-base font-bold text-white mt-1">
            Retrieval Degradation Under Memory Load &amp; Key Overlap
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Systematic measurement across dimensionless load ratio γ = N / d.
          </p>
        </div>

        <div className="text-[11px] bg-black/60 px-3 py-1.5 border border-white/10 text-slate-300">
          Rank Bound: <strong className="text-white">Rank(S) ≤ {d}</strong>
        </div>
      </div>

      {/* Experiment Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-black/40 p-4 border border-white/10">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">State Dimension d:</label>
          <select
            value={d}
            onChange={(e) => setD(parseInt(e.target.value))}
            className="w-full bg-[#14171F] border border-white/15 px-2 py-1.5 text-white font-mono text-xs focus:outline-none"
          >
            <option value={4}>d = 4 (Rank limit 4)</option>
            <option value={8}>d = 8 (Rank limit 8)</option>
            <option value={12}>d = 12 (Rank limit 12)</option>
            <option value={16}>d = 16 (Rank limit 16)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1">
            Controlled Parameter ρ: <strong className="text-amber-400">{rho.toFixed(2)}</strong>
          </label>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.1"
            value={rho}
            onChange={(e) => setRho(parseFloat(e.target.value))}
            className="w-full mt-1"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1">
            Retention Factor λ: <strong className="text-slate-200">{lambdaDecay.toFixed(2)}</strong>
          </label>
          <input
            type="range"
            min="0.6"
            max="1.0"
            step="0.05"
            value={lambdaDecay}
            onChange={(e) => setLambdaDecay(parseFloat(e.target.value))}
            className="w-full mt-1"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 p-2 bg-white/5 border border-white/10 cursor-pointer w-full">
            <input
              type="checkbox"
              checked={useBDH}
              onChange={(e) => setUseBDH(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-emerald-500 bg-slate-900 border-white/20"
            />
            <span className="text-[11px] text-emerald-400 font-bold">Sparse Projection [ABSTRACTION]</span>
          </label>
        </div>
      </div>

      {/* Metric Selector & Real Empirical SVG Chart */}
      <div className="border border-white/10 bg-black/60 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
          <span className="text-xs font-bold text-white uppercase">Empirical Curve (Live In-Browser Computation):</span>
          <div className="flex space-x-1">
            {[
              { id: "cosineError", label: "COSINE ERROR (1-cos)" },
              { id: "l2Error", label: "RAW L2 ERROR" },
              { id: "isr", label: "ISR (CROSSTALK/SIGNAL)" },
              { id: "observedCosine", label: "PAIRWISE KEY COSINE" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMetric(m.id as MetricType)}
                className={`px-2 py-1 text-[10px] font-mono transition-all ${
                  selectedMetric === m.id
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real Empirical SVG Plot */}
        <div className="overflow-x-auto py-2 flex justify-center">
          <svg width={chartWidth} height={chartHeight} className="border border-white/5 bg-[#090B10]">
            {/* Grid & Axis Lines */}
            <line
              x1={padding}
              y1={chartHeight - padding}
              x2={chartWidth - padding}
              y2={chartHeight - padding}
              stroke="rgba(255, 255, 255, 0.2)"
            />
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={chartHeight - padding}
              stroke="rgba(255, 255, 255, 0.2)"
            />

            {/* Capacity Threshold Vertical Indicator (N/d = 1.0) */}
            {1.0 >= minLoad && 1.0 <= maxLoad && (
              <line
                x1={padding + ((1.0 - minLoad) / (maxLoad - minLoad)) * (chartWidth - 2 * padding)}
                y1={padding}
                x2={padding + ((1.0 - minLoad) / (maxLoad - minLoad)) * (chartWidth - 2 * padding)}
                y2={chartHeight - padding}
                stroke="rgba(245, 158, 11, 0.4)"
                strokeDasharray="4 4"
              />
            )}

            {/* Empirical Line */}
            <path d={pathD} fill="none" stroke="#00E5FF" strokeWidth="2" />

            {/* Data Points */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="3.5" fill="#00E5FF" stroke="#08090C" strokeWidth="1" />
              </g>
            ))}

            {/* Axis Labels */}
            <text
              x={chartWidth / 2}
              y={chartHeight - 10}
              fill="#94A3B8"
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Dimensionless Memory Load Ratio γ = N / d
            </text>
            <text
              x={15}
              y={chartHeight / 2}
              fill="#94A3B8"
              fontSize="10"
              textAnchor="middle"
              transform={`rotate(-90 15 ${chartHeight / 2})`}
              fontFamily="monospace"
            >
              {selectedMetric}
            </text>
          </svg>
        </div>
      </div>

      {/* Structured Results Table */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-white uppercase">Empirical Sweep Measurements:</div>
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/60 text-[10px] text-slate-400 uppercase">
                <th className="py-2.5 px-3">Associations (N)</th>
                <th className="py-2.5 px-3">Load Ratio (N/d)</th>
                <th className="py-2.5 px-3">Observed Key Cosine</th>
                <th className="py-2.5 px-3">Cosine Error</th>
                <th className="py-2.5 px-3">Raw L2 Error</th>
                <th className="py-2.5 px-3">Interference/Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/30">
              {sweepResults.map((r) => {
                const isOverCapacity = r.loadRatio > 1.0;
                return (
                  <tr
                    key={r.N}
                    className={`hover:bg-white/5 transition-colors ${
                      isOverCapacity ? "bg-amber-500/5" : ""
                    }`}
                  >
                    <td className="py-2 px-3 font-bold text-white">N = {r.N}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-1.5 py-0.5 border text-[10px] ${
                          isOverCapacity
                            ? "bg-amber-950/40 text-amber-300 border-amber-500/30"
                            : "bg-cyan-950/40 text-cyan-300 border-cyan-500/30"
                        }`}
                      >
                        {r.loadRatio.toFixed(2)} {isOverCapacity ? "(Over Rank)" : "(Within Rank)"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-300">
                      {r.observedCosine.toFixed(3)} ± {r.observedStd.toFixed(3)}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`font-bold ${
                          r.cosineError < 0.05
                            ? "text-emerald-400"
                            : r.cosineError < 0.25
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {r.cosineError.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-300">{r.l2Error.toFixed(3)}</td>
                    <td className="py-2 px-3 text-slate-300">{r.isr.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scientific Methodology Qualification */}
      <div className="p-3.5 bg-black/60 border border-white/10 flex items-start space-x-3 text-[11px] text-slate-300 leading-relaxed">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-0.5">Methodology &amp; Scientific Interpretation:</strong>
          Dimensionless memory load N/d reflects state capacity constraints. In our synthetic experiments, retrieval degradation increases systematically with load ratio; these curves represent empirical observations of the specified isotropic Gaussian distribution, not a universal theorem.
        </div>
      </div>
    </div>
  );
};
