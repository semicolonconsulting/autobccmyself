# AMO listing: Auto BCC Myself for Gmail

Text to paste into the Developer Hub at https://addons.mozilla.org/developers/ when submitting `dist/auto-bcc-myself-2.0.0.xpi` (made by `./build.sh`). AMO stores listing text per language: add the Japanese version under the language switcher on the listing's edit page.

## Submission choices

| Field | Value |
|---|---|
| Distribution | On this site (public listing) |
| Compatibility | Firefox (desktop) only. Leave Android unchecked: Gmail's mobile site is laid out differently and hasn't been tested. |
| Source code needed? | No. Nothing is minified, bundled or generated. |
| Name | Auto BCC Myself for Gmail |
| URL slug | `auto-bcc-myself-for-gmail` |
| Category | Social & Communication |
| License | MIT |
| Privacy policy | Not needed: the add-on collects nothing, and the manifest declares that |
| Homepage | https://github.com/semicolonconsulting/autobccmyself |
| Support website | https://github.com/semicolonconsulting/autobccmyself/issues |
| Support email | Optional. It's shown publicly. |
| Icon | Taken from the manifest. If the form asks, upload `extension/icon128.png`. |
| Screenshots | Optional. A compose window with the Bcc chip works well; blur your signature and other recipients first. |

## Summary (English, 250 characters max)

Adds your own address as Bcc to every Gmail message you write, so threads you send stay in your inbox. The Bcc shows up as soon as you start writing, and you can remove it before sending.

## Description (English)

Gmail files the messages you send under Sent only. If you're waiting for a reply, the thread drops out of sight until someone answers. Auto BCC Myself for Gmail puts your own address in Bcc on every message, so a copy lands in your inbox and the thread stays in front of you.

What it does:
- When you open a compose window (new message, reply, reply all or forward), it opens the Bcc field and adds your address.
- The Bcc is visible right away, so you can remove it from any message before you send.
- It skips messages where you're already in To, Cc or Bcc.
- By default it uses the Gmail account you're signed in to. To always use a different address, set it in the toolbar popup. You can also switch the add-on off there.
- It finds Gmail's fields without relying on English button labels.

Privacy: Everything happens in your browser. The add-on collects and sends no data, makes no network requests, and only stores its two settings locally.

Permissions: it runs on mail.google.com only. "storage" saves your settings.

Not affiliated with Google. Gmail is a trademark of Google LLC.

## Summary (Japanese)

Gmail で書くすべてのメールの Bcc に自分のアドレスを自動で追加し、送ったスレッドを受信トレイに残します。作成画面を開いた時点で Bcc に入るので、送信前に確認や削除ができます。

## Description (Japanese)

Gmail では、送ったメールは「送信済み」にしか残りません。返信を待っているスレッドも、相手から返事が来るまで受信トレイから消えたままです。Auto BCC Myself for Gmail はすべてのメールの Bcc に自分のアドレスを入れるので、コピーが受信トレイに届き、スレッドが目の前に残ります。

できること：
- 作成画面（新規作成・返信・全員に返信・転送）を開くと、Bcc 欄を開いて自分のアドレスを追加します。
- Bcc はすぐに表示されるので、送信前にメールごとに削除できます。
- 自分がすでに To・Cc・Bcc に入っているメールには追加しません。
- 通常はログイン中の Gmail アカウントのアドレスを使います。別のアドレスを常に使いたいときは、ツールバーのポップアップで設定できます。オン・オフもそこで切り替えられます。
- 英語のボタン名に頼らずに Gmail の入力欄を見つけます。

プライバシー：処理はすべてブラウザの中で行います。データの収集や送信はせず、ネットワーク通信もしません。保存するのは 2 つの設定だけで、それもブラウザ内に保存します。

権限：mail.google.com でのみ動作します。「storage」は設定の保存に使います。

Google とは関係ありません。Gmail は Google LLC の商標です。

## Version notes for 2.0.0

First public release.

## Notes to reviewer

To test: sign in to any Gmail account at https://mail.google.com and click Compose. The Bcc field opens and the signed-in address is added as a recipient chip. Then open a conversation and click Reply: the collapsed recipient line shows "1 Bcc". The toolbar popup has an on/off switch and an optional fixed Bcc address.

The package has no build step and no minified or third-party code; every file is included as written. The content script only reads and edits Gmail's compose form in the page, and the add-on makes no network requests.
