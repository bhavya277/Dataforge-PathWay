import { KeyValuePair, KeySetStats, RetrievalBreakdown } from "./types";

// ==========================================
// 1. Fundamental Vector & Matrix Operations
// ==========================================

export function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

export function vectorNorm(v: number[]): number {
  return Math.sqrt(dotProduct(v, v));
}

export function normalizeVector(v: number[]): number[] {
  const norm = vectorNorm(v);
  if (norm < 1e-12) return v.slice();
  return v.map((x) => x / norm);
}

export function outerProduct(v: number[], k: number[]): number[][] {
  const d_v = v.length;
  const d_k = k.length;
  const mat: number[][] = Array.from({ length: d_v }, () => new Array(d_k).fill(0));
  for (let i = 0; i < d_v; i++) {
    for (let j = 0; j < d_k; j++) {
      mat[i][j] = v[i] * k[j];
    }
  }
  return mat;
}

export function matrixZero(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => new Array(cols).fill(0));
}

export function matrixVectorMultiply(M: number[][], v: number[]): number[] {
  const rows = M.length;
  const cols = M[0].length;
  const out = new Array(rows).fill(0);
  for (let i = 0; i < rows; i++) {
    let sum = 0;
    for (let j = 0; j < cols; j++) {
      sum += M[i][j] * v[j];
    }
    out[i] = sum;
  }
  return out;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const normA = vectorNorm(a);
  const normB = vectorNorm(b);
  if (normA < 1e-12 || normB < 1e-12) return 0;
  return Math.max(-1.0, Math.min(1.0, dotProduct(a, b) / (normA * normB)));
}

export function l2Distance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

// ==========================================
// 2. Statistically Valid Isotropic Key Generator
// ==========================================

function gaussianRandom(rng: () => number): number {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function pseudoRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function computeKeySetStats(keys: number[][]): KeySetStats {
  const N = keys.length;
  if (N <= 1) {
    return { meanCosine: 1.0, stdCosine: 0.0, minCosine: 1.0, maxCosine: 1.0, isOrthogonal: true };
  }

  const offDiags: number[] = [];
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      offDiags.push(dotProduct(keys[i], keys[j]));
    }
  }

  const sum = offDiags.reduce((a, b) => a + b, 0);
  const mean = sum / offDiags.length;
  const variance = offDiags.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / offDiags.length;
  const std = Math.sqrt(variance);
  const min = Math.min(...offDiags);
  const max = Math.max(...offDiags);
  const isOrth = Math.max(...offDiags.map(Math.abs)) < 1e-6;

  return {
    meanCosine: mean,
    stdCosine: std,
    minCosine: min,
    maxCosine: max,
    isOrthogonal: isOrth,
  };
}

