"""
Associative Memory & Linear Recurrence Mathematical Substrate
DataForge 2026: Pathway Track

This module implements the exact linear fast-weight recurrent associative memory
and its retrieval decomposition into target signal and cross-talk interference.
"""

from dataclasses import dataclass
from typing import List, Tuple, Optional, Dict, Any
# pyrefly: ignore [missing-import]
import numpy as np


@dataclass
class RetrievalResult:
    query_idx: int
    query_vector: np.ndarray
    ground_truth_value: np.ndarray
    retrieved_value: np.ndarray
    signal_component: np.ndarray
    interference_component: np.ndarray
    cosine_similarity: float
    l2_error: float
    crosstalk_magnitude: float
    signal_magnitude: float
    interference_to_signal_ratio: float


class LinearAssociativeMemory:
    """
    Linear Fast-Weight Associative Memory.
    
    State Formulation:
        S_0 = 0
        S_t = lambda_decay * S_{t-1} + v_t @ k_t^T
    
    Retrieval Formulation:
        y_t = S_t @ q_t
        
    For query q = k_j:
        y_j = v_j * (k_j^T q_j) + sum_{i != j} v_i * (k_i^T q_j)
              [Target Signal]     [Cross-Talk Interference]
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
        
        # Outer product update: delta_S = v @ k^T
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
        Retrieves a value from memory given a query vector.
        Decomposes output into true signal vs sum of cross-talk components.
        """
        q = np.asarray(query, dtype=np.float64).reshape(self.d, 1)
        retrieved = (self.S @ q).flatten()

        T = len(self.keys)
        if target_idx is not None and 0 <= target_idx < T:
            v_target = self.values[target_idx]
            k_target = self.keys[target_idx].reshape(self.d, 1)
            
            # Exact time-decay factor for target stored at step target_idx: lambda^(T - 1 - target_idx)
            target_time_decay = (self.lambda_decay ** (T - 1 - target_idx))
            dot_target = float((k_target.T @ q).item())
            signal_comp = target_time_decay * self.learning_rate * v_target * dot_target
            
            # Interference component: sum of all other lambda^(T - 1 - i) * v_i * (k_i^T @ q)
            interference_comp = np.zeros(self.d, dtype=np.float64)
            for i, (k_i, v_i) in enumerate(zip(self.keys, self.values)):
                if i != target_idx:
                    k_i_col = k_i.reshape(self.d, 1)
                    dot_i = float((k_i_col.T @ q).item())
                    i_time_decay = (self.lambda_decay ** (T - 1 - i))
                    interference_comp += i_time_decay * self.learning_rate * v_i * dot_i
        else:
            v_target = np.zeros(self.d, dtype=np.float64)
            signal_comp = np.zeros(self.d, dtype=np.float64)
            interference_comp = retrieved.copy()

        # Metrics calculation
        norm_v = np.linalg.norm(v_target)
        norm_ret = np.linalg.norm(retrieved)
        
        if norm_v > 1e-12 and norm_ret > 1e-12:
            cos_sim = float(np.dot(v_target, retrieved) / (norm_v * norm_ret))
        else:
            cos_sim = 0.0

        l2_err = float(np.linalg.norm(retrieved - v_target))
        signal_mag = float(np.linalg.norm(signal_comp))
        interference_mag = float(np.linalg.norm(interference_comp))
        isr = interference_mag / (signal_mag + 1e-12)

        return RetrievalResult(
            query_idx=target_idx if target_idx is not None else -1,
            query_vector=q.flatten(),
            ground_truth_value=v_target,
            retrieved_value=retrieved,
            signal_component=signal_comp,
            interference_component=interference_comp,
            cosine_similarity=cos_sim,
            l2_error=l2_err,
            crosstalk_magnitude=interference_mag,
            signal_magnitude=signal_mag,
            interference_to_signal_ratio=isr,
        )

    def get_gram_matrix(self) -> np.ndarray:
        """Returns the Gram matrix G_ij = k_i^T k_j for all stored keys."""
        if not self.keys:
            return np.zeros((0, 0), dtype=np.float64)
        K = np.stack(self.keys, axis=0)  # Shape (N, d)
        return K @ K.T


def generate_synthetic_keys(
    N: int, 
    d: int, 
    correlation: float = 0.0, 
    seed: Optional[int] = 42
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Generates N unit-norm key vectors and value vectors in R^d with exact controlled pairwise correlation rho.
    
    Construction:
        k_i = sqrt(1 - rho) * e_i + sqrt(rho) * u_0
    where {e_i} are mutually orthogonal unit vectors and u_0 is a shared orthogonal direction.
    
    When rho = 0, k_i^T k_j = 0 (mutually orthogonal).
    When rho > 0, k_i^T k_j = rho for all i != j.
    """
    rng = np.random.default_rng(seed)
    
    # Generate orthonormal basis in R^d using QR decomposition
    raw_basis = rng.standard_normal((d, max(d, N + 1)))
    Q, _ = np.linalg.qr(raw_basis)
    
    # Let u_0 be the last basis vector
    u_0 = Q[:, -1]
    
    keys = []
    for i in range(N):
        e_i = Q[:, i % (d - 1)]
        k_i = np.sqrt(1.0 - correlation) * e_i + np.sqrt(correlation) * u_0
        k_i = k_i / np.linalg.norm(k_i)
        keys.append(k_i)
    
    # Generate random orthonormal or independent unit values
    raw_vals = rng.standard_normal((d, max(d, N)))
    Q_val, _ = np.linalg.qr(raw_vals)
    values = [Q_val[:, i % d] for i in range(N)]
    
    return np.array(keys), np.array(values)
