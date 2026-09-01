"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, BookOpen, Cpu } from "lucide-react";

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
  const [currentChapter, setCurrentChapter] = useState<number>(1);

  const chapters = [
    {
      step: 1,
      title: "Chapter 01: The Act of Storing (Outer Products)",
      subtitle: "How does a recurrent matrix remember facts without a KV-cache?",
      description:
        "Standard Transformers store every key-value vector in an ever-growing memory list (KV cache). In contrast, linear recurrent fast-weight models compress incoming key-value pairs (k_t, v_t) into a fixed-size matrix S_t through cumulative outer products:",
      math: "S_t = S_{t-1} + v_t k_t^T, \\quad S_0 = 0",
      actionText: "Load Clean Memory Baseline (d=8, N=4, ρ=0.0)",
      config: { d: 8, N: 4, correlation: 0.0, decay: 1.0, useBDH: false },
      takeaway:
        "Each incoming association writes a rank-1 footprint ΔS = v k^T into the shared matrix. Notice how the cells in S_t light up.",
    },
    {
      step: 2,
      title: "Chapter 02: Associative Retrieval (Exact Readout)",
      subtitle: "Reading back a stored value using query vector q",
      description:
        "To recall the value associated with key j, we multiply the state matrix S by query vector q = k_j. By the distributive property of linear algebra, this matrix-vector product expands to:",
      math: "y_j = S q_j = v_j (k_j^T q_j) + \\sum_{i \\ne j} v_i (k_i^T q_j)",
      actionText: "Verify Exact Recall with Orthogonal Keys",
      config: { d: 8, N: 4, correlation: 0.0, decay: 1.0, useBDH: false },
      takeaway:
        "When keys are mutually orthogonal (k_i^T k_j = 0), the second term vanishes completely! Output y_j matches ground truth v_j with Cosine Similarity = 1.0000.",
    },
    {
      step: 3,
      title: "Chapter 03: The 60-Second Insight: Key Interference & Cross-Talk",
      subtitle: "What happens when keys are not orthogonal?",
      description:
        "In natural language and continuous embeddings, keys are rarely perfectly orthogonal. When keys share directional alignment (ρ > 0), querying Key A activates fractional components of Key B, C, and D:",
      math: "\\text{Cross-Talk Term} = \\sum_{i \\ne j} v_i (k_i^T k_j) \\ne 0",
      actionText: "Inject Key Correlation (ρ = 0.50)",
      config: { d: 8, N: 4, correlation: 0.5, decay: 1.0, useBDH: false },
      takeaway:
        "Look at the Gram Matrix G and the Dual Readout below: off-diagonal elements ignite in amber, and the retrieved vector is contaminated by cross-talk noise!",
    },
    {
      step: 4,
      title: "Chapter 04: The Capacity Stress Test (N > d)",
      subtitle: "What happens when memory load exceeds matrix rank?",
      description:
        "The mathematical rank of an 8×8 matrix cannot exceed 8. Storing 12 associations in an 8-dimensional state matrix forces key overlap by the pigeonhole principle. Cross-talk terms compound rapidly:",
      math: "\\text{Rank}(S) \\le \\min(d, N)",
      actionText: "Stress Test Memory (N=12, d=8, ρ=0.35)",
      config: { d: 8, N: 12, correlation: 0.35, decay: 1.0, useBDH: false },
      takeaway:
        "Retrieval quality degrades significantly as N grows relative to d. This is the fundamental capacity limit of un-gated linear fast weights.",
    },
    {
      step: 5,
      title: "Chapter 05: How BDH Approaches the Memory Bottleneck",
      subtitle: "Sparse Positive Rectification & Monosemantic Synapses (Teaching Simplification)",
      description:
        "Dragon Hatchling (BDH) does NOT use dense continuous superposition. Instead, BDH explores non-negative sparse positive activations (ReLU/Top-K). In high dimensions, non-negative sparse vectors have quasi-disjoint supports, driving cross-talk inner products toward zero. (Note: This is a simplified single-layer model inspired by mechanisms discussed in BDH; it is not an implementation of the complete multi-layer BDH architecture).",
      math: "W_t = \\text{TopK}(\\lambda W_{t-1} + \\eta \\cdot \\text{ReLU}(v_t) \\text{ReLU}(k_t)^T)",
      actionText: "Activate Sparse Positive Plasticity (BDH-Inspired Teaching Simplification)",
      config: { d: 8, N: 12, correlation: 0.35, decay: 1.0, useBDH: true },
      takeaway:
        "Observe how sparse positive rectification sharpens the matrix and suppresses off-diagonal cross-talk in this toy model without requiring an expanding KV cache.",
    },
  ];

  const current = chapters[currentChapter - 1];

  const handleSelectChapter = (step: number) => {
    setCurrentChapter(step);
    onApplyConfig(chapters[step - 1].config);
  };

  return (
    <div className="bg-[#11141B] border border-white/10 rounded-xl p-6 shadow-2xl mb-6">
      {/* Chapter Step Indicators */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Guided Discovery Journey (5 Chapters)
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {chapters.map((ch) => (
            <button
              key={ch.step}
              onClick={() => handleSelectChapter(ch.step)}
              className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center ${
                currentChapter === ch.step
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/50"
                  : currentChapter > ch.step
                  ? "bg-white/10 text-cyan-300 hover:bg-white/15"
                  : "bg-white/5 text-slate-500 hover:bg-white/10"
              }`}
            >
              {ch.step}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Content */}
      <div className="space-y-4">
        <div>
          <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wide">
            STEP {current.step} OF 5
          </span>
          <h2 className="text-lg font-bold text-white mt-0.5">{current.title}</h2>
          <p className="text-xs font-mono text-slate-400">{current.subtitle}</p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-sans">{current.description}</p>

        {/* Central Mathematical Formula */}
        <div className="bg-black/60 border border-white/10 rounded-lg p-3 font-mono text-sm text-cyan-300 flex items-center justify-center text-center">
          {current.math}
        </div>

        {/* Interactive Action Button & Scientific Takeaway */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => onApplyConfig(current.config)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{current.actionText}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentChapter === 1}
              onClick={() => handleSelectChapter(currentChapter - 1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentChapter === chapters.length}
              onClick={() => handleSelectChapter(currentChapter + 1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-[#161B24] border border-cyan-500/20 rounded-lg p-3 text-xs text-slate-300 flex items-start space-x-2 mt-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-300 font-mono">Pedagogical Insight: </strong>
            {current.takeaway}
          </div>
        </div>
      </div>
    </div>
  );
};
