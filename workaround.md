# Local workaround v1.2.0

**This is an unsupported local workaround, not an official Google repair.** Its last recorded live verification was September 17, 2026. Later Gemini builds may be incompatible.

The [source](workaround/gemini-attachment-menu-fix.user.js) recognizes the inspected citation-template structure, omits an empty legacy Deep Research citation widget, and restarts stranded work through the existing scheduler after a successful application tick. It leaves unfamiliar or ambiguous structures untouched. Omitting an empty widget does not repair Gemini's legacy citation conversion itself.

The script runs only at `https://gemini.google.com/`, in the main page. It sends no data, makes no network requests, stores no conversation content, and does not edit messages or account settings. It nevertheless executes inside a signed-in page and depends on private frontend internals: inspect the source and keep that limitation in mind.

## Historical verification

- 25 focused offline checks passed, covering two production template variants, identifier changes, valid and mixed sources, creation-phase safety, nested views, restoration after exceptions, and scheduler failure handling.
- Three fresh loads of the original conversation recorded version 1.2.0, one patched template, one recovered queue, and zero recovery errors.
- The menu opened with its actions present; a harmless text attachment completed and was removed unsent.
- The original v1.0.1 workaround had stopped matching after internal identifiers changed. This is why a local workaround must not be presented as a permanent product fix.

## Installation and removal

The verified historical installation used AdGuard for Mac's userscript Extensions feature. If using that existing feature, add the exact source as a userscript, enable only that script, and freshly load the affected page. Do not disable general protection, clear browser storage, sign out, or erase the conversation for this workaround.

To undo it, disable the single **Gemini attachment menu compatibility** script and freshly load the page. Merely disabling a script after it has run does not undo its changes to an already loaded page.

Review [AdGuard's official extensions documentation](https://adguard.com/kb/adguard-for-mac/features/extensions/) for the product interface. Installing an additional extension or changing security permissions is not part of this repository's reproduction.

Exact source SHA-256:

```text
eb22a96507f79059d7b7ea0a1b0a5b4ff4f63523d02fb1a48c63089753cb4fb7
```