export function generateSyntheticPairs(
  N: number,
  d: number,
  correlation: number,
  seed: number = 42
): { pairs: KeyValuePair[]; stats: KeySetStats } {
  const rng = pseudoRandom(seed);
  const colors = [
    "#00E5FF", // Cyan (Primary target)
    "#F59E0B", // Amber (Interference)
    "#10B981", // Emerald
    "#A855F7", // Purple
    "#38BDF8", // Sky Blue
    "#F43F5E", // Rose
    "#6366F1", // Indigo
    "#EC4899", // Pink
    "#14B8A6", // Teal
    "#EAB308", // Yellow
  ];

  const keys: number[][] = [];
  const values: number[][] = [];

  if (correlation === 0.0 && N <= d) {
    // Exact orthonormal basis for low-overlap baseline where N <= d
    const basis: number[][] = [];
    for (let i = 0; i < d; i++) {
      let v = Array.from({ length: d }, () => gaussianRandom(rng));
      for (const b of basis) {
        const proj = dotProduct(v, b);
        v = v.map((x, idx) => x - proj * b[idx]);
      }
      basis.push(normalizeVector(v));
    }
    for (let i = 0; i < N; i++) {
      keys.push(basis[i]);
    }
  } else {
    // Statistically valid isotropic shared-component model
    let u_0 = Array.from({ length: d }, () => gaussianRandom(rng));
    u_0 = normalizeVector(u_0);

    const sqrtRho = Math.sqrt(Math.max(0, Math.min(1, correlation)));
    const sqrtOneMinusRho = Math.sqrt(Math.max(0, 1.0 - correlation));

    for (let i = 0; i < N; i++) {
      let u_i = Array.from({ length: d }, () => gaussianRandom(rng));
      // Remove projection on u_0 for clean control
      const proj = dotProduct(u_i, u_0);
      u_i = normalizeVector(u_i.map((x, idx) => x - proj * u_0[idx]));

      const k_i = u_i.map((x, idx) => sqrtOneMinusRho * x + sqrtRho * u_0[idx]);
      keys.push(normalizeVector(k_i));
    }
  }

  // Independent isotropic random values
  for (let i = 0; i < N; i++) {
    const v_raw = Array.from({ length: d }, () => gaussianRandom(rng));
    values.push(normalizeVector(v_raw));
  }

  const pairs: KeyValuePair[] = keys.map((k, i) => ({
    id: i,
    label: `Item ${i + 1}`,
    color: colors[i % colors.length],
    keyVector: k,
    valueVector: values[i],
  }));

  const stats = computeKeySetStats(keys);
  return { pairs, stats };
}

// ==========================================
// 3. Associative Memory Simulation Engine
// ==========================================

export class LiveAssociativeEngine {
  d: number;
  decay: number;
  learningRate: number;
  useBDH: boolean;
  sparsity: number;
  stateMatrix: number[][];
  stepHistory: number[][][];
  pairs: KeyValuePair[];

  constructor(
    d: number,
    decay: number = 1.0,
    learningRate: number = 1.0,
    useBDH: boolean = false,
    sparsity: number = 0.4
  ) {
    this.d = d;
    this.decay = decay;
    this.learningRate = learningRate;
    this.useBDH = useBDH;
    this.sparsity = sparsity;
    this.stateMatrix = matrixZero(d, d);
    this.stepHistory = [matrixZero(d, d)];
    this.pairs = [];
  }

  storePair(pair: KeyValuePair): number[][] {
    let k = pair.keyVector.slice();
    let v = pair.valueVector.slice();

    if (this.useBDH) {
      // BDH-inspired sparse positive projection (teaching abstraction)
      k = k.map((x) => Math.max(0, x));
      v = v.map((x) => Math.max(0, x));
    }

    const delta = outerProduct(v, k);
    const nextS = matrixZero(this.d, this.d);

    for (let r = 0; r < this.d; r++) {
      for (let c = 0; c < this.d; c++) {
        nextS[r][c] = this.decay * this.stateMatrix[r][c] + this.learningRate * delta[r][c];
      }
    }

    if (this.useBDH && this.sparsity < 1.0) {
      // Top-K connection retention
      const allVals: { r: number; c: number; val: number }[] = [];
      for (let r = 0; r < this.d; r++) {
        for (let c = 0; c < this.d; c++) {
          allVals.push({ r, c, val: Math.abs(nextS[r][c]) });
        }
      }
      allVals.sort((a, b) => b.val - a.val);
      const keepCount = Math.max(1, Math.floor(allVals.length * this.sparsity));
      const threshold = allVals[keepCount - 1]?.val || 0;

      for (let r = 0; r < this.d; r++) {
        for (let c = 0; c < this.d; c++) {
          if (Math.abs(nextS[r][c]) < threshold) {
            nextS[r][c] = 0;
          }
        }
      }
    }

    this.stateMatrix = nextS;
    this.pairs.push(pair);
    this.stepHistory.push(JSON.parse(JSON.stringify(nextS)));
    return this.stateMatrix;
  }

