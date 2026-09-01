import { MemoryPreset } from "./types";

export const PRESETS: MemoryPreset[] = [
  {
    id: "preset_01_clean",
    title: "Preset 01 — Clean Orthogonal Recall",
    subtitle: "Lossless associative storage with zero cross-talk",
    description:
      "When key vectors are mutually orthogonal (k_i^T k_j = 0 for i != j), each stored value is retrieved with 100% precision. The cross-talk interference term is identically zero.",
    scientificLesson:
      "Orthogonality is a sufficient condition for perfect linear associative retrieval. The memory matrix S acts as a set of non-overlapping coordinate projections.",
    d: 8,
    N: 4,
    correlation: 0.0,
    decay: 1.0,
    useBDH: false,
  },
  {
    id: "preset_02_correlated",
    title: "Preset 02 — Visible Cross-Talk",
    subtitle: "Moderate key correlation introducing value bleed",
    description:
      "Setting key correlation rho = 0.45 causes key vectors to share directional alignment. Retrieving Key A pulls fractional components of Value B, C, and D.",
    scientificLesson:
      "In linear recurrence, querying key j activates all keys non-orthogonally aligned with it. The retrieved output is a contaminated linear superposition.",
    d: 8,
    N: 4,
    correlation: 0.45,
    decay: 1.0,
    useBDH: false,
  },
  {
    id: "preset_03_pressure",
    title: "Preset 03 — Memory Pressure (N > d)",
    subtitle: "Exceeding matrix rank capacity",
    description:
      "Storing 12 associations in an 8-dimensional state matrix exceeds rank capacity (Rank(S) <= 8). Even with mild correlation (rho = 0.20), interference terms accumulate.",
    scientificLesson:
      "A fixed-size recurrent state S in R^(d x d) cannot store unbounded independent facts without progressive signal degradation.",
    d: 8,
    N: 12,
    correlation: 0.2,
    decay: 1.0,
    useBDH: false,
  },
  {
    id: "preset_04_failure",
    title: "Preset 04 — Catastrophic Cross-Talk Collapse",
    subtitle: "Controlled adversarial failure where interference exceeds signal",
    description:
      "High correlation (rho = 0.75) and high load (N = 10, d = 6) causes the cumulative interference magnitude to strictly overpower the target signal, inverting retrieval direction.",
    scientificLesson:
      "When off-diagonal interference terms dominate, the model's output vector points away from the ground truth toward the centroid of interfering keys.",
    d: 6,
    N: 10,
    correlation: 0.75,
    decay: 1.0,
    useBDH: false,
  },
];
