# One-Page Concept Summary: Associative Memory Under Key Interference
## DataForge × Pathway 2026 Submission

---

### 1. Concept
An associative memory stores key-value pairs $(k_i, v_i)$ such that query $q \approx k_j$ retrieves $y \approx v_j$. In linear fast-weight recurrence—the recurrent dual of linear attention—associations accumulate into a fixed-size matrix $S_t \in \mathbb{R}^{d \times d}$ via outer products $v_t k_t^T$ instead of an expanding token cache.

---

### 2. Central Claim
> **"When stored keys are not orthogonal, a linear fast-weight state adds non-target contributions to retrieval; in our synthetic setup, increasing controlled key overlap increases measured cross-talk."**

*Classification:* Exact derivation for linear decomposition `[MATHEMATICAL FACT]`; empirical scaling under controlled key overlap $\rho$ `[SYNTHETIC EXPERIMENT / EMPIRICAL OBSERVATION]`.

---

### 3. Why It Matters
Recurrent models replace $O(N)$ token caches with $O(1)$ states for constant inference latency. However, fixed states store continuous superpositions without softmax routing; retrieving one item superimposes non-target items. Understanding cross-talk geometry is essential to analyzing capacity bounds in non-transformer recurrent networks.

---

### 4. Mechanism
For sequence length $t$, dimension $d$, retention factor $\lambda \in (0, 1]$, and learning rate $\eta$:

$$S_t = \lambda S_{t-1} + \eta v_t k_t^T = \sum_{i=1}^t \lambda^{t-i} \eta v_i k_i^T \quad \in \mathbb{R}^{d \times d} \quad \text{[MATHEMATICAL FACT]}$$

When queried with key $q = k_j$, linear readout $y_t = S_t q$ decomposes into:

$$y_t = \underbrace{\lambda^{t-j} \eta v_j (k_j^T q_j)}_{\text{Target Signal}} + \underbrace{\sum_{i \ne j} \lambda^{t-i} \eta v_i (k_i^T q_j)}_{\text{Cross-Talk Interference}} \quad \text{[MATHEMATICAL FACT]}$$

When keys are orthonormal ($k_i^T k_j = 0$ for $i \ne j$), cross-talk vanishes and retrieval is exact. When keys overlap ($k_i^T q \ne 0$), non-target associations bleed additively into the readout.

---

### 5. What the Learner Controls
The interactive substrate provides live control of 4 variables:
* **$d$ (Dimension, $4 \le d \le 16$):** Vector dimension; sets rank bound $\text{Rank}(S_t) \le d$.
* **$N$ (Stored Associations, $2 \le N \le 16$):** Sequence length; sets load ratio $\gamma = N/d$.
* **$\rho$ (Key Correlation, $0.0 \le \rho \le 0.8$):** Shared-component alignment across keys.
* **$\lambda$ (Retention Factor, $0.5 \le \lambda \le 1.0$):** Recurrent temporal decay factor.

---

### 6. What the Experiment Demonstrates
* **Baseline ($\rho = 0.0, N = 4, d = 8, \lambda = 1.0$):** Cosine similarity $= 1.0000$, $L_2$ error $= 0.0000$, ISR $= 0.000$.
* **Controlled Overlap ($\rho = 0.45, N = 4, d = 8$):** Off-diagonal Gram entries produce cross-talk, reducing mean cosine similarity to $\approx 0.84$.
* **Empirical Load Stress ($\gamma = N/d > 1$):** Because at most $d$ vectors can be orthogonal in $\mathbb{R}^d$, higher load ratios correlate with higher cross-talk under isotropic Gaussian sampling `[EMPIRICAL OBSERVATION]`.

---

