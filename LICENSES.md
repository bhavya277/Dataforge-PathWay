# Software, Asset & Provenance License Record
## DataForge × Pathway 2026 Submission

---

## 1. Project License
This project is open-sourced under the **MIT License**.

```
MIT License

Copyright (c) 2026 Bhavya Modi & DataForge × Pathway Project Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 2. Complete Asset Provenance Registry

In accordance with the official Pathway Problem Statement guidelines, the provenance of all assets and artifacts is certified below:

| Asset Category | Provenance Status | Details & Attribution |
|---|---|---|
| **CODE** | Original / Open Source | Core mathematical engine, state recurrence updates, interactive visualizers, and Python verification scripts are original work under the MIT License. |
| **DATA** | Synthetic Only | No external private or proprietary datasets used. All key-value vectors are generated synthetically in-memory via controlled isotropic Gaussian sampling (`src/lib/math-engine.ts`, `experiments/associative_memory.py`). |
| **MODEL WEIGHTS** | None | No pre-trained proprietary or third-party neural network model weights are bundled or utilized. All state matrices ($S \in \mathbb{R}^{d \times d}$) are computed deterministically from first principles. |
| **GRAPHICS** | Original / Programmatic | All heatmaps, vector bars, capacity curves, and decomposition diagrams are rendered programmatically via inline HTML5 SVG/Canvas elements. |
| **FONTS** | Open Font License | System sans-serif fallbacks and Google Fonts (Inter, JetBrains Mono) under the SIL Open Font License (OFL 1.1). |
| **REUSED COMPONENTS** | Permissive Open Source | See third-party dependency manifest below. |

---

## 3. Third-Party Libraries & Dependencies

| Library / Tool | Version | Purpose | License | Provenance Link |
|---|---|---|---|---|
| **Next.js** | 15.5.7 | React framework & server-side generation | MIT | https://github.com/vercel/next.js |
| **React** | 19.x | UI component architecture | MIT | https://github.com/facebook/react |
| **Tailwind CSS** | 3.4.x | Utility-first CSS layout engine | MIT | https://github.com/tailwindlabs/tailwindcss |
| **Lucide React** | 0.475.x | Minimalist UI glyphs and icons | ISC | https://github.com/lucide-icons/lucide |
| **NumPy** | 1.26+ | Python numerical verification & testing | BSD 3-Clause | https://github.com/numpy/numpy |
| **MathJax** | 3.x | LaTeX mathematical typesetting in export | Apache 2.0 | https://github.com/mathjax/MathJax |
