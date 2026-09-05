import { ProtocolPreset } from "./types";

export const PROTOCOL_PRESETS: ProtocolPreset[] = [
  {
    id: "protocol_01_baseline",
    title: "BASELINE",
    subtitle: "Low-overlap retrieval baseline",
    question: "Can a fixed-size recurrent state store and retrieve values without cross-talk?",
    scientificLesson:
      "When stored keys are mutually orthonormal (G_ij = 0 for i != j), off-diagonal cross-talk terms vanish completely. The retrieved vector matches ground truth with zero linear error.",
    d: 8,
    N: 4,
    correlation: 0.0,
    decay: 1.0,
    useBDH: false,
    stats: {
      mean_pairwise_cosine: 0.0,
      std_pairwise_cosine: 0.0,
      min_pairwise_cosine: 0.0,
      max_pairwise_cosine: 0.0,
    },
  },
  {
    id: "protocol_02_interference",
    title: "INTERFERENCE",
    subtitle: "Controlled key correlation (rho = 0.45)",
    question: "How does non-orthogonal key alignment induce cross-talk noise?",
    scientificLesson:
      "Increasing key correlation parameter rho produces non-zero inner products k_i^T q, projecting fractional values of unrelated memories into the retrieved output.",
    d: 8,
    N: 4,
    correlation: 0.45,
    decay: 1.0,
    useBDH: false,
    stats: {
      mean_pairwise_cosine: 0.45,
      std_pairwise_cosine: 0.08,
      min_pairwise_cosine: 0.32,
      max_pairwise_cosine: 0.58,
    },
  },
  {
    id: "protocol_03_load_stress",
    title: "LOAD STRESS",
    subtitle: "Higher synthetic memory load: N/d = 1.5",
    question: "What happens when the number of stored memories N exceeds state dimension d?",
    scientificLesson:
      "When N > d, keys cannot all be mutually orthogonal. This creates non-zero off-diagonal projections; in this synthetic configuration, those contributions increase the measured retrieval error.",
    d: 8,
    N: 12,
    correlation: 0.2,
    decay: 1.0,
    useBDH: false,
    stats: {
      mean_pairwise_cosine: 0.22,
      std_pairwise_cosine: 0.11,
      min_pairwise_cosine: -0.05,
      max_pairwise_cosine: 0.49,
    },
  },
  {
    id: "protocol_04_forgetting",
    title: "TEMPORAL DECAY",
    subtitle: "Exponential retention factor lambda = 0.80",
    question: "How does temporal decay lambda < 1 alter the retention of earlier vs recent memories?",
    scientificLesson:
      "Setting lambda < 1 discounts earlier associations by lambda^(t-i). This attenuates cross-talk from old memories while reducing earlier target signal strength.",
    d: 8,
    N: 6,
    correlation: 0.2,
    decay: 0.8,
    useBDH: false,
    stats: {
      mean_pairwise_cosine: 0.21,
      std_pairwise_cosine: 0.10,
      min_pairwise_cosine: -0.02,
      max_pairwise_cosine: 0.44,
    },
  },
  {
    id: "protocol_05_sparse_abstraction",
    title: "SPARSE ABSTRACTION",
    subtitle: "BDH-inspired non-negative sparse projection [TEACHING ABSTRACTION]",
    question: "Can non-negative sparse activations suppress cross-talk in a toy recurrent matrix?",
    scientificLesson:
      "Non-negative sparse activations can reduce active overlapping connections under suitable sparse-support regimes, suppressing pairwise dot products in this simplified toy model. (Note: this is a single-layer teaching abstraction, not the complete BDH architecture).",
    d: 8,
    N: 12,
    correlation: 0.35,
    decay: 1.0,
    useBDH: true,
    stats: {
      mean_pairwise_cosine: 0.12,
      std_pairwise_cosine: 0.06,
      min_pairwise_cosine: 0.0,
      max_pairwise_cosine: 0.28,
    },
  },
];
