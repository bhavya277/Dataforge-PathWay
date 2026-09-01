"""
Associative Memory & Linear Recurrence Mathematical Substrate
DataForge 2026: Pathway Track

Implements linear fast-weight recurrent associative memory with exact
time-decayed signal/cross-talk decomposition and statistically valid isotropic key generation.
"""

from dataclasses import dataclass
from typing import List, Tuple, Optional, Dict, Any
import numpy as np


@dataclass
class KeySetStats:
    mean_cosine: float
    std_cosine: float
    min_cosine: float
    max_cosine: float
    is_orthogonal: bool


@dataclass
class RetrievalResult:
    query_idx: int
    query_vector: np.ndarray
    ground_truth_value: np.ndarray
    retrieved_value: np.ndarray
    signal_component: np.ndarray
    interference_component: np.ndarray
    cosine_similarity: float
    cosine_error: float
    raw_l2_error: float
    crosstalk_magnitude: float
    signal_magnitude: float
    interference_to_signal_ratio: float
    time_decay_factor: float


class LinearAssociativeMemory:
    """
    Linear Fast-Weight Associative Memory.
    
    Generalized Recurrent Formulation:
        S_0 = 0
        S_t = lambda_decay * S_{t-1} + v_t @ k_t^T = sum_{i=1}^t lambda^(t-i) * (v_i @ k_i^T)
    
    Retrieval Formulation for query q_t:
        y_t = S_t @ q_t = sum_{i=1}^t lambda^(t-i) * v_i * (k_i^T @ q_t)
        
    For query corresponding to target key j (q = k_j):
        Target Signal = lambda^(t-j) * v_j * (k_j^T q_j)
        Cross-Talk    = sum_{i != j} lambda^(t-i) * v_i * (k_i^T q_j)
    """

    def __init__(self, d: int, lambda_decay: float = 1.0, learning_rate: float = 1.0):
        self.d = d
        self.lambda_decay = float(lambda_decay)
        self.learning_rate = float(learning_rate)
        self.S = np.zeros((d, d), dtype=np.float64)
        self.history_S: List[np.ndarray] = [self.S.copy()]
        self.keys: List[np.ndarray] = []
        self.values: List[np.ndarray] = []

    def reset(self):
        self.S = np.zeros((self.d, self.d), dtype=np.float64)
        self.history_S = [self.S.copy()]
        self.keys = []
        self.values = []

    def store(self, key: np.ndarray, value: np.ndarray) -> np.ndarray:
        """Stores a key-value pair and returns the updated state S_t."""
        k = np.asarray(key, dtype=np.float64).reshape(self.d, 1)
        v = np.asarray(value, dtype=np.float64).reshape(self.d, 1)
        
        delta_S = self.learning_rate * (v @ k.T)
        self.S = self.lambda_decay * self.S + delta_S
        
        self.keys.append(k.flatten())
        self.values.append(v.flatten())
        self.history_S.append(self.S.copy())
        return self.S

    def store_sequence(self, keys: np.ndarray, values: np.ndarray):
        """Stores a batch of keys and values sequentially."""
        for k, v in zip(keys, values):
            self.store(k, v)

    def retrieve(self, query: np.ndarray, target_idx: Optional[int] = None) -> RetrievalResult:
        """
        Retrieves a value from memory given query vector q.
        Decomposes output into exact time-decayed target signal vs sum of cross-talk components.
        """
        q = np.asarray(query, dtype=np.float64).reshape(self.d, 1)
        retrieved = (self.S @ q).flatten()
        T = len(self.keys)

        if target_idx is not None and 0 <= target_idx < T:
            v_target = self.values[target_idx]
            k_target = self.keys[target_idx].reshape(self.d, 1)
            
            # Exact time decay factor: lambda^(T - 1 - target_idx)
            target_decay = float(self.lambda_decay ** (T - 1 - target_idx))
            dot_target = float((k_target.T @ q).item())
            signal_comp = target_decay * self.learning_rate * v_target * dot_target
            
            # Cross-talk: sum_{i != target} lambda^(T - 1 - i) * v_i * (k_i^T @ q)
            interference_comp = np.zeros(self.d, dtype=np.float64)
            for i, (k_i, v_i) in enumerate(zip(self.keys, self.values)):
                if i != target_idx:
                    k_i_col = k_i.reshape(self.d, 1)
                    dot_i = float((k_i_col.T @ q).item())
                    i_decay = float(self.lambda_decay ** (T - 1 - i))
                    interference_comp += i_decay * self.learning_rate * v_i * dot_i
        else:
            v_target = np.zeros(self.d, dtype=np.float64)
            signal_comp = np.zeros(self.d, dtype=np.float64)
            interference_comp = retrieved.copy()
            target_decay = 1.0

        # Metric calculations
        norm_v = np.linalg.norm(v_target)
        norm_ret = np.linalg.norm(retrieved)
        
        if norm_v > 1e-12 and norm_ret > 1e-12:
            cos_sim = float(np.dot(v_target, retrieved) / (norm_v * norm_ret))
        else:
            cos_sim = 0.0

        cos_sim = max(-1.0, min(1.0, cos_sim))
        cos_err = 1.0 - cos_sim
        raw_l2 = float(np.linalg.norm(retrieved - v_target))
        signal_mag = float(np.linalg.norm(signal_comp))
        crosstalk_mag = float(np.linalg.norm(interference_comp))
        isr = crosstalk_mag / (signal_mag + 1e-12)

        return RetrievalResult(
            query_idx=target_idx if target_idx is not None else -1,
            query_vector=q.flatten(),
            ground_truth_value=v_target,
            retrieved_value=retrieved,
            signal_component=signal_comp,
            interference_component=interference_comp,
            cosine_similarity=cos_sim,
            cosine_error=cos_err,
            raw_l2_error=raw_l2,
            crosstalk_magnitude=crosstalk_mag,
            signal_magnitude=signal_mag,
            interference_to_signal_ratio=isr,
            time_decay_factor=target_decay,
        )

    def get_gram_matrix(self) -> np.ndarray:
        """Returns the Gram matrix G_ij = k_i^T k_j for all stored keys."""
        if not self.keys:
            return np.zeros((0, 0), dtype=np.float64)
        K = np.stack(self.keys, axis=0)
        return K @ K.T


