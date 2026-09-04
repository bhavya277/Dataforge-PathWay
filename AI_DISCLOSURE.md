# AI Assistance & Attribution Disclosure
## DataForge × Pathway 2026 Submission

In compliance with the DataForge 2026 Pathway Track regulations, this document transparently discloses all AI tooling, assistance, and mentorship details for this submission.

---

## 1. AI Assistance Disclosure
* **Tool:** AI coding assistant.
* **Scope of Assistance:** AI-assisted coding, documentation, and design support was used during development.
* **Technical Ownership:** The team provided the project direction, reviewed generated work, verified mathematical behavior, and retains responsibility for the final implementation, empirical findings, and scientific claims.

---

## 2. Mentor Involvement Disclosure
* **Mentor involvement:** None. No mentor or advisor was involved in this submission.
* All mathematical modeling, experimental design, software implementation, visual presentation, and defense materials were conceived, built, and verified independently by the registered author.

---

## 3. Technical Integrity & Mathematical Verification
* **Mathematical Integrity:** All linear algebraic formulations ($S_t = \lambda S_{t-1} + v_t k_t^T$, $y_t = S_t q_t$, exact signal/cross-talk decomposition) and unit test assertions were verified against peer-reviewed literature (Schlag et al. ICML 2021; Beck et al. NeurIPS 2024).
* **Zero Fake Computation:** No AI-generated fake numbers or scripted animations are passed off as computation. All visualizations and metrics are driven by deterministic live Float64 matrix operations in `src/lib/math-engine.ts`.
