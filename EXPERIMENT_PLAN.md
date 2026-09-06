# Computational Substrate & Experiment Architecture Plan

## 1. Objectives of the Computational Substrate
The experiment is NOT a mock UI or cosmetic animation. It is an exact, vectorized linear algebraic simulation of:
1. **Classical Linear Attention / Fast-Weight Outer-Product Accumulation**
2. **Key Interference Dynamics ($\rho$-controlled Gram Matrix)**
3. **Multi-Query Associative Recall (MQAR) Retrieval Protocol**
4. **BDH Sparse Positive Rectified Synaptic Updates**

---

## 2. Mathematical State Engine Architecture

### Pipeline:
$$\text{Input Tokens } \{x_1, \dots, x_N\} \xrightarrow{\text{Projection}} \{(k_1, v_1), \dots, (k_N, v_N)\} \xrightarrow{\text{State Update}} S_t \xrightarrow{\text{Query } q} \hat{v} \xrightarrow{\text{Comparison}} (v_{\text{truth}}, \hat{v}, \text{Error})$$

### State Update Equations:
1. **Linear Attention / Fast-Weight Recurrence:**
   $$S_0 = \mathbf{0}_{d \times d}$$
   $$S_t = \lambda S_{t-1} + v_t k_t^T$$
   $$\text{Prediction at Query } q_m: \quad \hat{v}_m = S_t q_m$$

2. **Orthogonality & Correlation Parameterization:**
   Given base orthogonal basis vectors $\{e_1, \dots, e_d\}$, synthetic key vectors are parameterized by correlation $\rho \in [0, 1]$:
   $$k_i = \sqrt{1 - \rho} \, e_i + \sqrt{\rho} \, u_0$$
   where $u_0$ is a shared interference direction ($\|u_0\|=1, u_0 \perp e_i$).
   * When $\rho = 0$, $k_i^T k_j = 0$ (orthogonal construction for $N \le d$).
   * When $\rho > 0$, $\rho$ controls the shared component of the synthetic key distribution; observed pairwise cosine similarity varies around this setting.

3. **Exact Error Metric:**
   $$\text{Cosine Error} = 1 - \frac{\hat{v}_m \cdot v_m}{\|\hat{v}_m\| \|v_m\|}$$
   $$\text{L2 Reconstruction Error} = \|\hat{v}_m - v_m\|_2^2$$
   $$\text{Interference-to-Signal Ratio (ISR)} = \frac{\sum_{i \ne m} |k_i^T k_m|}{\|k_m\|^2}$$

4. **BDH Sparse Plasticity Update Engine:**
   $$S_t^{\text{BDH}} = \text{TopK}\left(\lambda S_{t-1}^{\text{BDH}} + \eta \cdot \text{ReLU}(v_t) \text{ReLU}(k_t)^T, \; K\right)$$

---

## 3. The 4 Benchmark Presets

| Preset | Parameters | Observed Behavior | Scientific Lesson |
|---|---|---|---|
| **01. Orthogonal Baseline** | $N=4, d=8, \rho=0.0, \lambda=1.0$ | $\text{Error} = 0.000$, clean retrieval | With orthogonal keys, memory retrieval has zero cross-talk for $N \le d$. |
| **02. Key Interference** | $N=4, d=8, \rho=0.45, \lambda=1.0$ | Observed $\text{Error} > 0.0$, noisy output vector | Non-orthogonal keys bleed value components across memory slots. |
| **03. High-Load Stress Case** | $N=12, d=8, \rho=0.45, \lambda=1.0$ | Observed higher $\text{Error}$ | When $N > d$ and keys correlate, additive cross-talk degrades output. |
| **04. BDH Sparse Plasticity** | $N=12, d=8, \rho=0.45, \text{BDH}=\text{True}$ | Altered cross-talk in toy model | Non-negative sparse activations change off-diagonal interference patterns in this teaching abstraction. |

---

## 4. Verification & Testing Strategy
* `/experiments/verify_engine.py`: A Python verification script asserting the mathematical identity between sequential recurrence and batch linear attention, outputting JSON verification vectors.
* Deterministic unit tests ensuring identical numerical outputs across Python reference and TypeScript client engine ($<10^{-6}$ float tolerance).
