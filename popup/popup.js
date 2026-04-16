// popup.js — Handles popup logic and chrome.storage reads

// operatorColors must be defined here; it lives in content.js which runs in a
// separate page context and is not accessible from the popup.
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

document.addEventListener('DOMContentLoaded', () => {
  const statusDiv = document.getElementById('status');
  const verifyBtn = document.getElementById('verify-btn');

  // Fetch the last analysis results written by background.js.
  chrome.storage.local.get('lastResults', (data) => {
    if (data.lastResults) {
      displayResults(data.lastResults);
    } else {
      statusDiv.textContent = 'No recent analysis.';
    }
  });

  // Self-verification button — background.js now handles the 'self_verify' action.
  verifyBtn.addEventListener('click', () => {
    statusDiv.textContent = 'Running verification…';
    chrome.runtime.sendMessage({ action: 'self_verify' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        statusDiv.textContent = 'Verification failed (runtime error).';
        return;
      }
      if (response && response.error) {
        statusDiv.textContent = `Verification error: ${response.error}`;
        return;
      }
      statusDiv.textContent = `Self-Verification: ${
        response && response.self_verified ? 'Passed ✓' : 'Failed ✗'
      }`;
    });
  });
});

function displayResults(results) {
  const statusDiv = document.getElementById('status');
  statusDiv.innerHTML = '';

  const summary = document.createElement('p');
  summary.textContent = `Last Bravo Score: ${Math.round(results.bravo_score || 0)}%`;
  statusDiv.appendChild(summary);

  const opsList = document.createElement('ul');
  (results.operators || []).forEach(op => {
    const li    = document.createElement('li');
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.backgroundColor = operatorColors[op] || '#000';
    badge.textContent = `${op} (${(results.emotions && results.emotions[op]) || 'Unknown'})`;
    li.appendChild(badge);
    opsList.appendChild(li);
  });
  statusDiv.appendChild(opsList);

  const verified = document.createElement('p');
  verified.textContent = `Self-Verified: ${results.self_verified ? '✓' : '✗'}`;
  statusDiv.appendChild(verified);
}
