# DataForge × Pathway 2026: Associative Memory & Linear Recurrence in Fast-Weight Architectures

An interactive frontier AI research explainer and in-browser computational substrate exploring associative memory recall, non-orthogonal key overlap, temporal retention decay, and sparse plasticity in linear fast-weight architectures.

---

## 1. Locked Central Educational Claim

> **"When stored keys are not orthogonal, a linear fast-weight state adds non-target contributions to retrieval; in our synthetic setup, increasing controlled key overlap increases measured cross-talk."**

*This single falsifiable statement is the project's central scientific source of truth. Memory load $N/d$ is explored as a secondary empirical stress test under the specified synthetic setup, not an assertion of universal capacity failure.*

---

## 2. Intended Learner & Prerequisites

* **Target Audience:** ML students and practitioners familiar with vectors, matrices, dot products, and basic neural networks.
* **Prerequisites:**
  * Vectors and matrices
  * Dot products and vector projection ($k^T q$)
  * Outer products ($v k^T$)
  * Recurrent matrix state updates ($S_t = \lambda S_{t-1} + v_t k_t^T$)
  * Basic neural-network concepts

---

## 3. Learning Objectives

After completing this interactive experiment, the learner will be able to:
1. **Explain** how a linear fast-weight state stores key-value associations through outer products.
2. **Explain** why overlapping keys create cross-talk contamination during matrix readout.
3. **Predict** how controlled key overlap ($\rho$) changes target signal vs. non-target contributions.
4. **Distinguish** ground-truth signal from non-target linear contributions algebraically.
5. **Explain** the conceptual connection to BDH's sparse-positive synaptic plasticity framing.
6. **Identify** at least one limitation of the simplified synthetic finite-dimensional experiment.

---

## 4. The 60-Second Primary Learning Journey

The application opens with a baseline preset already computed and running ($d=8, N=4, \rho=0.00, \lambda=1.00$). The learner progresses through a single continuous 7-step investigation:

* **01 / SEE THE MEMORY:** Inspect the already-running fixed-size state matrix $S_t \in \mathbb{R}^{d \times d}$ storing outer-product associations.
* **02 / ASK THE MEMORY:** Query with default stored key $q = k_1$. Observe Ground Truth ($v_1$) beside Retrieved ($y_t = S_t q$) with Cosine Similarity, Raw $L_2$ Error, and ISR.
* **03 / CHANGE ONE THING:** A prominent single control for Controlled Key Overlap ($\rho$). Increasing $\rho$ ($0 \to 0.2 \to 0.45 \to 0.70$) immediately updates the Gram matrix and retrieval output.
* **04 / SEE CROSS-TALK:** The central mathematical "aha!" moment:
  $$\text{Retrieved Output } y_t = \underbrace{\lambda^{t-j} \eta v_j (k_j^T q_j)}_{\text{Target Signal}} + \underbrace{\sum_{i \ne j} \lambda^{t-i} \eta v_i (k_i^T q_j)}_{\text{Cross-Talk Interference}}$$
  *Because the query is similar to keys other than the target key, those stored associations also contribute to the readout.* Verified with exact float64 equality in linear mode.
* **05 / PUSH MEMORY LOAD:** Empirical stress test across the dimensionless load ratio $\gamma = N/d$ on a live SVG chart.
* **06 / CONNECT TO BDH:** Conceptual bridge from continuous dense linear superposition to Dragon Hatchling (BDH) sparse positive plasticity `[TEACHING ABSTRACTION]`.
* **07 / EXPLORE YOURSELF:** Full sandbox controls unlocked ($d, N, \rho, \lambda$) operating on the same underlying state.

---

## 5. Computational Substrate Classification

* **LIVE:** Exact recurrence updates, memory state evaluation, query readout, Gram matrix computation, algebraic decomposition, and parameter sweeps run live in-browser (<15 ms).
* **SYNTHETIC:** Generated isotropic Gaussian keys and values with controlled shared-component correlation parameter $\rho$.
* **PRECOMPUTED:** Reference statistical benchmark distributions across repeated trials exported by `generate_experiment_data.py`.
* **TEACHING ABSTRACTION:** BDH-inspired sparse positive projection ($\text{ReLU}/\text{Top-K}$) used as a single-layer visual demonstration model, not a reproduction of the complete multi-layer BDH architecture.

---

## 6. Primary Literature Grounding

1. **Dragon Hatchling (BDH):**  
   Adrian Kosowski, Przemysław Uznański, Jan Chorowski, Zuzanna Stamirowska, Michał Bartoszkiewicz (2025).  
   *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain.*  
   [arXiv:2509.26507](https://arxiv.org/abs/2509.26507).
2. **BDH-CQ (Continuous Query & In-Context Latent Reasoning):**  
   Björn Engdahl, Adrian Kosowski, Jan Chorowski, Zuzanna Stamirowska, Przemysław Uznański, et al. (2026).  
   *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning.*  
   [arXiv:2608.09888](https://arxiv.org/abs/2608.09888).
3. **Linear Attention & Fast-Weight Recurrence Duality:**  
   Imanol Schlag, Kazuki Irie, Jürgen Schmidhuber (2021).  
   *Linear Transformers Are Secretly Fast Weight Programmers.*  
   ICML 2021. [arXiv:2102.11174](https://arxiv.org/abs/2102.11174).

---

## 7. Project Structure

```
├── src/
│   ├── app/                      # Next.js 15 App Router & 7-Step Canvas
│   ├── components/
│   │   ├── visualization/        # Heatmaps (Memory Matrix S_t, Gram Matrix G)
│   │   ├── experiment/           # Dual Readout, Retrieval Decomposition (Step 04), Control Panel, Stress Test
│   │   ├── education/            # Guided Flow, Research Notebook
│   │   ├── equations/            # Interactive Mathematical Inspector
│   │   ├── bdh/                  # BDH Comparison Explorer [Teaching Abstraction]
│   │   └── ui/                   # Editorial Header & Status
│   └── lib/                      # Vectorized Math Engine, Presets, Types
├── experiments/                  # Verified Python Numerical Substrate
│   ├── associative_memory.py     # Fast-weight memory & key generator
│   ├── verify_recurrence.py      # Numerical float64 equivalence tests (125 sweeps)
│   ├── generate_experiment_data.py # Reference dataset exporter
│   └── test_math.py              # Automated unit test suite (6 tests)
├── data/                         # Benchmark datasets (JSON)
├── CONCEPT_LOCK.md               # Scientific boundary document
├── BLOG_POST.md                  # Comprehensive educational paper
├── AI_DISCLOSURE.md              # AI assistance & transparency disclosure
└── PATHWAY_STRATEGY.md           # Defense playbook & alignment matrix
```

---

## 8. Numerical Verification & Testing

Run all automated Python tests and equivalence verifications:
```bash
# Run unit tests
python -m unittest discover -s experiments

# Run numerical equivalence tests (Recurrence vs Linear Attention)
python experiments/verify_recurrence.py
```

Run interactive web application:
```bash
npm run dev
# Open http://localhost:3000
```
