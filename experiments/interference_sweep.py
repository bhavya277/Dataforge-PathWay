"""
Controlled Interference Sweeps & Empirical Benchmarking
DataForge 2026: Pathway Track

Runs systematic Monte Carlo empirical sweeps:
1. Exp A: Orthogonal baseline (rho = 0.0, N <= d)
2. Exp B: Key correlation parameter sweep (rho from 0.0 to 0.95)
3. Exp C: Memory load ratio sweep (N from 1 to 24 at fixed d=8)
4. Exp D: State dimension sweep (d from 4 to 64 at fixed N=8)
5. Exp E: Decay parameter sweep (lambda from 0.5 to 1.0)
"""

import os
import sys
from typing import Dict, Any, List
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from associative_memory import LinearAssociativeMemory, generate_synthetic_keys


def run_experiment_a_orthogonal_baseline(d: int = 8, N: int = 4, seed: int = 42) -> Dict[str, Any]:
    """Experiment A: Low-overlap baseline where N <= d."""
    keys, values, stats = generate_synthetic_keys(N, d, correlation=0.0, seed=seed)
    mem = LinearAssociativeMemory(d=d, lambda_decay=1.0)
    mem.store_sequence(keys, values)
    
    results = [mem.retrieve(k, target_idx=i) for i, k in enumerate(keys)]
    
    avg_cos_sim = float(np.mean([r.cosine_similarity for r in results]))
    avg_l2_err = float(np.mean([r.raw_l2_error for r in results]))
    avg_crosstalk = float(np.mean([r.crosstalk_magnitude for r in results]))
    
    return {
        "name": "Experiment A: Orthogonal Baseline",
        "d": d,
        "N": N,
        "load_ratio_N_over_d": round(N / d, 3),
        "controlled_correlation_rho": 0.0,
        "observed_mean_cosine": round(stats.mean_cosine, 4),
        "observed_std_cosine": round(stats.std_cosine, 4),
        "avg_cosine_similarity": round(avg_cos_sim, 4),
        "avg_raw_l2_error": round(avg_l2_err, 4),
        "avg_crosstalk_magnitude": round(avg_crosstalk, 4),
        "is_perfect_recall": avg_cos_sim > 0.999999 and avg_l2_err < 1e-10,
    }


def run_experiment_b_correlation_sweep(
    d: int = 8, 
    N: int = 4, 
    steps: int = 20, 
    num_trials: int = 40
) -> List[Dict[str, Any]]:
    """Experiment B: Controlled correlation parameter sweep."""
    rhos = np.linspace(0.0, 0.95, steps)
    sweep_data = []
    
    for rho in rhos:
        cos_sims, cos_errs, l2_errs, isr_list, obs_cosines = [], [], [], [], []
        for trial in range(num_trials):
            keys, values, stats = generate_synthetic_keys(N, d, correlation=float(rho), seed=1000 + trial * 13)
            mem = LinearAssociativeMemory(d=d, lambda_decay=1.0)
            mem.store_sequence(keys, values)
            obs_cosines.append(stats.mean_cosine)
            
            for i, k in enumerate(keys):
                res = mem.retrieve(k, target_idx=i)
                cos_sims.append(res.cosine_similarity)
                cos_errs.append(res.cosine_error)
                l2_errs.append(res.raw_l2_error)
                isr_list.append(res.interference_to_signal_ratio)
                
        sweep_data.append({
            "correlation_param_rho": round(float(rho), 4),
            "observed_mean_pairwise_cosine": round(float(np.mean(obs_cosines)), 4),
            "mean_cosine_similarity": round(float(np.mean(cos_sims)), 4),
            "std_cosine_similarity": round(float(np.std(cos_sims)), 4),
            "mean_cosine_error": round(float(np.mean(cos_errs)), 4),
            "mean_raw_l2_error": round(float(np.mean(l2_errs)), 4),
            "mean_interference_to_signal_ratio": round(float(np.mean(isr_list)), 4),
        })
    return sweep_data


def run_experiment_c_load_sweep(
    d: int = 8, 
    max_N: int = 20, 
    rho: float = 0.35, 
    num_trials: int = 40
) -> List[Dict[str, Any]]:
    """Experiment C: Memory load ratio sweep N/d under isotropic keys."""
    sweep_data = []
    for N in range(1, max_N + 1):
        cos_sims, cos_errs, l2_errs, isr_list, obs_cosines = [], [], [], [], []
        for trial in range(num_trials):
            keys, values, stats = generate_synthetic_keys(N, d, correlation=rho, seed=2000 + trial * 17 + N)
            mem = LinearAssociativeMemory(d=d, lambda_decay=1.0)
            mem.store_sequence(keys, values)
            obs_cosines.append(stats.mean_cosine)
            
            for i, k in enumerate(keys):
                res = mem.retrieve(k, target_idx=i)
                cos_sims.append(res.cosine_similarity)
                cos_errs.append(res.cosine_error)
                l2_errs.append(res.raw_l2_error)
                isr_list.append(res.interference_to_signal_ratio)
                
        sweep_data.append({
            "N": N,
            "d": d,
            "load_ratio_N_over_d": round(N / d, 3),
            "controlled_correlation_rho": rho,
            "observed_mean_pairwise_cosine": round(float(np.mean(obs_cosines)), 4),
            "mean_cosine_similarity": round(float(np.mean(cos_sims)), 4),
            "mean_cosine_error": round(float(np.mean(cos_errs)), 4),
            "mean_raw_l2_error": round(float(np.mean(l2_errs)), 4),
            "mean_interference_to_signal_ratio": round(float(np.mean(isr_list)), 4),
        })
    return sweep_data


def run_experiment_d_dimension_sweep(
    N: int = 8, 
    dimensions: List[int] = [4, 6, 8, 12, 16, 24, 32, 48, 64], 
    rho: float = 0.35, 
    num_trials: int = 40
) -> List[Dict[str, Any]]:
    """Experiment D: Dimension sweep d from 4 to 64 at fixed load N."""
    sweep_data = []
    for d in dimensions:
        cos_sims, cos_errs, l2_errs, isr_list = [], [], [], []
        for trial in range(num_trials):
            keys, values, stats = generate_synthetic_keys(N, d, correlation=rho, seed=3000 + trial * 19 + d)
            mem = LinearAssociativeMemory(d=d, lambda_decay=1.0)
            mem.store_sequence(keys, values)
            
            for i, k in enumerate(keys):
                res = mem.retrieve(k, target_idx=i)
                cos_sims.append(res.cosine_similarity)
                cos_errs.append(res.cosine_error)
                l2_errs.append(res.raw_l2_error)
                isr_list.append(res.interference_to_signal_ratio)
                
        sweep_data.append({
            "d": d,
            "N": N,
            "load_ratio_N_over_d": round(N / d, 3),
            "controlled_correlation_rho": rho,
            "mean_cosine_similarity": round(float(np.mean(cos_sims)), 4),
            "mean_cosine_error": round(float(np.mean(cos_errs)), 4),
            "mean_raw_l2_error": round(float(np.mean(l2_errs)), 4),
            "mean_interference_to_signal_ratio": round(float(np.mean(isr_list)), 4),
        })
    return sweep_data
