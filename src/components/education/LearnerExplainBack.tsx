"use client";

import React, { useState } from "react";
import { CheckCircle2, RefreshCw, Send, Sparkles } from "lucide-react";

export const LearnerExplainBack: React.FC = () => {
  const [response, setResponse] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const conceptHints = [
    { label: "Key Overlap (ρ)", hint: "Non-orthogonal keys share non-zero alignment." },
    { label: "Projection (k_iᵀ q)", hint: "The query projects onto non-target stored keys." },
    { label: "Target Contribution", hint: "The desired stored value v_j scaled by k_jᵀ q_j." },
    { label: "Non-Target Contribution", hint: "Unwanted stored values v_i bleeding into readout." },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim().length > 0) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <section className="space-y-6 pt-4 border-t border-[#D9DCE1]">
      <div className="border-b border-[#D9DCE1] pb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
            LEARNING CHECKPOINT
          </span>
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
            EXPLAIN IT BACK
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] mt-1">
          SYNTHESIZE THE MECHANISM IN YOUR OWN WORDS
        </h2>
        <p className="text-sm text-[#626873] mt-1 max-w-3xl leading-relaxed">
          The most effective test of conceptual understanding is articulating the cause-and-effect chain. Formulate your answer before comparing with the reference explanation.
        </p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#D9DCE1] p-6 shadow-sm space-y-6">
        {/* Core Prompt */}
        <div className="space-y-2">
          <label htmlFor="learner-explanation" className="block text-sm sm:text-base font-bold text-[#111318]">
            Prompt: In your own words, why can increasing key overlap increase cross-talk during retrieval?
          </label>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-[#626873]">Helpful concepts to include:</span>
            {conceptHints.map((c, idx) => (
              <span
                key={idx}
                title={c.hint}
                className="px-2 py-0.5 text-[11px] font-mono bg-[#F7F7F4] text-[#111318] border border-[#D9DCE1] cursor-help"
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>

        {/* Input Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              id="learner-explanation"
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="When stored keys are not orthogonal, a query for one key has non-zero projections..."
              className="w-full p-3.5 text-sm font-sans text-[#111318] bg-[#FDFDFD] border border-[#D9DCE1] focus:border-[#111318] focus:ring-1 focus:ring-[#111318] outline-none transition-all placeholder:text-[#8A909A]"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-[#8A909A]">
                {response.trim().split(/\s+/).filter(Boolean).length} words entered
              </span>
              <button
                type="submit"
                disabled={response.trim().length === 0}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#111318] text-white text-xs font-mono font-bold tracking-wider uppercase transition-all hover:bg-[#252830] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Compare with Reference Explanation</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {/* Learner's answer */}
            <div className="p-4 bg-[#F7F7F4] border border-[#D9DCE1] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-[#626873] uppercase">YOUR EXPLANATION:</span>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center space-x-1 text-[#0284C7] hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Edit Response</span>
                </button>
              </div>
              <p className="text-sm text-[#111318] whitespace-pre-wrap leading-relaxed font-sans">
                {response}
              </p>
            </div>

            {/* Model reference explanation */}
            <div className="p-5 bg-[#FFFFFF] border-l-4 border-[#059669] border border-[#D9DCE1] shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#059669]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="uppercase tracking-wider">REFERENCE SCIENTIFIC MECHANISM</span>
              </div>
              <p className="text-sm text-[#111318] leading-relaxed font-sans">
                When stored keys are not orthogonal, a query for key <strong>k_j</strong> produces non-zero dot products (projections) with other stored keys <strong>k_i</strong> (i ≠ j). Because the linear fast-weight state is an un-gated outer-product sum <em>S = Σ v_i k_iᵀ</em>, multiplying the query by the state distributes linearly across all stored associations. Every non-zero projection <em>k_iᵀ q</em> scales and injects that non-target value <strong>v_i</strong> directly into the readout vector, creating measured additive cross-talk interference.
              </p>
              <div className="pt-2 border-t border-[#E2E4E8] text-[11px] font-mono text-[#626873] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                <span>Self-Assessment: Did your explanation link key non-orthogonality to non-zero inner products and linear state distribution?</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
