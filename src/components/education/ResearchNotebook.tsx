"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { BlockMath } from "@/components/ui/MathView";

export const ResearchNotebook: React.FC = () => {
  return (
    <article className="py-8 space-y-12 max-w-4xl mx-auto">
      {/* Article Title Header */}
      <header className="border-b border-[#D9DCE1] pb-8 space-y-3">
        <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
          07 / RESEARCH NOTES • TECHNICAL SPECIFICATION
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111318]">
          Associative Memory &amp; Linear Recurrent State Updates in Fast-Weight Architectures
        </h1>
        <p className="text-sm text-[#626873]">
          DataForge × Pathway 2026 Hackathon • Primary Mathematical and Experimental Substrate
        </p>
      </header>

      {/* 01. Research Question */}
      <section className="space-y-4">
        <div className="flex items-baseline space-x-3 border-b border-[#D9DCE1] pb-2">
          <span className="text-lg font-mono font-bold text-[#626873]">01</span>
          <h2 className="text-lg font-bold text-[#111318] uppercase tracking-wider">
            QUESTION &amp; CENTRAL CLAIM
          </h2>
        </div>
        <div className="p-5 bg-[#FFFFFF] border-l-4 border-[#111318] shadow-sm text-sm sm:text-base text-[#111318] leading-relaxed italic">
          &ldquo;When stored keys are not orthogonal, a linear fast-weight state adds non-target contributions to retrieval; in our synthetic setup, increasing controlled key overlap increases measured cross-talk.&rdquo;
        </div>
      </section>

      {/* 02. Method */}
      <section className="space-y-4">
        <div className="flex items-baseline space-x-3 border-b border-[#D9DCE1] pb-2">
          <span className="text-lg font-mono font-bold text-[#626873]">02</span>
          <h2 className="text-lg font-bold text-[#111318] uppercase tracking-wider">
            METHODOLOGY &amp; SYNTHETIC DATASET
          </h2>
        </div>
        <p className="text-sm text-[#626873] leading-relaxed">
          The memory is modeled as a recurrent matrix Sₜ ∈ ℝ^(d×d) storing N key-value associations (k_i, v_i) ∈ ℝ^d.
          Keys are generated via isotropic Gaussian distributions with a controlled shared-component parameter ρ:
        </p>
        <div className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] text-center shadow-sm">
          <BlockMath math={"k_i = \\operatorname{normalize}\\left(\\sqrt{1 - \\rho} \\cdot u_i + \\sqrt{\\rho} \\cdot u_0\\right), \\quad u_0, u_i \\sim \\mathcal{N}(0, I_d)"} />
        </div>
      </section>

      {/* 03. Mathematical Model */}
      <section className="space-y-4">
        <div className="flex items-baseline space-x-3 border-b border-[#D9DCE1] pb-2">
          <span className="text-lg font-mono font-bold text-[#626873]">03</span>
          <h2 className="text-lg font-bold text-[#111318] uppercase tracking-wider">
            MATHEMATICAL MODEL &amp; EXACT RECURRENCE DECOMPOSITION
          </h2>
        </div>

        <div className="space-y-4 text-sm text-[#626873]">
          <div>
            <span className="font-medium text-[#111318] block mb-1">1. Recurrent State Update:</span>
            <div className="p-3 bg-[#FFFFFF] border border-[#D9DCE1] text-center shadow-sm">
              <BlockMath math={"S_t = \\lambda S_{t-1} + v_t k_t^T = \\sum_{i=1}^t \\lambda^{t-i} v_i k_i^T"} />
            </div>
          </div>

          <div>
            <span className="font-medium text-[#111318] block mb-1">2. Query Readout for probe q_j = k_j:</span>
            <div className="p-3 bg-[#FFFFFF] border border-[#D9DCE1] text-center shadow-sm">
              <BlockMath math={"y_t = S_t q_t = \\sum_{i=1}^t \\lambda^{t-i} v_i (k_i^T q_t)"} />
            </div>
          </div>

          <div>
            <span className="font-medium text-[#111318] block mb-1">3. Exact Causal Algebraic Decomposition:</span>
            <div className="p-4 bg-[#FFFFFF] border border-[#0284C7]/40 text-center shadow-sm space-y-2">
              <BlockMath math={"y_t = \\underbrace{\\lambda^{t-j} v_j (k_j^T q_j)}_{\\text{Target Signal Component}} + \\underbrace{\\sum_{i \\ne j} \\lambda^{t-i} v_i (k_i^T q_j)}_{\\text{Cross-Talk Interference}}"} />
              <p className="text-xs font-normal text-[#626873]">
                When λ = 1.0, temporal decay is absent and recurrence reduces to un-normalized sum of outer products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04. Experiment & Attention Equivalence */}
      <section className="space-y-4">
        <div className="flex items-baseline space-x-3 border-b border-[#D9DCE1] pb-2">
          <span className="text-lg font-mono font-bold text-[#626873]">04</span>
          <h2 className="text-lg font-bold text-[#111318] uppercase tracking-wider">
            EXPERIMENT: LINEAR RECURRENCE ↔ LINEAR ATTENTION DUAL
          </h2>
        </div>
        <p className="text-sm text-[#626873] leading-relaxed">
          Schlag, Irie, &amp; Schmidhuber (2021) demonstrated that causal linear transformers compute:
        </p>
        <div className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] text-center shadow-sm">
          <BlockMath math={"y_t = (V_{1:t} K_{1:t}^T) q_t = \\left( \\sum_{i=1}^t v_i k_i^T \\right) q_t = S_t q_t"} />
        </div>
        <p className="text-xs text-[#626873]">
          Our Python and TypeScript test suites numerically verify this identity across 125 randomized parameter sweeps with float64 discrepancy &lt; 10^-14.
        </p>
      </section>

      {/* 05. Limitations */}
      <section className="space-y-4">
        <div className="flex items-baseline space-x-3 border-b border-[#D9DCE1] pb-2">
          <span className="text-lg font-mono font-bold text-[#626873]">05</span>
          <h2 className="text-lg font-bold text-[#111318] uppercase tracking-wider">
            SCIENTIFIC LIMITATIONS &amp; HONEST BOUNDS
          </h2>
        </div>
        <div className="p-5 bg-[#FFFFFF] border border-[#D9DCE1] shadow-sm space-y-2 text-xs text-[#626873] leading-relaxed">
          <div>
            <strong className="text-[#111318]">• Dimensionless Load Ratio N/d:</strong> Error scaling with N/d is an empirical observation on the specified isotropic Gaussian distribution, not a universal theorem for arbitrary manifolds.
          </div>
          <div>
            <strong className="text-[#111318]">• BDH-Inspired Abstraction:</strong> Our interactive ReLU/Top-K matrix is a single-layer visual teaching model; it is NOT the complete multi-layer Dragon Hatchling architecture.
          </div>
          <div>
            <strong className="text-[#111318]">• Computational Validation:</strong> Numerical equivalence verification serves as computational validation of our implementation rather than an axiomatic deductive proof.
          </div>
        </div>
      </section>

      {/* 06. BDH Connection */}
      <section className="space-y-4">
        <div className="flex items-baseline space-x-3 border-b border-[#D9DCE1] pb-2">
          <span className="text-lg font-mono font-bold text-[#626873]">06</span>
          <h2 className="text-lg font-bold text-[#111318] uppercase tracking-wider">
            BDH &amp; BDH-CQ ARCHITECTURAL CONNECTION
          </h2>
        </div>
        <p className="text-sm text-[#626873] leading-relaxed">
          Dragon Hatchling (BDH) combines sparse positive activations (ReLU/TopK), local synaptic plasticity, and recurrent memory state updates. BDH-CQ extends this to in-context learning with recurrent latent reasoning over demonstration trajectories without verbal token generation.
        </p>
      </section>

      {/* 07. Primary Literature Sources */}
      <section className="space-y-4">
        <div className="flex items-baseline space-x-3 border-b border-[#D9DCE1] pb-2">
          <span className="text-lg font-mono font-bold text-[#626873]">07</span>
          <h2 className="text-lg font-bold text-[#111318] uppercase tracking-wider">
            PRIMARY RESEARCH SOURCES &amp; REFERENCES
          </h2>
        </div>
        <div className="space-y-3">
          {[
            {
              author: "Kosowski, Uznański, Chorowski, Stamirowska, & Bartoszkiewicz (2025)",
              title: "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain",
              arxiv: "arXiv:2509.26507",
              url: "https://arxiv.org/abs/2509.26507",
            },
            {
              author: "Engdahl, Kosowski, Chorowski, Stamirowska, Uznański, et al. (2026)",
              title: "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning",
              arxiv: "arXiv:2608.09888",
              url: "https://arxiv.org/abs/2608.09888",
            },
            {
              author: "Schlag, Irie, & Schmidhuber (2021)",
              title: "Linear Transformers Are Secretly Fast Weight Programmers",
              arxiv: "arXiv:2102.11174",
              url: "https://arxiv.org/abs/2102.11174",
            },
            {
              author: "Katharopoulos, Vyas, Pappas, & Fleuret (2020)",
              title: "Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention",
              arxiv: "arXiv:2006.16236",
              url: "https://arxiv.org/abs/2006.16236",
            },
          ].map((ref, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm"
            >
              <div className="text-xs">
                <strong className="text-[#111318]">{ref.author}. </strong>
                <span className="italic text-[#626873]">&ldquo;{ref.title}&rdquo;. </span>
                <span className="font-mono text-[#8A909A]">{ref.arxiv}.</span>
              </div>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-[#0284C7] hover:underline text-xs font-mono flex-shrink-0"
              >
                <span>{ref.arxiv}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};
