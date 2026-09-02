# Architectural Connection: Fast-Weight Associative Memory to Dragon Hatchling (BDH) & BDH-CQ

---

## 1. Executive Summary

This document formalizes the theoretical bridge connecting our interactive linear associative memory substrate with Pathway's frontier **Dragon Hatchling (BDH)** and **BDH-CQ** architectures.

* **Standard Linear Fast Weights:** Accumulates continuous real-valued outer products into a dense state matrix $S_t = \lambda S_{t-1} + v_t k_t^T$. Under non-orthogonal keys ($\rho > 0$) or high memory load ($N > d$), off-diagonal dot products $k_i^T q$ contaminate retrieval with additive linear cross-talk noise.
* **BDH-Inspired Sparse Plasticity [TEACHING ABSTRACTION]:** Introduces non-negative sparse positive activations ($\text{ReLU}/\text{Top-K}$). In high dimensions, non-negative sparse vectors exhibit quasi-disjoint supports, driving cross-talk inner products $k_i^T k_j \to 0$ by geometric construction.
* **Actual Dragon Hatchling (BDH) Research:** Scale-free biologically-grounded neural substrate featuring locally interacting neuron particles, synaptic plasticity, and monosemantic circuits (Kosowski et al., 2025, arXiv:2509.26507).
* **BDH-CQ (Continuous Query):** In-context learning with recurrent latent reasoning directly from demonstration trajectories without explicit written Chain-of-Thought (CoT) (Engdahl et al., 2026, arXiv:2608.09888).

---

## 2. Mathematical Formulation Comparison

### Model A: Standard Linear Fast Weights (Continuous Superposition)
$$S_0 = 0 \in \mathbb{R}^{d \times d}$$
$$S_t = \lambda S_{t-1} + v_t k_t^T = \sum_{i=1}^t \lambda^{t-i} v_i k_i^T$$
$$y_t = S_t q_t = \underbrace{\lambda^{t-j} v_j (k_j^T q_j)}_{\text{Target Signal}} + \underbrace{\sum_{i \ne j} \lambda^{t-i} v_i (k_i^T q_j)}_{\text{Cross-Talk Interference}}$$

### Model B: BDH Sparse Plasticity [TEACHING ABSTRACTION]
$$W_t = \text{TopK}\left(\lambda W_{t-1} + \eta \cdot \text{ReLU}(v_t) \text{ReLU}(k_t)^T\right)$$

*(Note: Model B is a single-layer visual teaching abstraction used in this research lab to make sparse support separation visible. It is NOT the complete multi-layer BDH architecture).*

---

## 3. Literature Citations
1. **Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M. (2025).** *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain.* arXiv:2509.26507.
2. **Engdahl, B., Kosowski, A., Chorowski, J., Stamirowska, Z., Uznański, P., et al. (2026).** *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning.* arXiv:2608.09888.
3. **Schlag, I., Irie, K., & Schmidhuber, J. (2021).** *Linear Transformers Are Secretly Fast Weight Programmers.* ICML 2021. arXiv:2102.11174.
