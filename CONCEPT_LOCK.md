# CONCEPT LOCK: Associative Memory in Fast-Weight Recurrence and BDH Synaptic Plasticity

## 1. Concept Specification
* **Selected Concept:** Associative Memory in Fast-Weight Architectures and Linear Recurrent State Updates (and its transformation via BDH Sparse Hebbian Plasticity).
* **Category Mapping (from PDF Page 2):** 
  * *Primary:* "Memory and state: Linear attention. Associative memory. Synaptic plasticity as short-term memory. Test-time learned memory."
  * *Bridge:* "Architectural directions: Post Transformer architectures, including BDH."
* **Approved Blog Topic (from PDF Page 8):** Topic 2 / Topic 3 / Topic 5 ("Associative Memory in Fast-Weight Architectures" & "Linear Attention Variants and Their Equivalences to Recurrent State Updates").

---

## 2. Why Selected & Why It Matters Now (2022–2026)
* **The Post-Transformer Pivot:** Standard Transformers scale quadratically with context length ($O(N^2)$). Post-Transformer architectures (Linear Attention, RWKV, RetNet, Mamba, xLSTM, BDH) compress context into a recurrent hidden state $S_t \in \mathbb{R}^{d_{key} \times d_{val}}$.
* **The Fundamental Dilemma:** Unlike full KV caching which stores all history faithfully, a fixed-size recurrent state MUST continuously superimpose outer products:
  $$S_t = \lambda S_{t-1} + v_t k_t^T$$
  This creates a fundamental trade-off between **memory load** and **cross-talk interference**.
* **The BDH Connection:** Dragon Hatchling (BDH) explores replacing dense linear superposition with sparse positive activations and localized synaptic plasticity, providing an architectural alternative to dense linear recurrent states.

---

## 3. Pedagogical Persona & Framing
* **Target Learner:** AI engineers, ML researchers, and students who understand basic linear algebra (matrix multiplication) and standard attention ($Q K^T V$), but want to understand *how linear recurrence stores associations* and *how interference emerges*.
* **Prerequisites:** Matrix outer products ($v k^T$), dot product similarity, basic vector embeddings.
* **Learning Objectives:**
  1. Derive the mathematical duality: $\text{Linear Attention } (Q K^T V) \equiv \text{Recurrent State } S_t = \lambda S_{t-1} + v_t k_t^T$.
  2. Directly visualize the $d \times d$ Fast-Weight Memory Matrix storing key-value associations.
  3. Measure cross-talk interference by varying the controlled key correlation parameter $\rho$.
  4. Observe retrieval behavior as memory load ratio $N/d$ increases beyond subspace rank $\text{Rank}(S) \le d$.
  5. Understand how BDH's sparse positive activations and Hebbian plasticity provide a contrasting approach to memory storage.

---

## 4. Central Question & One-Sentence Falsifiable Claim

### Central Question
> **"How do memory load and key overlap affect retrieval quality in the specified fixed-size recurrent associative-memory model?"**

### The One-Sentence Falsifiable Claim
> **"When stored keys are not orthogonal, a linear fast-weight state adds non-target contributions to retrieval; in our synthetic setup, increasing controlled key overlap increases measured cross-talk."**

*(Note: Empirical error scaling with $N/d$ is documented strictly as an empirical observation under isotropic Gaussian keys, not a universal theorem.)*

---

## 5. Mathematical Mechanism & Learner Variables

### The Core Equations
1. **Writing into Memory (Hebbian Outer-Product Update):**
   $$S_t = \lambda S_{t-1} + \eta (v_t k_t^T)$$
   where $\lambda \in [0, 1]$ is the retention/decay factor and $\eta$ is the learning rate.
