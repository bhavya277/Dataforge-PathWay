export interface KeyValuePair {
  id: number;
  label: string;
  color: string;
  keyVector: number[];
  valueVector: number[];
}

export interface KeySetStats {
  meanCosine: number;
  stdCosine: number;
  minCosine: number;
  maxCosine: number;
  isOrthogonal: boolean;
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
  cosineError: number;
  rawL2Error: number;
  signalMagnitude: number;
  crosstalkMagnitude: number;
  interferenceToSignalRatio: number;
  timeDecayFactor: number;
}

export interface ProtocolPreset {
  id: string;
  title: string;
  subtitle: string;
  question: string;
  scientificLesson: string;
  d: number;
  N: number;
  correlation: number;
  decay: number;
  useBDH: boolean;
  stats?: {
    mean_pairwise_cosine: number;
    std_pairwise_cosine: number;
    min_pairwise_cosine: number;
    max_pairwise_cosine: number;
  };
}

export type ActiveMode = "lab" | "guided" | "stress-test" | "bdh-abstraction" | "research-notebook";
