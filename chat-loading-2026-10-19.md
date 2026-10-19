# Separate chat-loading observation — October 19, 2026 UTC

**Current result:** the original standalone Safari app loads its recent-chat list and an existing conversation again. The cause and durability of this recovery remain unresolved. These tests do not establish resolution of the older attachment-menu defect.

## Captured failure

Safari 27.0.1, Gemini deployment `boq_gemini-web-uiserver_20261016.00_p0`, AdGuard for Mac 2.20.0.2626 release / CoreLibs 1.22.29. Native Web Inspector captured the `MaZiqc` chat-list RPC to `/_/BardChatUi/data/batchexecute` failing with “The network connection was lost”, no response headers, and about 844 ms elapsed time. WebKit Networking logged NSURLErrorDomain -1005 / NSPOSIXErrorDomain 57 errors in the captured failure window.

A fresh load with the local v1.2.0 userscript disabled reproduced the failure, with its execution marker absent. This reproduced failure does not require the compatibility script. The script was restored ON afterward.

Successful RPCs in the same failing load reported `h3`; the failed RPC had no Resource Timing entry, so its protocol was not directly measured. AdGuard HTTP/3 stream warnings were time-correlated, which does not establish causation.

## Temporary HTTP/3 filtering comparison

Only AdGuard's `network.https.filter.http3.enabled` setting was changed; the userscript and other protections stayed unchanged during this comparison. The setting was restored to `true` afterward.

| Sequence | Observed result |
|---|---|
| Initial ON baseline | Recent-chat list remained loading. |
| First OFF reload | Blank page. |
| First restoration to ON | List loaded once; the next fresh app launch stalled again. |
| Second OFF cycle: fresh launch + two reloads | All three loaded the recent-chat list. |
| Restored ON: fresh launch + two reloads | All three also loaded the recent-chat list. |
| Existing-chat navigation and return home, ON | Existing conversation loaded; home list loaded again. |

No browser data was cleared, account signed out, prompt sent, or attachment uploaded. The final setting is ON. The ON reversal did not reproduce the failure, so this comparison cannot establish HTTP/3 filtering as the cause or a permanent repair. Reset connection state is a hypothesis, not a measured mechanism.

## Vendor investigation and scope

The qualified findings and a request for a narrowly scoped diagnostic were [posted to AdGuard's existing Safari connection-error discussion](https://github.com/AdguardTeam/AdguardForMac/issues/1700#issuecomment-6267128801). That discussion concerns other sites; it is not an independent Gemini attachment-menu confirmation or proof of an identical root cause. No new Angular failure was established by this test.

The attachment-menu report counts remain unchanged: one detailed independent symptom match and one terse reply in one thread; zero independent Safari confirmations; zero independently confirmed identical root causes; affected population unknown. Private conversation contents, identifiers, raw traffic and correspondence are excluded from this note.
