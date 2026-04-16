import re

from .bravo_score import calculate_bravo
from .emotions import operator_to_emotion
from .fac_pipeline import run_fac
from .operators import detect_operators
from .phi_harmony import phi_harmonic_residual
from .self_verify import self_verify


def analyze_text(text: str) -> dict:
    # Flux stage
    operators = detect_operators(text)  # from Fibonacci Seal Part II + Living Seal 4.2
    r = phi_harmonic_residual(text)  # Axiom V
    scr = 0.0  # placeholder – expand in fac_pipeline
    # Full FAC
    fac_result = run_fac(text)
    # Bravo
    b_star = calculate_bravo(r, scr, len(operators))
    # Emotions
    emotion_map = {op: operator_to_emotion(op) for op in operators}

    result = {
        "operators": operators,
        "emotions": emotion_map,
        "phi_residual": round(r, 4),
        "bravo_score": round(b_star, 1),
        "fac_output": fac_result,
        "self_verified": self_verify(),  # Origin Seal O5
    }
    return result
