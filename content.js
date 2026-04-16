// content.js — Injects floating sidebar on text selection and handles analysis

let sidebar = null;
let debounceTimer = null;

// Use only mouseup. selectionchange fires on every cursor move, flooding the
// background worker with hundreds of simultaneous requests.
document.addEventListener('mouseup', handleSelection);

function handleSelection() {
  // Debounce: wait 300 ms after the user lifts the mouse before sending.
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';

    if (selectedText.length > 0) {
      chrome.runtime.sendMessage({ action: 'analyze', text: selectedText }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Open Veritas:', chrome.runtime.lastError.message);
          return;
        }
        if (response && response.result) {
          showSidebar(response.result, selectedText);
        }
      });
    } else if (sidebar) {
      sidebar.style.display = 'none';
    }
  }, 300);
}

// Colour map used both here and shared with popup via storage.
const operatorColors = {
  'Omission':     '#2196f3',
  'Addition':     '#f44336',
  'Substitution': '#ffeb3b',
  'Permutation':  '#9c27b0',
  'Scaling':      '#ff9800',
  'Inversion':    '#e91e63',
  'Displacement': '#4caf50',
  'Compression':  '#607d8b',
};

function showSidebar(results, selectedText) {
  if (!sidebar) {
    sidebar = document.createElement('div');
    sidebar.id = 'ov-sidebar';
    Object.assign(sidebar.style, {
      position:        'fixed',
      top:             '0',
      right:           '0',
      width:           '300px',
      height:          '100%',
      backgroundColor: 'white',
      borderLeft:      '1px solid #ccc',
      overflowY:       'auto',
      zIndex:          '9999',
      padding:         '10px',
      boxShadow:       '0 0 10px rgba(0,0,0,0.1)',
    });
    document.body.appendChild(sidebar);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.float = 'right';
    closeBtn.style.marginBottom = '10px';
    closeBtn.onclick = () => { sidebar.style.display = 'none'; };
    sidebar.appendChild(closeBtn);

    const style = document.createElement('style');
    style.textContent = `
      #ov-sidebar h3 { margin: 15px 0 5px; font-size: 16px; }
      #ov-sidebar .highlighted { background-color: #ffffcc; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
      #ov-sidebar ul { list-style: none; padding: 0; margin: 0; }
      #ov-sidebar li { margin: 5px 0; }
      #ov-sidebar .badge { padding: 5px 10px; color: white; border-radius: 5px; display: inline-block; }
      #ov-sidebar progress { width: 100%; height: 20px; -webkit-appearance: none; appearance: none; }
      #ov-sidebar progress::-webkit-progress-bar { background-color: #eee; border-radius: 2px; }
      #ov-sidebar progress::-webkit-progress-value { background-color: #4caf50; border-radius: 2px; }
      #ov-sidebar .verified { color: green; font-weight: bold; }
      #ov-sidebar .not-verified { color: red; font-weight: bold; }
    `;
    document.head.appendChild(style);
  }

  // Clear previous content (keep close button at index 0).
  while (sidebar.children.length > 1) {
    sidebar.removeChild(sidebar.lastChild);
  }

  // Selected text
  appendHeader(sidebar, 'Selected Text');
  const textDiv = document.createElement('div');
  textDiv.className = 'highlighted';
  textDiv.textContent = selectedText || 'No text selected';
  sidebar.appendChild(textDiv);

  // Detected operators
  appendHeader(sidebar, 'Detected Operators');
  const opsList = document.createElement('ul');
  (results.operators || []).forEach(op => {
    const li   = document.createElement('li');
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.backgroundColor = operatorColors[op] || '#000';
    badge.textContent = `${op} (${(results.emotions && results.emotions[op]) || 'Unknown'})`;
    li.appendChild(badge);
    opsList.appendChild(li);
  });
  sidebar.appendChild(opsList);

  // Phi residual
  const phiP = document.createElement('p');
  phiP.textContent = `Phi Residual: ${
    results.phi_residual != null ? results.phi_residual.toFixed(4) : 'N/A'
  }`;
  sidebar.appendChild(phiP);

  // Bravo score gauge
  appendHeader(sidebar, 'Bravo Score');
  const progress = document.createElement('progress');
  progress.value = results.bravo_score || 0;
  progress.max   = 100;
  sidebar.appendChild(progress);
  const scoreP = document.createElement('p');
  scoreP.textContent = `${Math.round(results.bravo_score || 0)}%`;
  sidebar.appendChild(scoreP);

  // FAC output — fac_output is a dict, so stringify it for display.
  appendHeader(sidebar, 'FAC Pipeline Output');
  const facP = document.createElement('pre');
  facP.style.cssText = 'font-size:11px; white-space:pre-wrap; word-break:break-word;';
  facP.textContent = results.fac_output
    ? JSON.stringify(results.fac_output, null, 2)
    : 'No FAC output available';
  sidebar.appendChild(facP);

  // Self-verification
  appendHeader(sidebar, 'Self-Verification');
  const verifiedP  = document.createElement('p');
  verifiedP.textContent = 'Status: ';
  const statusSpan = document.createElement('span');
  statusSpan.textContent = results.self_verified ? 'Verified ✓' : 'Not Verified ✗';
  statusSpan.className   = results.self_verified ? 'verified' : 'not-verified';
  verifiedP.appendChild(statusSpan);
  sidebar.appendChild(verifiedP);

  sidebar.style.display = 'block';
}

function appendHeader(parent, text) {
  const h3 = document.createElement('h3');
  h3.textContent = text;
  parent.appendChild(h3);
}
