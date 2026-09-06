# Research Map: Formal Theorems, Empirical Evidence & Primary Sources (2022–2026)

This document establishes the scientific grounding for the project, categorizing every claim, formal derivation, published benchmark, and toy experiment simplification.

---

## 1. Primary Research Matrix

| Claim / Mechanism | Primary Source | Venue / Year | Evidence Level | Exact Mathematical Formulation | Role in Project |
|---|---|---|---|---|---|
| **1. Linear Attention $\equiv$ Fast Weight Memory** | Schlag, Irie, Schmidhuber | ICML 2021 | Formal Result & Empirical Proof | $S_t = \lambda S_{t-1} + v_t k_t^T$, $\text{Read} = S_t q_t$ | Foundational duality derivation |
| **2. Recurrent State Algebraic Rank Bound** | Standard Linear Algebra | Linear Algebra Property | Exact Matrix Bound | $\text{Rank}(S_t) \le d$ for $S_t \in \mathbb{R}^{d \times d}$ | Geometric bound on state subspace |
| **3. Test-Time Parameter Update as Memory** | Sun et al. (*TTT / Test-Time Training*) | arXiv:2407.04620 (2024) | Published Experiment | $\theta_t = \theta_{t-1} - \eta \nabla \ell(\theta_{t-1}; x_t)$ | Fast Weight vs Test-Time Weight Adaptation |
| **4. Selective State-Space Gating vs Recurrence** | Gu & Dao (*Mamba*) | arXiv:2312.00752 (2023) | Published Experiment | $h_t = (I - \Delta_t A) h_{t-1} + \Delta_t B_t x_t$ | Comparison baseline in Sandbox |
| **5. Sparse Synaptic Plasticity** | Kosowski et al. (*Dragon Hatchling / BDH*) | arXiv:2509.26507 (2025) | Published Pre-print | $a_t \ge 0$, local synaptic updates | BDH Research Connection & Toy Abstraction |
| **6. Latent Demonstration Reasoning** | Engdahl et al. (*BDH-CQ*) | arXiv:2608.09888 (2026) | Published Pre-print | In-context learning via recurrent latent reasoning | BDH-CQ Contextual Extension |

---

## 2. Evidence Categorization Legend

* `[FORMAL THEOREM]`: Mathematically proven algebraic identities (e.g., matrix rank bounds, exact causal recurrence decomposition).
* `[PUBLISHED EXPERIMENT]`: Empirically validated on benchmarks in primary literature (e.g., Mamba, xLSTM, TTT, BDH).
* `[OUR LIVE SUBSTRATE]`: Real-time mathematical simulation running inside the user's browser via deterministic vectorized linear algebra.
* `[BDH-INSPIRED TEACHING ABSTRACTION]`: A single-layer ReLU/Top-K toy model used for visual geometric intuition; not the complete multi-layer BDH architecture.

---

## 3. Disclosed Limitations & Boundary Conditions
1. **Dimensionless Memory Load Diagnostic ($N/d$):** We use $N/d$ as a dimensionless memory-load diagnostic and empirically measure retrieval behavior under the specified synthetic key distribution. These experiments do not establish a universal $N/d$ scaling law across arbitrary structured data manifolds.
2. **Softmax vs Linear Attention:** Standard Softmax Attention ($O(N^2)$) does not compress state into a fixed-size matrix, storing all history at the cost of quadratic compute and growing KV memory.
3. **Synthetic Diagnostic Task:** We utilize synthetic key-value associative pairs to isolate associative memory interference cleanly from language modeling perplexity.
