# Associative Memory in Fast-Weight Architectures
### DataForge × Pathway 2026 Submission • Frontier Research Track

---

### Required Submission Deliverables & Artifacts
* **Public Interactive Web Application:** [https://dataforge-pathway-iota.vercel.app/](https://dataforge-pathway-iota.vercel.app/)
* **One-Page Concept Summary PDF:** [`CONCEPT_SUMMARY.pdf`](CONCEPT_SUMMARY.pdf) (Repository Root; 727 words via PDF text extraction, single-page A4)
* **Research Blog Post PDF:** [`BLOG_POST.pdf`](BLOG_POST.pdf) (Repository Root; publication layout with KaTeX typesetting)
* **Public Source Repository:** [https://github.com/bhavya277/Dataforge-PathWay.git](https://github.com/bhavya277/Dataforge-PathWay.git)
  
---

## 1. What This Project Teaches

This project teaches the geometric and algebraic mechanics of **associative memory recall and recurrent cross-talk interference** in linear fast-weight neural network architectures.

When a fixed-size recurrent matrix state stores key-value associations through outer products ($v_t k_t^T$), querying with a stored key retrieves not only the target value, but also an additive linear superposition of non-target values whenever stored keys are not mutually orthogonal. The project demonstrates:
1. How outer-product recurrence acts as the exact sequential dual of un-softmaxed linear attention.
2. How increasing controlled key overlap ($\rho$) causes non-target associations to bleed additively into retrieval.
3. How this linear superposition limitation connects to the sparse-positive plasticity ideas investigated in Dragon Hatchling (BDH).

---

## 2. Central Claim

> **"When stored keys are not orthogonal, a linear fast-weight state adds non-target contributions to retrieval; in our synthetic setup, increasing controlled key overlap increases measured cross-talk."**

*This single falsifiable statement is the project's central scientific source of truth. Memory load $N/d$ is explored as an empirical stress-test diagnostic under the specified synthetic setup, not an assertion of universal capacity failure.*

---

## 3. Intended Learner

* **Target Audience:** Machine learning students, researchers, and practitioners familiar with vectors, matrices, dot products, and basic neural network concepts who want to understand the representational limits of recurrent fast-weight memory.

---

## 4. Prerequisites

* **Vectors and Matrices:** Vector addition, matrix-vector multiplication, norms ($\|v\|_2$).
* **Dot Products & Projections:** Vector inner product $k^T q$, cosine similarity $\cos(\theta) = \frac{u \cdot v}{\|u\| \|v\|}$.
* **Outer Products:** Matrix formation via rank-1 outer product $v k^T \in \mathbb{R}^{d \times d}$.
* **Recurrent State Updates:** First-order discrete matrix recurrence $S_t = \lambda S_{t-1} + v_t k_t^T$.
* **Basic Neural Network Concepts:** Hidden states, self-attention, activation sparsity. *(Note: Familiarity with linear attention is helpful but not required).*

---

## 5. Learning Objectives

After completing this interactive experiment, the learner will be able to:
1. **Explain** how a linear fast-weight state stores key-value associations through recurrent outer products.
2. **Explain** why overlapping keys create additive cross-talk contamination during matrix readout.
3. **Predict** how increasing controlled key overlap ($\rho$) changes target signal vs. non-target contributions.
4. **Distinguish** ground-truth signal from non-target linear contributions algebraically.
5. **Explain** the conceptual connection to Dragon Hatchling's (BDH) sparse-positive synaptic plasticity framing.
6. **Identify** at least one fundamental limitation of the simplified synthetic finite-dimensional experiment.

---

## 6. Guided Learning Flow

The application opens with a baseline preset already running ($d=8, N=4, \rho=0.00, \lambda=1.00$). The learner progresses through a single continuous 7-step investigation:

* **01 / SEE THE MEMORY:** Inspect the already-running fixed-size state matrix $S_t \in \mathbb{R}^{d \times d}$ storing outer-product associations.
* **02 / ASK THE MEMORY:** Query with default stored key $q = k_1$. Observe Ground Truth ($v_1$) beside Retrieved ($y_t = S_t q$) with live Cosine Similarity, Raw $L_2$ Error, and Interference-to-Signal Ratio (ISR).
* **03 / CHANGE ONE THING:** A prominent single control for Controlled Key Overlap ($\rho$). Increasing $\rho$ ($0.00 \to 0.45 \to 0.70$) immediately updates the Gram matrix and retrieval output.
* **04 / SEE CROSS-TALK:** Answers: *"Where did the unwanted part of the retrieval come from?"*
  $$\text{Retrieved Output } y_t = \underbrace{\lambda^{t-j} \eta v_j (k_j^T q_j)}_{\text{Target Contribution}} + \underbrace{\sum_{i \ne j} \lambda^{t-i} \eta v_i (k_i^T q_j)}_{\text{Cross-Talk Contribution}}$$
  *Because the keys are not perfectly orthogonal, a query for one key can have non-zero projection onto other stored keys. Those projections contribute non-target terms to the retrieved value.* Verified with an exact float64 residual badge ($\|y - (\text{target} + \text{crosstalk})\|_2 < 10^{-14}$) in linear mode.
* **05 / PUSH MEMORY LOAD:** Empirical stress test across the dimensionless load ratio $\gamma = N/d$ on a live SVG chart with a $\gamma = 1$ reference line.
* **06 / CONNECT TO BDH:** Conceptual bridge from continuous dense linear superposition to Dragon Hatchling (BDH) sparse positive plasticity `[TEACHING ABSTRACTION]`.
* **07 / EXPLORE YOURSELF:** Full sandbox controls unlocked ($d, N, \rho, \lambda$, BDH toggle) operating on the same underlying state, followed by an "Explain It Back" synthesis checkpoint.

---

## 7. Architecture

The system is architectured into three decoupled, reproducible layers:
1. **Mathematical Engine Layer (`src/lib/math-engine.ts`):** Pure TypeScript vectorized linear algebra kernels running deterministic Float64 matrix arithmetic.
2. **Interactive Presentation Layer (`src/app/`, `src/components/`):** Responsive editorial layout presenting the 7-step learning journey, visual heatmaps, 3-column decomposition, and metric readouts.
3. **Python Numerical Verification Layer (`experiments/`):** Independent test suite verifying recurrence properties, linear attention duality, and statistical sweeps.

---

## 8. Mathematical Model

For sequence length $t$, state dimension $d$, retention factor $\lambda \in (0, 1]$, and learning rate $\eta$:

### Sequential Recurrent State Update
$$S_0 = \mathbf{0} \in \mathbb{R}^{d \times d}$$
$$S_t = \lambda S_{t-1} + \eta \cdot (v_t k_t^T) = \sum_{i=1}^t \lambda^{t-i} \eta \cdot (v_i k_i^T)$$

### Linear Retrieval Readout
Given query vector $q \in \mathbb{R}^d$:
$$y_t = S_t q = \sum_{i=1}^t \lambda^{t-i} \eta \cdot v_i (k_i^T q)$$

### Exact Retrieval Decomposition
For query $q = k_j$ targeting association $j$:
$$y_t = \underbrace{\lambda^{t-j} \eta \cdot v_j (k_j^T q_j)}_{\text{Target Contribution}} + \underbrace{\sum_{i \ne j} \lambda^{t-i} \eta \cdot v_i (k_i^T q_j)}_{\text{Cross-Talk Contribution}}$$

*Linear Invariant:* In linear mode without nonlinear connection pruning, $y_t \equiv \text{Target Contribution} + \text{Cross-Talk Contribution}$ down to machine epsilon.

---

## 9. What is Computed Live

* **Matrix Recurrence Updates:** Sequential calculation of $S_t = \lambda S_{t-1} + v_t k_t^T$ computed live on every user parameter change.
* **Associative Retrieval:** Exact matrix-vector multiplication $y_t = S_t q$ executed in real time in-browser.
* **Gram Matrix Evaluation:** Full pairwise inner-product matrix $G_{ij} = k_i^T k_j$ and statistical distributions (mean, std, min, max) computed on the fly.
* **Target vs. Cross-Talk Decomposition:** Exact algebraic separation of target signal and cross-talk interference vectors.
* **Residual Verification:** Dynamic live $L_2$ difference $\|y_t - (\text{target} + \text{crosstalk})\|_2$ computed live in browser.
* **Interactive Sandbox Controls:** Sliders ($d, N, \rho, \lambda$) re-evaluate the full computational engine live in the browser.

---

## 10. Component Classification: Live vs. Precomputed vs. Teaching Abstraction

| Component / Subsystem | Classification | Implementation Details |
|---|---|---|
| **Recurrent Outer-Product State Update ($S_t$)** | **Live Computation** | Vectorized Float64 linear algebra in `src/lib/math-engine.ts` evaluated on every user interaction. |
| **Associative Query Readout ($y_t = S_t q_t$)** | **Live Computation** | Exact matrix-vector multiplication executed in-browser in real time. |
| **Target vs. Cross-Talk Decomposition** | **Live Computation** | Exact algebraic separation with live float64 residual badge ($\|y_t - (\text{target} + \text{crosstalk})\|_2 < 10^{-14}$). |
| **Pairwise Key Gram Matrix ($G = K K^T$)** | **Live Computation** | Full inner-product matrix and observed statistics ($\mu, \sigma, \min, \max$) evaluated on the fly. |
| **Learner Explain-Back Reflection Checkpoint** | **Live Interactive UI** | In-memory reflection prompt with concept hint tags and reference model answer reveal. |
| **Monte Carlo Benchmark Distributions** | **Precomputed / Cached** | The benchmark dataset contains 50 configurations: 1 deterministic orthogonal baseline, plus 20 correlation-sweep, 20 load-sweep, and 9 dimension-sweep configurations. The three sweep experiments use 50 Monte Carlo trials per configuration, stored in `data/experiment_benchmarks.json`. |
| **BDH Sparse Plasticity Block** | **Teaching Abstraction** | Simplified single-layer $\text{ReLU}(v)\text{ReLU}(k)^T$ with Top-K pruning; illustrates sparse gating, not full BDH model. |

---

## 11. What is Computed Live (Engine Summary)

* **Matrix Recurrence Updates:** Sequential calculation of $S_t = \lambda S_{t-1} + v_t k_t^T$ computed live on every parameter change.
* **Associative Retrieval:** Exact matrix-vector multiplication $y_t = S_t q$ executed in real time in-browser.
* **Gram Matrix Evaluation:** Full pairwise inner-product matrix $G_{ij} = k_i^T k_j$ and statistical distributions (mean, std, min, max) computed on the fly.
* **Target vs. Cross-Talk Decomposition:** Exact algebraic separation of target signal and cross-talk interference vectors.
* **Residual Verification:** Dynamic live $L_2$ difference $\|y_t - (\text{target} + \text{crosstalk})\|_2$ computed live in browser.
* **Interactive Sandbox Controls:** Sliders ($d, N, \rho, \lambda$) re-evaluate the full computational engine live in the browser.

---

## 12. What is Precomputed

* **Statistical Benchmark Sweeps:** The benchmark dataset contains 50 configurations: 1 deterministic orthogonal baseline, plus 20 correlation-sweep, 20 load-sweep, and 9 dimension-sweep configurations. The three sweep experiments use 50 Monte Carlo trials per configuration saved in `data/experiment_benchmarks.json`. These provide statistical baseline reference curves on the Stress Test tab. No live UI simulation passes off precomputed traces as real-time computation.

---

## 13. What is Synthetic

* **Key and Value Vectors:** Generated in-memory via controlled isotropic Gaussian sampling.
* **Controlled Overlap Distribution:** When $\rho > 0$, keys share a common latent Gaussian direction:
  $$k_i = \text{normalize}\left(\sqrt{\rho} \cdot u_0 + \sqrt{1 - \rho} \cdot \xi_i\right), \quad u_0, \xi_i \sim \mathcal{N}(0, I_d)$$
  $\rho$ controls the shared component; observed pairwise cosine similarities vary statistically around this setting.
* **Synthetic Benchmark Sweeps:** The stress test curves reflect empirical results under this specific synthetic distribution.

---

## 14. What is a Teaching Abstraction

* **BDH-Inspired Sparse Plasticity Module:** A simplified single-layer model applying $\text{ReLU}(v) \text{ReLU}(k)^T$ and Top-K connection pruning on $S \in \mathbb{R}^{d \times d}$.
* **Purpose:** Demonstrates how non-negative activations and sparse connections restrict active interactions in a low-dimensional state.
* **Pedagogical Boundary:** Explicitly labeled as `[BDH-INSPIRED TEACHING ABSTRACTION • NOT THE FULL BDH ARCHITECTURE]`. It is not a reproduction of the multi-layer BDH architecture, nor does it imply that sparsity eliminates all interference.

---

## 15. BDH Connection

* **Literature:** Dragon Hatchling (**BDH**; Kosowski et al., 2025, arXiv:2509.26507) proposes a Post-Transformer brain-inspired architecture where attention is reformulated as local synaptic plasticity over non-negative sparse activations ($a \ge 0$).
* **Relevance:** While standard fast weights superimpose unconstrained real-valued vectors causing dense interference, BDH explores grounding memory in localized synaptic pathways with sparse positive activations. Our teaching abstraction illustrates how non-negative sparsity alters the pattern of active interactions.

---

## 16. BDH-CQ Connection

* **Literature:** **BDH-CQ** (Engdahl et al., 2026, arXiv:2608.09888) investigates in-context demonstration learning where input-output examples $(X \to Y)$ update recurrent synaptic states, allowing multi-step reasoning via continuous latent forward passes without generating explicit text tokens.
* **Relevance:** Serves as broader research context for how recurrent fast-weight updates can assimilate demonstration pairs in modern architectures.

---

## 17. Known Limitations

1. **Synthetic Key Distribution:** Keys use isotropic Gaussian vectors; real linguistic tokens lie on structured, non-uniform natural language manifolds.
2. **Single-Layer Low-Dimensional Scale:** State dimension $d \in [4, 16]$ enables visible matrix cell inspection in browser, but lacks the multi-head, multi-layer depth of production LLMs ($d \ge 2048$).
3. **No Learned Projections:** Keys and values are evaluated directly without trained linear projection weight matrices ($W_Q, W_K, W_V$).
4. **Diagnostic, Not Theorem:** $N/d$ is an empirical memory-load diagnostic for the synthetic experiment, not a universal capacity theorem.

---

## 18. Reproduction / Local Setup

```bash
# Clone repository
git clone https://github.com/bhavya277/Dataforge-PathWay.git
cd Dataforge-PathWay

# Install dependencies cleanly
npm ci

# Start development server
npm run dev

# Open in browser: http://localhost:3000
```

To run an optimized production build:
```bash
npm run build
npm start
```

---

## 19. Tests & Verification

```bash
# Run Python automated mathematical unit tests (outer-product, decomposition, orthogonality, decay, bounds)
npm run test:py
# or: python -m unittest discover -s experiments

# Run numerical recurrence equivalence verification across 125 randomized parameter sweeps
python experiments/verify_recurrence.py

# Export publication-ready Blog Post & One-Page Concept Summary PDFs (KaTeX + Puppeteer SSR)
npm run export:pdf
```

---

## 20. Sources / Primary Papers

1. **Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M. (2025).** *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain.* [arXiv:2509.26507](https://arxiv.org/abs/2509.26507).
2. **Engdahl, B., Kosowski, A., Chorowski, J., Stamirowska, Z., Uznański, P., et al. (2026).** *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning.* [arXiv:2608.09888](https://arxiv.org/abs/2608.09888).
3. **Schlag, I., Irie, K., & Schmidhuber, J. (2021).** *Linear Transformers Are Secretly Fast Weight Programmers.* ICML 2021. [arXiv:2102.11174](https://arxiv.org/abs/2102.11174).
4. **Beck, M., et al. (2024).** *xLSTM: Extended Long Short-Term Memory.* NeurIPS 2024. [arXiv:2405.04517](https://arxiv.org/abs/2405.04517).
5. **Gu, A., & Dao, T. (2023).** *Mamba: Linear-Time Sequence Modeling with Selective State Spaces.* [arXiv:2312.00752](https://arxiv.org/abs/2312.00752).
6. **Sun, Y., Li, X., Dalal, K., Xu, J., Vikram, A., Zhang, G., Dubois, Y., Chen, X., Wang, X., Koyejo, S., Hashimoto, T., & Guestrin, C. (2024).** *Learning to (Learn at Test Time): RNNs with Expressive Hidden States (TTT).* [arXiv:2407.04620](https://arxiv.org/abs/2407.04620).
7. **Elhage, N., et al. (Anthropic, 2022).** *Toy Models of Superposition.* Transformer Circuits Thread.

---

## 21. Code/Data/Asset Licenses

* **Code:** Open-source under the MIT License (see [LICENSES.md](LICENSES.md)).
* **Data:** Synthetic only; no private or proprietary external datasets.
* **Model Weights:** None used or bundled.
* **Graphics:** Original, programmatic inline SVGs.
* **Fonts:** Standard system sans-serif font stack; mathematical symbols rendered via KaTeX bundled font assets.
* **Dependencies:** Next.js (MIT), React (MIT), Tailwind CSS (MIT), KaTeX (MIT), Lucide React (ISC), Framer Motion (MIT), NumPy (BSD 3-Clause).

---

## 22. AI Assistance Disclosure

In compliance with the DataForge 2026 regulations:
* **Tool Used:** Antigravity AI coding assistant.
* **Role:** Code boilerplate generation, TypeScript typing, UI layout styling, and documentation formatting.
* **Human Ownership:** All mathematical derivations, scientific framing, central claim formulation, experimental design, validation assertions, and architectural decisions were directed, audited, and reviewed by the registered author.

---

## 23. Mentor Involvement Disclosure

**Mentor involvement: None. No mentor or advisor was involved in this submission.** All research framing, mathematical implementations, interactive visualizations, and defense documentation were conceived, implemented, tested, and defended independently by the registered author.

