# One-Page Concept Summary: Associative Memory Under Key Interference
## DataForge × Pathway 2026 Submission

---

### 1. Concept
An associative memory stores key-value pairs $(k_i, v_i)$ such that presenting query $q \approx k_j$ retrieves value $y \approx v_j$. In linear fast-weight recurrence—the recurrent dual of un-softmaxed linear attention—associations are accumulated into a fixed-size state matrix $S_t \in \mathbb{R}^{d \times d}$ via outer products $v_t k_t^T$ rather than an expanding key-value cache.

---

### 2. Central Claim
> **"When stored keys are not orthogonal, a linear fast-weight state adds non-target contributions to retrieval; in our synthetic setup, increasing controlled key overlap increases measured cross-talk."**

*Classification:* Exact analytical derivation for the linear decomposition `[MATHEMATICAL FACT]`; empirical scaling behavior under controlled key overlap $\rho$ `[SYNTHETIC EXPERIMENT / EMPIRICAL OBSERVATION]`.

---

### 3. Why It Matters
Modern sequence architectures (linear transformers, recurrent state spaces, test-time training) replace $O(N)$ token caches with $O(1)$ fixed-size recurrent states to achieve constant inference latency. However, because fixed states store continuous superpositions without nonlinear softmax routing, retrieving one item algebraically superimposes contributions from other stored items. Understanding the geometry of cross-talk is fundamental to understanding capacity tradeoffs in non-transformer recurrent neural models.

---

### 4. Mechanism
For sequence length $t$, state dimension $d$, retention factor $\lambda \in (0, 1]$, and learning rate $\eta$:

$$S_t = \lambda S_{t-1} + \eta v_t k_t^T = \sum_{i=1}^t \lambda^{t-i} \eta v_i k_i^T \quad \in \mathbb{R}^{d \times d} \quad \text{[MATHEMATICAL FACT]}$$

When queried with key $q = k_j$, linear readout $y_t = S_t q$ decomposes exactly into:

$$y_t = \underbrace{\lambda^{t-j} \eta v_j (k_j^T q_j)}_{\text{Target Signal Component}} + \underbrace{\sum_{i \ne j} \lambda^{t-i} \eta v_i (k_i^T q_j)}_{\text{Cross-Talk Interference Component}} \quad \text{[MATHEMATICAL FACT]}$$

When stored keys are mutually orthonormal ($k_i^T k_j = 0$ for $i \ne j$), the cross-talk sum evaluates to zero and retrieval is exact. When keys overlap ($k_i^T q \ne 0$), non-target memories bleed additively into the output vector.

---

### 5. What the Learner Controls
The interactive substrate allows live manipulation of 4 conceptual variables:
* **$d$ (State Dimension, $4 \le d \le 16$):** Dimensionality of keys and values; sets algebraic rank upper bound $\text{Rank}(S_t) \le d$.
* **$N$ (Stored Associations, $2 \le N \le 16$):** Sequence length; determines dimensionless memory load ratio $\gamma = N/d$.
* **$\rho$ (Controlled Key Correlation, $0.0 \le \rho \le 0.8$):** Controls shared-component alignment across synthetic keys.
* **$\lambda$ (Retention Factor, $0.5 \le \lambda \le 1.0$):** Recurrent temporal decay discount.

---

### 6. What the Experiment Demonstrates
* **Baseline ($\rho = 0.0, N = 4, d = 8, \lambda = 1.0$):** Cosine similarity $= 1.0000$, $L_2$ error $= 0.0000$, interference-to-signal ratio (ISR) $= 0.000$.
* **Controlled Overlap ($\rho = 0.45, N = 4, d = 8$):** Non-zero off-diagonal Gram matrix elements produce measured cross-talk, reducing mean cosine similarity to $\approx 0.84$ under this synthetic distribution.
* **Empirical Load Stress ($\gamma = N/d > 1$):** Because at most $d$ vectors can be mutually orthogonal in $\mathbb{R}^d$, higher load ratios are associated with higher measured cross-talk under isotropic Gaussian sampling `[EMPIRICAL OBSERVATION]`.

---

### 7. Representative Recent Systems & Papers
* **Schlag, Irie, & Schmidhuber (ICML 2021):** Proved un-softmaxed linear attention is mathematically equivalent to fast-weight recurrent state update.
* **Gu & Dao (2023) — Mamba:** Selective structured state-space sequence modeling with continuous recurrent states.
* **Beck et al. (NeurIPS 2024) — xLSTM:** Extended LSTM introducing matrix memory cells ($s_t = s_{t-1} + v_t k_t^T$) with covariance-like storage.
* **Sun et al. (2024) — Test-Time Training (TTT):** Formulates recurrent hidden states as linear models updated by online gradient descent.
* **Kosowski et al. (2025) — The Dragon Hatchling (BDH):** Biologically-grounded architecture with non-negative sparse activations and local synaptic plasticity.
* **Engdahl et al. (2026) — BDH-CQ:** In-context demonstration reasoning via recurrent latent computation.