2. **Reading from Memory (Associative Query Lookup):**
   $$\hat{v}_{query} = S_t q_{query}$$
   Expanding the recurrence for query $q = k_m$:
   $$\hat{v}_m = \sum_{i=1}^t \lambda^{t-i} \eta v_i (k_i^T k_m) = \underbrace{v_m \|k_m\|^2}_{\text{Target Signal}} + \underbrace{\sum_{i \ne m} \lambda^{t-i} \eta v_i (k_i^T k_m)}_{\text{Cross-Talk Interference}}$$
3. **BDH-Inspired Teaching Abstraction (Non-negative Rectification & Connection Gating):**
   $$W_{t} = \text{TopK}\left(\lambda W_{t-1} + \eta \cdot \text{ReLU}(v_t) \text{ReLU}(k_t)^T\right)$$
   The BDH-inspired teaching abstraction applies non-negative activation and sparse connection gating to explore how restricting active supports can change the pattern of cross-talk.

### Meaningful Learner Variables
1. **Controlled Key Overlap / Parameter ($\rho \in [0, 1]$):** Adjusts the shared-component parameter between stored keys.
2. **State Dimension ($d \in [4, 64]$):** Changes the dimension of the recurrent matrix ($S \in \mathbb{R}^{d \times d}$).
3. **Sequence Length / Number of Injected Key-Values ($N \in [1, 32]$):** Explores memory load where $N > d$.
4. **Decay / Forgetting Factor ($\lambda \in [0.5, 1.0]$):** Controls recency bias versus long-term retention.
5. **Connection Sparsity ($K / d \in [0.05, 1.0]$):** Controls sparsity in the BDH-inspired teaching abstraction used for comparison.

---

## 6. Ground Truth, Expected Result & Controlled Failure Modes
* **Ground Truth:** The exact target vector $v_{target}$ or target token class injected at step $t_{target}$.
* **Model Output:** $\hat{v} = S_N q_{target}$, normalized and projected onto the token dictionary.
* **Failure Mode (Preset 03 - High-Load Stress Case):** When $N > d$ and $\rho \ge 0.45$, cross-talk terms accumulate relative to the target signal under this synthetic distribution:
  $$\|\text{Interference}\| \approx \|\text{Signal}\| \implies \text{ArgMax}(\hat{v}) \ne \text{ArgMax}(v_{target})$$
  The learner witnesses exact matrix cell accumulation and output error interactively in the browser.

---

## 7. Direct BDH & BDH-CQ Grounding
* **BDH (Dragon Hatchling Research Context):** Explores a brain-inspired architecture where memory and computation are tied to local synaptic activity:
  1. *Sparse Positive Activations:* Non-negative activations restrict active overlapping connections in high dimensions.
  2. *Sparse Synaptic Plasticity:* Dynamic local connection updates occur during context consumption.
  3. *Note on Abstraction:* This project does NOT implement the full multi-layer BDH architecture; our interactive mode is a simplified single-layer teaching abstraction.
* **BDH-CQ (Research Context):** Studies demonstration-conditioned recurrent states to evaluate queries via continuous latent reasoning without explicit chain-of-thought tokens. (Our interactive model is a simplified teaching abstraction).

---

## 8. Primary Research Paper Citations (2022–2026)
1. **Schlag, I., Irie, K., & Schmidhuber, J. (2021/2022).** *Linear Transformers Are Secretly Fast Weight Programmers.* ICML.
2. **Sun, Y., et al. (2024).** *Learning to (Learn at Test Time): RNNs with Expressive Hidden States (TTT).* arXiv:2407.04620.
3. **Beck, M., et al. (2024).** *xLSTM: Extended Long Short-Term Memory.* NeurIPS 2024.
4. **Gu, A., & Dao, T. (2023).** *Mamba: Linear-Time Sequence Modeling with Selective State Spaces.* arXiv:2312.00752.
5. **Pathway Research Team (2024–2025).** *Dragon Hatchling (BDH): Brain-Inspired Sparse Associative Architectures.* Technical Whitepaper & BDH-CQ Specification.
