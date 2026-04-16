// background.js
// NOTE: Pyodide must be bundled locally in a pyodide/ subdirectory.
// Download from: https://github.com/pyodide/pyodide/releases
// Required files: pyodide.js, pyodide.asm.wasm, pyodide.asm.js,
//                 packages.json, and any packages used.

let pyodideReady = false;
let pyodideInstance = null;

// The Python source files that need to be written into the Pyodide VFS.
const PYTHON_MODULES = [
  '__init__',
  'bek_core',
  'bravo_score',
  'emotions',
  'fac_pipeline',
  'operators',
  'phi_harmony',
  'self_verify',
];

async function loadPyodide() {
  if (pyodideReady) return pyodideInstance;

  // Load Pyodide from a LOCAL file — remote importScripts violates MV3.
  importScripts(chrome.runtime.getURL('pyodide/pyodide.js'));

  pyodideInstance = await globalThis.loadPyodide({
    indexURL: chrome.runtime.getURL('pyodide/')
  });

  // Write every Python module into the Pyodide virtual file system (VFS).
  // Pyodide's WASM sandbox has no access to the extension's real filesystem.
  pyodideInstance.FS.mkdir('/python');

  for (const mod of PYTHON_MODULES) {
    const url = chrome.runtime.getURL(`python/${mod}.py`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch python/${mod}.py`);
    const src = await response.text();
    pyodideInstance.FS.writeFile(`/python/${mod}.py`, src);
  }

  // Point Python's sys.path at the VFS root so `import python.bek_core` resolves.
  await pyodideInstance.runPythonAsync(`
import sys
if '/' not in sys.path:
    sys.path.insert(0, '/')
  `);

  pyodideReady = true;
  console.log('✅ Open Veritas: Pyodide loaded and VFS populated');
  return pyodideInstance;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'analyze') {
    loadPyodide().then(async (py) => {
      try {
        // Pass text via pyodide.globals to avoid any string-injection risk.
        // Never interpolate untrusted text directly into a Python source string.
        py.globals.set('_input_text', message.text);

        const result = await py.runPythonAsync(`
import json
from python.bek_core import analyze_text
json.dumps(analyze_text(_input_text))
        `);

        const parsed = JSON.parse(result);

        // Persist last results so the popup can display them.
        chrome.storage.local.set({ lastResults: parsed });

        sendResponse({ result: parsed });
      } catch (err) {
        console.error('Open Veritas analysis error:', err);
        sendResponse({ error: err.message });
      }
    });
    return true; // keep message channel open for async response
  }

  if (message.action === 'self_verify') {
    loadPyodide().then(async (py) => {
      try {
        const verified = await py.runPythonAsync(`
from python.self_verify import self_verify
self_verify()
        `);
        sendResponse({ self_verified: verified });
      } catch (err) {
        console.error('Open Veritas self-verify error:', err);
        sendResponse({ self_verified: false, error: err.message });
      }
    });
    return true;
  }
});
