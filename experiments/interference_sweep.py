"""
Controlled Interference Sweeps & Empirical Benchmarking
DataForge 2026: Pathway Track

This script runs the 5 systematic experimental suites:
1. Exp A: Orthogonal baseline (rho = 0.0)
2. Exp B: Key correlation sweep (rho from 0.0 to 0.95)
3. Exp C: Memory load sweep (N from 1 to 32 at fixed d=8)
4. Exp D: State dimension sweep (d from 4 to 64 at fixed N=8)
5. Exp E: Combined parameter stress grid (N, d, rho)
"""

import os
import sys
from typing import Dict, Any, List
# pyrefly: ignore [missing-import]
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from associative_memory import LinearAssociativeMemory, generate_synthetic_keys


def run_experiment_a_orthogonal_baseline(d: int = 8, N: int = 4, seed: int = 42) -> Dict[str, Any]:
    """Experiment A: Pure Orthogonal Keys (rho = 0.0)."""
    keys, values = generate_synthetic_keys(N, d, correlation=0.0, seed=seed)
    mem = LinearAssociativeMemory(d=d)
    mem.store_sequence(keys, values)
    
    results = [mem.retrieve(k, target_idx=i) for i, k in enumerate(keys)]
    
    avg_cos_sim = float(np.mean([r.cosine_similarity for r in results]))
    avg_l2_err = float(np.mean([r.l2_error for r in results]))
    avg_crosstalk = float(np.mean([r.crosstalk_magnitude for r in results]))
    
    return {
        "name": "Experiment A: Orthogonal Baseline",
        "d": d,
        "N": N,
        "correlation": 0.0,
        "avg_cosine_similarity": avg_cos_sim,
        "avg_l2_error": avg_l2_err,
        "avg_crosstalk_magnitude": avg_crosstalk,
        "is_perfect_recall": avg_cos_sim > 0.999999 and avg_l2_err < 1e-10,
    }


def run_experiment_b_correlation_sweep(
    d: int = 8, 
    N: int = 4, 
    steps: int = 20, 
    num_trials: int = 50
) -> List[Dict[str, Any]]:
    """Experiment B: Correlation sweep from 0.0 to 0.95."""
    rhos = np.linspace(0.0, 0.95, steps)
    sweep_data = []
    
    for rho in rhos:
        cos_sims, l2_errs, isr_list = [], [], []
        for trial in range(num_trials):
            keys, values = generate_synthetic_keys(N, d, correlation=float(rho), seed=1000 + trial)
            mem = LinearAssociativeMemory(d=d)
            mem.store_sequence(keys, values)
            
            for i, k in enumerate(keys):
                res = mem.retrieve(k, target_idx=i)
                cos_sims.append(res.cosine_similarity)
                l2_errs.append(res.l2_error)
                isr_list.append(res.interference_to_signal_ratio)
                
        sweep_data.append({
            "correlation": round(float(rho), 4),
            "mean_cosine_similarity": float(np.mean(cos_sims)),
            "std_cosine_similarity": float(np.std(cos_sims)),
            "mean_l2_error": float(np.mean(l2_errs)),
            "mean_interference_to_signal_ratio": float(np.mean(isr_list)),
        })
    return sweep_data


def run_experiment_c_load_sweep(
    d: int = 8, 
    max_N: int = 24, 
    rho: float = 0.3, 
    num_trials: int = 50
) -> List[Dict[str, Any]]:
    """Experiment C: Memory load sweep N from 1 to max_N at fixed d."""
    sweep_data = []
    for N in range(1, max_N + 1):
        cos_sims, l2_errs, isr_list = [], [], []
        for trial in range(num_trials):
            keys, values = generate_synthetic_keys(N, d, correlation=rho, seed=2000 + trial * 100 + N)
            mem = LinearAssociativeMemory(d=d)
            mem.store_sequence(keys, values)
            
            for i, k in enumerate(keys):
                res = mem.retrieve(k, target_idx=i)
                cos_sims.append(res.cosine_similarity)
                l2_errs.append(res.l2_error)
                isr_list.append(res.interference_to_signal_ratio)
                
        sweep_data.append({
            "N": N,
            "d": d,
            "load_ratio_N_over_d": round(N / d, 3),
            "correlation": rho,
            "mean_cosine_similarity": float(np.mean(cos_sims)),
            "mean_l2_error": float(np.mean(l2_errs)),
            "mean_interference_to_signal_ratio": float(np.mean(isr_list)),
        })
    return sweep_data


def run_experiment_d_dimension_sweep(
    N: int = 8, 
    dimensions: List[int] = [4, 8, 12, 16, 24, 32, 48, 64], 
    rho: float = 0.3, 
    num_trials: int = 50
) -> List[Dict[str, Any]]:
    """Experiment D: Dimension sweep d from 4 to 64 at fixed N."""
    sweep_data = []
    for d in dimensions:
        cos_sims, l2_errs, isr_list = [], [], []
        for trial in range(num_trials):
            keys, values = generate_synthetic_keys(N, d, correlation=rho, seed=3000 + trial * 100 + d)
            mem = LinearAssociativeMemory(d=d)
            mem.store_sequence(keys, values)
            
            for i, k in enumerate(keys):
                res = mem.retrieve(k, target_idx=i)
                cos_sims.append(res.cosine_similarity)
                l2_errs.append(res.l2_error)
                isr_list.append(res.interference_to_signal_ratio)
                
        sweep_data.append({
            "d": d,
            "N": N,
            "load_ratio_N_over_d": round(N / d, 3),
            "correlation": rho,
            "mean_cosine_similarity": float(np.mean(cos_sims)),
            "mean_l2_error": float(np.mean(l2_errs)),
            "mean_interference_to_signal_ratio": float(np.mean(isr_list)),
        })
    return sweep_data


if __name__ == "__main__":
    print("Running Experiment A (Orthogonal)...")
    res_a = run_experiment_a_orthogonal_baseline()
    print("Result A:", res_a)
    
    print("\nRunning Experiment B (Correlation Sweep)...")
    res_b = run_experiment_b_correlation_sweep(steps=5, num_trials=10)
    for r in res_b:
        print(f"rho={r['correlation']:.2f} -> CosSim={r['mean_cosine_similarity']:.4f}, L2Err={r['mean_l2_error']:.4f}")
        
    print("\nRunning Experiment C (Memory Load Sweep)...")
    res_c = run_experiment_c_load_sweep(max_N=8, num_trials=10)
    for r in res_c:
        print(f"N={r['N']} (N/d={r['load_ratio_N_over_d']:.2f}) -> CosSim={r['mean_cosine_similarity']:.4f}, ISR={r['mean_interference_to_signal_ratio']:.4f}")