### 7. Representative Recent Systems
* **Schlag et al. (ICML 2021):** Linear attention equivalence to fast-weight recurrent state update.
* **Gu & Dao (2023):** Mamba selective state spaces with input-dependent decay.
* **Beck et al. (NeurIPS 2024):** xLSTM matrix memory cells ($s_t = s_{t-1} + v_t k_t^T$).
* **Sun et al. (2024):** TTT recurrent states updated by test-time gradient descent.
* **Kosowski et al. (2025):** BDH non-negative sparse activations and local synaptic plasticity.
* **Engdahl et al. (2026):** BDH-CQ in-context reasoning via recurrent latent computation.

---

### 8. Comparison Table

| Architecture | Memory Footprint | Retrieval Routing | Cross-Talk Invariant | Capacity Constraint |
|---|---|---|---|---|
| **Transformer (Softmax)** | $O(N \cdot d)$ (Expanding) | Non-linear softmax | Suppressed exponentially | KV cache bandwidth |
| **Linear Fast Weights** | $O(d^2)$ (Fixed matrix) | Linear readout $y = S q$ | Exact: Signal $+$ Cross-talk | Rank bound $\text{Rank}(S) \le d$ |
| **xLSTM (mLSTM)** | $O(d^2)$ (Matrix cell) | Gated matrix readout | Normalizer stabilizes scale | Finite state saturation |
| **BDH Teaching Model** | $O(d^2)$ (Sparse non-negative) | Sparse matrix readout | Top-K breaks linear sum | Sparse packing capacity |

---

### 9. BDH / BDH-CQ Connection
* **The Concept:** Standard fast weights superimpose unconstrained continuous vectors. Dragon Hatchling (**BDH**; Kosowski et al., 2025) explores non-negative sparse activations ($a \ge 0$) and local synaptic plasticity.
* **Teaching Abstraction:** Our single-layer model applies $\text{ReLU}(v)\text{ReLU}(k)^T$ and Top-K connection gating to illustrate how sparse positive supports reduce overlapping interactions.
* **Pedagogical Boundary:** Explicitly labeled as a **teaching abstraction**, not full BDH. BDH-CQ (Engdahl et al., 2026) provides context for demonstration reasoning without verbal tokens.

---

### 10. Limitations
1. **Synthetic Keys:** Isotropic Gaussian sampling; real tokens lie on structured linguistic manifolds.
2. **Toy Scale:** State dimension $d \in [4, 16]$ enables browser inspection, but lacks the depth of production LLMs ($d \ge 2048$).
3. **No Learned Projections:** Evaluated directly without trained projection matrices ($W_Q, W_K, W_V$).
4. **Diagnostic, Not Theorem:** $N/d$ is an empirical diagnostic for finite-state saturation, not a universal theorem.

---

### 11. Evidence Classification
* **`[MATHEMATICAL FACT]`**: Recurrence $S_t$; exact decomposition $y_t = \text{Target} + \sum \text{Cross-talk}$; rank bound $\le d$.
* **`[LIVE EXPERIMENT]`**: Vectorized in-browser Float64 matrix updates and Gram matrix evaluation (<15 ms).
* **`[SYNTHETIC EXPERIMENT]`**: Key/value vectors generated via pseudo-random isotropic sampling with correlation $\rho$.
* **`[EMPIRICAL OBSERVATION]`**: Degradation curves observed across parameter sweeps in this synthetic setup.
* **`[RESEARCH INTERPRETATION]`**: Parallels between fast weights, linear transformers, and state spaces.
* **`[TEACHING ABSTRACTION]`**: BDH single-layer sparse-plasticity toy model with Top-K pruning.

---

### 12. Primary Sources
1. Kosowski et al. (2025). *The Dragon Hatchling.* arXiv:2509.26507.
2. Engdahl et al. (2026). *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning.* arXiv:2608.09888.
3. Schlag, Irie, & Schmidhuber (2021). *Linear Transformers Are Secretly Fast Weight Programmers.* ICML.
4. Beck et al. (2024). *xLSTM: Extended Long Short-Term Memory.* NeurIPS.
5. Gu & Dao (2023). *Mamba: Linear-Time Sequence Modeling.* arXiv:2312.00752.
6. Sun et al. (2024). *Learning to (Learn at Test Time).* arXiv:2407.04620.
