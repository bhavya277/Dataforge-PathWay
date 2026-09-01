export interface KeyValuePair {
  id: number;
  label: string;
  color: string;
  keyVector: number[];
  valueVector: number[];
}

export interface RetrievalBreakdown {
  queryIdx: number;
  queryLabel: string;
  queryVector: number[];
  groundTruthValue: number[];
  retrievedValue: number[];
  signalComponent: number[];
  interferenceComponent: number[];
  cosineSimilarity: number;
  l2Error: number;
  signalMagnitude: number;
  crosstalkMagnitude: number;
  interferenceToSignalRatio: number;
}

export interface MemoryPreset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  scientificLesson: string;
  d: number;
  N: number;
  correlation: number;
  decay: number;
  sparsity?: number;
  useBDH?: boolean;
}

export interface SweepPoint {
  correlation?: number;
  N?: number;
  d?: number;
  mean_cosine_similarity: number;
  mean_l2_error: number;
  mean_interference_to_signal_ratio: number;
  load_ratio_N_over_d?: number;
}

export type ActiveTab = "guide" | "interactive-lab" | "bdh-architecture" | "benchmarks" | "blog";