  retrieve(queryVector: number[], targetIdx: number): RetrievalBreakdown {
    let q = queryVector.slice();
    if (this.useBDH) {
      q = q.map((x) => Math.max(0, x));
    }

    const retrieved = matrixVectorMultiply(this.stateMatrix, q);
    const T = this.pairs.length;
    const targetPair = this.pairs[targetIdx];
    // In BDH-inspired teaching abstraction, ground truth uses the same non-negative sparse representation stored by the model
    const v_target = targetPair
      ? (this.useBDH ? targetPair.valueVector.map((x) => Math.max(0, x)) : targetPair.valueVector)
      : new Array(this.d).fill(0);

    let signalComp = new Array(this.d).fill(0);
    let interferenceComp = new Array(this.d).fill(0);
    let targetTimeDecay = 1.0;

    if (targetPair && targetIdx >= 0 && targetIdx < T) {
      let k_target = targetPair.keyVector;
      if (this.useBDH) k_target = k_target.map((x) => Math.max(0, x));

      const dotTarget = dotProduct(k_target, q);
      targetTimeDecay = Math.pow(this.decay, T - 1 - targetIdx);
      const v_target_eff = this.useBDH
        ? targetPair.valueVector.map((x) => Math.max(0, x))
        : targetPair.valueVector;

      signalComp = v_target_eff.map(
        (val) => targetTimeDecay * this.learningRate * val * dotTarget
      );

      // Cross-talk decomposition
      for (let i = 0; i < this.pairs.length; i++) {
        if (i !== targetIdx) {
          let k_i = this.pairs[i].keyVector;
          let v_i = this.pairs[i].valueVector;
          if (this.useBDH) {
            k_i = k_i.map((x) => Math.max(0, x));
            v_i = v_i.map((x) => Math.max(0, x));
          }
          const dot_i = dotProduct(k_i, q);
          const iTimeDecay = Math.pow(this.decay, T - 1 - i);
          for (let dim = 0; dim < this.d; dim++) {
            interferenceComp[dim] +=
              iTimeDecay * this.learningRate * v_i[dim] * dot_i;
          }
        }
      }
    }

    const cosSim = cosineSimilarity(v_target, retrieved);
    const cosErr = 1.0 - cosSim;
    const rawL2 = l2Distance(v_target, retrieved);
    const signalMag = vectorNorm(signalComp);
    const crosstalkMag = vectorNorm(interferenceComp);
    const isr = crosstalkMag / (signalMag + 1e-12);

    // Exact linear decomposition invariant: retrieved ≈ signalComp + interferenceComp
    const reconstructed = signalComp.map((s, idx) => s + interferenceComp[idx]);
    const decompositionResidual = l2Distance(retrieved, reconstructed);

    return {
      queryIdx: targetIdx,
      queryLabel: targetPair ? targetPair.label : "Unknown",
      queryVector: queryVector,
      groundTruthValue: v_target,
      retrievedValue: retrieved,
      signalComponent: signalComp,
      interferenceComponent: interferenceComp,
      cosineSimilarity: cosSim,
      cosineError: cosErr,
      rawL2Error: rawL2,
      signalMagnitude: signalMag,
      crosstalkMagnitude: crosstalkMag,
      interferenceToSignalRatio: isr,
      timeDecayFactor: targetTimeDecay,
      decompositionResidual,
      isExactLinear: !this.useBDH,
    };
  }

  getGramMatrix(): number[][] {
    const N = this.pairs.length;
    const G = matrixZero(N, N);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        let k_i = this.pairs[i].keyVector;
        let k_j = this.pairs[j].keyVector;
        if (this.useBDH) {
          k_i = k_i.map((x) => Math.max(0, x));
          k_j = k_j.map((x) => Math.max(0, x));
        }
        G[i][j] = dotProduct(k_i, k_j);
      }
    }
    return G;
  }
}
