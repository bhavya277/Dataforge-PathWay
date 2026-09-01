# Associative Memory & Linear Recurrence in Fast-Weight Architectures
### DataForge × Pathway 2026 Hackathon Submission (Explain the Frontier Track)

---

## 1. Executive Summary & Central Claim

This research learning platform investigates the fundamental trade-off of **linear recurrent state compression** in Post-Transformer architectures (Linear Attention, RWKV, RetNet, Mamba, xLSTM, and Dragon Hatchling / BDH).

### The Central Falsifiable Claim
> **"In a linear fast-weight associative memory, retrieving one stored value also receives contributions from other stored key-value pairs; increasing key similarity or memory load therefore increases interference under the stated retrieval setup."**

---

## 2. Intended Learner & Learning Objectives
* **Intended Audience:** ML researchers, AI systems engineers, and students familiar with matrix multiplication and standard attention ($QK^T V$).
* **Prerequisites:** Matrix outer products ($v k^T$), vector dot products, basic linear algebra.
* **Core Learning Objectives:**
  1. Derive the mathematical equivalence between un-normalized linear attention and recurrent fast-weight updates.
  2. Directly visualize the $d \times d$ recurrent memory matrix $S_t$ mutating live token-by-token.
  3. Observe the causal progression from **Key Correlation ($\rho$) $\to$ Off-Diagonal Gram Elements $\to$ Cross-Talk Contamination $\to$ Retrieval Failure**.
  4. Understand why Dragon Hatchling (BDH) utilizes **non-negative sparse positive activations** and **monosemantic synapses** to suppress polysemantic superposition.

---

## 3. Mathematical Mechanism

### State Update (Outer-Product Accumulation)
$$S_0 = \mathbf{0}_{d \times d}$$
$$S_t = \lambda S_{t-1} + v_t k_t^T = \sum_{i=1}^t \lambda^{t-i} v_i k_i^T$$

### Retrieval Decomposition
For query $q_j = k_j$:
$$y_j = S_t q_j = \underbrace{v_j (k_j^T q_j)}_{\text{Target Signal}} + \underbrace{\sum_{i \ne j} v_i (k_i^T q_j)}_{\text{Cross-Talk Interference}}$$

When keys are mutually orthonormal ($k_i^T k_j = 0$ for $i \ne j$), the interference term is identically zero. When keys correlate ($\rho > 0$) or when memory load exceeds rank capacity ($N > d$), off-diagonal interference terms contaminate the output vector.

---

## 4. Scientific Honesty: Computation & Evidence Classification

| Component | Status / Mode | Technical Description |
|---|---|---|
| **Interactive Research Lab** | `LIVE COMPUTATION` | Real-time vectorized linear algebra running client-side in TypeScript ($<5$ms execution per slider move). |
| **Statistical Sweeps** | `PRECOMPUTED BENCHMARK` | 50 Monte Carlo trials per step across $\rho, N, d$ generated using `/experiments/interference_sweep.py`. |
| **Dimension Scaling** | `TEACHING SIMPLIFICATION` | Low-dimensional states ($d \in [4, 16]$) used to make individual matrix cells visible, while preserving scale-invariant cross-talk dynamics. |

---

## 5. Dragon Hatchling (BDH) & BDH-CQ Integration

### BDH Monosemantic Synaptic Plasticity
Dragon Hatchling (Pathway, 2024–2025) directly resolves the linear cross-talk bottleneck by enforcing:
$$W_t = \text{TopK}\left(\lambda W_{t-1} + \eta \cdot \text{ReLU}(v_t) \text{ReLU}(k_t)^T\right)$$
Because non-negative sparse representations in high dimensions have quasi-disjoint supports ($\text{supp}(k_i) \cap \text{supp}(k_j) \approx \emptyset$), cross-talk inner products $k_i^T k_j \to 0$ are suppressed by geometric construction.

### BDH-CQ (Continuous Query)
BDH-CQ performs in-context demonstration reasoning by writing dynamic transformation operators directly into synaptic weights during context intake, evaluating multi-step reasoning in a single latent forward pass without autoregressive chain-of-thought tokens.

---

## 6. Primary Research Bibliography (2022–2026)
1. **Schlag, I., Irie, K., & Schmidhuber, J. (2021).** *Linear Transformers Are Secretly Fast Weight Programmers.* ICML.
2. **Beck, M., et al. (2024).** *xLSTM: Extended Long Short-Term Memory.* NeurIPS.
3. **Gu, A., & Dao, T. (2023).** *Mamba: Linear-Time Sequence Modeling with Selective State Spaces.* arXiv.
4. **Sun, Y., et al. (2024).** *Learning to (Learn at Test Time): RNNs with Expressive Hidden States (TTT).* arXiv.
5. **Pathway Research Team (2024–2025).** *Dragon Hatchling (BDH) & BDH-CQ Architectural Reports.*

---

## 7. Reproduction Instructions

### Python Scientific Substrate
```bash
# 1. Run the automated test suite
python -m unittest discover -s experiments

# 2. Verify recurrence vs linear attention equivalence
python experiments/verify_recurrence.py

# 3. Generate benchmark sweeps
python experiments/generate_experiment_data.py
```

### Interactive Web Application
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build production bundle
npm run build
```

---

## 8. Disclosures & Licensing
* **AI Disclosure:** See [AI_DISCLOSURE.md](AI_DISCLOSURE.md) for transparent details on AI tooling and assistance.
* **License:** Open-sourced under the MIT License. See [LICENSES.md](LICENSES.md).
