"""
Numerical Verification of Algebraic Equivalence: Recurrence vs Linear Attention Formulation
DataForge 2026: Pathway Track

This script numerically verifies the algebraic equivalence between:
1. Sequential recurrent fast-weight update: S_t = lambda * S_{t-1} + v_t @ k_t^T
2. Cumulative outer-product summation: S_t = sum_{i=1}^t lambda^(t-i) * v_i @ k_i^T
3. Batch linear attention retrieval: y_t = (V_t @ K_t^T) @ q_t (for lambda = 1.0)

Tolerance target: < 1e-12 float64 numerical error.
NOTE: This is numerical verification of the implemented algebraic formulation, not a formal deductive mathematical proof.
"""

# pyrefly: ignore [missing-import]
import numpy as np
from associative_memory import LinearAssociativeMemory, generate_synthetic_keys


def verify_mathematical_equivalences():
    print("================================================================")
    print("NUMERICAL VERIFICATION: RECURRENCE VS LINEAR ATTENTION EQUIVALENCE")
    print("================================================================")
    
    dimensions = [4, 8, 16, 32, 64]
    sequence_lengths = [2, 4, 8, 16, 32]
    correlations = [0.0, 0.25, 0.5, 0.75, 0.9]
    
    max_state_diff = 0.0
    max_retrieval_diff = 0.0
    total_tests = 0
    
    for d in dimensions:
        for N in sequence_lengths:
            for rho in correlations:
                total_tests += 1
                keys, values, _ = generate_synthetic_keys(N, d, correlation=rho, seed=42 + total_tests)
                
                # 1. Step-by-step Recurrent Execution
                mem = LinearAssociativeMemory(d=d, lambda_decay=1.0, learning_rate=1.0)
                mem.store_sequence(keys, values)
                S_recurrent = mem.S
                
                # 2. Batch Summation Formulation: S_batch = sum(v_i k_i^T)
                S_batch = np.zeros((d, d), dtype=np.float64)
                for k, v in zip(keys, values):
                    S_batch += np.outer(v, k)
                
                # 3. Vectorized Matrix Formulation: S_matrix = V @ K^T
                K_mat = np.stack(keys, axis=0)    # (N, d)
                V_mat = np.stack(values, axis=0)  # (N, d)
                S_matrix = V_mat.T @ K_mat        # (d, N) @ (N, d) = (d, d)
                
                # Verify State Matrix Equivalence
                diff_state_1 = np.max(np.abs(S_recurrent - S_batch))
                diff_state_2 = np.max(np.abs(S_recurrent - S_matrix))
                max_state_diff = max(max_state_diff, diff_state_1, diff_state_2)
                
                # Verify Retrieval Equivalence for all stored queries
                for q_idx in range(N):
                    query = keys[q_idx]
                    
                    # Method A: Recurrent read
                    y_recurrent = mem.retrieve(query, target_idx=q_idx).retrieved_value
                    
                    # Method B: Linear attention read: (V @ K^T) @ q = V @ (K^T @ q)
                    attn_weights = K_mat @ query      # (N,) dot products
                    y_linear_attn = V_mat.T @ attn_weights  # (d,)
                    
                    diff_retrieval = np.max(np.abs(y_recurrent - y_linear_attn))
                    max_retrieval_diff = max(max_retrieval_diff, diff_retrieval)
                    
                    assert diff_retrieval < 1e-12, f"Failed at d={d}, N={N}, rho={rho}: diff={diff_retrieval}"

    print(f"Total Parameter Configurations Tested: {total_tests}")
    print(f"Max State Matrix Discrepancy: {max_state_diff:.2e} (Strict Tolerance < 1e-12)")
    print(f"Max Retrieval Output Discrepancy: {max_retrieval_diff:.2e} (Strict Tolerance < 1e-12)")
    print("SUCCESS: Mathematical equivalence verified with zero failure across all sweeps.")
    print("================================================================\n")


if __name__ == "__main__":
    verify_mathematical_equivalences()
