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
      title: "THE RECURRENT MEMORY STATE",
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
      num: "02",
      title: "THE QUERY & ASSOCIATIVE RECALL",
      subtitle: "O(1) matrix-vector associative readout",
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
      num: "03",
      title: "THE CROSS-TALK BREAKDOWN",
      subtitle: "The algebraic root of associative interference",
      question: "What happens when key vectors have non-zero geometric overlap (rho > 0)?",
      formula: "y_t = \\underbrace{\\lambda^{t-j} v_j (k_j^T q_j)}_{\\text{Target Signal}} + \\underbrace{\\sum_{i \\ne j} \\lambda^{t-i} v_i (k_i^T q_j)}_{\\text{Cross-Talk Interference}}",
      explanation:
        "When keys overlap, querying key k_j activates non-zero projections k_i^T q_j. The retrieved vector becomes a contaminated linear superposition of the target value and all other memories.",
      actionText: "Inject Key Correlation (rho = 0.45, d = 8, N = 4)",
      config: { d: 8, N: 4, correlation: 0.45, decay: 1.0, useBDH: false },
      takeaway: "Look at the Amber Cross-Talk bar in the Dual Readout: unrelated memories now bleed into the output.",
    },
    {
      step: 4,
      num: "04",
      title: "MEMORY LOAD RATIO (N / d)",
      subtitle: "Capacity bounds under isotropic keys",
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
      num: "05",
      title: "TEMPORAL FORGETTING & RETENTION",
      subtitle: "Exponential decay factor lambda < 1",
      question: "How does temporal decay alter retention of earlier vs recent memories?",
      formula: "S_t = \\lambda S_{t-1} + v_t k_t^T \\implies \\text{Discount } \\lambda^{t-i}",
      explanation:
        "Setting lambda < 1 discounts earlier associations exponentially by lambda^(t-i). This attenuates cross-talk from old memories while reducing earlier target signal magnitude.",
      actionText: "Apply Temporal Decay (lambda = 0.80, N = 6, d = 8)",
      config: { d: 8, N: 6, correlation: 0.2, decay: 0.8, useBDH: false },
      takeaway: "Notice how recent memories have stronger signal retention while older memories fade.",
    },
    {
      step: 6,
      num: "06",
      title: "BDH-INSPIRED SPARSE PLASTICITY",
      subtitle: "Sparse Positive Rectification [TEACHING ABSTRACTION]",
      question: "How do sparse positive activations suppress cross-talk without an expanding KV cache?",
      formula: "W_t = \\text{TopK}(\\lambda W_{t-1} + \\eta \\cdot \\text{ReLU}(v_t) \\text{ReLU}(k_t)^T)",
      explanation:
        "Dragon Hatchling (BDH) explores non-negative sparse activations (ReLU/Top-K). In high dimensions, sparse positive vectors have quasi-disjoint supports, driving cross-talk inner products toward zero. (Note: this is a single-layer visual teaching abstraction; not the complete multi-layer BDH architecture).",
      actionText: "Activate Sparse Positive Plasticity [TEACHING ABSTRACTION]",
      config: { d: 8, N: 12, correlation: 0.35, decay: 1.0, useBDH: true },
      takeaway: "Notice how sparse non-negative projection suppresses off-diagonal cross-talk in this toy model.",
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

          <div className="flex space-x-1.5">
            {chapters.map((ch) => (
              <button
                key={ch.step}
                onClick={() => setCurrentStep(ch.step)}
                className={`w-6 h-6 text-xs font-mono font-bold flex items-center justify-center transition-all ${
                  ch.step === currentStep
                    ? "bg-[#111318] text-white"
                    : "bg-[#FFFFFF] border border-[#D9DCE1] text-[#626873] hover:bg-[#F0F1ED]"
                }`}
                aria-label={`Go to step ${ch.step}`}
              >
                {ch.step}
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
