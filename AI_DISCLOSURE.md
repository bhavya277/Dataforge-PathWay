# AI Assistance & Attribution Disclosure

In compliance with the DataForge 2026 Pathway Track regulations, this document transparently discloses all AI tooling, models, and assistance utilized in the creation of this submission.

---

## 1. AI Tooling & Models Used
* **AI Assistant:** Antigravity AI coding assistant.
* **Role & Tasks:**
  * AI assistance was used for code, UI layout, and documentation development.
  * Human Direction & Ownership: The project direction, mathematical methodology, experimental design, validation suite, and final decisions were human-directed and reviewed.

---

## 2. Technical Ownership & Audit
* **Human Research & Direction:** All mathematical derivations, topic selection, 1-sentence falsifiable claim formulation, BDH architectural analysis, primary research citations, and experimental boundaries were directed, audited, and verified by the team.
* **Mathematical Integrity:** All linear algebraic formulas ($S_t = S_{t-1} + v_t k_t^T$, $\hat{v} = S q$, cross-talk decomposition) and unit test assertions were verified against peer-reviewed publications (Schlag et al. ICML 2021; Beck et al. NeurIPS 2024).
* **Zero Fake Computation:** No AI-generated fake data or scripted animations are passed off as computation. All client-side visualizations are driven by live matrix operations in `lib/math-engine.ts`.
