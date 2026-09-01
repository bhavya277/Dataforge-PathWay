# AI Assistance & Attribution Disclosure

In compliance with the DataForge 2026 Pathway Track regulations, this document transparently discloses all AI tooling, models, and assistance utilized in the creation of this submission.

---

## 1. AI Tooling & Models Used
* **AI Model:** Antigravity AI Coding Assistant (Gemini 3.7 Architecture).
* **Role & Tasks:**
  * Architecture scaffolding & TypeScript boilerplate.
  * Vectorized linear algebra implementation and Python unit test generation.
  * Interactive UI layout and Tailwind CSS styling.
  * Technical documentation structuring and formatting.

---

## 2. Technical Ownership & Audit
* **Human Research & Direction:** All mathematical derivations, topic selection, 1-sentence falsifiable claim formulation, BDH architectural analysis, primary research citations, and experimental boundaries were directed, audited, and verified by the team.
* **Mathematical Integrity:** All linear algebraic formulas ($S_t = S_{t-1} + v_t k_t^T$, $\hat{v} = S q$, cross-talk decomposition) and unit test assertions were verified against peer-reviewed publications (Schlag et al. ICML 2021; Beck et al. NeurIPS 2024).
* **Zero Fake Computation:** No AI-generated fake data or scripted animations are passed off as computation. All client-side visualizations are driven by live matrix operations in `lib/math-engine.ts`.
