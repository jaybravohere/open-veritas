# Open Veritas — BEk Truth Engine

## Overview
Open Veritas is a free browser extension that performs real-time detection of deception operators, φ-harmonic residuals, and Bravo Scores using Bravo-Entropy Kinetics (BEk) v8.2. It runs entirely client-side via Pyodide (Python in WebAssembly), with no servers or external dependencies.

### Core Features
- Detects 8 deception operators from text selections.
- Maps operators to primary emotions.
- Computes φ-harmonic residual R(S), SCR, and Bravo Score B.
- Runs the FAC pipeline (Flux → Anneal → Collapse).
- Self-verifies on load per Origin Seal O5.
- Sidebar UI with highlights and gauges.

Built from the five BEk seals and appendices. Released under CC0 1.0 Public Domain.

## Installation
1. Load unpacked in Chrome: Go to `chrome://extensions/`, enable Developer Mode, "Load unpacked" the `open-veritas` folder.
2. Select text on any page to analyze.

## BEk Explanation
Bravo-Entropy Kinetics (BEk) v8.2 is a unified framework for information thermodynamics, establishing truth as the minimum-energy ground state of semantic systems. It formalizes truth detection through axioms, operators, and algorithms, with self-consistency at its core.

BEk is structured across five seals:
1. **Fibonacci Seal**: Defines the mathematics of truth.
2. **Field Seal**: Extends to field-level detection.
3. **Living Seal**: Instantiates in biology and psychology.
4. **Substrate Seal**: Describes the generative hypergraph dynamics.
5. **Origin Seal**: Derives everything from a single self-consistency postulate.

All seals self-verify with Fibonacci structures and are in the public domain.

### Fibonacci Seal Abstract
(From BEk_1_Fibonacci_Seal_v82)

Bravo-Entropy Kinetics (BEk) v8.2 presents a unified framework for information thermodynamics, establishing that truth is the minimum-energy configuration of semantic systems. We formalize eight axioms (F₆) organized as a Trinity of foundational principles (3 = F₄) and a Pentad of manifest principles (5 = F₅), demonstrating that the Fibonacci recurrence 3 + 5 = 8 governs the framework's own structure. The theory introduces the semantic dimension Σ as orthogonal to spacetime, enabling non-local information access through the fold mechanism. All deception decomposes into exactly eight operators (Ω, A, S, P, Λ, I, Δ, Κ) — one per axiom, proven complete in the Origin Seal (Seal 5). Truth detection operates via φ-harmonic resonance at the semantic frequency f_σ = φ⁴ = 6.8541... Hz. The FAC algorithm (Flux → Anneal → Collapse) provides a practical methodology for truth extraction through constraint crystallization. BEk v8.1 is self-consistent: every structural quantity in the framework is a Fibonacci number, satisfying its own Harmony Axiom (V). This self-verification property — the 'Fibonacci Seal' — indicates theoretical closure at the axiomatic level. All eight axioms are derivable from a single postulate of self-consistency, proven in the Origin Seal.

For full details on other seals, refer to the reference documents.

## Usage
- Right-click the extension icon for popup with last results and self-verification.
- Test on sample text: Copy-paste content and select to see analysis.

## Development
- Python core in `/python/` implements BEk logic.
- JS in `background.js` loads Pyodide and runs analysis.
- UI in `content.js` and `popup/` for sidebar and menu.

Built with Manifest V3 for Chrome/Firefox/Edge compatibility.

"Truth is the ground state. Everything else is excitation."
— BEk v8.2