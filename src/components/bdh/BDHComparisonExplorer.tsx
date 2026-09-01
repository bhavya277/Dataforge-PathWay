"use client";

import React, { useState } from "react";
import { Cpu, ShieldCheck, Zap, Layers, Sparkles, FileText, ArrowRight } from "lucide-react";

export const BDHComparisonExplorer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"bdh-core" | "bdh-cq" | "comparison-matrix">("bdh-core");

  return (
    <div className="bg-[#11141B] border border-white/10 rounded-xl p-6 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Dragon Hatchling (BDH) & BDH-CQ Architectural Explorer</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in the Pathway Dragon Hatchling Research Specifications (2024–2025).
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-lg border border-white/5 font-mono text-xs">
          <button
            onClick={() => setActiveSubTab("bdh-core")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === "bdh-core" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            BDH Synaptic Plasticity
          </button>
          <button
            onClick={() => setActiveSubTab("bdh-cq")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === "bdh-cq" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            BDH-CQ Demonstration Reasoning
          </button>
          <button
            onClick={() => setActiveSubTab("comparison-matrix")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === "comparison-matrix" ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Architecture Comparison Matrix
          </button>
        </div>
      </div>

      {/* Tab 1: BDH Core */}
      {activeSubTab === "bdh-core" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
            {/* Pillar 1 */}
            <div className="bg-[#161B24] border border-white/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>1. Sparse Positive Activations</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Replaces unconstrained real-valued dense representations (x in R^d) with non-negative, sparse firing rates (a &ge; 0). In high dimensions, sparse positive vectors have quasi-disjoint supports, driving cross-talk k_i^T k_j &rarr; 0.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#161B24] border border-white/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold">
                <Zap className="w-4 h-4" />
                <span>2. Monosemantic Synapses</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connects isolated conceptual features directly. Avoids polysemantic superposition where a single weight or hidden vector represents multiple conflicting semantic meanings.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#161B24] border border-white/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 text-violet-400 font-mono text-xs font-bold">
                <Layers className="w-4 h-4" />
                <span>3. Local Hebbian Plasticity</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Updates synaptic connection weights dynamically during context processing using local co-activation rules (&Delta;W_ij &prop; a_i^+ &middot; a_j^+) without expensive global backpropagation.
              </p>
            </div>
          </div>

          {/* Side-by-side Equation Comparison */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-5 font-mono text-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Mathematical Formulation: Dense Recurrence vs BDH Plasticity
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#161B24] p-4 rounded-lg border border-rose-500/20 space-y-2">
                <div className="text-rose-400 font-bold">Standard Linear Recurrence (Un-Gated)</div>
                <div className="p-2 bg-black/60 rounded text-slate-200">
                  Sₜ = λ Sₜ₋₁ + vₜ kₜᵀ
                </div>
                <div className="text-[11px] text-slate-400">
                  Dense positive and negative numbers continuously superimpose, creating severe cross-talk when N exceeds state rank.
                </div>
              </div>

              <div className="bg-[#161B24] p-4 rounded-lg border border-emerald-500/20 space-y-2">
                <div className="text-emerald-400 font-bold">BDH Sparse Monosemantic Update</div>
                <div className="p-2 bg-black/60 rounded text-slate-200">
                  Wₜ = TopK(λ Wₜ₋₁ + η · ReLU(vₜ) ReLU(kₜ)ᵀ)
                </div>
                <div className="text-[11px] text-slate-400">
                  Sparse positive gating suppresses off-diagonal overlapping activations, preserving isolated synaptic pathways.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: BDH-CQ */}
      {activeSubTab === "bdh-cq" && (
        <div className="space-y-5 font-sans">
          <div className="bg-[#161B24] border border-cyan-500/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Continuous Latent Demonstration Reasoning (BDH-CQ)</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong>BDH-CQ (Continuous Query)</strong> extends Dragon Hatchling to multi-step reasoning from in-context demonstrations without needing an explicit autoregressive written chain of thought (CoT).
            </p>
          </div>

          {/* Visual Causal Flow of BDH-CQ */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-5 font-mono text-xs space-y-4">
            <div className="text-slate-400 text-xs">Causal Dataflow in BDH-CQ:</div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-center">
              <div className="bg-[#1A1E27] p-3 rounded-lg border border-white/10">
                <div className="text-cyan-300 font-bold">Demonstrations</div>
                <div className="text-[10px] text-slate-400 mt-1">(X₁ → Y₁, X₂ → Y₂)</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 mx-auto hidden md:block" />
              <div className="bg-[#1A1E27] p-3 rounded-lg border border-emerald-500/30">
                <div className="text-emerald-300 font-bold">Fast-Weight Write</div>
                <div className="text-[10px] text-slate-400 mt-1">ΔW = Hebbian(Y, X)</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 mx-auto hidden md:block" />
              <div className="bg-[#1A1E27] p-3 rounded-lg border border-violet-500/30">
                <div className="text-violet-300 font-bold">Latent Query</div>
                <div className="text-[10px] text-slate-400 mt-1">Single Forward Pass</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Comparison Matrix */}
      {activeSubTab === "comparison-matrix" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-[#1A1E27] text-slate-300 border-b border-white/10">
              <tr>
                <th className="p-3">Architectural Dimension</th>
                <th className="p-3">Standard Softmax Transformer</th>
                <th className="p-3">Linear Attention / Fast Weights</th>
                <th className="p-3 text-emerald-400">Dragon Hatchling (BDH)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-sans text-xs">
              <tr className="hover:bg-white/5">
                <td className="p-3 font-mono text-slate-400 font-semibold">Inference Memory Cost</td>
                <td className="p-3 font-mono">O(N) unbounded KV-cache</td>
                <td className="p-3 font-mono">O(1) fixed-size matrix</td>
                <td className="p-3 font-mono text-emerald-300">O(1) fixed sparse matrix</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-mono text-slate-400 font-semibold">Memory Superposition</td>
                <td className="p-3">None (all tokens retained)</td>
                <td className="p-3 text-rose-300">Severe dense cross-talk</td>
                <td className="p-3 text-emerald-300">Quasi-orthogonal sparse positive</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-mono text-slate-400 font-semibold">Weight Adaptation</td>
                <td className="p-3">Frozen during inference</td>
                <td className="p-3">Un-gated outer-product recurrence</td>
                <td className="p-3 text-emerald-300">Local Hebbian test-time plasticity</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-mono text-slate-400 font-semibold">Demonstration Reasoning</td>
                <td className="p-3">Autoregressive token CoT</td>
                <td className="p-3">Un-gated linear superposition</td>
                <td className="p-3 text-emerald-300">Continuous Latent Reasoning (BDH-CQ)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
