'use strict';

const enabledInput = document.getElementById('enabled');
const emailInput = document.getElementById('email');
const statusEl = document.getElementById('status');
let statusTimer = 0;

browser.storage.local.get(['enabled', 'bccEmail']).then(stored => {
  enabledInput.checked = stored.enabled !== false;
  emailInput.value = stored.bccEmail || '';
});

enabledInput.addEventListener('change', () => {
  browser.storage.local.set({ enabled: enabledInput.checked });
});

// Saves when the field loses focus or on Enter.
emailInput.addEventListener('change', () => {
  const email = emailInput.value.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showStatus('That doesn’t look like an email address.', true);
    return;
  }
  browser.storage.local.set({ bccEmail: email }).then(() => {
    showStatus(email ? `Saved. Bcc goes to ${email}.` : 'Saved. Bcc goes to the signed-in account.');
  });
});

emailInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') emailInput.blur();
});

function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.className = 'status' + (isError ? ' error' : '');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { statusEl.textContent = ''; }, 2500);
}
