# Systematic Evaluation & Ranking of Approved Pathway Concepts

This document rigorously evaluates the approved main topics from Page 2 of the DataForge 2026 Pathway Problem Statement across all 22 required evaluation dimensions.

---

## 1. Candidate Concepts from Approved List

### Cluster A: Memory and State
1. **Linear Attention & Associative Memory / Fast Weights** (Equivalence between linear recurrent state updates $S_t = S_{t-1} + v_t k_t^T$ and outer-product associative memories).
2. **Neural State Space Models (SSMs / Mamba)** (Continuous-to-discrete time-invariant/time-varying linear state transitions $h_t = \bar{A}h_{t-1} + \bar{B}x_t$).
3. **Synaptic Plasticity as Short-Term Memory / Test-Time Learned Memory** (Hebbian/anti-Hebbian local parameter adaptation as dynamic working memory).
4. **Continual and Online Learning in Recurrent Architectures** (Catastrophic forgetting vs forward transfer in recurrent states).

### Cluster B: Recurrence and Computation
5. **Recurrent / Latent Space Reasoning** (Recurrent latent iterations for multi-step algorithmic deduction without token-level decoding).
6. **Recurrent Spiking Neural Networks (RSNNs)** (Membrane potential leak, integrate, and spike firing dynamics).
7. **Local Attention vs Linear Recurrence Hybridization**.
8. **Layer Normalization Dynamics in Post-Transformer Recurrence** (RMSNorm / GroupNorm stabilization in xLSTM/RWKV).

### Cluster C: Sparsity and Interpretability
9. **Sparse Positive Activations & Monosemantic Synapses** (ReLU/Top-K induced non-negative polysemanticity reduction vs dense superposition).
10. **Scale-Free Neural Networks & Sparse Topology**.

### Cluster D: Architectural Directions
11. **Post-Transformer Landscape Comparison (BDH vs Mamba vs xLSTM vs RWKV vs Jamba)**.
12. **Mixture of Experts (MoE) in State-Space / Recurrent Systems**.

---

## 2. Multi-Dimensional Scoring Framework (1 to 5 scale per criterion, Max Score = 110)

| Evaluation Criterion | Linear Attention & Associative Fast Weights | Neural SSMs (Mamba / S4) | Sparse Positive Activations & Monosemantic Synapses | Recurrent Latent Reasoning |
|---|:---:|:---:|:---:|:---:|
| 1. Technical Depth | 5 | 5 | 4 | 5 |
| 2. Research Relevance (2022–2026) | 5 | 5 | 5 | 5 |
| 3. Availability of Primary Papers | 5 | 5 | 4 | 4 |
| 4. Fresh Research Relevance | 5 | 5 | 5 | 5 |
| 5. Interactive Potential | 5 | 4 | 4 | 4 |
| 6. Visualization Potential | 5 | 4 | 5 | 4 |
| 7. Real Computational Substrate Feasibility | 5 | 4 | 4 | 3 |
| 8. Falsifiable Claim Strength | 5 | 4 | 4 | 4 |
| 9. Ground Truth vs Output Contrast | 5 | 4 | 4 | 4 |
| 10. Exposing Meaningful Internal State | 5 ($S_t$ matrix) | 4 (hidden vector) | 5 (activation map) | 3 (latent trace) |
| 11. Failure-Case Potential | 5 (Interference cliff) | 4 (Decay collapse) | 4 (Dead units) | 4 (Drift) |
| 12. Natural BDH Connection | 5 (Direct Hebbian) | 4 (Comparison) | 5 (Sparse BDH core) | 4 (BDH CQ) |
| 13. Natural BDH-CQ Connection | 5 (Demonstration memory) | 3 | 4 | 5 |
| 14. 6-Day Implementation Feasibility | 5 | 4 | 4 | 3 |
| 15. Minimal Compute Requirements | 5 (Real-time in browser) | 4 | 4 | 3 |
| 16. Deployment Simplicity | 5 (Deterministic Wasm/TS) | 4 | 4 | 3 |
| 17. Research Rigor & Grounding | 5 | 5 | 4 | 4 |
| 18. Low Risk of Becoming Generic | 5 | 3 (Mamba is common) | 4 | 4 |
| 19. Competition Differentiation | 5 | 3 | 4 | 4 |
| 20. Judge-Defense Robustness | 5 | 4 | 4 | 3 |
| 21. Potential for 60-second "OH!" Moment | 5 | 4 | 4 | 4 |
| 22. Reusable Educational Tooling Value | 5 | 4 | 4 | 4 |
| **TOTAL SCORE (out of 110)** | **109** | **91** | **94** | **87** |

---

## 3. Detailed Analysis of the TOP 3 Candidates

### TOP 1: Associative Memory in Fast Weights & Linear Attention (Score: 109/110)
* **Concept:** The duality between linear attention recurrent state updates ($S_t = S_{t-1} + v_t k_t^T$) and fast-weight associative matrix memory, demonstrating capacity bounds, token interference, and Hebbian updating.
* **Why it wins:**
  1. **Perfect Computational Substrate:** Can execute 100% mathematically faithful matrix updates in live browser memory at 60 FPS without approximations or black-box neural networks.
  2. **Direct, Unbroken BDH Connection:** Dragon Hatchling (BDH) uses sparse Hebbian synaptic updates as its foundational memory mechanism. Showing how classical linear attention suffers from cross-talk/interference that BDH's sparse monosemantic plasticity resolves is the ultimate pedagogical narrative.
  3. **Visually Stunning & Intuitive:** A 2D recurrent weight matrix heatmap ($d \times d$) mutating live token-by-token reveals exactly how memories overwrite each other when key vectors lose orthogonality.
  4. **Sharp, Clean Falsifiable Claim:** Quantifiable storage capacity threshold $N \le d$ under orthogonal keys, collapsing to retrieval error as token similarity increases.

### TOP 2: Sparse Positive Activations & Monosemantic Synapses in Post-Transformers (Score: 94/110)
* **Concept:** How non-negative Top-K / ReLU activation constraints force polysemantic superposition collapse into isolated, monosemantic circuits.
* **Pros:** Deep aesthetic appeal, direct BDH relevance (sparse positive firing).
* **Cons:** Harder to provide an immediate 60-second quantitative ground-truth error comparison without training large SAE dictionaries.

### TOP 3: Neural State Space Models & Selection Dynamics (Mamba / S4) (Score: 91/110)
* **Concept:** Selective state space updates ($B_t, C_t, \Delta_t$) filtering irrelevant context versus continuous LTI recurrence.
* **Pros:** Highly popular in recent literature (Gu & Dao, 2023).
* **Cons:** High risk of becoming a generic "Mamba explainer" identical to existing blogs; harder for learners to manipulate underlying continuous ODE physics in <60 seconds.

---

## 4. Final Recommendation
**Topic Selected:** **Associative Memory in Fast-Weight Architectures and Linear Recurrent State Updates (with direct extension to BDH Synaptic Plasticity).**
