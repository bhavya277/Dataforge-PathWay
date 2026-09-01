import { KeyValuePair, RetrievalBreakdown } from "./types";

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

export function matrixAdd(A: number[][], B: number[][], scaleB: number = 1.0): number[][] {
  const rows = A.length;
  const cols = A[0].length;
  const result = matrixZero(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = A[i][j] + scaleB * B[i][j];
    }
  }
  return result;
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
  return dotProduct(a, b) / (normA * normB);
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
// 2. Synthetic Orthonormal & Correlated Basis Generator
// ==========================================

function pseudoRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateSyntheticPairs(
  N: number,
  d: number,
  correlation: number,
  seed: number = 42
): KeyValuePair[] {
  const rng = pseudoRandom(seed);
  const colors = [
    "#00E5FF", // Cyan
    "#00F5A0", // Neon Emerald
    "#FFB800", // Amber
    "#FF0055", // Crimson
    "#9E00FF", // Violet
    "#38BDF8", // Sky Blue
    "#F43F5E", // Rose
    "#A855F7", // Purple
    "#10B981", // Teal
    "#F59E0B", // Orange
    "#EC4899", // Pink
    "#6366F1", // Indigo
  ];

  // Generate orthonormal basis vectors using Gram-Schmidt
  const basis: number[][] = [];
  for (let i = 0; i < Math.max(d, N + 1); i++) {
    let v = Array.from({ length: d }, () => rng() * 2 - 1);
    for (let b of basis) {
      const proj = dotProduct(v, b);
      v = v.map((x, idx) => x - proj * b[idx]);
    }
    const norm = vectorNorm(v);
    if (norm > 1e-6) {
      basis.push(v.map((x) => x / norm));
    } else {
      // Fallback unit vector
      const fallback = new Array(d).fill(0);
      fallback[i % d] = 1;
      basis.push(fallback);
    }
  }

  const u_0 = basis[basis.length - 1]; // Shared correlation vector
  const pairs: KeyValuePair[] = [];

  for (let i = 0; i < N; i++) {
    const e_i = basis[i % (d - 1)];
    const sqrtRho = Math.sqrt(Math.max(0, Math.min(1, correlation)));
    const sqrtOneMinusRho = Math.sqrt(Math.max(0, 1.0 - correlation));

    let k_raw = e_i.map((x, idx) => sqrtOneMinusRho * x + sqrtRho * u_0[idx]);
    const key = normalizeVector(k_raw);

    // Value vector: independent orthonormal or unique unit vector
    const v_raw = basis[(i + 1) % d];
    const value = normalizeVector(v_raw);

    pairs.push({
      id: i,
      label: `Pair ${String.fromCharCode(65 + i)}`,
      color: colors[i % colors.length],
      keyVector: key,
      valueVector: value,
    });
  }

  return pairs;
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
    sparsity: number = 0.5
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
      // BDH: Sparse Positive Rectification (ReLU + optional TopK)
      k = k.map((x) => Math.max(0, x));
      v = v.map((x) => Math.max(0, x));
    }

    const delta = outerProduct(v, k);
    let nextS = matrixZero(this.d, this.d);

    for (let r = 0; r < this.d; r++) {
      for (let c = 0; c < this.d; c++) {
        nextS[r][c] = this.decay * this.stateMatrix[r][c] + this.learningRate * delta[r][c];
      }
    }

    if (this.useBDH && this.sparsity < 1.0) {
      // Top-K synaptic connection retention
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
    const v_target = targetPair ? targetPair.valueVector : new Array(this.d).fill(0);

    // Exact Signal Component: lambda^(T - 1 - targetIdx) * v_target * (k_target^T @ q)
    let signalComp = new Array(this.d).fill(0);
    let interferenceComp = new Array(this.d).fill(0);

    if (targetPair && targetIdx >= 0 && targetIdx < T) {
      let k_target = targetPair.keyVector;
      if (this.useBDH) k_target = k_target.map((x) => Math.max(0, x));

      const dotTarget = dotProduct(k_target, q);
      const targetTimeDecay = Math.pow(this.decay, T - 1 - targetIdx);
      signalComp = targetPair.valueVector.map(
        (val) => targetTimeDecay * this.learningRate * val * dotTarget
      );

      // Interference: Sum of all other stored pairs lambda^(T - 1 - i) * v_i * (k_i^T @ q)
      for (let i = 0; i < this.pairs.length; i++) {
        if (i !== targetIdx) {
          let k_i = this.pairs[i].keyVector;
          if (this.useBDH) k_i = k_i.map((x) => Math.max(0, x));
          const dot_i = dotProduct(k_i, q);
          const iTimeDecay = Math.pow(this.decay, T - 1 - i);
          for (let dim = 0; dim < this.d; dim++) {
            interferenceComp[dim] +=
              iTimeDecay * this.learningRate * this.pairs[i].valueVector[dim] * dot_i;
          }
        }
      }
    }

    const cosSim = cosineSimilarity(v_target, retrieved);
    const l2Err = l2Distance(v_target, retrieved);
    const signalMag = vectorNorm(signalComp);
    const crosstalkMag = vectorNorm(interferenceComp);
    const isr = crosstalkMag / (signalMag + 1e-12);

    return {
      queryIdx: targetIdx,
      queryLabel: targetPair ? targetPair.label : "Unknown",
      queryVector: queryVector,
      groundTruthValue: v_target,
      retrievedValue: retrieved,
      signalComponent: signalComp,
      interferenceComponent: interferenceComp,
      cosineSimilarity: cosSim,
      l2Error: l2Err,
      signalMagnitude: signalMag,
      crosstalkMagnitude: crosstalkMag,
      interferenceToSignalRatio: isr,
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
