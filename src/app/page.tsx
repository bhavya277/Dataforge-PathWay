"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/ui/Header";
import { MemoryMatrixHeatmap } from "@/components/visualization/MemoryMatrixHeatmap";
import { GramMatrixHeatmap } from "@/components/visualization/GramMatrixHeatmap";
import { DualReadout } from "@/components/experiment/DualReadout";
import { ControlPanel } from "@/components/experiment/ControlPanel";
import { GuidedChapterFlow } from "@/components/education/GuidedChapterFlow";
import { StressTestExplorer } from "@/components/experiment/StressTestExplorer";
import { BDHComparisonExplorer } from "@/components/bdh/BDHComparisonExplorer";
import { ResearchNotebook } from "@/components/education/ResearchNotebook";
import { PROTOCOL_PRESETS } from "@/lib/presets";
import { generateSyntheticPairs, LiveAssociativeEngine } from "@/lib/math-engine";
import { ActiveMode } from "@/lib/types";
import { ArrowRight, CheckCircle2, Sliders, Sparkles } from "lucide-react";

export default function HomePage() {
  const [activeMode, setActiveMode] = useState<ActiveMode>("lab");

  // Core Simulation Parameters (Opens with preset already running)
  const [d, setD] = useState<number>(8);
  const [N, setN] = useState<number>(4);
  const [correlation, setCorrelation] = useState<number>(0.0);
  const [decay, setDecay] = useState<number>(1.0);
  const [useBDH, setUseBDH] = useState<boolean>(false);
  const [selectedQueryIdx, setSelectedQueryIdx] = useState<number>(0);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>("protocol_01_baseline");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate synthetic keys & values using statistically valid isotropic modeling
  const { pairs, stats } = useMemo(() => {
    return generateSyntheticPairs(N, d, correlation, 100 + N * 7 + d * 3);
  }, [N, d, correlation]);

  // Execute live associative memory recurrence
  const engine = useMemo(() => {
    const eng = new LiveAssociativeEngine(d, decay, 1.0, useBDH);
    pairs.forEach((p) => eng.storePair(p));
    return eng;
  }, [d, decay, useBDH, pairs]);

  // Execute query retrieval on active selected key
  const retrieval = useMemo(() => {
    const validIdx = Math.min(selectedQueryIdx, Math.max(0, pairs.length - 1));
    const targetPair = pairs[validIdx];
    const qVec = targetPair ? targetPair.keyVector : new Array(d).fill(0);
    return engine.retrieve(qVec, validIdx);
  }, [engine, pairs, selectedQueryIdx, d]);

  const gramMatrix = useMemo(() => {
    return engine.getGramMatrix();
  }, [engine]);

  // Protocol preset application
  const handleSelectProtocol = (id: string) => {
    const preset = PROTOCOL_PRESETS.find((p) => p.id === id);
    if (preset) {
      setSelectedProtocolId(preset.id);
      setD(preset.d);
      setN(preset.N);
      setCorrelation(preset.correlation);
      setDecay(preset.decay);
      setUseBDH(preset.useBDH);
      setSelectedQueryIdx(0);
    }
  };

  const handleGuidedConfig = (config: {
    d: number;
    N: number;
    correlation: number;
    decay: number;
    useBDH: boolean;
  }) => {
    setD(config.d);
    setN(config.N);
    setCorrelation(config.correlation);
    setDecay(config.decay);
    setUseBDH(config.useBDH);
    setSelectedQueryIdx(0);
    setSelectedProtocolId(null);
  };

  const handleReset = () => {
    handleSelectProtocol("protocol_01_baseline");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center font-mono text-sm text-[#626873]">
        Initializing Live Research Instrument...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#111318] flex flex-col selection:bg-[#0284C7]/20">
      <Header activeMode={activeMode} setActiveMode={setActiveMode} isLive={true} />

      {/* Main Research Instrument Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ============================================================ */}
        {/* MODE 1: LAB (The Unified 7-Step Educational Learning Journey) */}
        {/* ============================================================ */}
        {activeMode === "lab" && (
          <div className="space-y-16">
            {/* Editorial Hero Section */}
            <section className="space-y-6 pt-4 border-b border-[#D9DCE1] pb-10">
              <div className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
                DATAFORGE × PATHWAY 2026 • FRONTIER RESEARCH SUBSTRATE
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#111318] leading-[1.05] font-editorial">
                ASSOCIATIVE MEMORY
                <br />
                UNDER INTERFERENCE
              </h1>

              <p className="text-base sm:text-xl text-[#626873] max-w-3xl leading-relaxed font-normal">
                How much information can a fixed-size recurrent state preserve before stored associations interfere?
              </p>

              {/* Locked Central Educational Claim */}
              <div className="pt-2">
                <blockquote className="text-sm sm:text-base italic text-[#111318] border-l-2 border-[#111318] pl-4 py-1.5 leading-relaxed bg-[#FFFFFF]/60">
                  &ldquo;When stored keys are not orthogonal, a linear fast-weight state adds non-target contributions to retrieval; in our synthetic setup, increasing controlled key overlap increases measured cross-talk.&rdquo;
                </blockquote>
                <span className="text-[11px] font-mono text-[#8A909A] block mt-1.5 pl-4 uppercase font-semibold">
                  Locked Central Educational Claim • Exact Recurrence Decomposition
                </span>
              </div>

              {/* Target Audience & Prerequisites */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs text-[#626873] font-mono">
                <div className="bg-[#FFFFFF] p-3 border border-[#D9DCE1] shadow-sm">
                  <span className="font-bold text-[#111318] block mb-1">TARGET AUDIENCE</span>
                  <span>Designed for ML students &amp; practitioners familiar with vectors, matrices, dot products, and basic neural network concepts.</span>
                </div>
                <div className="bg-[#FFFFFF] p-3 border border-[#D9DCE1] shadow-sm">
                  <span className="font-bold text-[#111318] block mb-1">PREREQUISITES</span>
                  <span>Vectors &amp; Matrices • Dot Products • Outer Products (v kᵀ) • Recurrent Matrix Updates</span>
                </div>
              </div>

              {/* Live Baseline Status (Opens with preset already running) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#E2E4E8]">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#0284C7]">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
                  <span>BASELINE PRESET RUNNING LIVE</span>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono text-[#626873] bg-[#FFFFFF] px-4 py-2 border border-[#D9DCE1] shadow-sm">
                  <span>d = {d}</span>
                  <span>N = {N}</span>
                  <span>ρ = {correlation.toFixed(2)}</span>
                  <span>λ = {decay.toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* STEP 01: SEE THE MEMORY */}
            {/* ============================================================ */}
            <section className="space-y-6">
              <MemoryMatrixHeatmap
                matrix={engine.stateMatrix}
                d={d}
                t={N}
                decay={decay}
                isBDH={useBDH}
              />
            </section>

            {/* ============================================================ */}
            {/* STEP 02: ASK THE MEMORY */}
            {/* ============================================================ */}
            <section className="space-y-6">
              <DualReadout
                retrieval={retrieval}
                dim={d}
                availableKeys={pairs.length}
                selectedQueryIdx={selectedQueryIdx}
                onSelectQueryIdx={setSelectedQueryIdx}
              />
            </section>

            {/* ============================================================ */}
            {/* STEP 03: CHANGE ONE THING (KEY OVERLAP ρ) */}
            {/* ============================================================ */}
            <section className="space-y-6 pt-4 border-t border-[#D9DCE1]">
              <div className="border-b border-[#D9DCE1] pb-4">
                <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
                  03 / CHANGE ONE THING
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] mt-1">
                  INCREASE CONTROLLED KEY OVERLAP (ρ)
                </h2>
                <p className="text-sm text-[#626873] mt-1 max-w-2xl">
                  Slide ρ from 0.00 to 0.45 or 0.60. Watch how non-orthogonal key alignment immediately introduces non-target contributions into the retrieved vector.
                </p>
              </div>

              {/* Prominent Single Interactive Slider */}
              <div className="bg-[#FFFFFF] border-2 border-[#111318] p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E4E8] pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#626873] uppercase tracking-wider block">
                      PRIMARY EXPERIMENTAL VARIABLE
                    </span>
                    <span className="text-base font-bold text-[#111318]">
                      Controlled Key Correlation (ρ)
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-[#D97706]">
                    ρ = {correlation.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <input
                    type="range"
                    min="0.0"
                    max="0.80"
                    step="0.05"
                    value={correlation}
                    onChange={(e) => {
                      setCorrelation(parseFloat(e.target.value));
                      setSelectedProtocolId(null);
                    }}
                    className="w-full h-3 bg-[#F0F1ED] rounded-none appearance-none cursor-pointer accent-[#111318]"
                    aria-label="Controlled key correlation rho"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#626873]">
                    <span>ρ = 0.00 (Orthogonal • No Overlap)</span>
                    <span>ρ = 0.40 (Moderate Overlap)</span>
                    <span>ρ = 0.80 (Strong Overlap)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => {
                      setCorrelation(0.0);
                      setSelectedProtocolId(null);
                    }}
                    className={`px-3 py-1 text-xs font-mono font-semibold transition-all ${
                      correlation === 0.0
                        ? "bg-[#111318] text-white"
                        : "bg-[#F0F1ED] hover:bg-[#EAEBE5] text-[#111318]"
                    }`}
                  >
                    Set ρ = 0.00 (Clean)
                  </button>
                  <button
                    onClick={() => {
                      setCorrelation(0.45);
                      setSelectedProtocolId(null);
                    }}
                    className={`px-3 py-1 text-xs font-mono font-semibold transition-all ${
                      correlation === 0.45
                        ? "bg-[#111318] text-white"
                        : "bg-[#F0F1ED] hover:bg-[#EAEBE5] text-[#111318]"
                    }`}
                  >
                    Inject ρ = 0.45 (Interference)
                  </button>
                  <button
                    onClick={() => {
                      setCorrelation(0.70);
                      setSelectedProtocolId(null);
                    }}
                    className={`px-3 py-1 text-xs font-mono font-semibold transition-all ${
                      correlation === 0.70
                        ? "bg-[#111318] text-white"
                        : "bg-[#F0F1ED] hover:bg-[#EAEBE5] text-[#111318]"
                    }`}
                  >
                    Stress ρ = 0.70 (Heavy Overlap)
                  </button>
                </div>
              </div>

              {/* Gram Matrix & Observed Pairwise Cosines */}
              <GramMatrixHeatmap
                gramMatrix={gramMatrix}
                pairLabels={pairs.map((p) => p.label)}
                stats={stats}
                correlationParam={correlation}
                pairs={pairs}
              />
            </section>

            {/* ============================================================ */}
            {/* STEP 05: PUSH MEMORY LOAD (N/d) */}
            {/* ============================================================ */}
            <section className="space-y-6 pt-4 border-t border-[#D9DCE1]">
              <div className="border-b border-[#D9DCE1] pb-4">
                <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
                  05 / PUSH MEMORY LOAD
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] mt-1">
                  EMPIRICAL LOAD STRESS TEST (N / d)
                </h2>
                <p className="text-sm text-[#626873] mt-1 max-w-2xl">
                  Explore how retrieval behaves in high-load regimes under the specified synthetic distribution.
                </p>
              </div>

              <StressTestExplorer />
            </section>

            {/* ============================================================ */}
            {/* STEP 06: CONNECT TO BDH */}
            {/* ============================================================ */}
            <section className="space-y-6 pt-4 border-t border-[#D9DCE1]">
              <div className="p-4 bg-[#FFFFFF] border-l-4 border-[#0284C7] shadow-sm text-xs sm:text-sm text-[#111318] leading-relaxed">
                <strong>From Linear Fast Weights to Synaptic Plasticity:</strong> Fast-weight associative memory stores relationships in a recurrent state. BDH explores a broader brain-inspired view in which memory and computation are tied to sparse positive synaptic activity.
              </div>

              <BDHComparisonExplorer />
            </section>

            {/* ============================================================ */}
            {/* STEP 07: EXPLORE YOURSELF (SANDBOX) */}
            {/* ============================================================ */}
            <section className="space-y-6 pt-4 border-t border-[#D9DCE1]">
              <div className="border-b border-[#D9DCE1] pb-4">
                <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
                  07 / EXPLORE YOURSELF
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] mt-1">
                  INTERACTIVE EXPERIMENT SANDBOX
                </h2>
                <p className="text-sm text-[#626873] mt-1 max-w-2xl">
                  Now freely adjust all state dimensions, stored associations, key correlations, and retention decay.
                </p>
              </div>

              <ControlPanel
                d={d}
                setD={setD}
                N={N}
                setN={setN}
                correlation={correlation}
                setCorrelation={setCorrelation}
                decay={decay}
                setDecay={setDecay}
                useBDH={useBDH}
                setUseBDH={setUseBDH}
                selectedProtocolId={selectedProtocolId}
                onSelectProtocol={handleSelectProtocol}
                onReset={handleReset}
              />
            </section>

            {/* ============================================================ */}
            {/* LEARNING OBJECTIVES & TAKEAWAYS */}
            {/* ============================================================ */}
            <section className="bg-[#FFFFFF] border border-[#D9DCE1] p-6 shadow-sm space-y-4">
              <span className="text-xs font-mono font-bold text-[#111318] uppercase tracking-wider block border-b border-[#E2E4E8] pb-2">
                AFTER THIS EXPERIMENT, YOU CAN:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#626873]">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
                  <span>Explain how a linear fast-weight state stores key-value associations via outer products.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
                  <span>Explain why overlapping keys create cross-talk contamination during matrix readout.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
                  <span>Predict what happens to target signal vs cross-talk when key overlap increases.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
                  <span>Distinguish ground truth signal from non-target linear superpositions algebraically.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
                  <span>Explain the conceptual connection to BDH&apos;s sparse synaptic plasticity framing.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
                  <span>Identify the limitations of finite-dimensional synthetic toy benchmarks.</span>
                </div>
              </div>
            </section>

            {/* Research Notes & Primary Sources */}
            <ResearchNotebook />
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 2: GUIDED DISCOVERY CURRICULUM */}
        {/* ============================================================ */}
        {activeMode === "guided" && (
          <div className="space-y-12">
            <GuidedChapterFlow onApplyConfig={handleGuidedConfig} />

            {/* Live Observation Substrate */}
            <div className="border-t border-[#D9DCE1] pt-8 space-y-8">
              <div className="border-b border-[#D9DCE1] pb-3">
                <span className="text-xs font-mono font-bold tracking-widest text-[#626873] uppercase">
                  LIVE OBSERVATION SUBSTRATE
                </span>
                <h3 className="text-xl font-bold text-[#111318] mt-1">
                  Active Memory State &amp; Retrieval Decomposition
                </h3>
              </div>

              {/* Memory Matrix */}
              <MemoryMatrixHeatmap
                matrix={engine.stateMatrix}
                d={d}
                t={N}
                decay={decay}
                isBDH={useBDH}
                showSectionHeader={false}
              />

              {/* Retrieval Breakdown */}
              <DualReadout
                retrieval={retrieval}
                dim={d}
                availableKeys={pairs.length}
                selectedQueryIdx={selectedQueryIdx}
                onSelectQueryIdx={setSelectedQueryIdx}
              />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 3: STRESS TEST EXPLORER */}
        {/* ============================================================ */}
        {activeMode === "stress-test" && <StressTestExplorer />}

        {/* ============================================================ */}
        {/* MODE 4: BDH CONNECTION */}
        {/* ============================================================ */}
        {activeMode === "bdh-abstraction" && <BDHComparisonExplorer />}

        {/* ============================================================ */}
        {/* MODE 5: RESEARCH NOTEBOOK */}
        {/* ============================================================ */}
        {activeMode === "research-notebook" && <ResearchNotebook />}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#D9DCE1] bg-[#FFFFFF] py-6 text-xs text-[#626873] font-mono mt-16">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DataForge × Pathway 2026 • Verified Float64 Associative Memory Substrate</span>
          <span>Exact Algebraic Decomposition • In-Browser Live Computation</span>
        </div>
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
          <span>Designed and Developed by Bhavya Modi</span>
        </div>
      </footer>
    </div>
  );
}
