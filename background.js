// background.js
let pyodideReady = false;
let pyodideInstance = null;

async function loadPyodide() {
  if (pyodideReady) return pyodideInstance;
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js');
  pyodideInstance = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/"
  });
  await pyodideInstance.loadPackage(['micropip']);
  pyodideReady = true;
  console.log('✅ Open Veritas: Pyodide loaded');
  return pyodideInstance;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyze") {
    loadPyodide().then(async (py) => {
      // Load all Python modules (see Step 4)
      const result = await py.runPythonAsync(`
        from python.bek_core import analyze_text
        import json
        print(json.dumps(analyze_text("""${message.text}""")))
      `);
      sendResponse({ result: JSON.parse(result) });
    });
    return true; // async response
  }
});
