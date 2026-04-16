# emotions.py - Exact bijection from Living Seal Theorem L3 table


def operator_to_emotion(op: str) -> str:
    """
    Maps a deception operator to its primary emotion based on the bijection
    in Living Seal Theorem L3.

    Args:
        op (str): The operator name (e.g., 'Omission', 'Addition').

    Returns:
        str: The corresponding emotion, or 'Unknown' if not found.
    """
    mapping = {
        "Omission": "Sadness",
        "Addition": "Disgust",
        "Substitution": "Surprise",
        "Permutation": "Confusion",
        "Scaling": "Anxiety",
        "Inversion": "Contempt",
        "Displacement": "Anger",
        "Compression": "Occlusion",
    }
    return mapping.get(op, "Unknown")
