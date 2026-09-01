"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, AlertCircle, Database } from "lucide-react";

export const BenchmarkCharts: React.FC = () => {
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [activeSweep, setActiveSweep] = useState<"correlation" | "load" | "dimension">("correlation");

  useEffect(() => {
    fetch("/data/experiment_benchmarks.json")
      .then((res) => res.json())
      .then((data) => setBenchmarkData(data))
      .catch((err) => console.error("Failed to load benchmark data:", err));
  }, []);

  if (!benchmarkData) {
    return (
      <div className="bg-[#11141B] border border-white/10 rounded-xl p-8 text-center font-mono text-xs text-slate-400">
        Loading empirical benchmark sweeps...
      </div>
    );
  }

  const sweeps = benchmarkData.sweeps;

  return (
    <div className="bg-[#11141B] border border-white/10 rounded-xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Empirical Benchmark Sweeps (Precomputed)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            50 Monte Carlo trials per data point generated via{" "}
            <code className="text-cyan-300 font-mono">/experiments/interference_sweep.py</code>
          </p>
        </div>

        {/* Sweep Selector */}
        <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-lg border border-white/5 font-mono text-xs">
          <button
            onClick={() => setActiveSweep("correlation")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSweep === "correlation" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Correlation Sweep (ρ)
          </button>
          <button
            onClick={() => setActiveSweep("load")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSweep === "load" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Load Sweep (N)
          </button>
          <button
            onClick={() => setActiveSweep("dimension")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSweep === "dimension" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Dimension Sweep (d)
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      {activeSweep === "correlation" && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="font-semibold text-white">Key Correlation (ρ) vs Mean Cosine Similarity & L2 Error</span>
            <span className="text-[11px] text-slate-400">Fixed d=8, N=4</span>
          </div>

          <div className="h-64 bg-black/40 rounded-xl border border-white/5 p-4 flex items-end justify-between gap-1 relative overflow-hidden">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="border-b border-white w-full"></div>
              <div className="border-b border-white w-full"></div>
              <div className="border-b border-white w-full"></div>
            </div>

            {sweeps.experiment_b_correlation_sweep.map((pt: any, idx: number) => {
              const cosHeight = Math.max(5, pt.mean_cosine_similarity * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  <div
                    className="w-full bg-cyan-400/80 group-hover:bg-cyan-300 rounded-t transition-all"
                    style={{ height: `${cosHeight}%` }}
                  ></div>
                  <span className="text-[8px] text-slate-500 mt-1">{idx % 4 === 0 ? pt.correlation.toFixed(2) : ""}</span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#1A1E27] p-2 rounded border border-white/20 text-[10px] text-slate-200 z-20 whitespace-nowrap shadow-xl">
                    <div>ρ: {pt.correlation}</div>
                    <div className="text-cyan-300 font-bold">CosSim: {pt.mean_cosine_similarity.toFixed(4)}</div>
                    <div className="text-rose-400">L2 Err: {pt.mean_l2_error.toFixed(4)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>ρ = 0.00 (Orthogonal / CosSim = 1.0)</span>
            <span>ρ = 0.95 (Severe Cross-Talk / CosSim &lt; 0.5)</span>
          </div>
        </div>
      )}

      {activeSweep === "load" && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="font-semibold text-white">Memory Load (N) vs Interference-to-Signal Ratio (ISR)</span>
            <span className="text-[11px] text-slate-400">Fixed d=8, ρ=0.35</span>
          </div>

          <div className="h-64 bg-black/40 rounded-xl border border-white/5 p-4 flex items-end justify-between gap-1.5 relative overflow-hidden">
            {sweeps.experiment_c_load_sweep.map((pt: any, idx: number) => {
              const isrNorm = Math.min(100, Math.max(5, (pt.mean_interference_to_signal_ratio / 1.5) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  <div
                    className={`w-full rounded-t transition-all ${
                      pt.N > pt.d ? "bg-rose-500/80 group-hover:bg-rose-400" : "bg-amber-400/80 group-hover:bg-amber-300"
                    }`}
                    style={{ height: `${isrNorm}%` }}
                  ></div>
                  <span className="text-[9px] text-slate-400 mt-1">N={pt.N}</span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#1A1E27] p-2 rounded border border-white/20 text-[10px] text-slate-200 z-20 whitespace-nowrap shadow-xl">
                    <div>N: {pt.N} (N/d: {pt.load_ratio_N_over_d})</div>
                    <div className="text-amber-300 font-bold">ISR: {pt.mean_interference_to_signal_ratio.toFixed(3)}</div>
                    <div className="text-cyan-300">CosSim: {pt.mean_cosine_similarity.toFixed(4)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>N = 1 (Within Rank Capacity)</span>
            <span className="text-rose-400 font-bold">N = 20 (N &gt;&gt; d / Cross-Talk Overload)</span>
          </div>
        </div>
      )}

      {activeSweep === "dimension" && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="font-semibold text-white">State Dimension (d) vs Retrieval Cosine Similarity</span>
            <span className="text-[11px] text-slate-400">Fixed N=8, ρ=0.35</span>
          </div>

          <div className="h-64 bg-black/40 rounded-xl border border-white/5 p-4 flex items-end justify-between gap-3 relative overflow-hidden">
            {sweeps.experiment_d_dimension_sweep.map((pt: any, idx: number) => {
              const cosHeight = Math.max(5, pt.mean_cosine_similarity * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  <div
                    className="w-full bg-violet-400/80 group-hover:bg-violet-300 rounded-t transition-all"
                    style={{ height: `${cosHeight}%` }}
                  ></div>
                  <span className="text-[10px] text-slate-300 mt-1">d={pt.d}</span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#1A1E27] p-2 rounded border border-white/20 text-[10px] text-slate-200 z-20 whitespace-nowrap shadow-xl">
                    <div>Dimension d: {pt.d}</div>
                    <div className="text-violet-300 font-bold">CosSim: {pt.mean_cosine_similarity.toFixed(4)}</div>
                    <div className="text-cyan-300">L2 Err: {pt.mean_l2_error.toFixed(4)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>d = 4 (Tight Bottleneck)</span>
            <span>d = 64 (Expanded Rank Capacity)</span>
          </div>
        </div>
      )}
    </div>
  );
};
