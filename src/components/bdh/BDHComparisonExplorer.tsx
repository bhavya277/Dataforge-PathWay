"use client";

import React from "react";
import { Cpu, ShieldCheck, Zap, Layers, Sparkles } from "lucide-react";

export const BDHComparisonExplorer: React.FC = () => {
  return (
    <div className="bg-[#101217] border border-white/[0.08] rounded-lg p-5 font-mono space-y-6 text-xs text-slate-300">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-wider">
              DRAGON HATCHLING (BDH) &amp; BDH-CQ CONNECTION
            </h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            [BDH-INSPIRED TEACHING ABSTRACTION]
          </span>
        </div>
        <p className="text-slate-400 text-xs mt-1">
          Bridging standard dense recurrent fast weights with Pathway&apos;s biologically-inspired sparse neural architecture.
        </p>
      </div>

      {/* Distinction Callout Banner */}
      <div className="p-3.5 bg-black/40 border border-emerald-500/20 rounded-lg space-y-1.5 text-[11px]">
        <div className="flex items-center space-x-2 text-emerald-300 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Scientific Distinction: Actual BDH Research vs Our Teaching Abstraction</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 pt-1">
          <div className="p-2.5 bg-white/5 rounded border border-white/5">
            <strong className="text-white block mb-1">Actual Pathway BDH Architecture:</strong>
            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-300">
              <li>Non-negative sparse firing rates &amp; monosemantic circuits</li>
              <li>Synaptic plasticity across locally interacting neuron particles</li>
              <li>Scale-free recurrent computational substrate</li>
              <li>BDH-CQ multi-step demonstration reasoning without explicit text CoT</li>
            </ul>
          </div>

          <div className="p-2.5 bg-white/5 rounded border border-white/5">
            <strong className="text-white block mb-1">Our Teaching Abstraction [IN THIS LAB]:</strong>
            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-300">
              <li>Simplified single-layer non-negative vector projection (ReLU)</li>
              <li>Top-K connection gating on state matrix W_t in ℝ^(d × d)</li>
              <li>Designed to give geometric intuition on sparse support separation</li>
              <li><em className="text-emerald-400">[NOT THE FULL BDH ARCHITECTURE]</em></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison Grid: Standard Fast Weights vs BDH Sparse Plasticity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Dense Linear Fast Weights */}
        <div className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-2.5">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
            <Layers className="w-4 h-4" />
            <span>Standard Linear Fast-Weight Memory</span>
          </div>
          <div className="p-2 bg-[#161a22] rounded border border-white/5 text-[11px] text-center font-bold text-white">
            {"S_t = \\lambda S_{t-1} + v_t k_t^T"}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Relies on dense real-valued superposition. When N &gt; d or keys correlate, off-diagonal dot products k_i^T q contaminate retrieval with additive linear cross-talk noise.
          </p>
          <div className="text-[10px] text-slate-400 bg-black/30 p-2 rounded">
            <strong>Vulnerability:</strong> Catastrophic cross-talk cliff as sequence length N grows.
          </div>
        </div>

        {/* Card 2: BDH Sparse Plasticity Abstraction */}
        <div className="p-4 bg-black/40 border border-emerald-500/20 rounded-lg space-y-2.5">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
            <Zap className="w-4 h-4" />
            <span>BDH Sparse Plasticity Abstraction</span>
          </div>
          <div className="p-2 bg-[#161a22] rounded border border-white/5 text-[11px] text-center font-bold text-white">
            {"W_t = \\text{TopK}(\\lambda W_{t-1} + \\eta \\cdot \\text{ReLU}(v_t) \\text{ReLU}(k_t)^T)"}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Replaces dense continuous superposition with non-negative sparse positive activations. In high dimensions, sparse positive vectors exhibit quasi-disjoint supports, driving cross-talk inner products k_i^T k_j toward zero.
          </p>
          <div className="text-[10px] text-emerald-400/90 bg-emerald-950/20 p-2 rounded border border-emerald-500/20">
            <strong>Advantage:</strong> Geometric cross-talk suppression without expanding KV caches.
          </div>
        </div>
      </div>

      {/* BDH-CQ Section */}
      <div className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-2">
        <div className="flex items-center space-x-2 text-violet-400 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>BDH-CQ (Continuous Query): Multi-Step Demonstration Reasoning</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          BDH-CQ extends Dragon Hatchling by enabling deep multi-step logical deduction directly from in-context demonstration trajectories. Rather than emitting an explicit token-by-token Chain-of-Thought (CoT), BDH-CQ iterates internal synaptic updates across a continuous recurrence loop, retrieving intermediate facts while maintaining bounded memory footprint.
        </p>
      </div>
    </div>
  );
};
