"use client";

import React, { useState, useMemo } from "react";
import { generateSyntheticPairs, LiveAssociativeEngine } from "@/lib/math-engine";
import { BarChart3, AlertCircle } from "lucide-react";

export const StressTestExplorer: React.FC = () => {
  const [d, setD] = useState<number>(8);
  const [rho, setRho] = useState<number>(0.35);
  const [lambdaDecay, setLambdaDecay] = useState<number>(1.0);
  const [useBDH, setUseBDH] = useState<boolean>(false);

  // Live sweep over N from 2 to 20
  const sweepResults = useMemo(() => {
    const results = [];
    for (let n = 2; n <= 20; n += 2) {
      const { pairs, stats } = generateSyntheticPairs(n, d, rho, 42 + n);
      const engine = new LiveAssociativeEngine(d, lambdaDecay, 1.0, useBDH);
      pairs.forEach((p) => engine.storePair(p));

      // Retrieve all and average metrics
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
        meanCosineError: totalCosErr / n,
        meanL2Error: totalL2 / n,
        meanISR: totalISR / n,
        observedMeanCos: stats.meanCosine,
        observedStdCos: stats.stdCosine,
      });
    }
    return results;
  }, [d, rho, lambdaDecay, useBDH]);

  return (
    <div className="bg-[#101217] border border-white/[0.08] rounded-lg p-5 font-mono space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-3 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wider">STRESS TEST: HOW FAR CAN THE MEMORY GO?</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical investigation of memory load N/d under controlled isotropic key correlation.
          </p>
        </div>

        <div className="text-[10px] text-slate-400 bg-black/40 px-2.5 py-1 rounded border border-white/5">
          Dimensionless Load Ratio: <strong className="text-white">γ = N / d</strong>
        </div>
      </div>

      {/* Interactive Parameter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-black/30 p-3 rounded border border-white/5 text-xs">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">State Dimension d:</label>
          <select
            value={d}
            onChange={(e) => setD(parseInt(e.target.value))}
            className="w-full bg-[#161a22] border border-white/10 rounded px-2 py-1 text-white font-mono text-xs focus:outline-none"
          >
            <option value={4}>d = 4 (Rank limit 4)</option>
            <option value={8}>d = 8 (Rank limit 8)</option>
            <option value={12}>d = 12 (Rank limit 12)</option>
            <option value={16}>d = 16 (Rank limit 16)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Controlled Correlation ρ: {rho.toFixed(2)}</label>
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
          <label className="text-[10px] text-slate-400 block mb-1">Decay Factor λ: {lambdaDecay.toFixed(2)}</label>
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
          <label className="flex items-center space-x-2 p-1.5 rounded bg-white/5 border border-white/5 cursor-pointer w-full">
            <input
              type="checkbox"
              checked={useBDH}
              onChange={(e) => setUseBDH(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-emerald-500 bg-slate-900 border-white/20"
            />
            <span className="text-[10px] text-emerald-400 font-bold">Sparse Projection</span>
          </label>
        </div>
      </div>

      {/* Real-time Data Table & Visualizer */}
      <div className="space-y-3">
        <div className="text-xs text-white font-bold">Empirical Load Sweep (N = 2 .. 20 at d = {d}):</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase">
                <th className="py-2 px-3">Memories (N)</th>
                <th className="py-2 px-3">Load Ratio (N/d)</th>
                <th className="py-2 px-3">Observed Pairwise Cosine</th>
                <th className="py-2 px-3">Cosine Error (1-cos)</th>
                <th className="py-2 px-3">Raw L2 Error</th>
                <th className="py-2 px-3">Interference/Signal</th>
                <th className="py-2 px-3">Fidelity Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
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
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          isOverCapacity
                            ? "bg-amber-950/60 text-amber-300 border border-amber-500/30"
                            : "bg-cyan-950/60 text-cyan-300 border border-cyan-500/30"
                        }`}
                      >
                        {r.loadRatio.toFixed(2)} {isOverCapacity ? "Over Rank" : "Within Rank"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-300">
                      {r.observedMeanCos.toFixed(2)} ± {r.observedStdCos.toFixed(2)}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`font-bold ${
                          r.meanCosineError < 0.05
                            ? "text-emerald-400"
                            : r.meanCosineError < 0.25
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {r.meanCosineError.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-300">{r.meanL2Error.toFixed(3)}</td>
                    <td className="py-2 px-3 text-slate-300">{r.meanISR.toFixed(2)}</td>
                    <td className="py-2 px-3 w-32">
                      <div className="w-full bg-[#161a22] h-3 rounded-[1px] overflow-hidden flex">
                        <div
                          className="bg-cyan-400 h-full"
                          style={{ width: `${Math.max(0, 1 - r.meanCosineError) * 100}%` }}
                        ></div>
                        <div
                          className="bg-rose-500 h-full"
                          style={{ width: `${Math.min(1, r.meanCosineError) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scientific Qualification Notice */}
      <div className="p-3 bg-black/40 rounded border border-white/5 flex items-start space-x-2.5 text-[11px] text-slate-400">
        <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Scientific Note:</strong> N/d is used strictly as a dimensionless memory-load ratio. Retrieval degradation under high load is documented as an empirical observation of the specified isotropic key distribution, not a universal theorem.
        </div>
      </div>
    </div>
  );
};
