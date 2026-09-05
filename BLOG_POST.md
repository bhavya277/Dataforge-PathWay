# Associative Memory in Fast-Weight Architectures: The Geometry of Recurrent Interference

**Author:** DataForge × Pathway Research Team  
**Topic:** Associative Memory in Fast-Weight Architectures (Topic 2)  
**Word Count:** ~725 words  
**Target Reader:** Machine learning practitioners studying linear recurrent memory limits.

---

### The Bottleneck of Linear Recurrence

Autoregressive Transformers rely on Softmax Attention, which requires storing all past Key-Value (KV) vectors ($\mathcal{O}(N)$ memory per step). Over long sequences, this cache strains hardware memory bandwidth.

Linear recurrent models and fast-weight architectures (Schlag et al., 2021; Gu & Dao, 2023; Beck et al., 2024) compress context into a fixed-size state matrix $S_t \in \mathbb{R}^{d \times d}$ updated via outer products:

$$S_t = S_{t-1} + v_t k_t^T, \quad S_0 = \mathbf{0}$$

Reading from memory uses matrix-vector multiplication with query $q$:

$$y = S q = \sum_{i=1}^N v_i (k_i^T q)$$

When probing for stored key $k_j$ ($q = k_j$), retrieval decomposes into target signal and cross-talk interference:

$$y_j = \underbrace{v_j (k_j^T k_j)}_{\text{Target Signal}} + \underbrace{\sum_{i \ne j} v_i (k_i^T k_j)}_{\text{Cross-Talk Interference}}$$

---

### The Mechanism of Interference

Our central claim is: **When stored keys are not orthogonal, a linear fast-weight state adds non-target contributions to retrieval; in our synthetic setup, increasing controlled key overlap increases measured cross-talk.**

Under orthonormal keys ($k_i^T k_j = 0$ for $i \ne j$), cross-talk vanishes, yielding exact reconstruction $y_j = v_j$. However, when unit keys in $\mathbb{R}^d$ are not orthogonal, off-diagonal inner products inject non-target values additively into the readout. Because the recurrent state is an un-gated outer-product sum, query evaluation distributes linearly across all stored items, scaling each non-target value by its key projection.

Our benchmark sweeps (50 Monte Carlo trials per configuration at $d=8$) measured retrieval degradation across controlled key correlation $\rho$:

1. **Orthogonal Baseline ($\rho = 0.0, N = 4$):** Mean Cosine Similarity $= 1.0000$, Mean L2 Error $= 0.0000$.
2. **Moderate Overlap ($\rho = 0.45, N = 4$):** Mean Cosine Similarity drops to $0.7647$, Mean L2 Error rises to $0.8475$.
3. **High Load ($N = 12 > d = 8, \rho = 0.35$):** Mean Cosine Similarity drops to $0.5764$, Mean L2 Error rises to $1.3590$.

Across the sweep, higher controlled key overlap is associated with higher measured cross-talk, with small stochastic variation between configurations. The linear state has rank bounded by $d$ ($\text{rank}(S) \le \min(d, N)$). When $N > d$, nonzero keys in $\mathbb{R}^d$ cannot all be mutually orthogonal, producing non-zero projections that increase measured error.

---

### Stress Testing: High-Load Regime

In an adversarial test ($d=6, N=10, \rho=0.75$), cumulative interference terms ($\|\sum_{i \ne j} v_i (k_i^T k_j)\|$) exceed the target signal ($\|v_j\|$). The retrieved vector aligns with the dominant cluster of interfering keys rather than the target value, severely distorting recall.

---

### Connection to Dragon Hatchling (BDH)

Dragon Hatchling (**BDH**; Kosowski et al., 2025) explores a brain-inspired alternative using sparse positive activations ($\text{ReLU} / \text{Top-K}$) and local synaptic plasticity. Under sparse support, restricting active connections alters feature interactions compared to dense linear superposition. **BDH-CQ** (Engdahl et al., 2026) extends this to in-context demonstration learning $(X \to Y)$ via recurrent latent computation.

Our non-negative sparse teaching abstraction changes which interactions contribute to the recurrent state, but it should not be interpreted as evidence that the full BDH architecture eliminates cross-talk. Under finite dimension $d$, memory representation remains fundamentally constrained by finite-dimensional geometric bounds. Understanding the precise trade-off between synaptic sparsity and representational capacity across non-uniform natural language token distributions remains an open research frontier.

---

### Primary References
1. **Schlag, I., Irie, K., & Schmidhuber, J. (2021).** *Linear Transformers Are Secretly Fast Weight Programmers.* ICML. [arXiv:2102.11174](https://arxiv.org/abs/2102.11174).
2. **Beck, M., et al. (2024).** *xLSTM: Extended Long Short-Term Memory.* NeurIPS. [arXiv:2405.04517](https://arxiv.org/abs/2405.04517).
3. **Gu, A., & Dao, T. (2023).** *Mamba: Linear-Time Sequence Modeling.* [arXiv:2312.00752](https://arxiv.org/abs/2312.00752).
4. **Sun, Y., et al. (2024).** *Learning to (Learn at Test Time): RNNs with Expressive Hidden States.* [arXiv:2407.04620](https://arxiv.org/abs/2407.04620).
5. **Kosowski, A., et al. (2025).** *The Dragon Hatchling: Missing Link between Transformer and Brain.* [arXiv:2509.26507](https://arxiv.org/abs/2509.26507).
6. **Engdahl, B., et al. (2026).** *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning.* [arXiv:2608.09888](https://arxiv.org/abs/2608.09888).