def compute_key_stats(keys: np.ndarray) -> KeySetStats:
    """Computes observed pairwise cosine similarity statistics across a set of keys."""
    N = len(keys)
    if N <= 1:
        return KeySetStats(1.0, 0.0, 1.0, 1.0, True)
        
    K = np.stack(keys, axis=0)
    G = K @ K.T
    
    off_diags = []
    for i in range(N):
        for j in range(i + 1, N):
            off_diags.append(G[i, j])
            
    off_arr = np.array(off_diags)
    mean_cos = float(np.mean(off_arr))
    std_cos = float(np.std(off_arr))
    min_cos = float(np.min(off_arr))
    max_cos = float(np.max(off_arr))
    is_orth = float(np.max(np.abs(off_arr))) < 1e-10
    
    return KeySetStats(mean_cos, std_cos, min_cos, max_cos, is_orth)


def generate_synthetic_keys(
    N: int, 
    d: int, 
    correlation: float = 0.0, 
    seed: Optional[int] = 42
) -> Tuple[np.ndarray, np.ndarray, KeySetStats]:
    """
    Generates N unit-norm keys and values in R^d using statistically valid isotropic modeling.
    
    Methodology:
    - If correlation == 0.0 and N <= d: Constructs an exact orthonormal basis via QR decomposition.
    - For general correlation rho or N > d: Constructs keys via the standard isotropic shared-component model:
          k_i = normalize( sqrt(1 - rho) * u_i + sqrt(rho) * u_0 )
      where u_i and u_0 are independent Gaussian random vectors in R^d.
      
    Values are generated as independent isotropic unit vectors.
    """
    rng = np.random.default_rng(seed)
    
    if correlation == 0.0 and N <= d:
        # Exact orthonormal construction for orthogonal baseline within rank capacity
        raw_basis = rng.standard_normal((d, d))
        Q, _ = np.linalg.qr(raw_basis)
        keys = [Q[:, i] for i in range(N)]
    else:
        # Statistically valid isotropic shared-component model
        u_0 = rng.standard_normal(d)
        u_0 = u_0 / np.linalg.norm(u_0)
        
        sqrt_rho = np.sqrt(max(0.0, min(1.0, correlation)))
        sqrt_one_minus_rho = np.sqrt(max(0.0, 1.0 - correlation))
        
        keys = []
        for _ in range(N):
            u_i = rng.standard_normal(d)
            # Remove projection on u_0 to maintain clean parameter control
            u_i = u_i - np.dot(u_i, u_0) * u_0
            norm_ui = np.linalg.norm(u_i)
            if norm_ui > 1e-12:
                u_i = u_i / norm_ui
            else:
                u_i = rng.standard_normal(d)
                u_i = u_i / np.linalg.norm(u_i)
                
            k_i = sqrt_one_minus_rho * u_i + sqrt_rho * u_0
            k_i = k_i / np.linalg.norm(k_i)
            keys.append(k_i)
            
    keys_arr = np.array(keys)
    
    # Values: independent random unit vectors
    raw_vals = rng.standard_normal((N, d))
    values_arr = raw_vals / np.linalg.norm(raw_vals, axis=1, keepdims=True)
    
    stats = compute_key_stats(keys_arr)
    return keys_arr, values_arr, stats
