"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/ui/Header";
import { MemoryMatrixHeatmap } from "@/components/visualization/MemoryMatrixHeatmap";
import { GramMatrixHeatmap } from "@/components/visualization/GramMatrixHeatmap";
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
import { Sparkles, Terminal } from "lucide-react";

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
    <div className="min-h-screen bg-[#090A0D] text-slate-100 flex flex-col font-mono selection:bg-cyan-500/30">
      <Header activeMode={activeMode} setActiveMode={setActiveMode} isLive={true} />

      {/* Main Research Instrument Canvas */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Compact Hero Banner (Immediate Science Presentation) */}
        <div className="bg-[#101217] border border-white/[0.08] rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-400 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Associative Memory Under Interference • Research Substrate</span>
            </div>
            <div className="text-[10px] text-slate-400">
              State: <strong className="text-white">S ∈ ℝ^({d}×{d})</strong> • Associations: <strong className="text-white">N = {N}</strong>
            </div>
          </div>

          <div className="p-2.5 bg-black/40 border border-cyan-500/20 rounded text-xs text-slate-300 flex items-start space-x-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex-shrink-0 text-[11px]">
              Central Claim:
            </span>
            <span className="text-[11px] leading-relaxed">
              &ldquo;In a linear fast-weight associative memory, retrieving one stored value also receives contributions from other stored key-value pairs; increasing key similarity or memory load therefore increases interference under the stated retrieval setup.&rdquo;
            </span>
          </div>
        </div>

        {/* MODE 1: LAB (Scientific Instrument Layout) */}
        {activeMode === "lab" && (
          <div className="space-y-4">
            {/* Query Selector Bar */}
            <div className="bg-[#101217] border border-white/[0.08] rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-300 font-bold">Select Active Query Probe:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {pairs.map((p, idx) => {
                  const active = selectedQueryIdx === idx;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedQueryIdx(idx)}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                        active
                          ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                          : "bg-black/40 text-slate-300 hover:bg-white/10 border border-white/5"
                      }`}
                    >
                      Probe Item {idx + 1} (k_{idx + 1})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instrument Grid: Left Controls | Center Heatmaps | Right Readout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (4 cols): Control Panel */}
              <div className="lg:col-span-4 space-y-4">
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

              {/* Middle/Right Column (8 cols): Visualizers */}
              <div className="lg:col-span-8 space-y-4">
                {/* Dual Readout Component */}
                <DualReadout retrieval={retrieval} dim={d} />

                {/* Heatmap Matrices (Side-by-Side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MemoryMatrixHeatmap
                    matrix={engine.stateMatrix}
                    d={d}
                    t={N}
                    decay={decay}
                    isBDH={useBDH}
                  />

                  <GramMatrixHeatmap
                    gramMatrix={gramMatrix}
                    pairLabels={pairs.map((p) => p.label)}
                    stats={stats}
                    correlationParam={correlation}
                  />
                </div>
              </div>
            </div>

            {/* Bottom: Mathematical Formulations Inspector */}
            <InteractiveEquation />
          </div>
        )}

        {/* MODE 2: GUIDED DISCOVERY TUTORIAL */}
        {activeMode === "guided" && (
          <div className="space-y-4">
            <GuidedChapterFlow onApplyConfig={handleGuidedConfig} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
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

        {/* MODE 3: STRESS TEST & CAPACITY SWEEP */}
        {activeMode === "stress-test" && <StressTestExplorer />}

        {/* MODE 4: BDH ABSTRACTION EXPLORER */}
        {activeMode === "bdh-abstraction" && <BDHComparisonExplorer />}

        {/* MODE 5: RESEARCH NOTEBOOK */}
        {activeMode === "research-notebook" && <ResearchNotebook />}
      </main>

      {/* Scientific Lab Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090A0D] py-3 text-center text-[10px] text-slate-400">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DataForge × Pathway 2026 • Verified Float64 Associative Memory Substrate</span>
          <span className="text-slate-400">Exact Algebraic Decomposition • In-Browser Live Computation</span>
        </div>
      </footer>
    </div>
  );
}
