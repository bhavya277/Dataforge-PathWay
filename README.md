# DataForge × Pathway 2026: Associative Memory & Linear Recurrence in Fast-Weight Architectures

An interactive frontier AI research explainer and in-browser computational substrate exploring associative memory recall, non-orthogonal token interference, temporal forgetting decay, and sparse plasticity in linear fast-weight architectures.

---

## 1. Central Falsifiable Claim

> **"In a linear fast-weight associative memory, retrieving one stored value also receives contributions from other stored key-value pairs; increasing key similarity or memory load therefore increases interference under the stated retrieval setup."**

*(Note: Empirical degradation scaling with dimensionless load ratio $N/d$ is documented strictly as an empirical observation under isotropic Gaussian keys, not a universal theorem.)*

---

## 2. Core Mathematical Formulations

### Generalized Recurrent State Update
For sequence length $t$, embedding dimension $d$, retention factor $\lambda \in (0, 1]$, and learning rate $\eta$:
$$S_0 = 0 \in \mathbb{R}^{d \times d}$$
$$S_t = \lambda S_{t-1} + \eta \cdot (v_t k_t^T) = \sum_{i=1}^t \lambda^{t-i} \eta \cdot (v_i k_i^T)$$

*When $\lambda = 1.0$, temporal decay disappears and the recurrence reduces to cumulative outer-product memory.*

### Linear Query Readout & Causal Decomposition
For query vector $q_t = k_j$:
$$y_t = S_t q_t = \sum_{i=1}^t \lambda^{t-i} \eta \cdot v_i (k_i^T q_t)$$

Decomposing for target association $j$:
$$y_t = \underbrace{\lambda^{t-j} \eta \cdot v_j (k_j^T q_j)}_{\text{Target Signal Component}} + \underbrace{\sum_{i \ne j} \lambda^{t-i} \eta \cdot v_i (k_i^T q_j)}_{\text{Cross-Talk Interference}}$$

---

## 3. Dragon Hatchling (BDH) & BDH-CQ Connection

### Actual BDH Research Architecture
* **Non-Negative Sparse Activations:** Positive firing rates $a \ge 0$ driving monosemantic representations.
* **Synaptic Plasticity:** Hebbian-like local learning updates between interacting neuron particles.
* **Scale-Free Computation:** Bounded state footprints bypassing quadratic sequence self-attention.
* **BDH-CQ (Continuous Query):** Multi-step in-context reasoning from demonstrations without explicit text Chain-of-Thought (CoT).

### Our Teaching Abstraction `[TEACHING ABSTRACTION • NOT FULL BDH]`
* Single-layer non-negative ReLU projection and Top-K connection gating on state matrix $W_t \in \mathbb{R}^{d \times d}$.
* Designed to provide clear geometric intuition on how non-negative sparse supports suppress pairwise inner products ($k_i^T k_j \to 0$).

---

## 4. Project Structure

```
├── src/
│   ├── app/                      # Next.js 15 App Router & Research Canvas
│   ├── components/
│   │   ├── visualization/        # Heatmaps (Memory Matrix S_t, Gram Matrix G)
│   │   ├── experiment/           # Dual Readout, Control Panel, Stress Test
│   │   ├── education/            # 5-Chapter Guided Flow, Research Notebook
│   │   ├── equations/            # Interactive Mathematical Inspector
│   │   ├── bdh/                  # BDH & BDH-CQ Comparison Explorer
│   │   └── ui/                   # Research Instrument Header & Status
│   └── lib/                      # Vectorized Math Engine, Presets, Types
├── experiments/                  # Verified Python Numerical Substrate
│   ├── associative_memory.py     # Fast-weight memory & isotropic key generator
│   ├── verify_recurrence.py      # Numerical float64 equivalence tests
│   ├── interference_sweep.py     # Monte Carlo benchmark sweeps
│   ├── generate_experiment_data.py # Precomputed JSON exporter
│   └── test_math.py              # Automated unit test suite
├── data/                         # Benchmark datasets (JSON)
├── CONCEPT_LOCK.md               # Scientific boundary document
├── BLOG_POST.md                  # Comprehensive educational paper
└── PATHWAY_STRATEGY.md           # Defense playbook & alignment matrix
```

---

## 5. Numerical Verification & Testing

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
