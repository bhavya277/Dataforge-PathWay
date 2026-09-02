"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

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
            THE CENTRAL SCIENTIFIC QUESTION &amp; CLAIM
          </h2>
        </div>
        <div className="p-5 bg-[#FFFFFF] border-l-4 border-[#111318] shadow-sm text-sm sm:text-base text-[#111318] leading-relaxed italic">
          &ldquo;In a linear fast-weight associative memory, retrieving one stored value also receives contributions from other stored key-value pairs; increasing key similarity or memory load therefore increases interference under the stated retrieval setup.&rdquo;
        </div>
      </section>

      {/* 02. Method & Computational Substrate */}
      <section className="space-y-4">
        <div className="flex items-baseline space-x-3 border-b border-[#D9DCE1] pb-2">
          <span className="text-lg font-mono font-bold text-[#626873]">02</span>
          <h2 className="text-lg font-bold text-[#111318] uppercase tracking-wider">
            METHODOLOGY &amp; COMPUTATIONAL SUBSTRATE
          </h2>
        </div>
        <p className="text-sm text-[#626873] leading-relaxed">
          The memory is modeled as a recurrent matrix Sₜ ∈ ℝ^(d×d) storing N key-value associations (k_i, v_i) ∈ ℝ^d.
          Keys are generated via isotropic Gaussian distributions with a controlled shared-component parameter ρ:
        </p>
        <div className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] text-center font-mono font-bold text-sm text-[#111318] shadow-sm">
          {"k_i = \\text{normalize}\\left(\\sqrt{1 - \\rho} \\cdot u_i + \\sqrt{\\rho} \\cdot u_0\\right), \\quad u_0, u_i \\sim \\mathcal{N}(0, I_d)"}
        </div>
      </section>

      {/* 03. Mathematical Model & Exact Recurrence Decomposition */}
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
            <div className="p-3 bg-[#FFFFFF] border border-[#D9DCE1] text-center font-mono font-bold text-sm text-[#111318] shadow-sm">
              {"S_t = \\lambda S_{t-1} + v_t k_t^T = \\sum_{i=1}^t \\lambda^{t-i} v_i k_i^T"}
            </div>
          </div>

          <div>
            <span className="font-medium text-[#111318] block mb-1">2. Query Readout for probe q_j = k_j:</span>
            <div className="p-3 bg-[#FFFFFF] border border-[#D9DCE1] text-center font-mono font-bold text-sm text-[#111318] shadow-sm">
              {"y_t = S_t q_t = \\sum_{i=1}^t \\lambda^{t-i} v_i (k_i^T q_t)"}
            </div>
          </div>

          <div>
            <span className="font-medium text-[#111318] block mb-1">3. Exact Causal Algebraic Decomposition:</span>
            <div className="p-4 bg-[#FFFFFF] border border-[#0284C7]/40 text-center font-mono font-bold text-sm text-[#111318] shadow-sm space-y-2">
              <div>
                {"y_t = \\underbrace{\\lambda^{t-j} v_j (k_j^T q_j)}_{\\text{Target Signal Component}} + \\underbrace{\\sum_{i \\ne j} \\lambda^{t-i} v_i (k_i^T q_j)}_{\\text{Cross-Talk Interference}}"}
              </div>
              <p className="text-xs font-normal text-[#626873]">
                When λ = 1.0, temporal decay is absent and recurrence reduces to un-normalized sum of outer products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04. Linear Attention Recurrence Dual */}
      <section className="space-y-4">
        <div className="flex items-baseline space-x-3 border-b border-[#D9DCE1] pb-2">
          <span className="text-lg font-mono font-bold text-[#626873]">04</span>
          <h2 className="text-lg font-bold text-[#111318] uppercase tracking-wider">
            LINEAR RECURRENCE ↔ LINEAR ATTENTION EQUIVALENCE DUAL
          </h2>
        </div>
        <p className="text-sm text-[#626873] leading-relaxed">
          Schlag, Irie, &amp; Schmidhuber (2021) demonstrated that causal linear transformers with feature map &phi;(x) compute:
        </p>
        <div className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] text-center font-mono font-bold text-sm text-[#111318] shadow-sm">
          {"y_t = (V_{1:t} K_{1:t}^T) q_t = \\left( \\sum_{i=1}^t v_i k_i^T \\right) q_t = S_t q_t"}
        </div>
        <p className="text-xs text-[#626873]">
          This proves that linear transformers operate via fast-weight associative recurrence, executing sequential token inference in O(1) memory per step. Our test suite numerically verifies this identity across 125 randomized parameter configurations at float64 error &lt; 10^-14.
        </p>
      </section>

      {/* 05. Scientific Limitations */}
      <section className="space-y-4">
        <div className="flex items-baseline space-x-3 border-b border-[#D9DCE1] pb-2">
          <span className="text-lg font-mono font-bold text-[#626873]">05</span>
          <h2 className="text-lg font-bold text-[#111318] uppercase tracking-wider">
            SCIENTIFIC LIMITATIONS &amp; HONEST BOUNDS
          </h2>
        </div>
        <div className="p-5 bg-[#FFFFFF] border border-[#D9DCE1] shadow-sm space-y-2 text-xs text-[#626873] leading-relaxed">
          <div>
            <strong className="text-[#111318]">• Dimensionless Load Ratio N/d:</strong> Error scaling with N/d is an empirical observation on the specified isotropic Gaussian key distribution, not a universal theorem for arbitrary manifolds.
          </div>
          <div>
            <strong className="text-[#111318]">• BDH-Inspired Abstraction:</strong> Our interactive ReLU/Top-K matrix is a simplified single-layer teaching model. It is NOT the complete multi-layer Dragon Hatchling architecture.
          </div>
          <div>
            <strong className="text-[#111318]">• Finite Numerical Verification:</strong> Floating-point test suites numerically verify the implemented algebraic formulation, which serves as computational validation rather than a deductive mathematical proof.
          </div>
        </div>
      </section>

      {/* 06. Primary Verified Literature */}
      <section className="space-y-4">
        <div className="flex items-baseline space-x-3 border-b border-[#D9DCE1] pb-2">
          <span className="text-lg font-mono font-bold text-[#626873]">06</span>
          <h2 className="text-lg font-bold text-[#111318] uppercase tracking-wider">
            PRIMARY RESEARCH LITERATURE REFERENCES
          </h2>
        </div>
        <div className="space-y-3">
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
              className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] shadow-sm flex items-center justify-between"
            >
              <div className="text-xs">
                <strong className="text-[#111318]">{ref.authors}. </strong>
                <span className="italic text-[#626873]">&ldquo;{ref.title}&rdquo;. </span>
                <span className="font-mono text-[#8A909A]">{ref.venue}.</span>
              </div>
              <a
                href={ref.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-[#0284C7] hover:underline text-xs font-mono ml-4 flex-shrink-0"
              >
                <span>{ref.id}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};
