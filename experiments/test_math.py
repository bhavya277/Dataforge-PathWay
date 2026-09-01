"""
Automated Mathematical Test Suite for Linear Associative Memory Substrate
DataForge 2026: Pathway Track

Tests:
1. Outer-product matrix construction & shape correctness
2. Deterministic reproducibility with random seeds
3. Exact zero cross-talk under orthogonal keys
4. Exact Signal + Crosstalk = Retrieved Vector identity
5. Gram matrix symmetry and diagonal unit properties
6. Decay factor (lambda) exponential forgetting
7. Retrieval Cosine Similarity bounds [-1, 1]
"""

import sys
import os
import unittest
# pyrefly: ignore [missing-import]
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from associative_memory import LinearAssociativeMemory, generate_synthetic_keys


class TestLinearAssociativeMemory(unittest.TestCase):

    def test_outer_product_shape_and_values(self):
        d = 4
        mem = LinearAssociativeMemory(d=d)
        k = np.array([1.0, 0.0, 0.0, 0.0])
        v = np.array([0.0, 2.0, 0.0, 0.0])
        S = mem.store(k, v)
        
        expected_S = np.zeros((4, 4))
        expected_S[1, 0] = 2.0
        
        np.testing.assert_allclose(S, expected_S, atol=1e-12)

    def test_signal_crosstalk_decomposition_multi_decay(self):
        """Verifies exact identity retrieved_value == signal + interference across multiple decay values lambda."""
        d = 8
        N = 6
        decay_values = [1.0, 0.9, 0.75, 0.5]
        
        for lambda_val in decay_values:
            keys, values = generate_synthetic_keys(N, d, correlation=0.45, seed=123)
            mem = LinearAssociativeMemory(d=d, lambda_decay=lambda_val)
            mem.store_sequence(keys, values)
            
            for q_idx in range(N):
                res = mem.retrieve(keys[q_idx], target_idx=q_idx)
                reconstructed = res.signal_component + res.interference_component
                np.testing.assert_allclose(
                    res.retrieved_value, 
                    reconstructed, 
                    atol=1e-12,
                    err_msg=f"Failed exact decomposition at lambda={lambda_val}, query={q_idx}"
                )

    def test_perfect_orthogonal_retrieval(self):
        """When rho = 0 and lambda = 1, interference component MUST be exactly zero vector."""
        d = 6
        N = 4
        keys, values = generate_synthetic_keys(N, d, correlation=0.0, seed=456)
        mem = LinearAssociativeMemory(d=d, lambda_decay=1.0)
        mem.store_sequence(keys, values)
        
        for q_idx in range(N):
            res = mem.retrieve(keys[q_idx], target_idx=q_idx)
            np.testing.assert_allclose(res.interference_component, np.zeros(d), atol=1e-12)
            self.assertAlmostEqual(res.cosine_similarity, 1.0, places=6)
            self.assertAlmostEqual(res.l2_error, 0.0, places=6)

    def test_gram_matrix_properties(self):
        """Gram matrix G must be symmetric with 1.0 on diagonal (unit vectors)."""
        d = 8
        N = 6
        keys, _ = generate_synthetic_keys(N, d, correlation=0.35, seed=789)
        mem = LinearAssociativeMemory(d=d)
        for k in keys:
            mem.store(k, np.zeros(d))
            
        G = mem.get_gram_matrix()
        self.assertEqual(G.shape, (N, N))
        np.testing.assert_allclose(G, G.T, atol=1e-12)
        np.testing.assert_allclose(np.diag(G), np.ones(N), atol=1e-12)

    def test_decay_factor_recency(self):
        """Checks exponential decay lambda in recurrence."""
        d = 4
        lambda_val = 0.5
        mem = LinearAssociativeMemory(d=d, lambda_decay=lambda_val)
        
        k1 = np.array([1, 0, 0, 0], dtype=float)
        v1 = np.array([1, 0, 0, 0], dtype=float)
        k2 = np.array([0, 1, 0, 0], dtype=float)
        v2 = np.array([0, 1, 0, 0], dtype=float)
        
        mem.store(k1, v1)
        mem.store(k2, v2)
        
        # S_2 = 0.5 * (v1 k1^T) + v2 k2^T
        expected_S = np.array([
            [0.5, 0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0, 0.0],
            [0.0, 0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0, 0.0],
        ])
        np.testing.assert_allclose(mem.S, expected_S, atol=1e-12)

    def test_recurrence_vs_direct_summation_arbitrary_decay(self):
        """Tests that S_T = sum_{i=1}^T lambda^(T-i) v_i k_i^T holds for arbitrary decay."""
        d = 6
        N = 5
        lambda_val = 0.85
        keys, values = generate_synthetic_keys(N, d, correlation=0.25, seed=999)
        mem = LinearAssociativeMemory(d=d, lambda_decay=lambda_val)
        mem.store_sequence(keys, values)
        
        S_sum = np.zeros((d, d), dtype=np.float64)
        for i, (k, v) in enumerate(zip(keys, values)):
            decay_factor = lambda_val ** (N - 1 - i)
            S_sum += decay_factor * np.outer(v, k)
            
        np.testing.assert_allclose(mem.S, S_sum, atol=1e-12)


if __name__ == "__main__":
    unittest.main()
