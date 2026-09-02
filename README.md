# Associative Memory in Fast-Weight Architectures
### DataForge × Pathway 2026 Hackathon Submission • Frontier Research Track

An interactive scientific research platform and computational substrate exploring associative memory storage, key cross-talk interference, temporal retention decay, and sparse synaptic plasticity in recurrent fast-weight architectures.

---

## Central Claim

> **"When stored keys are not orthogonal, a linear fast-weight state adds non-target contributions to retrieval; in our synthetic setup, increasing controlled key overlap increases measured cross-talk."**

*This single falsifiable statement is the project's central scientific source of truth. Memory load $N/d$ is explored as a secondary empirical stress test under the specified synthetic setup, not an assertion of universal capacity failure.*

---

## Intended Learner

* **Target Audience:** Machine learning students, researchers, and practitioners familiar with vectors, matrices, dot products, and basic neural network concepts who want to understand the representational limits of recurrent fast-weight memory.
* **Prerequisites:**
  * Vector and matrix arithmetic (addition, multiplication)
  * Dot products and vector projections ($k^T q$)
  * Outer products ($v k^T$)
  * Recurrent matrix state updates ($S_t = \lambda S_{t-1} + v_t k_t^T$)
  * Basic neural network concepts (attention, hidden states, activation sparsity)

---

## Learning Objectives

After completing this interactive experiment, the learner will be able to:
1. **Explain** how a linear fast-weight state stores key-value associations through recurrent outer products.
2. **Explain** why overlapping keys create additive cross-talk contamination during matrix readout.
3. **Predict** how increasing controlled key overlap ($\rho$) changes target signal vs. non-target contributions.
4. **Distinguish** ground-truth signal from non-target linear contributions algebraically.
5. **Explain** the conceptual connection to Dragon Hatchling's (BDH) sparse-positive synaptic plasticity framing.
6. **Identify** at least one fundamental limitation of the simplified synthetic finite-dimensional experiment.

---

## 60-Second Learning Journey

The application opens with a baseline preset already running ($d=8, N=4, \rho=0.00, \lambda=1.00$). The learner progresses through a single continuous 7-step investigation:

1. **01 / SEE THE MEMORY:** Inspect the already-running fixed-size state matrix $S_t \in \mathbb{R}^{d \times d}$ storing outer-product associations.
2. **02 / ASK THE MEMORY:** Query with default stored key $q = k_1$. Observe Ground Truth ($v_1$) beside Retrieved ($y_t = S_t q$) with live Cosine Similarity, Raw $L_2$ Error, and Interference-to-Signal Ratio (ISR).
3. **03 / CHANGE ONE THING:** A prominent single control for Controlled Key Overlap ($\rho$). Increasing $\rho$ ($0.00 \to 0.45 \to 0.70$) immediately updates the Gram matrix and retrieval output.
4. **04 / SEE CROSS-TALK:** The central mathematical "aha!" moment:
   $$\text{Retrieved Output } y_t = \underbrace{\lambda^{t-j} \eta v_j (k_j^T q_j)}_{\text{Target Signal}} + \underbrace{\sum_{i \ne j} \lambda^{t-i} \eta v_i (k_i^T q_j)}_{\text{Cross-Talk Interference}}$$
   *Because the query is similar to keys other than the target key, those stored associations also contribute to the readout.* In linear mode, exact equality is verified with a live float64 residual badge ($\|y - (\text{signal} + \text{crosstalk})\|_2 < 10^{-14}$).
5. **05 / PUSH MEMORY LOAD:** Empirical stress test across the dimensionless load ratio $\gamma = N/d$ on a live SVG chart with a $\gamma = 1$ reference line.
6. **06 / CONNECT TO BDH:** Conceptual bridge from continuous dense linear superposition to Dragon Hatchling (BDH) sparse positive plasticity `[TEACHING ABSTRACTION]`.
7. **07 / EXPLORE YOURSELF:** Full sandbox controls unlocked ($d, N, \rho, \lambda$, BDH toggle) operating on the same underlying state.

---

## Mathematical Model

