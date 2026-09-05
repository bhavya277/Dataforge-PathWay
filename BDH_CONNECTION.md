# Architectural Connection: Fast-Weight Associative Memory to Dragon Hatchling (BDH) & BDH-CQ
## DataForge × Pathway 2026 Submission

---

## 1. Executive Summary & Distinction of Scope

This document formalizes the conceptual relationship connecting our interactive linear associative memory substrate with Pathway's frontier **Dragon Hatchling (BDH)** and **BDH-CQ** architectures.

To maintain strict scientific honesty, the project maintains a three-part boundary:

### A. What the Published Papers Actually Say
* **Dragon Hatchling (BDH):** Kosowski et al. (2025; arXiv:2509.26507) introduce a scale-free neural architecture featuring locally interacting neuron particles, non-negative sparse activations, and local synaptic plasticity. The paper investigates how sparse positive representations and local learning rules provide an alternative to standard Transformer self-attention. The paper does not claim that interference is mathematically impossible in all finite systems.
* **BDH-CQ:** Engdahl et al. (2026; arXiv:2608.09888) extend these concepts to in-context learning with recurrent latent reasoning, demonstrating that in-context demonstration pairs can update recurrent synaptic memory so queries can be solved through latent recurrent transformations without emitting explicit text Chain-of-Thought tokens.

### B. What This Project Demonstrates
* **Linear Fast-Weight Recurrence:** Accumulates real-valued outer products into a dense state matrix $S_t = \lambda S_{t-1} + v_t k_t^T$. Under non-orthogonal keys ($\rho > 0$) or higher synthetic memory load ($N > d$), off-diagonal dot products $k_i^T q$ contribute additive linear cross-talk noise during retrieval:
  $$y_t = S_t q = v_j (k_j^T q) + \sum_{i \ne j} v_i (k_i^T q)$$
* **Empirical Mechanism in Synthetic Setup:** As controlled key overlap $\rho$ increases or memory load increases in our synthetic configuration, measured cross-talk increases and retrieval fidelity degrades.

### C. What This Project Simplifies for Teaching
* **[BDH-INSPIRED TEACHING ABSTRACTION • NOT THE FULL BDH ARCHITECTURE]**
* This project does **NOT** implement the full multi-layer BDH architecture.
* This project does **NOT** implement full BDH-CQ latent reasoning loops.
* Instead, we implement a simplified single-layer teaching abstraction applying non-negative rectification $\text{ReLU}(v)\text{ReLU}(k)^T$ and Top-K connection gating:
  $$W_t = \text{TopK}\left(\lambda W_{t-1} + \eta \cdot \text{ReLU}(v_t)\text{ReLU}(k_t)^T\right)$$
  This allows learners to observe how restricting active supports can alter cross-talk patterns relative to dense continuous superposition.
* **Scientific Boundaries:**
  - We do *not* claim BDH "solves" the cross-talk problem.
  - We do *not* claim BDH "eliminates" interference.
  - We do *not* claim BDH "guarantees" monosemantic representations or disjoint supports.

---

## 2. Mathematical Formulation Comparison

### Model A: Standard Linear Fast Weights (Continuous Superposition)
$$S_0 = 0 \in \mathbb{R}^{d \times d}$$
$$S_t = \lambda S_{t-1} + v_t k_t^T = \sum_{i=1}^t \lambda^{t-i} v_i k_i^T$$
$$y_t = S_t q_t = \underbrace{\lambda^{t-j} v_j (k_j^T q_j)}_{\text{Target Signal}} + \underbrace{\sum_{i \ne j} \lambda^{t-i} v_i (k_i^T q_j)}_{\text{Cross-Talk Interference}}$$

### Model B: [BDH-INSPIRED TEACHING ABSTRACTION • NOT THE FULL BDH ARCHITECTURE]
$$W_t = \text{TopK}\left(\lambda W_{t-1} + \eta \cdot \text{ReLU}(v_t) \text{ReLU}(k_t)^T\right)$$

In this teaching abstraction, non-negative rectification zeroes negative outer-product components, and Top-K pruning retains only the strongest connections, allowing students to explore how sparse activation supports affect cross-talk accumulation.

---

## 3. Literature Citations

1. **Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M. (2025).** *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain.* arXiv:2509.26507.
2. **Engdahl, B., Kosowski, A., Chorowski, J., Stamirowska, Z., Uznański, P., et al. (2026).** *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning.* arXiv:2608.09888.
3. **Schlag, I., Irie, K., & Schmidhuber, J. (2021).** *Linear Transformers Are Secretly Fast Weight Programmers.* ICML 2021. arXiv:2102.11174.
