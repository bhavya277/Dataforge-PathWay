"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

interface GuidedChapterFlowProps {
  onApplyConfig: (config: {
    d: number;
    N: number;
    correlation: number;
    decay: number;
    useBDH: boolean;
  }) => void;
}

export const GuidedChapterFlow: React.FC<GuidedChapterFlowProps> = ({ onApplyConfig }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const chapters = [
    {
      step: 1,
      num: "01",
      name: "STORE",
      title: "STORE: RANK-1 OUTER PRODUCT UPDATES",
      subtitle: "Writing associations into state matrix S",
      question: "How does a recurrent matrix store continuous key-value associations?",
      formula: "S_t = λ S_{t-1} + v_t k_tᵀ = Σ_{i=1}^t λ^(t-i) v_i k_iᵀ",
      explanation:
        "At each timestep t, the memory accumulates a rank-1 outer product matrix ΔS = v_t k_tᵀ. When keys are mutually orthonormal, each association occupies an independent subspace.",
      actionText: "Load 4 Orthogonal Keys (d = 8, N = 4, ρ = 0.0)",
      config: { d: 8, N: 4, correlation: 0.0, decay: 1.0, useBDH: false },
      takeaway: "Notice S_t updating as each outer product is written into the state.",
    },
    {
      step: 2,
      num: "02",
      name: "COMPRESS",
      title: "COMPRESS: FIXED-SIZE STATE RECURRENCE",
      subtitle: "Fixed parameter budget S ∈ ℝ^(d×d)",
      question: "Why does recurrent associative memory operate with O(1) inference memory?",
      formula: "S_t ∈ ℝ^(d × d) ⟹ Parameters Fixed at d²",
      explanation:
        "Unlike transformers with growing KV caches, the fast-weight recurrent state maintains fixed memory size d×d. All associations are compressed in continuous superposition.",
      actionText: "Check Fixed Parameter Budget (d = 8, N = 4)",
      config: { d: 8, N: 4, correlation: 0.0, decay: 1.0, useBDH: false },
      takeaway: "Notice that state size S remains exactly 8×8 regardless of sequence length.",
    },
    {
      step: 3,
      num: "03",
      name: "QUERY",
      title: "QUERY: O(1) ASSOCIATIVE READOUT",
      subtitle: "Matrix-vector multiplication y = S q",
      question: "How is a stored association retrieved from the compressed state?",
      formula: "y_t = S_t q_t = Σ_{i=1}^t λ^(t-i) v_i (k_iᵀ q_t)",
      explanation:
        "Querying key k_j computes S q_j. When keys are orthogonal, off-diagonal inner products k_iᵀ q_j = 0 for all i ≠ j, isolating ground truth v_j with zero error.",
      actionText: "Query Orthogonal State (Cosine Sim = 1.000)",
      config: { d: 8, N: 4, correlation: 0.0, decay: 1.0, useBDH: false },
      takeaway: "Notice that with orthogonal keys, Cross-Talk is identically 0.00 and Cosine Error is 0.0000.",
    },
    {
      step: 4,
      num: "04",
      name: "INTERFERE",
      title: "INTERFERE: CROSS-TALK CONTAMINATION",
      subtitle: "Non-orthogonal key overlap (ρ > 0)",
      question: "What happens when keys have non-zero geometric overlap?",
      formula: "y_t = [Target: λ^(t-j) v_j (k_jᵀ q_j)] + [Cross-Talk: Σ_{i ≠ j} λ^(t-i) v_i (k_iᵀ q_j)]",
      explanation:
        "When keys overlap, off-diagonal projections k_iᵀ q_j become non-zero. The retrieved vector is contaminated by additive contributions from all other stored associations.",
      actionText: "Inject Key Overlap (ρ = 0.45, d = 8, N = 4)",
      config: { d: 8, N: 4, correlation: 0.45, decay: 1.0, useBDH: false },
      takeaway: "Look at the Amber Cross-Talk bar: unrelated memories bleed into the readout.",
    },
    {
      step: 5,
      num: "05",
      name: "STRESS",
      title: "STRESS: MEMORY LOAD (N / d)",
      subtitle: "Finite-dimensional state under synthetic load",
      question: "What happens when stored associations N exceed state dimension d?",
      formula: "Memory Load Ratio: γ = N / d",
      explanation:
        "When more than d nonzero keys are placed in ℝ^d, the keys cannot all remain mutually orthogonal. In this synthetic setup, increasing memory load can therefore produce more non-zero off-diagonal contributions and measured cross-talk.",
      actionText: "Apply Synthetic Memory Load (N = 12, d = 8, N/d = 1.5)",
      config: { d: 8, N: 12, correlation: 0.2, decay: 1.0, useBDH: false },
      takeaway: "Observe how higher memory load ratio N/d in this synthetic setup produces non-zero off-diagonal contributions.",
    },
    {
      step: 6,
      num: "06",
      name: "CONNECT",
      title: "CONNECT: BDH-INSPIRED TEACHING ABSTRACTION",
      subtitle: "Sparse Positive Rectification [Not the full BDH architecture]",
      question: "How do sparse positive activations alter interference patterns?",
      formula: "W_t = TopK(λ W_{t-1} + η · ReLU(v_t) ReLU(k_t)ᵀ)",
      explanation:
        "The BDH-inspired teaching abstraction applies non-negative activation and sparse connection gating to explore how restricting active supports can change the pattern of cross-talk. It is not the full BDH architecture.",
      actionText: "Activate BDH-Inspired Teaching Abstraction",
      config: { d: 8, N: 12, correlation: 0.35, decay: 1.0, useBDH: true },
      takeaway: "Notice how restricting active interactions alters the pattern of cross-talk in this teaching abstraction.",
    },
  ];

  const current = chapters[currentStep - 1];

  const handleApply = () => {
    onApplyConfig(current.config);
  };

  return (
    <div className="py-6 space-y-6">
      {/* Step Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#D9DCE1] pb-4 gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#111318] text-white">
            STEP {current.num} / 06
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#111318] uppercase tracking-wider">
            {current.title}
          </h2>
        </div>

        {/* Step Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="p-1.5 bg-[#FFFFFF] border border-[#D9DCE1] text-[#626873] hover:text-[#111318] disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex space-x-1">
            {chapters.map((ch) => (
              <button
                key={ch.step}
                onClick={() => setCurrentStep(ch.step)}
                className={`px-2 py-1 text-[11px] font-mono font-bold flex items-center justify-center transition-all ${
                  ch.step === currentStep
                    ? "bg-[#111318] text-white"
                    : "bg-[#FFFFFF] border border-[#D9DCE1] text-[#626873] hover:bg-[#F0F1ED]"
                }`}
                aria-label={`Go to step ${ch.step}: ${ch.name}`}
              >
                {ch.num} {ch.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
            disabled={currentStep === 6}
            className="p-1.5 bg-[#FFFFFF] border border-[#D9DCE1] text-[#626873] hover:text-[#111318] disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            aria-label="Next step"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question, Formula, and Live Action */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="md:col-span-2 space-y-4">
          <div className="text-base font-bold text-[#111318]">
            Scientific Question: &ldquo;{current.question}&rdquo;
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#D9DCE1] text-center font-mono font-bold text-sm text-[#111318] shadow-sm overflow-x-auto">
            {current.formula}
          </div>

          <p className="text-sm text-[#626873] leading-relaxed">{current.explanation}</p>

          <div className="p-3 bg-[#F0F1ED] border border-[#D9DCE1] text-xs text-[#111318]">
            <strong>Key Observation:</strong> {current.takeaway}
          </div>
        </div>

        {/* Live Parameter Injection Action */}
        <div className="bg-[#FFFFFF] p-5 border border-[#D9DCE1] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#626873] uppercase tracking-widest block mb-2">
              STEP PARAMETERS
            </span>
            <div className="space-y-1.5 text-xs font-mono text-[#111318]">
              <div>Dimension: <strong>d = {current.config.d}</strong></div>
              <div>Associations: <strong>N = {current.config.N}</strong></div>
              <div>Correlation: <strong className="text-[#D97706]">ρ = {current.config.correlation.toFixed(2)}</strong></div>
              <div>Retention: <strong>λ = {current.config.decay.toFixed(2)}</strong></div>
              <div>Model: <strong>{current.config.useBDH ? "Sparse Positive" : "Standard Linear"}</strong></div>
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-[#111318] hover:bg-black text-white font-bold text-xs transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Apply This Protocol</span>
          </button>
        </div>
      </div>
    </div>
  );
};
