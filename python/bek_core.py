# bek_core.py — Central analysis entry point

from .bravo_score import calculate_bravo
from .emotions import operator_to_emotion
from .fac_pipeline import run_fac
from .operators import detect_operators
from .phi_harmony import phi_harmonic_residual
# self_verify is imported lazily inside analyze_text (see below).
# Although self_verify.py no longer imports bek_core, keeping the import lazy
# is an extra safety measure that also avoids any startup-time import cycle on
# Python implementations that process module-level imports differently.


def analyze_text(text: str) -> dict:
    # Flux stage
    operators = detect_operators(text)
    r         = phi_harmonic_residual(text)
    scr       = 0.0  # placeholder — computed fully in fac_pipeline

    # Full FAC
    fac_result = run_fac(text)

    # Bravo Score
    b_star = calculate_bravo(r, scr, len(operators))

    # Emotion mapping
    emotion_map = {op: operator_to_emotion(op) for op in operators}

    # Lazy import of self_verify avoids any circular-import risk at module load time.
    from .self_verify import self_verify  # noqa: PLC0415

    return {
        "operators":    operators,
        "emotions":     emotion_map,
        "phi_residual": round(r, 4),
        "bravo_score":  round(b_star, 1),
        "fac_output":   fac_result,
        "self_verified": self_verify(),
    }
