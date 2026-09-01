# Evidence Classification & Boundary Discipline

This document classifies every claim and technical mechanism in our project according to strict scientific standards.

---

## 1. Classification Categories

| Category | Definition | Standard of Verification |
|---|---|---|
| `[FORMAL DERIVATION]` | Mathematically derived and proven directly from first principles. | Exact analytical proof and zero-discrepancy simulation. |
| `[PUBLISHED RESULT]` | Reported in peer-reviewed literature or official whitepapers. | Exact paper citation, year, and venue. |
| `[OUR EXPERIMENT]` | Measured empirically on our computational substrate. | Reproducible Python test suite & deterministic seed. |
| `[TEACHING SIMPLIFICATION]` | Scaled-down model or visualization aid to enhance intuition. | Explicitly declared dimensionality boundaries. |
| `[INTERPRETATION]` | Conceptual synthesis or qualitative commentary. | Marked as team interpretation, separate from proof. |

---

## 2. Statement-by-Statement Evidence Audit

1. **"Linear Attention without softmax can be rewritten step-by-step as a recurrent outer-product state update $S_t = S_{t-1} + v_t k_t^T$."**
   * **Classification:** `[FORMAL DERIVATION]` & `[PUBLISHED RESULT]`
   * **Citation:** Schlag et al., ICML 2021; Katharopoulos et al., ICML 2020.
   * **Verification:** Verified numerically in `/experiments/verify_recurrence.py` with error $< 10^{-12}$.

2. **"Retrieval from $S$ yields $y = v_{\text{target}} (k_{\text{target}}^T q) + \sum_{i \ne \text{target}} v_i (k_i^T q)$, where the second term represents cross-talk."**
   * **Classification:** `[FORMAL DERIVATION]`
   * **Verification:** Proven algebraically by linearity of matrix-vector multiplication; asserted in `/experiments/test_math.py`.

3. **"Increasing key correlation $\rho$ increases mean cross-talk magnitude and reduces associative recall cosine similarity."**
   * **Classification:** `[OUR EXPERIMENT]`
   * **Verification:** Sweep data across 50 trials per $\rho$ step generated in `data/experiment_benchmarks.json`.

4. **"Dragon Hatchling (BDH) utilizes sparse positive activations and local Hebbian synaptic updates during context processing."**
   * **Classification:** `[PUBLISHED RESULT]`
   * **Citation:** Pathway Technical Report (2024–2025).

5. **"Our 8-dimensional single-layer visualizer represents the core associative mechanism of recurrent fast weights."**
   * **Classification:** `[TEACHING SIMPLIFICATION]`
   * **Boundary Note:** Real production LLMs utilize multi-layer stacked blocks with $d \in [2048, 8192]$. We isolate the single-layer fast-weight update to make matrix cell activations visually inspectable.

6. **"BDH eliminates all memory interference."**
   * **Classification:** `[DISALLOWED CLAIM / FALSE PSEUDOSCIENCE]`
   * **Correction:** BDH significantly suppresses polysemantic cross-talk via non-negative sparsity and localized plasticity, but finite-dimensional capacity limits still apply under extreme load.