For sequence length $t$, state dimension $d$, retention factor $\lambda \in (0, 1]$, and learning rate $\eta$:

### 1. Sequential Recurrent State Update
$$S_0 = \mathbf{0} \in \mathbb{R}^{d \times d}$$
$$S_t = \lambda S_{t-1} + \eta \cdot (v_t k_t^T) = \sum_{i=1}^t \lambda^{t-i} \eta \cdot (v_i k_i^T)$$

### 2. Linear Retrieval Readout
Given query vector $q \in \mathbb{R}^d$:
$$y_t = S_t q = \sum_{i=1}^t \lambda^{t-i} \eta \cdot v_i (k_i^T q)$$

### 3. Exact Retrieval Decomposition
For query $q = k_j$ targeting association $j$:
$$y_t = \underbrace{\lambda^{t-j} \eta \cdot v_j (k_j^T q_j)}_{\text{Target Signal Component}} + \underbrace{\sum_{i \ne j} \lambda^{t-i} \eta \cdot v_i (k_i^T q_j)}_{\text{Cross-Talk Interference Component}}$$

*Algebraic Invariant:* In linear mode without nonlinear connection pruning, $y_t \equiv \text{Target Signal} + \text{Cross-Talk Interference}$ to machine precision.

---

## Interactive Controls

| Control | Symbol | Range | Default | Conceptual Meaning |
|---|---|---|---|---|
| **State Dimension** | $d$ | $4 - 16$ (step 2) | $8$ | Dimensionality of keys and values; sets algebraic rank bound $\text{Rank}(S) \le d$. |
| **Stored Associations** | $N$ | $2 - 16$ (step 1) | $4$ | Sequence length stored in state; determines load ratio $\gamma = N/d$. |
| **Controlled Key Correlation** | $\rho$ | $0.0 - 0.8$ (step 0.05) | $0.0$ | Synthesizer parameter controlling shared-component alignment across keys. |
| **Retention Decay** | $\lambda$ | $0.5 - 1.0$ (step 0.05) | $1.0$ | Exponential forgetting discount factor applied to previous state $S_{t-1}$. |
| **BDH Plasticity Toggle** | — | boolean | `false` | Enables single-layer sparse-positive ReLU projection with Top-K connection pruning. |

---

## Experimental Method

1. **Synthetic Key-Value Generation:**
   * When $\rho = 0.0$ and $N \le d$, an exact Gram-Schmidt orthonormal basis is generated.
   * When $\rho > 0.0$, keys are synthesized via an isotropic shared-component model:
     $$k_i = \sqrt{\rho} \cdot u_0 + \sqrt{1 - \rho} \cdot \xi_i, \quad u_0, \xi_i \sim \mathcal{N}(0, I_d), \quad k_i \leftarrow \frac{k_i}{\|k_i\|_2}$$
   * Ground truth values $v_i \sim \mathcal{N}(0, I_d)$ are normalized unit vectors.
2. **State Construction & Query:**
   * Sequence pairs are accumulated into $S_t$ step-by-step.
   * Query vector $q = k_j$ is evaluated via matrix-vector product $y_t = S_t q$.
3. **Metric Evaluation:**
   * Cosine Similarity: $\cos(v_j, y_t) = \frac{v_j \cdot y_t}{\|v_j\| \|y_t\|}$
   * Raw Euclidean $L_2$ Error: $\|y_t - v_j\|_2$
   * Interference-to-Signal Ratio (ISR): $\frac{\|\text{Cross-Talk}\|_2}{\|\text{Target Signal}\|_2 + \epsilon}$

---

## Evidence Classification

