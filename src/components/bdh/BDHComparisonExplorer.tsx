"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

export const BDHComparisonExplorer: React.FC = () => {
  return (
    <div className="py-6 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D9DCE1] pb-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
            06 / FROM FAST WEIGHTS TO BDH
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] mt-1">
            BRIDGING LINEAR RECURRENCE &amp; DRAGON HATCHLING
          </h2>
          <p className="text-sm text-[#626873] mt-1 max-w-2xl">
            Exploring how sparse positive activations and synaptic-plasticity ideas motivate a contrasting interference pattern in a simplified associative-memory model.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-[#FFFFFF] text-[#111318] border border-[#D9DCE1] shadow-sm">
          [BDH-INSPIRED TEACHING ABSTRACTION]
        </span>
      </div>

      {/* Large Side-by-Side Comparison: Linear Fast Weights vs BDH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Model 1: Dense Linear Fast Weights */}
        <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-6 shadow-sm space-y-4">
          <div className="border-b border-[#E2E4E8] pb-2">
            <span className="text-xs font-mono font-bold text-[#626873] uppercase tracking-wider block">
              STANDARD LINEAR MEMORY
            </span>
            <h3 className="text-lg font-bold text-[#111318] mt-0.5">
              Continuous Fast Weights
            </h3>
          </div>

          <div className="p-3 bg-[#F7F7F4] border border-[#E2E4E8] text-center font-mono font-bold text-sm text-[#111318]">
            {"S_t = \\lambda S_{t-1} + v_t k_t^T"}
          </div>

          <p className="text-xs text-[#626873] leading-relaxed">
            Relies on dense real-valued superposition in ℝ^(d×d). As memory load N exceeds rank d or keys correlate, non-orthogonal inner products k_iᵀ q produce additive cross-talk interference.
          </p>

          <div className="p-3 bg-[#F0F1ED] border border-[#E2E4E8] text-xs font-mono text-[#111318]">
            <strong>Linear Superposition in This Model:</strong> Off-diagonal inner products accumulate additively across non-orthogonal stored associations.
          </div>
        </div>

        {/* Model 2: BDH Frontier Architecture */}
        <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-6 shadow-sm space-y-4">
          <div className="border-b border-[#E2E4E8] pb-2">
            <span className="text-xs font-mono font-bold text-[#0284C7] uppercase tracking-wider block">
              PATHWAY FRONTIER ARCHITECTURE
            </span>
            <h3 className="text-lg font-bold text-[#111318] mt-0.5">
              The Dragon Hatchling (BDH)
            </h3>
          </div>

          <div className="p-3 bg-[#F7F7F4] border border-[#0284C7]/30 text-center font-mono font-bold text-sm text-[#0284C7]">
            {"a_t \\ge 0 \\quad (\\text{Sparse Positive Activation Abstraction})"}
          </div>

          <p className="text-xs text-[#626873] leading-relaxed">
            Published BDH research studies sparse positive activations (a ≥ 0) and synaptic plasticity in a scale-free neural architecture.
          </p>

          <div className="p-3 bg-[#F0F1ED] border border-[#E2E4E8] text-xs font-mono text-[#111318]">
            <strong>Support Separation:</strong> Restricting active interactions can reduce the number of active contributing interactions in this abstraction.
          </div>
        </div>
      </div>

      {/* Teaching Abstraction Box */}
      <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E4E8] pb-2">
          <span className="text-xs font-bold text-[#111318] uppercase tracking-wider">
            TEACHING ABSTRACTION [USED IN THIS INTERACTIVE LAB]
          </span>
          <span className="text-[10px] font-mono font-bold text-[#D97706] uppercase">
            NOT THE FULL BDH ARCHITECTURE
          </span>
        </div>

        <div className="p-3 bg-[#F7F7F4] border border-[#E2E4E8] text-center font-mono font-bold text-sm text-[#111318]">
          {"W_t = \\text{TopK}\\left(\\lambda W_{t-1} + \\eta \\cdot \\text{ReLU}(v_t) \\text{ReLU}(k_t)^T\\right)"}
        </div>

        <p className="text-xs text-[#626873] leading-relaxed">
          Under suitable sparse-support regimes, restricting which connections participate can reduce the number of active contributing interactions in this abstraction; this interactive interface uses a single-layer non-negative toy abstraction to make that geometric intuition tangible.
        </p>
      </div>

      {/* BDH-CQ Recurrent Latent Reasoning */}
      <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-6 shadow-sm space-y-2">
        <span className="text-xs font-bold text-[#111318] uppercase tracking-wider block">
          BDH-CQ: In-Context Learning with Recurrent Latent Reasoning
        </span>
        <p className="text-xs text-[#626873] leading-relaxed">
          BDH-CQ extends Dragon Hatchling to multi-step reasoning over recurrent latent state trajectories. In-context demonstrations continuously update recurrent synaptic memory, allowing the query to be evaluated through iterative latent computation without requiring explicit written token Chain-of-Thought (CoT).
        </p>
      </div>

      {/* Primary Literature References */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-bold text-[#111318] uppercase tracking-wider block">
          Primary Literature References:
        </span>
        <div className="space-y-2">
          <div className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] flex items-center justify-between shadow-sm">
            <div className="text-xs">
              <strong className="text-[#111318]">Kosowski, Uznański, Chorowski, Stamirowska, &amp; Bartoszkiewicz (2025). </strong>
              <span className="italic text-[#626873]">&ldquo;The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain&rdquo;. </span>
              <span className="font-mono text-[#8A909A]">arXiv:2509.26507.</span>
            </div>
            <a
              href="https://arxiv.org/abs/2509.26507"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-[#0284C7] hover:underline text-xs font-mono ml-4 flex-shrink-0"
            >
              <span>arXiv:2509.26507</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] flex items-center justify-between shadow-sm">
            <div className="text-xs">
              <strong className="text-[#111318]">Engdahl, Kosowski, Chorowski, Stamirowska, Uznański, et al. (2026). </strong>
              <span className="italic text-[#626873]">&ldquo;BDH-CQ: In-Context Learning with Recurrent Latent Reasoning&rdquo;. </span>
              <span className="font-mono text-[#8A909A]">arXiv:2608.09888.</span>
            </div>
            <a
              href="https://arxiv.org/abs/2608.09888"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-[#0284C7] hover:underline text-xs font-mono ml-4 flex-shrink-0"
            >
              <span>arXiv:2608.09888</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
