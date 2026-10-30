# Auto BCC Myself for Gmail

A Firefox add-on that adds your own address as Bcc to every Gmail message you write, so threads you send stay in your inbox.

Gmail files the messages you send under Sent only. If you're waiting for a reply, the thread drops out of sight until someone answers. With yourself in Bcc, a copy lands in your inbox and the thread stays in front of you.

**Install:** [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/auto-bcc-myself-for-gmail/). It also works in Firefox-based browsers that use the same store, such as Zen.

## What it does

- When you open a compose window (new message, reply, reply all or forward), it opens the Bcc field and adds your address.
- The Bcc is visible right away, so you can remove it from any message before you send.
- It skips messages where you're already in To, Cc or Bcc.
- By default it uses the Gmail account you're signed in to, read from the tab title, so delegated mailboxes work too. To always use another address, set it in the toolbar popup. You can also switch the add-on off there.

## Privacy

Everything happens in your browser. The add-on collects and sends no data and makes no network requests. It stores only its two settings (on/off and the optional Bcc address) in the browser's local extension storage.

Permissions: it runs on `mail.google.com` only, and `storage` saves the settings.

## How it works

The content script edits Gmail's compose form directly. It finds the fields with hooks that don't depend on Gmail's display language:

| Hook | What it is |
|---|---|
| `form` containing `input[name="composeid"]` | each compose window |
| `div[name="to"]`, `div[name="cc"]`, `div[name="bcc"]` | the recipient fields |
| `span.pB[role="link"]` | the "Bcc" link that opens the field |
| `.aoD.hl` | the collapsed recipient line on replies (focusing it expands the fields) |
| `[data-hovercard-id]` | recipient chips (the value is the email address) |

It types the address with `document.execCommand('insertText')` and then sends Enter, which turns the text into a recipient chip. It doesn't inject scripts into the page: Gmail's Content Security Policy requires Trusted Types, which blocks that.

Gmail's class names can change without notice. If the add-on stops adding the Bcc, [open an issue](https://github.com/semicolonconsulting/autobccmyself/issues). `extension/content.js` is the only file that should need changes.

## Build from source

Needs Node.js (for Mozilla's `web-ext` linter) and `zip`.

```bash
./build.sh
```

It lints the add-on and writes `dist/auto-bcc-myself-<version>.xpi`. To try a change without installing, open `about:debugging` → **This Firefox** → **Load Temporary Add-on…** and pick `extension/manifest.json`.

`amo/listing.md` holds the store listing text in English and Japanese.

## License

[MIT](LICENSE)

Not affiliated with Google. Gmail is a trademark of Google LLC.
