// content.js - Injects floating sidebar on text selection and handles analysis

// Listen for text selection events
document.addEventListener('mouseup', handleSelection);
document.addEventListener('selectionchange', handleSelection); // For mobile/better detection

let sidebar = null; // Global reference to the sidebar element

function handleSelection() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText.length > 0) {
    // Send the selected text to background.js for analysis
    chrome.runtime.sendMessage({ action: "analyze", text: selectedText }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      // Assuming response.result contains the analysis data
      showSidebar(response.result, selectedText);
    });
  } else if (sidebar) {
    // Hide sidebar if no text is selected
    sidebar.style.display = 'none';
  }
}

function showSidebar(results, selectedText) {
  if (!sidebar) {
    // Create the sidebar element if it doesn't exist
    sidebar = document.createElement('div');
    sidebar.id = 'ov-sidebar';
    sidebar.style.position = 'fixed';
    sidebar.style.top = '0';
    sidebar.style.right = '0';
    sidebar.style.width = '300px';
    sidebar.style.height = '100%';
    sidebar.style.backgroundColor = 'white';
    sidebar.style.borderLeft = '1px solid #ccc';
    sidebar.style.overflowY = 'auto';
    sidebar.style.zIndex = '9999';
    sidebar.style.padding = '10px';
    sidebar.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    document.body.appendChild(sidebar);

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.float = 'right';
    closeBtn.style.marginBottom = '10px';
    closeBtn.onclick = () => { sidebar.style.display = 'none'; };
    sidebar.appendChild(closeBtn);

    // Inject inline CSS for styling (Tailwind-free)
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

  // Clear previous content except close button
  while (sidebar.children.length > 1) {
    sidebar.removeChild(sidebar.lastChild);
  }

  // Display Selected Text
  const textHeader = document.createElement('h3');
  textHeader.textContent = 'Selected Text';
  sidebar.appendChild(textHeader);
  const textDiv = document.createElement('div');
  textDiv.className = 'highlighted';
  textDiv.textContent = selectedText || 'No text selected';
  sidebar.appendChild(textDiv);

  // Detected Operators with colored badges and emotions
  const opsHeader = document.createElement('h3');
  opsHeader.textContent = 'Detected Operators';
  sidebar.appendChild(opsHeader);
  const opsList = document.createElement('ul');
  const operatorColors = {
    'Omission': '#2196f3',    // Blue
    'Addition': '#f44336',     // Red
    'Substitution': '#ffeb3b', // Yellow
    'Permutation': '#9c27b0',  // Purple
    'Scaling': '#ff9800',      // Orange
    'Inversion': '#e91e63',    // Pink
    'Displacement': '#4caf50', // Green
    'Compression': '#607d8b'   // Gray
  };

  (results.operators || []).forEach(op => {
    const li = document.createElement('li');
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.backgroundColor = operatorColors[op] || '#000'; // Default black if not found
    badge.textContent = `${op} (${results.emotions[op] || 'Unknown'})`;
    li.appendChild(badge);
    opsList.appendChild(li);
  });
  sidebar.appendChild(opsList);

  // Phi Residual
  const phiP = document.createElement('p');
  phiP.textContent = `Phi Residual: ${results.phi_residual.toFixed(4) || 'N/A'}`;
  sidebar.appendChild(phiP);

  // Bravo Score Gauge
  const bravoHeader = document.createElement('h3');
  bravoHeader.textContent = 'Bravo Score';
  sidebar.appendChild(bravoHeader);
  const progress = document.createElement('progress');
  progress.value = results.bravo_score || 0;
  progress.max = 100;
  sidebar.appendChild(progress);
  const scoreP = document.createElement('p');
  scoreP.textContent = `${Math.round(results.bravo_score) || 0}%`;
  sidebar.appendChild(scoreP);

  // FAC Output Summary
  const facHeader = document.createElement('h3');
  facHeader.textContent = 'FAC Pipeline Output';
  sidebar.appendChild(facHeader);
  const facP = document.createElement('p');
  facP.textContent = results.fac_output || 'No FAC output available';
  sidebar.appendChild(facP);

  // Self-Verified Status
  const verifiedHeader = document.createElement('h3');
  verifiedHeader.textContent = 'Self-Verification';
  sidebar.appendChild(verifiedHeader);
  const verifiedP = document.createElement('p');
  verifiedP.textContent = 'Status: ';
  const statusSpan = document.createElement('span');
  statusSpan.textContent = results.self_verified ? 'Verified ✓' : 'Not Verified ✗';
  statusSpan.className = results.self_verified ? 'verified' : 'not-verified';
  verifiedP.appendChild(statusSpan);
  sidebar.appendChild(verifiedP);

  // Show the sidebar
  sidebar.style.display = 'block';
}

// Optional: Store last results in chrome.storage for popup access
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getLastResults') {
    chrome.storage.local.get('lastResults', (data) => {
      sendResponse(data.lastResults || {});
    });
    return true;
  }
});
