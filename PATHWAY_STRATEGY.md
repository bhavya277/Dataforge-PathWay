# DataForge × Pathway 2026: Master Competition Strategy & Requirement Extraction

## 1. Executive Summary & Philosophy
We are building a world-class, research-grounded, highly interactive computational learning artifact for the **DataForge 2026 Pathway Track ("Explain the Frontier")**. 

Our primary operational directive is:
> **"Optimize for how impressive, understandable, technically correct, and defensible our ONE central experience is."**

---

## 2. Requirement Extraction & Scoring Breakdown (Total: 100 Points)

| Category | Points | Core Criteria Evaluated by Judges | Penalty / Disqualification Risks |
|---|---|---|---|
| **Technical Correctness & Depth** | 25 | Mathematical fidelity, exact equations, correct code/measurements, accurate visual mappings, explicit boundary limits. | Major penalty for mathematically false claims, incorrect equations, or pseudoscience. |
| **Technical Ownership & Live Defense** | 15 | Deep understanding of all code/abstractions; ability to predict behavior under interventions; distinct boundary between real computation vs precomputation. | Inability to explain code, unexplainable forks, black-box AI code. |
| **Learning Effectiveness** | 15 | Clear 1-sentence falsifiable claim, explicit target audience/prerequisites, guided pedagogical narrative, 60-second "OH!" moment. | Generic overviews, paper summary chatbot, unfocused multi-topic dashboards. |
| **Interactive Substrate & Honesty** | 15 | Live computational substrate (toy model / linear recurrence / state evolution), meaningful concept variables, visible internal state, truth beside estimate, fast feedback (<1s). | Scripted animations passed off as real computation, fake sliders, cherry-picked success-only demos. |
| **BDH / BDH-CQ Integration & Evidence Discipline** | 10 | Direct, non-bolted-on connection to Dragon Hatchling (BDH) / BDH-CQ architecture; grounded in primary technical reports; explicit evidence labeling. | Generic "About BDH" marketing page, ungrounded speculation, unsourced architectural claims. |
| **Craft, Robustness, Accessibility & Provenance** | 10 | Visual excellence (frontier research aesthetic), keyboard accessibility, responsive mobile/desktop layout, loading/error states, reproducible code, complete source/license registry. | Broken links, broken mobile layout, UI lag, missing licenses/disclosures. |
| **Blog Post (+10 bonus opportunity)** | 10 (+10) | 600–800 words on an approved blog topic; single falsifiable thesis; >=2 recent primary papers (2022–2026); failure mode and BDH connection; no AI slop. | Generic summary, missing citations, fluff/marketing buzzwords. |

---

## 3. Comprehensive Requirement Traceability Matrix

