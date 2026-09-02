# Primary Sources & Research Bibliography (2021–2026)

This document catalogs the primary literature supporting the technical design, mathematical formulations, and comparative analysis of our associative memory research substrate.

---

## 1. Fast Weights & Linear Attention Equivalence
1. **Schlag, Imanol, Kazuki Irie, and Jürgen Schmidhuber.**
   * *Title:* "Linear Transformers Are Secretly Fast Weight Programmers."
   * *Venue:* International Conference on Machine Learning (ICML), 2021.
   * *arXiv:* [2102.11174](https://arxiv.org/abs/2102.11174)
   * *Contribution:* Proves the formal algebraic duality between un-normalized linear attention with feature maps $\phi(x)$ and associative fast-weight recurrent state matrices $S_t = S_{t-1} + v_t k_t^T$.

2. **Katharopoulos, Angelos, et al.**
   * *Title:* "Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention."
   * *Venue:* ICML 2020.
   * *arXiv:* [2006.16236](https://arxiv.org/abs/2006.16236)
   * *Contribution:* Establishes $O(N)$ linear inference cost by expressing attention as recurrent matrix accumulation.

---

## 2. Recurrent Memory Capacity & Post-Transformer Architectures (2023–2026)
3. **Beck, Maximilian, et al.**
   * *Title:* "xLSTM: Extended Long Short-Term Memory."
   * *Venue:* Advances in Neural Information Processing Systems (NeurIPS), 2024.
   * *arXiv:* [2405.04517](https://arxiv.org/abs/2405.04517)
   * *Contribution:* Demonstrates matrix-valued recurrent hidden states ($S_t \in \mathbb{R}^{d \times d}$) with exponential gating and memory stabilization rules.

4. **Gu, Albert, and Tri Dao.**
   * *Title:* "Mamba: Linear-Time Sequence Modeling with Selective State Spaces."
   * *Venue:* arXiv preprint, 2023 / 2024.
   * *arXiv:* [2312.00752](https://arxiv.org/abs/2312.00752)
   * *Contribution:* Replaces time-invariant linear recurrence with input-dependent selection parameters ($\Delta, B, C$) to filter non-essential context.

5. **Sun, Yu, et al.**
   * *Title:* "Learning to (Learn at Test Time): RNNs with Expressive Hidden States (TTT)."
   * *Venue:* arXiv preprint, 2024.
   * *arXiv:* [2407.04620](https://arxiv.org/abs/2407.04620)
   * *Contribution:* Re-interprets recurrent hidden state evolution as online gradient descent on a self-supervised reconstruction loss at inference time.

---

## 3. Sparse Associative Plasticity & BDH Primary Research
6. **Kosowski, Adrian, Przemysław Uznański, Jan Chorowski, Zuzanna Stamirowska, and Michał Bartoszkiewicz.**
   * *Title:* "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain."
   * *Venue:* arXiv preprint, 2025.
   * *arXiv:* [2509.26507](https://arxiv.org/abs/2509.26507)
   * *Core Concepts:* Non-negative sparse positive neuron activations ($a \ge 0$), locally interacting neuron particles, synaptic plasticity during context processing, monosemantic circuits.

7. **Engdahl, Björn, Adrian Kosowski, Jan Chorowski, Zuzanna Stamirowska, Przemysław Uznański, Junlin Jiang, Rohan Phadke, Remigiusz Kinas, and Richard Zhong.**
   * *Title:* "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning."
   * *Venue:* arXiv preprint, 2026.
   * *arXiv:* [2608.09888](https://arxiv.org/abs/2608.09888)
   * *Core Concepts:* In-context demonstration assimilation and multi-step reasoning over recurrent latent state trajectories bypassing explicit written token Chain-of-Thought (CoT).

8. **Elhage, Nelson, et al. (Anthropic).**
   * *Title:* "Toy Models of Superposition."
   * *Venue:* Transformer Circuits Thread, 2022.
   * *Contribution:* Analyzes how high-dimensional vectors pack more features than dimensions via polysemantic superposition, motivating sparse positive support separation.