* **`[MATHEMATICAL FACT]`**: Recurrence closed form $S_t = \sum \lambda^{t-i} \eta v_i k_i^T$; algebraic decomposition $y_t = \text{Target} + \text{Cross-talk}$; matrix rank bound $\text{Rank}(S) \le d$.
* **`[LIVE EXPERIMENT]`**: In-browser vectorized Float64 linear algebra engine executing state updates, queries, and Gram matrix computations on every slider interaction ($<15$ ms).
* **`[SYNTHETIC EXPERIMENT]`**: Key and value vectors generated from controlled isotropic Gaussian distributions.
* **`[EMPIRICAL OBSERVATION]`**: Degradation curves observed across $(N, d, \rho, \lambda)$ parameter sweeps in this synthetic setup.
* **`[RESEARCH INTERPRETATION]`**: Parallels between linear fast weights, linear transformers, and recurrent state space models.
* **`[TEACHING ABSTRACTION]`**: Single-layer BDH-inspired sparse-plasticity toy model with Top-K connection gating.

---

## BDH / BDH-CQ Connection

### What Official Research Studies:
* **The Dragon Hatchling (BDH; Kosowski et al., 2025, arXiv:2509.26507):** Biologically-grounded scale-free neural architecture featuring non-negative sparse neuron particles ($a \ge 0$), local synaptic plasticity, and monosemantic routing.
* **BDH-CQ (Engdahl et al., 2026, arXiv:2608.09888):** In-context learning via recurrent latent reasoning directly from demonstration trajectories without explicit verbal Chain-of-Thought (CoT) tokens.

### What Our Teaching Abstraction Does:
* Applies non-negative sparse projections $\text{ReLU}(v) \text{ReLU}(k)^T$ and Top-K connection gating to illustrate how non-negative sparsity reduces active overlapping connections under suitable sparse-support regimes.
* **Representation Consistency:** In BDH mode, the target ground truth uses the same transformed representation ($\text{ReLU}(v)$) as the state.
* **Pedagogical Boundary:** Explicitly labeled as `[BDH-INSPIRED TEACHING ABSTRACTION • NOT THE FULL BDH ARCHITECTURE]`. Nonlinear Top-K pruning zeroes out matrix entries, meaning exact linear superposition does not hold after pruning.

---

## Limitations

1. **Synthetic Data Distribution:** Synthetic keys use controlled Gaussian shared-component sampling; linguistic token embeddings lie on structured, non-uniform natural language manifolds.
2. **Single-Layer Toy Scale:** State dimension $d \in [4, 16]$ enables visible matrix cell inspection in browser, but lacks the multi-head, multi-layer depth of production LLMs ($d \ge 2048$).
3. **Fixed Linear Projections:** Keys and values are evaluated directly without learned linear projection weight matrices ($W_Q, W_K, W_V$).
4. **Diagnostic, Not Theorem:** $N/d$ is an empirical diagnostic for finite-state saturation, not a universal capacity theorem.

---

## Architecture

The system is architectured into three decoupled, reproducible layers:
1. **Mathematical Engine Layer (`src/lib/math-engine.ts`):** Pure TypeScript vectorized linear algebra kernels running deterministic Float64 matrix arithmetic.
2. **Interactive UI / Educational Presentation Layer (`src/app/`, `src/components/`):** Responsive editorial layout presenting the 7-step learning journey, visual heatmaps, and metric readouts.
3. **Python Numerical Verification Layer (`experiments/`):** Independent test suite verifying recurrence properties, linear attention duality, and statistical sweeps.

---

## Major Components

* **`src/lib/math-engine.ts`:** Vectorized Float64 engine (`LiveAssociativeEngine`, `generateSyntheticPairs`, `computeKeySetStats`).
* **`src/app/page.tsx`:** Primary page orchestrating the unified 7-step educational learning journey.
* **`src/components/experiment/DualReadout.tsx`:** Step 02 Query & associative retrieval readout (Ground Truth vs. Retrieved).
* **`src/components/experiment/RetrievalDecomposition.tsx`:** Step 04 dedicated cross-talk decomposition and residual equality verification.
* **`src/components/visualization/MemoryMatrixHeatmap.tsx`:** Step 01 interactive 2D heatmap of state matrix $S_t \in \mathbb{R}^{d \times d}$.
* **`src/components/visualization/GramMatrixHeatmap.tsx`:** Step 03 Gram matrix $G_{ij} = k_i^T k_j$ with observed pairwise cosine statistics.
* **`src/components/experiment/StressTestExplorer.tsx`:** Step 05 empirical load ratio ($\gamma = N/d$) stress test with $\gamma = 1$ reference line.
* **`src/components/bdh/BDHComparisonExplorer.tsx`:** Step 06 conceptual bridge from linear recurrence to BDH synaptic plasticity.
* **`src/components/experiment/ControlPanel.tsx`:** Step 07 interactive sandbox controls with curated 1-click presets.
* **`src/components/education/ResearchNotebook.tsx`:** 7-section academic research notes, formal derivations, and literature sources.
* **`experiments/verify_recurrence.py`:** Standalone Python numerical proof verifying equivalence to linear attention.
* **`experiments/test_math.py`:** Python unit test suite verifying mathematical invariants.
* **`docs/ONE_PAGE_CONCEPT_SUMMARY.md`:** Self-contained 1-page executive technical summary.

