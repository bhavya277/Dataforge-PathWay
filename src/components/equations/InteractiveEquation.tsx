"use client";

import React, { useState } from "react";
import { Info, Sparkles } from "lucide-react";

export const InteractiveEquation: React.FC = () => {
  const [activeTerm, setActiveTerm] = useState<string>("interference");

  const terms: Record<
    string,
    { title: string; math: string; explanation: string; physicalRole: string; dimension: string }
  > = {
    state_update: {
      title: "Recurrent State Matrix (Sₜ)",
      math: "Sₜ = λ Sₜ₋₁ + vₜ kₜᵀ",
      explanation:
        "The fixed-size fast-weight synaptic matrix that accumulates associative bindings across time without allocating new KV-cache memory slots.",
      physicalRole: "Acts as dynamic working memory / plastic synaptic connections.",
      dimension: "ℝ^(d × d)",
    },
    outer_product: {
      title: "Hebbian Outer-Product Update (vₜ kₜᵀ)",
      math: "ΔS = vₜ kₜᵀ",
      explanation:
        "Rank-1 outer product binding key kₜ to value vₜ. Each cell ΔS_rc represents the joint co-activation of value neuron r and key neuron c.",
      physicalRole: "Associative write operation (fast-weight programming).",
      dimension: "ℝ^(d × d) (Rank 1)",
    },
    retrieval: {
      title: "Linear Query Readout (y = S q)",
      math: "y = S q = ∑ᵢ vᵢ (kᵢᵀ q)",
      explanation:
        "Reading from memory by projecting the state matrix onto query vector q. By linearity, this equals the weighted sum of all stored value vectors.",
      physicalRole: "Associative read operation.",
      dimension: "ℝ^d",
    },
    target_signal: {
      title: "Target Signal Component",
      math: "v_j (k_jᵀ q_j)",
      explanation:
        "The desired value vector scaled by the query's self-similarity to its matching key. When ||k_j|| = 1 and q = k_j, this is exactly 1.0 · v_j.",
      physicalRole: "Ground-truth information recovery.",
      dimension: "ℝ^d",
    },
    interference: {
      title: "Cross-Talk Interference Term",
      math: "∑_{i ≠ j} v_i (k_iᵀ q_j)",
      explanation:
        "The linear contamination from all OTHER stored associations whose keys share non-zero angular projection (k_iᵀ q_j ≠ 0) with the query.",
      physicalRole: "Cause of memory degradation, blur, and catastrophic collapse.",
      dimension: "ℝ^d",
    },
    bdh_sparse: {
      title: "Sparse Positive Plasticity (BDH-Inspired Teaching Simplification)",
      math: "W_t = TopK(lambda * W_{t-1} + eta * ReLU(v_t) ReLU(k_t)^T)",
      explanation:
        "A simplified teaching model inspired by mechanisms discussed in BDH: non-negative sparse activations enforce quasi-disjoint key supports (k_i^T k_j ~ 0), suppressing cross-talk by geometric construction. This is a single-layer visual demonstration, not the complete BDH architecture.",
      physicalRole: "Sparse associative memory without dense polysemantic superposition [TEACHING SIMPLIFICATION].",
      dimension: "R^(d x d) (Sparse Non-Negative)",
    },
  };

  const current = terms[activeTerm] || terms.interference;

  return (
    <div className="bg-[#11141B] border border-white/10 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Interactive Equation Inspector</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-400">Click any mathematical term to inspect</span>
      </div>

      {/* Clickable Equation Bar */}
      <div className="my-5 p-4 rounded-lg bg-black/60 border border-white/10 flex flex-wrap items-center justify-center gap-2 font-mono text-base sm:text-lg">
        <button
          onClick={() => setActiveTerm("retrieval")}
          className={`px-2.5 py-1 rounded transition-all ${
            activeTerm === "retrieval"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 ring-1 ring-cyan-400"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          }`}
        >
          y_j =
        </button>

        <button
          onClick={() => setActiveTerm("target_signal")}
          className={`px-2.5 py-1 rounded transition-all ${
            activeTerm === "target_signal"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 ring-1 ring-emerald-400"
              : "text-emerald-400/80 hover:text-emerald-300 hover:bg-white/5"
          }`}
        >
          v_j (k_jᵀ q_j)
        </button>

        <span className="text-slate-500 font-bold">+</span>

        <button
          onClick={() => setActiveTerm("interference")}
          className={`px-2.5 py-1 rounded transition-all ${
            activeTerm === "interference"
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 ring-1 ring-rose-400"
              : "text-rose-400/90 hover:text-rose-300 hover:bg-white/5"
          }`}
        >
          ∑_{`i ≠ j`} v_i (k_iᵀ q_j)
        </button>

        <span className="text-slate-600 mx-2">|</span>

        <button
          onClick={() => setActiveTerm("state_update")}
          className={`px-2 py-0.5 rounded text-xs transition-all ${
            activeTerm === "state_update"
              ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 ring-1 ring-violet-400"
              : "text-violet-400/80 hover:bg-white/5"
          }`}
        >
          [Sₜ = λSₜ₋₁ + vₜkₜᵀ]
        </button>

        <button
          onClick={() => setActiveTerm("bdh_sparse")}
          className={`px-2 py-0.5 rounded text-xs transition-all ${
            activeTerm === "bdh_sparse"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 ring-1 ring-amber-400"
              : "text-amber-400/80 hover:bg-white/5"
          }`}
        >
          [BDH Sparse Rule]
        </button>
      </div>

      {/* Selected Term Detail Card */}
      <div className="bg-[#181D26] border border-white/10 rounded-lg p-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="text-cyan-300 font-bold text-sm">{current.title}</div>
          <div className="text-slate-400 bg-black/40 px-2 py-0.5 rounded text-[11px]">
            Dimension: <span className="text-white font-semibold">{current.dimension}</span>
          </div>
        </div>

        <div className="my-2.5 font-mono text-sm text-amber-300 bg-black/50 p-2 rounded border border-white/5">
          {current.math}
        </div>

        <p className="text-slate-300 leading-relaxed font-sans text-xs mb-2">{current.explanation}</p>

        <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-500/20">
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            <strong>Scientific Role:</strong> {current.physicalRole}
          </span>
        </div>
      </div>
    </div>
  );
};
