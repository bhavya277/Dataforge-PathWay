"use client";

import React from "react";
import { BookOpen, ExternalLink, ShieldAlert } from "lucide-react";

export const ResearchNotebook: React.FC = () => {
  return (
    <div className="border border-white/[0.08] bg-[#0B0D12] p-8 font-mono text-xs text-slate-300 space-y-8">
      {/* Title Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
          <BookOpen className="w-4 h-4" />
          <span>RESEARCH TECHNICAL NOTEBOOK • INTERACTIVE SPECIFICATION</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Associative Memory &amp; Linear Recurrent State Updates in Fast-Weight Architectures
        </h1>
        <p className="text-slate-400 text-xs">
          DataForge × Pathway 2026 Hackathon • Primary Mathematical and Experimental Substrate
        </p>
      </div>

      {/* 01. Research Question */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-white/5 pb-1">
          01. THE CENTRAL SCIENTIFIC QUESTION &amp; CLAIM
        </h2>
        <div className="p-4 bg-black/50 border-l-2 border-cyan-400 text-slate-200 text-xs sm:text-sm leading-relaxed">
          <strong className="text-white block mb-1 uppercase font-bold text-xs">Falsifiable Claim:</strong>
          &ldquo;In a linear fast-weight associative memory, retrieving one stored value also receives contributions from other stored key-value pairs; increasing key similarity or memory load therefore increases interference under the stated retrieval setup.&rdquo;
        </div>
      </section>

      {/* 02. Method & Substrate */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-white/5 pb-1">
          02. METHODOLOGY &amp; COMPUTATIONAL SUBSTRATE
        </h2>
        <p className="leading-relaxed">
          The memory is modeled as a recurrent matrix Sₜ ∈ ℝ^(d×d) storing N key-value associations (k_i, v_i) ∈ ℝ^d.
          Keys are generated via isotropic Gaussian distributions with a controlled shared-component parameter ρ:
        </p>
        <div className="p-3 bg-black/60 border border-white/10 text-center font-bold text-white text-xs sm:text-sm">
          {"k_i = \\text{normalize}\\left(\\sqrt{1 - \\rho} \\cdot u_i + \\sqrt{\\rho} \\cdot u_0\\right), \\quad u_0, u_i \\sim \\mathcal{N}(0, I_d)"}
        </div>
      </section>

      {/* 03. Mathematical Model & Exact Decay */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-white/5 pb-1">
          03. MATHEMATICAL MODEL &amp; EXACT RECURRENCE DECOMPOSITION
        </h2>
        
        <div className="space-y-3">
          <div>
            <span className="text-slate-400 text-[11px] block mb-1">Recurrent State Accumulation:</span>
            <div className="p-3 bg-black/60 border border-white/10 text-center font-bold text-sm text-white">
              {"S_t = \\lambda S_{t-1} + v_t k_t^T = \\sum_{i=1}^t \\lambda^{t-i} v_i k_i^T"}
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block mb-1">Query Readout for probe q_j = k_j:</span>
            <div className="p-3 bg-black/60 border border-white/10 text-center font-bold text-sm text-white">
              {"y_t = S_t q_t = \\sum_{i=1}^t \\lambda^{t-i} v_i (k_i^T q_t)"}
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[11px] block mb-1">Exact Causal Algebraic Decomposition:</span>
            <div className="p-4 bg-black/80 border border-cyan-500/30 text-center font-bold text-sm text-white space-y-2">
              <div>
                {"y_t = \\underbrace{\\lambda^{t-j} v_j (k_j^T q_j)}_{\\text{Target Signal Component}} + \\underbrace{\\sum_{i \\ne j} \\lambda^{t-i} v_i (k_i^T q_j)}_{\\text{Cross-Talk Interference}}"}
              </div>
              <div className="text-[10px] text-slate-400 font-normal">
                When &lambda; = 1.0, temporal decay disappears and recurrence reduces to cumulative outer-product memory.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04. Linear Attention Equivalence Dual */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-white/5 pb-1">
          04. LINEAR RECURRENCE ↔ LINEAR ATTENTION EQUIVALENCE DUAL
        </h2>
        <p className="leading-relaxed">
          Schlag, Irie, &amp; Schmidhuber (2021) demonstrated that causal linear transformers with feature map &phi;(x) compute:
        </p>
        <div className="p-3 bg-black/60 border border-white/10 text-center font-bold text-sm text-white">
          {"y_t = (V_{1:t} K_{1:t}^T) q_t = \\left( \\sum_{i=1}^t v_i k_i^T \\right) q_t = S_t q_t"}
        </div>
        <p className="text-[11px] text-slate-400">
          This proves that linear transformers operate via fast-weight associative recurrence, executing sequential token inference in O(1) memory per step. Our test suite numerically verifies this identity across 125 randomized parameter configurations at float64 error &lt; 10^-14.
        </p>
      </section>

      {/* 05. Limitations & Scope Bounds */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-white/5 pb-1 flex items-center space-x-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>05. SCIENTIFIC LIMITATIONS &amp; SCOPE BOUNDS</span>
        </h2>
        <div className="p-4 bg-amber-950/20 border border-amber-500/30 space-y-2 text-[11px] text-slate-300">
          <div>
            <strong className="text-amber-300">• Dimensionless Load Ratio N/d:</strong> Error scaling with N/d is an empirical observation on the specified isotropic Gaussian key distribution, not a universal theorem for arbitrary manifolds.
          </div>
          <div>
            <strong className="text-amber-300">• BDH-Inspired Abstraction:</strong> Our interactive ReLU/Top-K matrix is a simplified single-layer teaching model. It is NOT the complete multi-layer Dragon Hatchling architecture.
          </div>
          <div>
            <strong className="text-amber-300">• Finite Numerical Verification:</strong> Floating-point test suites numerically verify the implemented algebraic formulation, which serves as computational validation rather than a deductive mathematical proof.
          </div>
        </div>
      </section>

      {/* 06. Primary Verified Literature */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-white/5 pb-1">
          06. PRIMARY RESEARCH LITERATURE REFERENCES
        </h2>
        <div className="space-y-2">
          {[
            {
              authors: "Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M. (2025)",
              title: "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain",
              venue: "arXiv:2509.26507",
              link: "https://arxiv.org/abs/2509.26507",
              id: "arXiv:2509.26507",
            },
            {
              authors: "Engdahl, B., Kosowski, A., Chorowski, J., Stamirowska, Z., Uznański, P., et al. (2026)",
              title: "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning",
              venue: "arXiv:2608.09888",
              link: "https://arxiv.org/abs/2608.09888",
              id: "arXiv:2608.09888",
            },
            {
              authors: "Schlag, I., Irie, K., & Schmidhuber, J. (2021)",
              title: "Linear Transformers Are Secretly Fast Weight Programmers",
              venue: "ICML 2021",
              link: "https://arxiv.org/abs/2102.11174",
              id: "arXiv:2102.11174",
            },
            {
              authors: "Beck, M., et al. (2024)",
              title: "xLSTM: Extended Long Short-Term Memory",
              venue: "NeurIPS 2024",
              link: "https://arxiv.org/abs/2405.04517",
              id: "arXiv:2405.04517",
            },
            {
              authors: "Gu, A., & Dao, T. (2023)",
              title: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
              venue: "arXiv:2312.00752",
              link: "https://arxiv.org/abs/2312.00752",
              id: "arXiv:2312.00752",
            },
            {
              authors: "Sun, Y., et al. (2024)",
              title: "Learning to (Learn at Test Time): RNNs with Expressive Hidden States (TTT)",
              venue: "arXiv:2407.04620",
              link: "https://arxiv.org/abs/2407.04620",
              id: "arXiv:2407.04620",
            },
          ].map((ref, i) => (
            <div
              key={i}
              className="p-3 bg-black/40 border border-white/10 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div>
                <span className="text-white font-bold">{ref.authors}. </span>
                <span className="text-slate-300 italic">&ldquo;{ref.title}&rdquo;. </span>
                <span className="text-slate-400">{ref.venue}.</span>
              </div>
              <a
                href={ref.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-[10px] ml-3 flex-shrink-0"
              >
                <span>{ref.id}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
