# Primary Sources & Research Bibliography (2021–2026)
## DataForge × Pathway 2026 Submission

This document catalogs the primary peer-reviewed and pre-print literature (2021–2026) underpinning our associative memory research substrate, verified against the official Pathway Problem Statement criteria.

---

## 1. Foundational Background (Pre-2022)

### Paper 1: Linear Transformers Are Secretly Fast Weight Programmers
* **Citation:** Schlag, Imanol, Kazuki Irie, and Jürgen Schmidhuber (2021). "Linear Transformers Are Secretly Fast Weight Programmers." *Proceedings of the 38th International Conference on Machine Learning (ICML 2021)*, PMLR 139:9355-9366. [arXiv:2102.11174](https://arxiv.org/abs/2102.11174).
* **Year:** 2021 (ICML)
* **Mechanism / System Studied:** Un-softmaxed causal linear self-attention vs. fast-weight associative neural networks (FWP).
* **Relationship to Associative Memory:** Proves that causal linear attention with feature map $\phi(x)$ is algebraically identical to sequential outer-product accumulation $S_t = S_{t-1} + v_t k_t^T$ into a recurrent matrix state, with retrieval via matrix-vector multiplication $y = S q$.
* **Relevance to Our Experiment:** Forms the foundational mathematical formulation of our simulation engine (`src/lib/math-engine.ts`) and numerical verification script (`experiments/verify_recurrence.py`).
* **Classification:** `[FOUNDATIONAL BACKGROUND (PRE-2022)]`

---

## 2. Primary Sources (2022–2026 Window — PS Requirement Satisfied)
*(The Pathway Problem Statement mandates at least three recent primary papers from 2022–2026; our research substrate builds directly on six primary sources in this window).*

### Paper 2: xLSTM: Extended Long Short-Term Memory
* **Citation:** Beck, Maximilian, Korbinian Pöppel, Markus Spanring, Andreas Auer, Oleksandra Prudnikova, Michael Kopp, Günter Klambauer, Johannes Brandstetter, and Sepp Hochreiter (2024). "xLSTM: Extended Long Short-Term Memory." *Advances in Neural Information Processing Systems (NeurIPS 2024)*. [arXiv:2405.04517](https://arxiv.org/abs/2405.04517).
* **Year:** 2024 (NeurIPS)
* **Mechanism / System Studied:** Matrix-memory LSTM cells (mLSTM) using a covariance-like recurrent state matrix $C_t = f_t C_{t-1} + i_t v_t k_t^T$ paired with a normalizer state $n_t$.
* **Relationship to Associative Memory:** Uses the outer-product associative update $v_t k_t^T$ as the core storage primitive to expand representational capacity via a matrix state beyond scalar LSTM hidden states, while adding gating to stabilize updates.
* **Relevance to Our Experiment:** Validates that matrix outer-product associative states are central to state-of-the-art non-transformer sequence models; illustrates the necessity of retention/decay mechanisms ($\lambda$) to manage memory retention.
* **Classification:** `[PUBLISHED LITERATURE • ARCHITECTURAL EXTENSION]`

### Paper 3: Mamba: Linear-Time Sequence Modeling with Selective State Spaces
* **Citation:** Gu, Albert, and Tri Dao (2023). "Mamba: Linear-Time Sequence Modeling with Selective State Spaces." *arXiv preprint*. [arXiv:2312.00752](https://arxiv.org/abs/2312.00752).
* **Year:** 2023 / 2024
* **Mechanism / System Studied:** Selective structured state space models (SSMs) with time-varying input-dependent recurrence matrices.
* **Relationship to Associative Memory:** Implements a compressed hidden state $h_t = \bar{A}_t h_{t-1} + \bar{B}_t x_t$ that selectively forgets or retains context based on the input, trading static associative superposition for dynamic input-driven filtering.
* **Relevance to Our Experiment:** Demonstrates how selective decay ($\lambda_t$) addresses the cross-talk accumulation problem inherent in fixed-size linear recurrent states.
* **Classification:** `[PUBLISHED LITERATURE • STATE SPACE COMPARISON]`

### Paper 4: Learning to (Learn at Test Time): RNNs with Expressive Hidden States
* **Citation:** Sun, Yu, Xinhao Li, Karan Dalal, Jiarui Xu, Arjun Vikram, Genghan Zhang, Yann Dubois, Xinlei Chen, Xiaolong Wang, Sanmi Koyejo, Tatsunori Hashimoto, and Carlos Guestrin (2024). "Learning to (Learn at Test Time): RNNs with Expressive Hidden States." *arXiv preprint*. [arXiv:2407.04620](https://arxiv.org/abs/2407.04620).
* **Year:** 2024
* **Mechanism / System Studied:** Test-Time Training (TTT) layers where recurrent state transitions are formulated as gradient descent steps on a self-supervised objective.
* **Relationship to Associative Memory:** Reinterprets the linear associative state $W_t$ as the weights of an internal linear model trained on the sequence history at test time, directly extending classical Hebbian fast weights.
* **Relevance to Our Experiment:** Demonstrates that modern test-time training architectures share the exact same outer-product gradient update as linear associative memories.
* **Classification:** `[PUBLISHED LITERATURE • TEST-TIME TRAINING DUAL]`

---

## 3. Dragon Hatchling (BDH) & BDH-CQ Research Context

### Paper 5: The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain
* **Citation:** Kosowski, Adrian, Przemysław Uznański, Jan Chorowski, Zuzanna Stamirowska, and Michał Bartoszkiewicz (2025). "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain." *arXiv preprint*. [arXiv:2509.26507](https://arxiv.org/abs/2509.26507).
* **Year:** 2025
* **Mechanism / System Studied:** Scale-free neural architecture featuring locally interacting neuron particles, non-negative sparse activations, and local synaptic plasticity.
* **Relationship to Associative Memory:** Connects transformer self-attention and recurrent memory to biological synaptic plasticity, exploring how non-negative sparse representations alter interaction patterns relative to dense continuous superposition.
* **Relevance to Our Experiment:** Inspires our single-layer sparse-plasticity teaching abstraction (`useBDH` in `math-engine.ts`), contrasting dense linear fast weights with sparse positive projections.
* **Classification:** `[PRIMARY BENCHMARK / SOURCE • RESEARCH SUBSTRATE]`

### Paper 6: BDH-CQ: In-Context Learning with Recurrent Latent Reasoning
* **Citation:** Engdahl, Björn, Adrian Kosowski, Jan Chorowski, Zuzanna Stamirowska, Przemysław Uznański, Junlin Jiang, Rohan Phadke, Remigiusz Kinas, and Richard Zhong (2026). "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning." *arXiv preprint*. [arXiv:2608.09888](https://arxiv.org/abs/2608.09888).
* **Year:** 2026
* **Mechanism / System Studied:** In-context learning via recurrent latent reasoning from demonstration pairs without explicit text Chain-of-Thought (CoT) token generation.
* **Relationship to Associative Memory:** Input-output demonstration pairs write updates directly into recurrent synaptic fast weights during prompt ingestion; queries are answered via iterative continuous latent transformations.
* **Relevance to Our Experiment:** Serves as advanced frontier research context for recurrent demonstration storage, clearly distinguished from our single-layer teaching abstraction.
* **Classification:** `[PRIMARY BENCHMARK / SOURCE • ADVANCED RESEARCH CONTEXT]`

---

## 4. Representational Geometry & Polysemantic Superposition

### Paper 7: Toy Models of Superposition
* **Citation:** Elhage, Nelson, Tristan Hume, Catherine Olsson, Nicholas Schiefer, Tom Henighan, Shauna Kravec, Zac Hatfield-Dodds, Robert Lasenby, Scott Johnston, Christopher Olah, et al. (Anthropic, 2022). "Toy Models of Superposition." *Transformer Circuits Thread*.
* **Year:** 2022
* **Mechanism / System Studied:** Geometric packing of features into lower-dimensional vector spaces via non-orthogonal superposition.
* **Relationship to Associative Memory:** Explains mathematically why non-orthogonal vectors create non-zero dot products ($k_i^T k_j \ne 0$) and how non-negative sparse constraints allow more distinct features to be packed before cross-talk overwhelms readout.
* **Relevance to Our Experiment:** Directly informs our geometric framing of key overlap ($\rho$), Gram matrix inspection, and the sparse positive contrast.
* **Classification:** `[PUBLISHED LITERATURE • REPRESENTATION GEOMETRY]`
