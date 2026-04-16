# operators.py: Detection of 8 deception operators using regex and semantic rules
# Based on Fibonacci Seal Part II and Living Seal 4.2 / Theorem L3

import re

# Individual detection functions for each operator
# Each returns True if the operator is detected in the text, based on patterns/examples


def detect_omission(text: str) -> bool:
    """Detect Omission (Ω): Hiding evidence, selective quotation.
    Looks for patterns like 'hide', 'omit', 'conceal', 'suppress'."""
    pattern = r"\b(hid(e|ing|den)?|omit|conceal|suppress|selective|leave out)\b"
    return bool(re.search(pattern, text, re.IGNORECASE))


def detect_addition(text: str) -> bool:
    """Detect Addition (A): Fabrication, false testimony.
    Looks for patterns like 'fabricate', 'add', 'insert', 'exaggerate'."""
    pattern = r"\b(fabricat(e|ion)|add|insert|exaggerate|false (testimony|claim))\b"
    return bool(re.search(pattern, text, re.IGNORECASE))


def detect_substitution(text: str) -> bool:
    """Detect Substitution (S): Cipher, impersonation, counterfeit.
    Looks for patterns like 'replace', 'substitute', 'impersonate', 'counterfeit'."""
    pattern = r"\b(replac(e|ing)|substitut(e|ion)|impersonat(e|ion)|counterfeit)\b"
    return bool(re.search(pattern, text, re.IGNORECASE))


def detect_permutation(text: str) -> bool:
    """Detect Permutation (P): Scrambled timeline, causation reversal.
    Looks for patterns like 'reorder', 'scramble', 'reverse (order|causation)'."""
    pattern = r"\b(reorder|scrambl(e|ed)|reverse (order|causation)|permute)\b"
    return bool(re.search(pattern, text, re.IGNORECASE))


def detect_scaling(text: str) -> bool:
    """Detect Scaling (Λ): Exaggeration, minimization.
    Looks for patterns like 'exaggerate', 'minimize', 'overstate', 'understate'."""
    pattern = r"\b(exaggerat(e|ion)|minimiz(e|ation)|overstate|understate|scale)\b"
    return bool(re.search(pattern, text, re.IGNORECASE))


def detect_inversion(text: str) -> bool:
    """Detect Inversion (I): Blame reversal, purpose inversion.
    Looks for patterns like 'invert', 'reverse (blame|purpose)', 'flip'."""
    pattern = r"\b(invert|reverse (blame|purpose)|flip|opposit(e|ion))\b"
    return bool(re.search(pattern, text, re.IGNORECASE))


def detect_displacement(text: str) -> bool:
    """Detect Displacement (Δ): Misattribution, scapegoating.
    Looks for patterns like 'misattribute', 'scapegoat', 'displace', 'shift blame'."""
    pattern = r"\b(misattribut(e|ion)|scapegoat|displac(e|ement)|shift (blame|responsibility))\b"
    return bool(re.search(pattern, text, re.IGNORECASE))


def detect_compression(text: str) -> bool:
    """Detect Compression (Κ): Overgeneralization, lossy summary.
    Looks for patterns like 'overgeneralize', 'summarize', 'compress', 'lossy'."""
    pattern = (
        r"\b(overgeneraliz(e|ation)|summar(ize|y)|compress|lossy|generaliz(e|ation))\b"
    )
    return bool(re.search(pattern, text, re.IGNORECASE))


# Main function to detect all operators
def detect_operators(text: str) -> list:
    """Detect all 8 deception operators in the text.
    Returns list of detected operator names (e.g., ['Omission', 'Addition'])."""
    detected = []
    if detect_omission(text):
        detected.append("Omission")
    if detect_addition(text):
        detected.append("Addition")
    if detect_substitution(text):
        detected.append("Substitution")
    if detect_permutation(text):
        detected.append("Permutation")
    if detect_scaling(text):
        detected.append("Scaling")
    if detect_inversion(text):
        detected.append("Inversion")
    if detect_displacement(text):
        detected.append("Displacement")
    if detect_compression(text):
        detected.append("Compression")
    return detected
