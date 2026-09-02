"use client";

import React from "react";
import { Cpu, ShieldCheck, Zap, Layers, Sparkles, ExternalLink } from "lucide-react";

export const BDHComparisonExplorer: React.FC = () => {
  return (
    <div className="border border-white/[0.08] bg-[#0B0D12] p-6 font-mono text-xs text-slate-300 space-y-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
            <Cpu className="w-4 h-4" />
            <span>04 — FROM FAST-WEIGHT MEMORY TO DRAGON HATCHLING</span>
          </div>
          <h1 className="text-base font-bold text-white mt-1">
            Bridging Linear Recurrence &amp; Biologically-Inspired Sparse Plasticity
          </h1>
        </div>

        <span className="text-[10px] px-2.5 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
          [BDH-INSPIRED TEACHING ABSTRACTION]
        </span>
      </div>

      {/* Structural Comparison: Linear Associative Memory vs BDH Abstraction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model 1: Dense Linear Fast Weights */}
        <div className="border border-white/10 bg-black/40 p-4 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase">
            <Layers className="w-4 h-4" />
            <span>Standard Linear Associative Memory</span>
          </div>
          <div className="p-3 bg-[#14171F] border border-white/10 text-center font-bold text-sm text-white">
            {"S_t = \\lambda S_{t-1} + v_t k_t^T"}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Relies on dense real-valued superposition in ℝ^(d×d). As memory load N exceeds rank d or keys correlate, non-orthogonal inner products k_iᵀ q produce additive cross-talk interference.
          </p>
          <div className="text-[10px] text-slate-400 bg-black/40 p-2 border border-white/5">
            <strong>Key Vulnerability:</strong> Additive cross-talk accumulation in dense continuous superposition.
          </div>
        </div>

        {/* Model 2: BDH Sparse Plasticity Teaching Abstraction */}
        <div className="border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase">
            <Zap className="w-4 h-4" />
            <span>BDH-Inspired Sparse Plasticity [ABSTRACTION]</span>
          </div>
          <div className="p-3 bg-[#14171F] border border-emerald-500/30 text-center font-bold text-sm text-emerald-300">
            {"W_t = \\text{TopK}(\\lambda W_{t-1} + \\eta \\cdot \\text{ReLU}(v_t) \\text{ReLU}(k_t)^T)"}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Under suitable sparse-support regimes, restricting which connections participate can reduce interference; this interface uses a simplified abstraction to make that geometric intuition visible.
          </p>
          <div className="text-[10px] text-emerald-400 bg-emerald-950/40 p-2 border border-emerald-500/20">
            <strong>Teaching Scope:</strong> Single-layer non-negative vector projection demonstrating quasi-disjoint support separation.
          </div>
        </div>
      </div>

      {/* Explicit Literature Distinction: Actual BDH Research vs Our Teaching Abstraction */}
      <div className="p-4 bg-black/60 border border-white/10 space-y-3">
        <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Scientific Distinction: Actual BDH Architecture vs Our Teaching Model</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] pt-1">
          <div className="p-3 bg-[#14171F] border border-white/5 space-y-1.5">
            <strong className="text-white block text-xs">Actual Dragon Hatchling (BDH) Architecture:</strong>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[10px]">
              <li>Non-negative sparse firing rates (a ≥ 0) producing monosemantic circuits</li>
              <li>Synaptic plasticity across locally interacting neuron particles</li>
              <li>Recurrent scale-free computational substrate</li>
              <li>Multi-layer biologically-grounded neural architecture</li>
            </ul>
          </div>

          <div className="p-3 bg-[#14171F] border border-white/5 space-y-1.5">
            <strong className="text-white block text-xs">Our Teaching Abstraction [IN THIS LAB]:</strong>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[10px]">
              <li>Simplified single-layer non-negative vector projection (ReLU)</li>
              <li>Top-K synaptic gating on state matrix W_t in ℝ^(d×d)</li>
              <li>Visualizes geometric support separation under key overlap</li>
              <li><em className="text-emerald-400">[NOT THE FULL BDH ARCHITECTURE]</em></li>
            </ul>
          </div>
        </div>
      </div>

      {/* BDH-CQ Recurrent Latent Reasoning Section */}
      <div className="p-4 bg-black/60 border border-white/10 space-y-2">
        <div className="flex items-center space-x-2 text-violet-400 font-bold text-xs uppercase">
          <Sparkles className="w-4 h-4" />
          <span>BDH-CQ: In-Context Learning with Recurrent Latent Reasoning</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          BDH-CQ (Continuous Query) extends Dragon Hatchling to multi-step reasoning by operating directly over recurrent latent state trajectories. In-context demonstrations continuously update recurrent synaptic memory, allowing the query to be solved through iterative latent computation without requiring an explicit token-by-token written Chain-of-Thought (CoT).
        </p>
      </div>

      {/* Verified Primary Sources */}
      <div className="space-y-2 pt-2">
        <div className="text-xs font-bold text-white uppercase">Primary Research Literature:</div>
        <div className="space-y-2">
          <div className="p-3 bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-white font-bold">Kosowski et al. (2025). </span>
              <span className="italic text-slate-300">&ldquo;The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain&rdquo;. </span>
              <span className="text-slate-400">arXiv:2509.26507.</span>
            </div>
            <a
              href="https://arxiv.org/abs/2509.26507"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-[10px] ml-3 flex-shrink-0"
            >
              <span>arXiv:2509.26507</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-white font-bold">Engdahl et al. (2026). </span>
              <span className="italic text-slate-300">&ldquo;BDH-CQ: In-Context Learning with Recurrent Latent Reasoning&rdquo;. </span>
              <span className="text-slate-400">arXiv:2608.09888.</span>
            </div>
            <a
              href="https://arxiv.org/abs/2608.09888"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-[10px] ml-3 flex-shrink-0"
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
