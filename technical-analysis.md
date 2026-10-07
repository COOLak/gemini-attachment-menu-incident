# Technical analysis

## Two connected failure layers

### 1. Gemini citation rendering — observed September 15–17

The affected conversation contained legacy sources marked `DEEP_RESEARCH`. In the inspected frontend, those sources produced an empty converted card array. A citation template then dereferenced its first entry. Six inspected citation components had a raw Deep Research source and zero converted cards during the original diagnosis.

That rendering exception coincided with the deferred queue becoming stranded. The attachment-menu shell could open, but its contents did not load. A targeted citation guard and recovery through the existing scheduler restored the menu in the same conversation. This is evidence for the mechanism in that inspected environment; it is not a claim about all upload failures or all Gemini users.

### 2. Angular IdleScheduler — independent source reproduction

The scheduler retains an in-flight callback handle while draining a bucket. In the tested revisions, either a callback exception or an `ApplicationRef._tick()` exception exits the work loop before that handle is cleared. The native callback has already fired, but the scheduler still treats it as pending. A later `add()` therefore fails to schedule new native work.

PR #70730 moved callback bookkeeping into a `finally` path. The published post-merge reproduction shows that the expired handle still strands later work at these exact commits:

| Branch | Tested commit |
|---|---|
| main merge | `9486df5e26388e975dfc222902505c2e864636ef` |
| 22.1.x backport | `c3e8f29b3f898ee5377b0110683fe9dc2808c116` |
| 22.2.x backport | `e0cb4ae9dd034c87d2a9e6eee12c9626b2f0fe72` |

The earlier tested PR head was `d8645885bb5167df04732333774a8610f95550e2`. The PR head was still that SHA when checked October 7. This does not rule out a separate later fix elsewhere in Angular.

## Reproduce the pinned scheduler results

The harness was originally run with Node 22.23.2. It uses Node's built-in TypeScript stripping, fetches the source at the pinned public commits, removes imports and exports, and supplies controlled dependency-injection and browser-callback mocks. The scheduler body is unchanged. Review the script before execution.

```sh
node repro/angular-merged70730-repro.mjs
```

The assertions intentionally verify the recorded failure. A zero exit code means the observations matched the reproduction; **it does not mean Angular is fixed**.

Across all three commits, the September record contains:

| Scenario | Scheduler modes | Native callbacks after a fresh add | Later callback runs | Remaining queue |
|---|---|---:|---|---:|
| No exception | Idle deadline and timeout fallback | 1 | Yes | 0 |
| Callback throws once | Both | 0 | No | 2 |
| Application tick throws once | Both | 0 | No | 2 |

There are 18 observations: six normal controls and twelve error cases. See the [recorded output](evidence/angular-merged70730-results.jsonl) and [public follow-up](https://github.com/angular/angular/issues/70728#issuecomment-5721025628).

## What this does not prove

- Which Angular revision Gemini currently deploys.
- Whether the October Gemini build still triggers the original citation exception.
- A failure in the native Android app; the September same-conversation Android test worked.
- The number of affected accounts, or a shared cause for generic upload errors.
- A server-side data-loss event. The observed defect concerns frontend rendering and scheduled work.

## Fresh Gemini verification protocol

1. Record browser/app, date, and available build identifier, without publishing private account or conversation identifiers.
2. Disable only the local compatibility script, then load the original affected conversation afresh. Disabling after it already patched a page is not an unpatched test.
3. Verify that the script did not execute. Test the native attachment menu repeatedly and, if appropriate, attach a harmless local text file without sending it.
4. Remove the unsent test file and restore the original blank composer and workaround state.
5. Record failure or success and any console error, stripping private content. A successful new chat or different browser is a comparison, not a substitute for the original case.

This protocol has not been completed for the current October deployment.
