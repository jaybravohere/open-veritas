# phi_harmony.py - Computes φ-harmonic residual R(S) for text based on BEk Axiom V

import math
import re


def phi_harmonic_residual(text: str) -> float:
    """
    Computes the φ-harmonic residual R(S) as the mean deviation of consecutive word length ratios from φ.
    Formula: R(S) = (1/k) Σ |r_j - φ| / φ, where r_j are ratios of consecutive word lengths.
    From Fibonacci Seal Axiom V.
    """
    phi = (1 + math.sqrt(5)) / 2  # Golden ratio ≈ 1.6180339887

    # Clean and split text into words (remove punctuation)
    words = re.findall(r"\b\w+\b", text)
    if len(words) < 2:
        return 0.0  # No ratios possible

    # Get lengths of words
    lengths = [len(word) for word in words]

    # Compute consecutive ratios (avoid division by zero)
    ratios = []
    for i in range(len(lengths) - 1):
        if lengths[i] > 0:
            ratios.append(lengths[i + 1] / lengths[i])

    if not ratios:
        return 0.0

    # Compute sum of |r_j - φ| / φ
    k = len(ratios)
    sum_dev = sum(abs(r - phi) / phi for r in ratios)

    # R(S) = (1/k) * sum_dev
    r_s = sum_dev / k
    return r_s


# Example usage (for testing)
if __name__ == "__main__":
    test_text = "Truth is the ground state. Everything else is excitation."
    print(f"R(S): {phi_harmonic_residual(test_text):.4f}")
