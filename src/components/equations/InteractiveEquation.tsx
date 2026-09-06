"use client";

import React, { useState } from "react";
import { BlockMath, InlineMath } from "@/components/ui/MathView";

export const InteractiveEquation: React.FC = () => {
  const [activeTerm, setActiveTerm] = useState<string>("decomposition");

  const terms: Record<
    string,
    { title: string; math: string; explanation: string; dimension: string; note: string }
  > = {
    recurrence: {
      title: "Generalized Recurrent State Update",
      math: "S_t = \\lambda S_{t-1} + v_t k_t^T = \\sum_{i=1}^t \\lambda^{t-i} v_i k_i^T",
      explanation:
        "Sequential associative write: the memory matrix updates linearly by accumulating the outer product of value vector v_t and key vector k_t^T, decayed exponentially by retention factor λ.",
      dimension: "S_t \\in \\mathbb{R}^{d \\times d}",
      note: "When λ = 1.0, decay vanishes and S_t equals the exact sum of outer products.",
    },
    retrieval: {
      title: "Linear Matrix-Vector Query Readout",
      math: "y_t = S_t q_t = \\sum_{i=1}^t \\lambda^{t-i} v_i (k_i^T q_t)",
      explanation:
        "Associative recall is executed via a single matrix-vector multiplication in O(d²) compute per token, bypassing the need to attend over historical key-value sequence caches.",
      dimension: "y_t \\in \\mathbb{R}^d",
      note: "Equivalent to linear causal attention (V Kᵀ) q when λ = 1.0.",
    },
    decomposition: {
      title: "Signal + Cross-Talk Decomposition",
      math: "y_t = \\underbrace{\\lambda^{t-j} v_j (k_j^T q_j)}_{\\text{Target Signal}} + \\underbrace{\\sum_{i \\ne j} \\lambda^{t-i} v_i (k_i^T q_j)}_{\\text{Cross-Talk Interference}}",
      explanation:
        "The algebraic mechanism of cross-talk in this linear model: querying key k_j retrieves target value v_j plus an additive linear superposition of non-target values weighted by their pairwise key inner products k_iᵀ q_j.",
      dimension: "y_t \\in \\mathbb{R}^d",
      note: "If all stored keys are mutually orthogonal (k_iᵀ k_j = 0 for i ≠ j), cross-talk evaluates to zero.",
    },
    linear_attn: {
      title: "Recurrence ↔ Linear Attention Dual",
      math: "S_t q_t = \\left(\\sum_{i=1}^t v_i k_i^T\\right) q_t = V_{1:t} (K_{1:t}^T q_t)",
      explanation:
        "Associative duality: recurrent sequential state accumulation in O(1) memory per step is algebraically equivalent to linear causal self-attention over the full token context.",
      dimension: "\\text{Equivalence verified at } < 10^{-14} \\text{ error}",
      note: "Proves that linear transformers operate secretly as fast-weight recurrent memories (Schlag et al., 2021).",
    },
    bdh_abstraction: {
      title: "BDH-Inspired Sparse Plasticity Abstraction",
      math: "W_t = \\operatorname{TopK}\\left(\\lambda W_{t-1} + \\eta \\cdot \\operatorname{ReLU}(v_t) \\operatorname{ReLU}(k_t)^T\\right)",
      explanation:
        "A simplified teaching abstraction inspired by mechanisms discussed in Dragon Hatchling (BDH): non-negative sparse projections reduce the number of active connections in this teaching abstraction, allowing learners to inspect how sparse support changes the cross-talk pattern.",
      dimension: "W_t \\in \\mathbb{R}^{d \\times d} \\text{ (Sparse Non-Negative)}",
      note: "[BDH-INSPIRED TEACHING ABSTRACTION • NOT THE FULL BDH ARCHITECTURE]",
    },
  };

  const current = terms[activeTerm];

  return (
    <div className="bg-[#101217] border border-white/[0.08] rounded-lg p-4 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
        <span className="font-bold text-white tracking-wider">MATHEMATICAL FORMULATIONS</span>
        <span className="text-[10px] text-slate-400">Click a formulation to inspect exact terms</span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1">
        {Object.entries(terms).map(([key, item]) => {
          const active = activeTerm === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTerm(key)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                active
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                  : "bg-black/30 text-slate-400 hover:text-slate-200 border border-white/5"
              }`}
            >
              {item.title.split(":")[0]}
            </button>
          );
        })}
      </div>

      {/* Display Box */}
      <div className="bg-black/50 p-3.5 rounded border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-cyan-400 font-bold">{current.title}</span>
          <span className="text-slate-400 text-[10px]">
            <InlineMath math={current.dimension} />
          </span>
        </div>

        <div className="py-2 px-3 bg-[#161a22] rounded border border-white/5 text-sm sm:text-base font-bold text-white overflow-x-auto text-center">
          <BlockMath math={current.math} />
        </div>

        <p className="text-slate-300 text-[11px] leading-relaxed">{current.explanation}</p>

        <div className="text-[10px] text-amber-400/90 pt-1 border-t border-white/5">
          <strong>Key Insight:</strong> {current.note}
        </div>
      </div>
    </div>
  );
};