| Requirement from PDF | Planned Implementation | Evidence / Demonstration | Status |
|---|---|---|---|
| **1. One-Sentence Falsifiable Claim** | "In a linear fast-weight associative memory, retrieving one stored value also receives contributions from other stored key-value pairs; increasing key similarity or memory load therefore increases interference under the stated retrieval setup." | Interactive capacity curve + token interference probe directly testing and falsifying the boundary. | Completed |
| **2. Real Computational Substrate** | Vectorized pure TypeScript/Python mathematical engine executing exact state updates ($S_t = \lambda S_{t-1} + v_t k_t^T$). | Live matrix arithmetic running in-browser with deterministic seeds; inspected step-by-step. | Completed |
| **3. Visible Internal State** | Real-time 2D matrix visualization of the Recurrent Memory Matrix $S_t$ showing exact Float64 weights and rank bounds. | Interactive matrix view showing dimensions, rank bounds, and per-cell weight inspection. | Completed |
| **4. Ground Truth vs Model Output** | Simultaneous dual-readout display: Ground Truth target vector vs Model retrieved output vector + Cosine Error / L2 distance / ISR. | Side-by-side discrepancy metric rendered at every query probe with exact algebraic breakdown. | Completed |
| **5. Few, Meaningful Controls** | Controls strictly mapped to physical/conceptual variables: State Dimension ($d$), Retention ($\lambda$), Associations ($N$), and Controlled Key Correlation ($\rho$). | Slider changes immediately re-evaluate the state equations and re-render in <15ms. | Completed |
| **6. Presets (Baseline, Phenomenon, Failure, Extreme)** | 5 curated 1-click presets: (1) Baseline Orthogonal, (2) Key Interference, (3) High-Load Stress Case, (4) Temporal Decay, (5) Sparse Plasticity. | 1-click instant scenario switching updating all visualizers and mathematical breakdowns. | Completed |
| **7. Integrated BDH / BDH-CQ Module** | Architectural derivation exploring how BDH's sparse positive activations and local plasticity provide an alternative to dense linear recurrent states. | Interactive side-by-side BDH Hebbian synapse update equation vs Linear Attention recurrent update. | Completed |
| **8. >=3 Recent Primary Papers (2022–2026)** | Mamba (Gu & Dao, 2023), xLSTM (Beck et al., 2024), Fast Weights (Sun et al., 2024 / Schlag et al., 2021), Dragon Hatchling (Kosowski et al., 2025), BDH-CQ (Engdahl et al., 2026). | Detailed citations beside every technical assertion and interactive equation element. | Completed |
| **9. Complete Disclosures & Open Artifacts** | `AI_DISCLOSURE.md`, `LICENSES.md`, `SOURCES.md`, public GitHub repo, zero-auth live deployment. | Markdown records tracking all tools, licenses, datasets, and code provenance. | Completed |
| **10. 600–800 Word Blog Post** | High-density technical essay on Blog Topic 3 ("Linear Attention Variants and Their Equivalences to Recurrent State Updates"). | Standalone markdown format with citations, limitations, and BDH grounding. | Completed |

---

## 4. Risk Analysis & Mitigation Matrix

### Technical & Scientific Risks
* **Risk:** Mathematical simplification misleads the learner or fails judge scrutiny.
  * *Mitigation:* Explicitly display both the continuous closed-form equation and the discrete simulation matrix; label every simplification with a formal "Scientific Simplification Disclaimer" detailing exact dimensionality tradeoffs.
* **Risk:** In-browser client latency when computing sequence rollouts.
  * *Mitigation:* Implement high-performance vectorized JavaScript/TypeScript kernels for live parameter sweeps (<15ms) and precalculate high-dimensional baselines with clear "LIVE" vs "PRECOMPUTED" status badges.

### Pedagogical & UI Risks
* **Risk:** The "Dashboard Problem" (too many dials, learner gets lost without understanding).
  * *Mitigation:* Enforce a strict 2-mode architecture: **Guided Discovery Mode** (10-step interactive narrative with sequential unlock) and **Research Sandbox Mode** (full variable manipulation).

---

## 5. Six-Day Execution Schedule

| Day | Focus Milestone | Deliverables & Artifacts |
|---|---|---|
| **Day 1** | Strategic Analysis, Topic Selection & Experiment Architecture | `PATHWAY_STRATEGY.md`, `TOPIC_EVALUATION.md`, `CONCEPT_LOCK.md`, `RESEARCH_MAP.md`, `EXPERIMENT_PLAN.md`, `BDH_CONNECTION.md`. |
| **Day 2** | Scientific Substrate & Core Mathematical Engine | `/experiments` Python verification scripts, PyTorch reference models, TypeScript linear algebra engine, test suite with assertions. |
| **Day 3** | Core Interactive Experience & State Visualizers | Next.js/React application, interactive memory matrix heatmaps, dual-readout ground-truth inspector, causal motion layer. |
| **Day 4** | BDH / BDH-CQ Integration & Deep Mathematical Linking | BDH sparse synaptic update explorer, interactive formula breakdown, paper citation overlays. |
| **Day 5** | Frontier Visual Polish, Accessibility & Performance | Dark-mode research lab aesthetic, responsive layout, keyboard navigation, WebWorker acceleration, complete disclosures. |
| **Day 6** | Feature Freeze, Defense Prep, Blog Post & Submission Package | `JUDGE_QUESTIONS.md`, 800-word Blog PDF, `README.md`, video demo script, public deployment validation. |
