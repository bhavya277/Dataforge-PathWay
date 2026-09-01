# Primary Sources & Research Bibliography (2022–2026)

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
6. **Pathway Research Team.**
   * *Title:* "Dragon Hatchling (BDH): Brain-Inspired Post-Transformer Architecture with Monosemantic Synaptic Plasticity."
   * *Venue:* Pathway Technical Report & Architecture Specification, 2024–2025.
   * *Core Concepts:* Non-negative sparse positive neuron activations ($\text{ReLU}/\text{Top-K}$), local Hebbian parameter updates during context processing, monosemantic synaptic routing.

7. **Pathway Research Team.**
   * *Title:* "BDH-CQ: In-Context Continuous Latent Reasoning from Demonstrations."
   * *Venue:* Pathway Technical Whitepaper, 2025.
   * *Core Concepts:* Latent demonstration assimilation bypassing token-level autoregressive chain-of-thought decoding.

8. **Elhage, Nelson, et al. (Anthropic).**
   * *Title:* "Toy Models of Superposition."
   * *Venue:* Transformer Circuits Thread, 2022.
   * *Contribution:* Analyzes how high-dimensional vectors pack more features than dimensions via polysemantic superposition, directly motivating BDH's sparse positive rectification.
