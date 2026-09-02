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
import { ArrowRight, Play } from "lucide-react";

export default function HomePage() {
  const [activeMode, setActiveMode] = useState<ActiveMode>("lab");

  // Core Simulation Parameters
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

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#111318] flex flex-col selection:bg-[#0284C7]/20">
      <Header activeMode={activeMode} setActiveMode={setActiveMode} isLive={true} />

      {/* Main Research Instrument Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ============================================================ */}
        {/* MODE 1: LAB (The Long-Form Interactive Research Article) */}
        {/* ============================================================ */}
        {activeMode === "lab" && (
          <div className="space-y-12">
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
                A fixed-size recurrent state stores key-value associations. Change the geometry. Change the load. Watch retrieval change.
              </p>

              {/* Action Row & Live Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleSelectProtocol("protocol_01_baseline")}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#111318] hover:bg-black text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>RUN THE EXPERIMENT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleSelectProtocol("protocol_02_interference")}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#F0F1ED] text-[#111318] border border-[#D9DCE1] text-xs font-semibold transition-colors shadow-sm"
                  >
                    <span>INJECT OVERLAP (ρ = 0.45)</span>
                  </button>
                </div>

                {/* Compact Live Metadata */}
                <div className="flex items-center space-x-3 text-xs font-mono text-[#626873] bg-[#FFFFFF] px-3.5 py-2 border border-[#D9DCE1] shadow-sm">
                  <span>d = {d}</span>
                  <span>•</span>
                  <span>N = {N}</span>
                  <span>•</span>
                  <span>ρ = {correlation.toFixed(2)}</span>
                  <span>•</span>
                  <span>λ = {decay.toFixed(2)}</span>
                </div>
              </div>

              {/* Editorial Pull Quote */}
              <div className="pt-4">
                <blockquote className="text-sm sm:text-base italic text-[#111318] border-l-2 border-[#111318] pl-4 py-1 leading-relaxed">
                  &ldquo;In a linear fast-weight memory, retrieving one association also receives contributions from other stored associations.&rdquo;
                </blockquote>
                <span className="text-[11px] font-mono text-[#8A909A] block mt-1 pl-4 uppercase">
                  Central Scientific Falsifiable Claim • Exact Recurrence Decomposition
                </span>
              </div>
            </section>
            {/* Laboratory Control Bar */}
            <div>
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
            </div>

            {/* Section 01: The Memory Matrix Hero Centerpiece */}
            <MemoryMatrixHeatmap
              matrix={engine.stateMatrix}
              d={d}
              t={N}
              decay={decay}
              isBDH={useBDH}
            />

            {/* Section 02 & 03: Ask the Memory + Where the Error Comes From */}
            <DualReadout
              retrieval={retrieval}
              dim={d}
              availableKeys={pairs.length}
              selectedQueryIdx={selectedQueryIdx}
              onSelectQueryIdx={setSelectedQueryIdx}
            />

            {/* Section 04: Key Overlap & Gram Matrix */}
            <GramMatrixHeatmap
              gramMatrix={gramMatrix}
              pairLabels={pairs.map((p) => p.label)}
              stats={stats}
              correlationParam={correlation}
              pairs={pairs}
            />

            {/* Section 05: Stress Test Console */}
            <StressTestExplorer />

            {/* Section 06: BDH Frontier Connection */}
            <BDHComparisonExplorer />

            {/* Section 07: Research Notes */}
            <ResearchNotebook />
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 2: GUIDED DISCOVERY */}
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
      </footer>
    </div>
  );
}
