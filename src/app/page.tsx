"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/ui/Header";
import { MemoryMatrixHeatmap } from "@/components/visualization/MemoryMatrixHeatmap";
import { GramMatrixHeatmap } from "@/components/visualization/GramMatrixHeatmap";
import { KeyGeometryPlot } from "@/components/visualization/KeyGeometryPlot";
import { DualReadout } from "@/components/experiment/DualReadout";
import { ControlPanel } from "@/components/experiment/ControlPanel";
import { InteractiveEquation } from "@/components/equations/InteractiveEquation";
import { GuidedChapterFlow } from "@/components/education/GuidedChapterFlow";
import { StressTestExplorer } from "@/components/experiment/StressTestExplorer";
import { BDHComparisonExplorer } from "@/components/bdh/BDHComparisonExplorer";
import { ResearchNotebook } from "@/components/education/ResearchNotebook";
import { PROTOCOL_PRESETS } from "@/lib/presets";
import { generateSyntheticPairs, LiveAssociativeEngine } from "@/lib/math-engine";
import { ActiveMode } from "@/lib/types";
import { Play, RotateCcw } from "lucide-react";

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

  React.useEffect(() => {
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
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col font-mono selection:bg-cyan-500/30">
      <Header activeMode={activeMode} setActiveMode={setActiveMode} isLive={true} />

      {/* Main Research Instrument Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Editorial Hero Header (First Viewport) */}
        <section className="border-b border-white/[0.08] pb-6 space-y-3">
          <div className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
            DATAFORGE × PATHWAY 2026 • RESEARCH EXPERIMENT
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase">
            ASSOCIATIVE MEMORY UNDER INTERFERENCE
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              How much information can a fixed-size recurrent state preserve before stored associations begin to interfere?
            </p>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => handleSelectProtocol("protocol_01_baseline")}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>RUN BASELINE (ρ = 0.0)</span>
              </button>
              <button
                onClick={() => handleSelectProtocol("protocol_02_interference")}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-colors"
              >
                <span>INJECT OVERLAP (ρ = 0.45)</span>
              </button>
            </div>
          </div>

          {/* Central Claim Box */}
          <div className="p-3 bg-black/40 border-l-2 border-cyan-400 text-xs text-slate-300 flex items-start space-x-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex-shrink-0 text-[11px]">
              Central Claim:
            </span>
            <span className="text-[11px] leading-relaxed">
              &ldquo;In a linear fast-weight associative memory, retrieving one stored value also receives contributions from other stored key-value pairs; increasing key similarity or memory load therefore increases interference under the stated retrieval setup.&rdquo;
            </span>
          </div>
        </section>

        {/* ============================================================ */}
        {/* MODE 1: LAB (The Live Research Instrument) */}
        {/* ============================================================ */}
        {activeMode === "lab" && (
          <div className="space-y-8">
            {/* Probe Selector Strip */}
            <div className="border border-white/[0.08] bg-[#0B0D12] p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 font-bold">
                01. SELECT ACTIVE QUERY PROBE (q = k_j):
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {pairs.map((p, idx) => {
                  const active = selectedQueryIdx === idx;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedQueryIdx(idx)}
                      className={`px-3 py-1 text-xs font-mono transition-all ${
                        active
                          ? "bg-cyan-500 text-slate-950 font-bold"
                          : "bg-black/50 text-slate-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      Probe Item {idx + 1} (k_{idx + 1})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Asymmetric Instrument Grid: Left Parameters | Center Memory Centerpiece */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (4 cols): Control Instrument */}
              <div className="lg:col-span-4 space-y-6">
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

              {/* Right Column (8 cols): Memory Matrix Heatmap (HERO) */}
              <div className="lg:col-span-8 space-y-6">
                <MemoryMatrixHeatmap
                  matrix={engine.stateMatrix}
                  d={d}
                  t={N}
                  decay={decay}
                  isBDH={useBDH}
                />
              </div>
            </div>

            {/* Section 03: Retrieval Readout & Energy Ratio */}
            <div>
              <DualReadout retrieval={retrieval} dim={d} />
            </div>

            {/* Section 04: Key Overlap (Gram Matrix) & 2D Geometry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GramMatrixHeatmap
                gramMatrix={gramMatrix}
                pairLabels={pairs.map((p) => p.label)}
                stats={stats}
                correlationParam={correlation}
              />

              <KeyGeometryPlot
                pairs={pairs}
                correlationParam={correlation}
              />
            </div>

            {/* Section 05: Mathematical Formulations */}
            <div>
              <InteractiveEquation />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 2: GUIDED DISCOVERY TUTORIAL */}
        {/* ============================================================ */}
        {activeMode === "guided" && (
          <div className="space-y-6">
            <GuidedChapterFlow onApplyConfig={handleGuidedConfig} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <DualReadout retrieval={retrieval} dim={d} />
              </div>
              <div className="lg:col-span-5">
                <MemoryMatrixHeatmap
                  matrix={engine.stateMatrix}
                  d={d}
                  t={N}
                  decay={decay}
                  isBDH={useBDH}
                />
              </div>
            </div>

            <InteractiveEquation />
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 3: STRESS TEST MODE */}
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

      {/* Scientific Lab Footer */}
      <footer className="border-t border-white/[0.08] bg-[#08090C] py-4 text-center text-xs text-slate-400 font-mono mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DataForge × Pathway 2026 • Verified Float64 Associative Memory Substrate</span>
          <span className="text-slate-400">Exact Algebraic Decomposition • In-Browser Live Computation</span>
        </div>
      </footer>
    </div>
  );
}