---

## Live vs Synthetic vs Precomputed

* **LIVE:** State recurrence updates, query evaluations, Gram matrix calculations, signal/cross-talk decompositions, and residual verifications are computed in real time on every slider adjustment (<15 ms).
* **SYNTHETIC:** Generated isotropic Gaussian key and value vectors under controlled correlation parameter $\rho$.
* **PRECOMPUTED:** Reference statistical benchmark distributions (`data/experiment_benchmarks.json`) generated by `generate_experiment_data.py` across 50 Monte Carlo trials per configuration.
* **TEACHING ABSTRACTION:** BDH single-layer sparse-plasticity toy model with Top-K pruning.

---

## Reproduction

To run the interactive web application locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser: http://localhost:3000
```

To create an optimized production build:
```bash
npm run build
```

---

## Tests

Execute the automated Python verification suite:

```bash
# Run unit tests (6 tests: outer-product, decomposition, orthogonality, Gram matrix, decay, bounds)
python -m unittest discover -s experiments

# Run numerical recurrence equivalence verification across 125 randomized parameter sweeps
python experiments/verify_recurrence.py

# Export publication-ready Blog Post PDF
python experiments/export_blog_pdf.py
```

---

## Research Sources

1. **Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M. (2025).** *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain.* [arXiv:2509.26507](https://arxiv.org/abs/2509.26507).
2. **Engdahl, B., Kosowski, A., Chorowski, J., Stamirowska, Z., Uznański, P., et al. (2026).** *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning.* [arXiv:2608.09888](https://arxiv.org/abs/2608.09888).
3. **Schlag, I., Irie, K., & Schmidhuber, J. (2021).** *Linear Transformers Are Secretly Fast Weight Programmers.* ICML 2021. [arXiv:2102.11174](https://arxiv.org/abs/2102.11174).
4. **Beck, M., et al. (2024).** *xLSTM: Extended Long Short-Term Memory.* NeurIPS 2024. [arXiv:2405.04517](https://arxiv.org/abs/2405.04517).
5. **Gu, A., & Dao, T. (2023).** *Mamba: Linear-Time Sequence Modeling with Selective State Spaces.* [arXiv:2312.00752](https://arxiv.org/abs/2312.00752).
6. **Sun, Y., et al. (2024).** *Learning to (Learn at Test Time): RNNs with Expressive Hidden States (TTT).* [arXiv:2407.04620](https://arxiv.org/abs/2407.04620).
7. **Elhage, N., et al. (Anthropic, 2022).** *Toy Models of Superposition.* Transformer Circuits Thread.

---

## Credits

* **Designed and Developed by:** Bhavya Modi
* **Platform:** DataForge × Pathway 2026 Frontier Research Substrate

---

## License

This project is licensed under the MIT License — see [LICENSES.md](file:///c:/Users/modib/OneDrive/Desktop/Pathway/LICENSES.md) for details.

---

## AI Disclosure

This project was developed with the assistance of the **Antigravity AI coding assistant** for code boilerplate, UI styling, and documentation structuring. All mathematical derivations, scientific framing, experimental design, validation assertions, and final architectural decisions were human-directed and reviewed.
