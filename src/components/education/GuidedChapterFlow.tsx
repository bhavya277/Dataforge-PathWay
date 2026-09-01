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
      title: "Chapter 01: The Recurrent State Update",
      subtitle: "How associations are stored via outer products",
      question: "How does a fixed-size matrix store continuous key-value associations over time?",
      formula: "S_t = \\lambda S_{t-1} + v_t k_t^T = \\sum_{i=1}^t \\lambda^{t-i} v_i k_i^T",
      explanation:
        "At each timestep t, the memory accumulates a rank-1 outer product matrix delta S = v_t k_t^T. Storing orthogonal keys embeds distinct associative pathways into orthogonal subspaces of S.",
      actionText: "Load Baseline: 4 Orthogonal Keys (rho = 0.0, d = 8)",
      config: { d: 8, N: 4, correlation: 0.0, decay: 1.0, useBDH: false },
      takeaway: "Observe S_t updating dynamically as each outer product is added to the state.",
    },
    {
      step: 2,
      title: "Chapter 02: Query Readout & Recall",
      subtitle: "O(1) matrix-vector associative retrieval",
      question: "How does the model retrieve a specific value without scanning a full history cache?",
      formula: "y_t = S_t q_t = \\sum_{i=1}^t \\lambda^{t-i} v_i (k_i^T q_t)",
      explanation:
        "To query for key k_j, the model multiplies S q_j. When keys are mutually orthonormal, k_i^T q_j = 0 for all i != j and k_j^T q_j = 1, extracting ground truth v_j with zero distortion.",
      actionText: "Test Orthogonal Query Readout (Cosine Sim = 1.000)",
      config: { d: 8, N: 4, correlation: 0.0, decay: 1.0, useBDH: false },
      takeaway: "Notice that with orthogonal keys, Cross-Talk is identically 0.00 and Cosine Error is 0.0000.",
    },
    {
      step: 3,
      title: "Chapter 03: The Cross-Talk Breakdown",
      subtitle: "The algebraic root of catastrophic memory bleed",
      question: "What happens when key vectors have non-zero geometric overlap (rho > 0)?",
      formula: "y_t = \\underbrace{\\lambda^{t-j} v_j (k_j^T q_j)}_{\\text{Target Signal}} + \\underbrace{\\sum_{i \\ne j} \\lambda^{t-i} v_i (k_i^T q_j)}_{\\text{Cross-Talk Interference}}",
      explanation:
        "When keys overlap, querying key k_j activates non-zero projections k_i^T q_j. The retrieved vector becomes a contaminated linear superposition of the target value and all other memories.",
      actionText: "Inject Key Correlation (rho = 0.45, d = 8, N = 4)",
      config: { d: 8, N: 4, correlation: 0.45, decay: 1.0, useBDH: false },
      takeaway: "Look at the Amber Cross-Talk bars in the Dual Readout: unrelated memories now bleed into the output.",
    },
    {
      step: 4,
      title: "Chapter 04: Memory Load Ratio (N/d)",
      subtitle: "Finite-dimensional capacity constraints under isotropic keys",
      question: "What happens when the number of stored memories N exceeds state dimension d?",
      formula: "\\text{Dimensionless Load Ratio: } \\gamma = N / d > 1.0",
      explanation:
        "The mathematical rank of an 8x8 matrix cannot exceed 8. Storing 12 associations in an 8-dimensional state matrix forces geometric overlap by linear algebra bounds, multiplying cumulative cross-talk.",
      actionText: "Stress Test Over-Capacity Load (N = 12, d = 8, N/d = 1.5)",
      config: { d: 8, N: 12, correlation: 0.2, decay: 1.0, useBDH: false },
      takeaway: "Observe how memory load ratio N/d > 1.0 elevates observed pairwise key overlap and error.",
    },
    {
      step: 5,
      title: "Chapter 05: BDH-Inspired Sparse Plasticity",
      subtitle: "Sparse Positive Rectification & Monosemantic Synapses [TEACHING ABSTRACTION]",
      question: "How do sparse positive activations suppress cross-talk without an expanding KV cache?",
      formula: "W_t = \\text{TopK}(\\lambda W_{t-1} + \\eta \\cdot \\text{ReLU}(v_t) \\text{ReLU}(k_t)^T)",
      explanation:
        "Dragon Hatchling (BDH) explores non-negative sparse activations (ReLU/Top-K). In high dimensions, sparse positive vectors have quasi-disjoint supports, driving cross-talk inner products toward zero. (Note: this is a single-layer visual teaching abstraction; not the complete multi-layer BDH architecture).",
      actionText: "Activate Sparse Positive Plasticity [BDH-INSPIRED TEACHING ABSTRACTION]",
      config: { d: 8, N: 12, correlation: 0.35, decay: 1.0, useBDH: true },
      takeaway: "Notice how sparse non-negative projection suppresses off-diagonal cross-talk in this toy model.",
    },
  ];

  const current = chapters[currentStep - 1];

  const handleApply = () => {
    onApplyConfig(current.config);
  };

  return (
    <div className="bg-[#101217] border border-white/[0.08] rounded-lg p-5 font-mono space-y-4">
      {/* Chapter Indicator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            STEP 0{current.step} / 05
          </span>
          <h2 className="text-sm font-bold text-white">{current.title}</h2>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="p-1.5 rounded bg-black/40 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous chapter"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex space-x-1">
            {chapters.map((ch) => (
              <button
                key={ch.step}
                onClick={() => setCurrentStep(ch.step)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  ch.step === currentStep ? "bg-cyan-400 scale-125" : "bg-white/10 hover:bg-white/30"
                }`}
                aria-label={`Go to chapter ${ch.step}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
            disabled={currentStep === 5}
            className="p-1.5 rounded bg-black/40 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next chapter"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question & Scientific Lesson */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2.5">
          <div className="text-xs text-cyan-300 font-bold">
            Scientific Question: &ldquo;{current.question}&rdquo;
          </div>

          <div className="p-3 bg-black/40 rounded border border-white/5 text-center text-xs sm:text-sm font-bold text-white overflow-x-auto">
            {current.formula}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{current.explanation}</p>

          <div className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2.5 rounded border border-amber-500/20">
            <strong>Key Insight:</strong> {current.takeaway}
          </div>
        </div>

        {/* Action Callout */}
        <div className="bg-black/50 p-4 rounded border border-white/10 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Live Parameter Injection
            </span>
            <div className="space-y-1 text-xs text-slate-300">
              <div>Dimension d: <strong className="text-white">{current.config.d}</strong></div>
              <div>Associations N: <strong className="text-white">{current.config.N}</strong></div>
              <div>Correlation ρ: <strong className="text-amber-400">{current.config.correlation.toFixed(2)}</strong></div>
              <div>Decay λ: <strong className="text-slate-200">{current.config.decay.toFixed(2)}</strong></div>
              <div>Plasticity: <strong className={current.config.useBDH ? "text-emerald-400" : "text-slate-400"}>{current.config.useBDH ? "Sparse Positive" : "Standard Linear"}</strong></div>
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Apply This Protocol</span>
          </button>
        </div>
      </div>
    </div>
  );
};
