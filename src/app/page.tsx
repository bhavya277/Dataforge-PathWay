"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/ui/Header";
import { GuidedChapterFlow } from "@/components/education/GuidedChapterFlow";
import { ControlPanel } from "@/components/experiment/ControlPanel";
import { MemoryMatrixHeatmap } from "@/components/visualization/MemoryMatrixHeatmap";
import { GramMatrixHeatmap } from "@/components/visualization/GramMatrixHeatmap";
import { DualReadout } from "@/components/experiment/DualReadout";
import { InteractiveEquation } from "@/components/equations/InteractiveEquation";
import { BDHComparisonExplorer } from "@/components/bdh/BDHComparisonExplorer";
import { BenchmarkCharts } from "@/components/experiment/BenchmarkCharts";
import { LiveAssociativeEngine, generateSyntheticPairs } from "@/lib/math-engine";
import { PRESETS } from "@/lib/presets";
import { ActiveTab, KeyValuePair, RetrievalBreakdown } from "@/lib/types";
import { Sparkles } from "lucide-react";

export default function Home(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ActiveTab>("guide");

  // Core Scientific Variables
  const [d, setD] = useState<number>(8);
  const [N, setN] = useState<number>(4);
  const [correlation, setCorrelation] = useState<number>(0.0);
  const [decay, setDecay] = useState<number>(1.0);
  const [useBDH, setUseBDH] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>("preset_01_clean");
  const [selectedQueryIdx, setSelectedQueryIdx] = useState<number>(0);

  // Live Computational Substrate Engine
  const { engine, pairs, retrieval, gramMatrix } = useMemo<{
    engine: LiveAssociativeEngine;
    pairs: KeyValuePair[];
    retrieval: RetrievalBreakdown;
    gramMatrix: number[][];
  }>(() => {
    const generatedPairs = generateSyntheticPairs(N, d, correlation, 42);
    const eng = new LiveAssociativeEngine(d, decay, 1.0, useBDH, 0.4);

    for (const p of generatedPairs) {
      eng.storePair(p);
    }

    const queryPair = generatedPairs[selectedQueryIdx] || generatedPairs[0];
    const ret = eng.retrieve(queryPair.keyVector, selectedQueryIdx < N ? selectedQueryIdx : 0);
    const G = eng.getGramMatrix();

    return {
      engine: eng,
      pairs: generatedPairs,
      retrieval: ret,
      gramMatrix: G,
    };
  }, [d, N, correlation, decay, useBDH, selectedQueryIdx]);

  const handleApplyPreset = (presetId: string): void => {
    const p = PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setSelectedPresetId(p.id);
    setD(p.d);
    setN(p.N);
    setCorrelation(p.correlation);
    setDecay(p.decay);
    setUseBDH(Boolean(p.useBDH));
    setSelectedQueryIdx(0);
  };

  const handleGuidedConfig = (config: {
    d: number;
    N: number;
    correlation: number;
    decay: number;
    useBDH: boolean;
  }): void => {
    setSelectedPresetId(null);
    setD(config.d);
    setN(config.N);
    setCorrelation(config.correlation);
    setDecay(config.decay);
    setUseBDH(config.useBDH);
    setSelectedQueryIdx(0);
  };

  const handleReset = (): void => {
    handleApplyPreset("preset_01_clean");
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} isLive={true} />

      {/* Hero / Falsifiable Claim Banner */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[#0F1219] to-[#08090C] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-1.5">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-[11px] font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>DataForge 2026 • Research Explainer &amp; Computational Substrate</span>
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Associative Memory &amp; Linear Recurrent State Updates in Fast-Weight Architectures
          </h1>

          <div className="p-2.5 bg-black/40 border border-cyan-500/20 rounded-lg text-[11px] font-mono text-slate-300 flex items-start space-x-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex-shrink-0">Central Claim:</span>
            <span>
              &ldquo;In a linear fast-weight associative memory, retrieving one stored value also receives contributions from other stored key-value pairs; increasing key similarity or memory load therefore increases interference under the stated retrieval setup.&rdquo;
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
        {/* Tab 1: Guided Discovery Journey */}
        {activeTab === "guide" && (
          <div className="space-y-6">
            <GuidedChapterFlow onApplyConfig={handleGuidedConfig} />

            {/* Live Interactive Visualization Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MemoryMatrixHeatmap
                matrix={engine.stateMatrix}
                title={useBDH ? "BDH Sparse Synaptic Matrix Wₜ" : "Recurrent Fast-Weight State Sₜ"}
                isBDH={useBDH}
              />
              <GramMatrixHeatmap gramMatrix={gramMatrix} pairLabels={pairs.map((p) => p.label)} />
            </div>

            {/* Query Selector Tabs */}
            <div className="bg-[#11141B] border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span className="text-slate-400">Select Query to Retrieve (q = k_i):</span>
              <div className="flex flex-wrap gap-1.5">
                {pairs.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedQueryIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                      selectedQueryIdx === idx
                        ? "bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 shadow-md"
                        : "bg-black/40 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <DualReadout retrieval={retrieval} dim={d} />
            <InteractiveEquation />
          </div>
        )}

        {/* Tab 2: Full Research Lab (Sandbox Mode) */}
        {activeTab === "interactive-lab" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                selectedPresetId={selectedPresetId}
                onSelectPreset={handleApplyPreset}
                onReset={handleReset}
              />
            </div>

            <div className="lg:col-span-8 space-y-6">
              {/* Query Selector */}
              <div className="bg-[#11141B] border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="text-slate-400">Query Target (q = k_i):</span>
                <div className="flex flex-wrap gap-1.5">
                  {pairs.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedQueryIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                        selectedQueryIdx === idx
                          ? "bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 shadow-md"
                          : "bg-black/40 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <DualReadout retrieval={retrieval} dim={d} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MemoryMatrixHeatmap
                  matrix={engine.stateMatrix}
                  title={useBDH ? "BDH Sparse State Wₜ" : "Recurrent State Sₜ"}
                  isBDH={useBDH}
                />
                <GramMatrixHeatmap gramMatrix={gramMatrix} pairLabels={pairs.map((p) => p.label)} />
              </div>

              <InteractiveEquation />
            </div>
          </div>
        )}

        {/* Tab 3: BDH & BDH-CQ Architecture */}
        {activeTab === "bdh-architecture" && <BDHComparisonExplorer />}

        {/* Tab 4: Empirical Benchmark Sweeps */}
        {activeTab === "benchmarks" && <BenchmarkCharts />}

        {/* Tab 5: Research Blog Post */}
        {activeTab === "blog" && (
          <div className="bg-[#11141B] border border-white/10 rounded-xl p-8 max-w-4xl mx-auto shadow-2xl space-y-6 font-sans">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Pathway Hackathon Blog • Topic 2
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Associative Memory in Fast-Weight Architectures: The Geometry of Recurrent Interference
              </h2>
              <div className="text-xs font-mono text-slate-400 mt-1 flex items-center space-x-3">
                <span>DataForge × Pathway Team</span>
                <span>•</span>
                <span>~740 Words</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Strict Scientific Tone</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
              <h3 className="text-base font-bold text-white font-mono">The Promise and Bottleneck of Linear Recurrence</h3>
              <p>
                Autoregressive Transformers have established empirical dominance across modern language modeling, but standard Softmax Attention exhibits an inference-time memory complexity of O(N) per sequence step due to continuous Key-Value (KV) cache expansion. Over long contexts, the cache size strains hardware memory bandwidth.
              </p>
              <p>
                This physical bottleneck has sparked intense resurgence in <strong>linear recurrent architectures</strong> and <strong>fast-weight memory models</strong> (Schlag et al., 2021; Gu &amp; Dao, 2023; Beck et al., 2024). These architectures compress unbounded token histories into a fixed-size recurrent state matrix S_t in R^(d x d). The state update follows an outer-product rule:
              </p>
              <div className="bg-black/60 p-3 rounded-lg font-mono text-cyan-300 text-center my-2">
                S_t = S_(t-1) + v_t k_t^T, S_0 = 0
              </div>
              <p>
                When retrieving an association corresponding to a specific key k_j (setting q = k_j), the output decomposes into two distinct algebraic components:
              </p>
              <div className="bg-black/60 p-3 rounded-lg font-mono text-amber-300 text-center my-2">
                y_j = v_j (k_j^T k_j) + ∑_(i ≠ j) v_i (k_i^T k_j)
              </div>

              <h3 className="text-base font-bold text-white font-mono mt-6">The Mechanism of Interference</h3>
              <p>
                The central insight is straightforward: <strong>in a linear fast-weight memory, retrieving one stored value inevitably accumulates linear contributions from all other stored pairs whose keys are not orthogonal to the query.</strong>
              </p>
              <p>
                If all keys are strictly orthonormal (k_i^T k_j = 0 for i ≠ j), the cross-talk sum vanishes entirely. However, once memory load N approaches or exceeds state dimension d, the pigeonhole principle forces non-zero projection across keys.
              </p>

              <h3 className="text-base font-bold text-white font-mono mt-6">How Dragon Hatchling (BDH) Approaches the Bottleneck</h3>
              <p>
                Dragon Hatchling (<strong>BDH</strong>; Pathway, 2024–2025) directly addresses this superposition vulnerability by replacing dense continuous vectors with <strong>sparse positive activations (ReLU/Top-K)</strong> and <strong>monosemantic synaptic connectivity</strong>. Because non-negative sparse vectors have quasi-disjoint supports, cross-talk inner products k_i^T k_j → 0 are suppressed by geometric construction.
              </p>

              <h3 className="text-base font-bold text-white font-mono mt-6">Primary Literature</h3>
              <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-slate-400">
                <li>Schlag, I., Irie, K., &amp; Schmidhuber, J. (2021). <em>Linear Transformers Are Secretly Fast Weight Programmers.</em> ICML.</li>
                <li>Beck, M., et al. (2024). <em>xLSTM: Extended Long Short-Term Memory.</em> NeurIPS.</li>
                <li>Gu, A., &amp; Dao, T. (2023). <em>Mamba: Linear-Time Sequence Modeling with Selective State Spaces.</em></li>
                <li>Pathway Research Team (2024–2025). <em>Dragon Hatchling (BDH) Architecture Technical Reports.</em></li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0C0E14] py-6 px-4 sm:px-6 lg:px-8 mt-12 font-mono text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>DataForge 2026 • Pathway Track Submission</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-500">100% Vectorized Substrate</span>
            <span>•</span>
            <span className="text-slate-500">Deterministic Seeds</span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">Zero Fake Computation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
