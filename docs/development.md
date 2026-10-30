# Development

How the add-on works, and how to build, test and release it.

## How it works

The content script (`extension/content.js`) runs on `mail.google.com` only. It watches the page for new compose windows and edits Gmail's compose form directly. It finds the fields with hooks that don't depend on Gmail's display language:

| Hook | What it is |
|---|---|
| `form` containing `input[name="composeid"]` | each compose window |
| `div[name="to"]`, `div[name="cc"]`, `div[name="bcc"]` | the recipient fields |
| `span.pB[role="link"]` | the "Bcc" link that opens the field |
| `.aoD.hl` | the collapsed recipient line on replies (focusing it expands the fields) |
| `[data-hovercard-id]` | recipient chips (the value is the email address) |

For each new compose window it:

1. Works out the address: the one set in the popup, or else the account in the tab title (`<view> - you@example.com - Gmail`), which also covers delegated mailboxes.
2. Stops if that address is already in To, Cc or Bcc.
3. On replies, focuses the collapsed recipient line so Gmail expands the fields.
4. Clicks the Bcc link, types the address with `document.execCommand('insertText')` and sends Enter, which turns the text into a recipient chip.
5. Puts the cursor back where it was, or where Gmail would put it (To on a new message, the body on a reply).

Compose windows are handled one at a time, because each one moves the focus.

It doesn't inject scripts into the page. Gmail's Content Security Policy requires Trusted Types, which blocks injected scripts without an error. That's why the first version of this add-on never worked.

Gmail's class names (`pB`, `aoD`, `hl`) can change without notice. If the add-on stops adding the Bcc, `extension/content.js` is the only file that should need changes.

## Build from source

Needs Node.js (for Mozilla's `web-ext` linter) and `zip`.

```bash
./build.sh
```

It lints the add-on and writes `dist/auto-bcc-myself-<version>.xpi`.

## Try a change

Open `about:debugging` → **This Firefox** → **Load Temporary Add-on…** and pick `extension/manifest.json`. Reload Gmail, then open a new message and a reply. The add-on is removed when the browser restarts.

Things to check:

- A new message gets your address in Bcc, and the cursor stays in To.
- A reply shows "1 Bcc" on the collapsed recipient line, and the cursor stays in the body.
- A message that already has you as a recipient is left alone.
- With the switch in the popup off, new compose windows are left alone.

## Release a new version

1. Raise `version` in `extension/manifest.json`. Firefox Add-ons rejects a version number it has already seen.
2. Run `./build.sh`. The linter should report 0 errors and 0 warnings.
3. Commit and push.
4. In the [Developer Hub](https://addons.mozilla.org/developers/), open the add-on, choose **Upload New Version**, upload the new `.xpi` and add a line of release notes.

The store listing text (English and Japanese) and the notes for reviewers are in [`amo/listing.md`](../amo/listing.md).
