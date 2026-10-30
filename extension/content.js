'use strict';

// Adds your own address as Bcc to each Gmail compose window as it opens, so
// threads you send stay in your inbox.
//
// It only relies on DOM hooks that don't depend on Gmail's UI language: the
// compose <form> (it holds a hidden input[name="composeid"]), the recipient
// fields div[name="to|cc|bcc"], and each chip's data-hovercard-id. It edits the
// DOM straight from the content script. Version 1.0 injected a <script> into
// the page instead, which Gmail's Trusted Types CSP blocks without an error.

const settings = { enabled: true, bccEmail: '' };
const handled = new WeakSet();
const EMAIL = /[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+/g;

// One compose window at a time: each one moves the focus around.
let queue = Promise.resolve();
let scanTimer = 0;

browser.storage.local.get(['enabled', 'bccEmail']).then(stored => {
  settings.enabled = stored.enabled !== false;
  settings.bccEmail = stored.bccEmail || '';
  new MutationObserver(scheduleScan).observe(document.body, { childList: true, subtree: true });
  scan();
});

browser.storage.onChanged.addListener(changes => {
  if (changes.enabled) settings.enabled = changes.enabled.newValue !== false;
  if (changes.bccEmail) settings.bccEmail = changes.bccEmail.newValue || '';
});

function scheduleScan() {
  if (!scanTimer) scanTimer = setTimeout(() => { scanTimer = 0; scan(); }, 100);
}

function scan() {
  if (!settings.enabled) return;
  for (const form of document.querySelectorAll('form')) {
    if (handled.has(form)) continue;
    if (!form.querySelector('input[name="composeid"]') || !form.querySelector('div[name="bcc"]')) continue;
    handled.add(form);
    queue = queue.then(() => addBcc(form)).catch(err => console.warn('[Auto BCC Myself]', err));
  }
}

// The tab title is "<view or subject> - me@example.com - Gmail" in every UI
// language, and it names the mailbox you're in, delegated ones included.
function accountEmail() {
  const inTitle = document.title.match(EMAIL);
  if (inTitle) return inTitle[inTitle.length - 1];
  const button = document.querySelector('a[aria-label*="@"]');
  const inButton = button && button.getAttribute('aria-label').match(EMAIL);
  return inButton ? inButton[inButton.length - 1] : '';
}

function recipients(form, field) {
  return [...form.querySelectorAll(`div[name="${field}"] [data-hovercard-id]`)]
    .map(chip => chip.getAttribute('data-hovercard-id').toLowerCase());
}

function visible(el) {
  return el && el.getClientRects().length > 0 ? el : null;
}

async function waitFor(check, timeout = 3000) {
  const end = Date.now() + timeout;
  for (;;) {
    const result = check();
    if (result || Date.now() > end) return result;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

async function openBccField(form) {
  const bccInput = () => visible(form.querySelector('div[name="bcc"] input[role="combobox"]'));
  if (bccInput()) return bccInput();

  // Replies collapse the recipients into one summary line; focusing it expands them.
  const toField = () => visible(form.querySelector('div[name="to"]'));
  const summary = visible(form.querySelector('.aoD.hl'));
  if (!toField() && summary) {
    summary.focus();
    if (!await waitFor(toField)) return null;
  }

  const bccLink = form.querySelector('span.pB[role="link"]');
  if (bccLink) bccLink.click();
  return waitFor(bccInput);
}

// Where the cursor should end up: back where it was if that was in this
// compose window, otherwise where Gmail would put it (To on a new message,
// the body on a reply).
function focusTarget(form, previous) {
  if (previous && previous !== document.body && previous.isConnected && form.contains(previous)) return previous;
  const to = visible(form.querySelector('div[name="to"] input[role="combobox"]'));
  if (to && recipients(form, 'to').length === 0) return to;
  // The body sits outside the <form>, in the same compose region.
  const region = form.closest('[role="region"]') || form;
  return visible(region.querySelector('[contenteditable="true"][role="textbox"]'));
}

async function addBcc(form) {
  const me = (settings.bccEmail || accountEmail()).toLowerCase();
  if (!me) return;

  // Gmail builds the recipient widgets a moment after the form appears.
  if (!await waitFor(() => form.querySelector('div[name="to"] input[role="combobox"]'))) return;
  if (['to', 'cc', 'bcc'].some(field => recipients(form, field).includes(me))) return;

  const previous = document.activeElement;
  try {
    const input = await openBccField(form);
    if (!input) return;

    input.focus();
    if (!document.execCommand('insertText', false, me)) {
      input.value = me;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    // Enter turns the typed address into a recipient chip.
    for (const type of ['keydown', 'keyup']) {
      input.dispatchEvent(new KeyboardEvent(type, {
        key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true,
      }));
    }

    if (!await waitFor(() => recipients(form, 'bcc').includes(me), 1500)) {
      console.warn('[Auto BCC Myself] Gmail did not accept the Bcc address', me);
    }
  } finally {
    const target = focusTarget(form, previous);
    if (target) target.focus();
  }
}