---

### 8. Comparison Table

| Architecture | Memory State Footprint | Retrieval Routing | Cross-Talk Invariant | Primary Capacity Constraint |
|---|---|---|---|---|
| **Transformer (Softmax KV)** | $O(N \cdot d)$ (Expanding) | Non-linear $\text{softmax}(Q K^T / \sqrt{d})$ | Cross-talk suppressed exponentially | KV cache memory bandwidth |
| **Linear Fast Weights** | $O(d^2)$ (Fixed $S \in \mathbb{R}^{d \times d}$) | Linear matrix-vector $y = S q$ | Exact algebraic decomposition: Signal $+$ Cross-talk | Matrix rank bound $\text{Rank}(S) \le d$ |
| **xLSTM (mLSTM cell)** | $O(d^2)$ (Matrix state $C_t$) | Gated matrix readout with normalization | Normalizer stabilizes state magnitude | Finite dimensional state saturation |
| **BDH Teaching Abstraction** | $O(d^2)$ (Sparse non-negative) | Sparse positive matrix readout | Nonlinear Top-K breaks exact linear sum | Sparse support packing capacity |

---

### 9. BDH / BDH-CQ Connection
* **The Concept:** Standard linear fast weights superimpose unconstrained continuous vectors. Dragon Hatchling (**BDH**; Kosowski et al., 2025) explores a brain-inspired alternative where activations are strictly non-negative and sparse ($a \ge 0$), and connections are updated through local synaptic plasticity.
* **Our Teaching Abstraction:** We provide a single-layer toy model applying $\text{ReLU}(v)\text{ReLU}(k)^T$ and Top-K connection gating. Under suitable sparse-support regimes, restricting active interactions reduces overlapping connections compared to dense linear superposition.
* **Pedagogical Boundary:** Our module is explicitly a **teaching abstraction**, not a reproduction of the multi-layer BDH architecture. BDH-CQ (Engdahl et al., 2026) is cited as research context for demonstration-driven recurrent reasoning without explicit verbal tokens.

---

### 10. Limitations
1. **Synthetic Key Distribution:** Synthetic keys use controlled shared-component Gaussian vectors; real linguistic token representations lie on structured, non-uniform data manifolds.
2. **Single-Layer Toy Scale:** State dimension $d \in [4, 16]$ allows real-time cell inspection in browser, but lacks the multi-head, multi-layer depth of production models ($d \ge 2048$).
3. **No Learned Projections:** Keys and values are evaluated directly without trained query/key/value projection weight matrices.
4. **Diagnostic, Not Theorem:** $N/d$ is an empirical memory-load diagnostic for finite-state saturation, not a universal capacity theorem for arbitrary neural architectures.

---

### 11. Evidence Classification
* **`[MATHEMATICAL FACT]`**: Exact recurrence $S_t = \sum \lambda^{t-i} \eta v_i k_i^T$; exact decomposition $y_t = \text{Target} + \sum_{i \ne j} \text{Cross-talk}$; rank bound $\text{Rank}(S) \le d$.
* **`[LIVE EXPERIMENT]`**: Vectorized in-browser Float64 matrix updates, query retrieval, and Gram matrix evaluation computed on each interaction ($<15$ ms).
* **`[SYNTHETIC EXPERIMENT]`**: Keys and values generated via deterministic pseudo-random isotropic sampling with controlled correlation $\rho$.
* **`[EMPIRICAL OBSERVATION]`**: Degradation curves observed across $(N, d, \rho, \lambda)$ sweeps in this synthetic setup.
* **`[RESEARCH INTERPRETATION]`**: Parallels between linear fast weights, linear transformers, and recurrent state spaces.
* **`[TEACHING ABSTRACTION]`**: BDH single-layer sparse-plasticity toy model with Top-K pruning.

---

### 12. Primary Sources
1. Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M. (2025). *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain.* arXiv:2509.26507.
2. Engdahl, B., Kosowski, A., Chorowski, J., Stamirowska, Z., Uznański, P., et al. (2026). *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning.* arXiv:2608.09888.
3. Schlag, I., Irie, K., & Schmidhuber, J. (2021). *Linear Transformers Are Secretly Fast Weight Programmers.* ICML 2021. arXiv:2102.11174.
4. Beck, M., et al. (2024). *xLSTM: Extended Long Short-Term Memory.* NeurIPS 2024. arXiv:2405.04517.
5. Gu, A., & Dao, T. (2023). *Mamba: Linear-Time Sequence Modeling with Selective State Spaces.* arXiv:2312.00752.
6. Sun, Y., et al. (2024). *Learning to (Learn at Test Time): RNNs with Expressive Hidden States (TTT).* arXiv:2407.04620.
