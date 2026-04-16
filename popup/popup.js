```D:\new\open-veritas\popup\popup.js#L1-50
// popup.js - Handles popup logic and storage

document.addEventListener('DOMContentLoaded', () => {
  const statusDiv = document.getElementById('status');
  const verifyBtn = document.getElementById('verify-btn');

  // Fetch last results from storage
  chrome.storage.local.get('lastResults', (data) => {
    if (data.lastResults) {
      displayResults(data.lastResults);
    } else {
      statusDiv.textContent = 'No recent analysis.';
    }
  });

  // Self-verification button
  verifyBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "self_verify" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        statusDiv.textContent = 'Verification failed.';
        return;
      }
      statusDiv.textContent = `Self-Verification: ${response.self_verified ? 'Passed ✓' : 'Failed ✗'}`;
    });
  });
});

function displayResults(results) {
  const statusDiv = document.getElementById('status');
  statusDiv.innerHTML = '';

  const summary = document.createElement('p');
  summary.textContent = `Last Bravo Score: ${results.bravo_score || 0}%`;
  statusDiv.appendChild(summary);

  const opsList = document.createElement('ul');
  (results.operators || []).forEach(op => {
    const li = document.createElement('li');
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.backgroundColor = operatorColors[op] || '#000'; // Assume operatorColors defined or from CSS
    badge.textContent = `${op} (${results.emotions[op] || 'Unknown'})`;
    li.appendChild(badge);
    opsList.appendChild(li);
  });
  statusDiv.appendChild(opsList);

  const verified = document.createElement('p');
  verified.textContent = `Self-Verified: ${results.self_verified ? '✓' : '✗'}`;
  statusDiv.appendChild(verified);
}
```
