# Gemini's empty attachment menu

> **Status, October 7 UTC, 2026:** Fresh tests confirm the original conversation still has an empty attachment menu in the standalone Safari web app with the local script disabled before reload. Restoring v1.2.0 restores attachments. The same conversation's menu and harmless attachment **work in Chrome and Firefox without the patch**. No official Gemini repair has been verified for the affected Safari environment.

This is a public evidence tracker for a Gemini web failure: opening the attachment menu in an affected older conversation produced an empty menu shell. The investigation traced the observed failure to a legacy Deep Research citation rendering error and a stalled deferred-work queue. The same conversation's attachment menu worked in the native Android app during the September comparison.

The application failure and the independently reproducible Angular scheduler problem are tracked separately. An Angular merge does not establish which code Gemini serves or whether the original conversation now works.

## Start here

- **[Public incident page](https://coolak.github.io/gemini-attachment-menu-incident/)**
- **[Fresh browser comparison and privacy-cropped evidence](browser-comparison.md)**
- **[Technical analysis and reproducible scheduler test](technical-analysis.md)**
- **[Local workaround and its limits](workaround.md)**
- **[Dated timeline](timeline.md)**
- **[Report scope and counting method](reports.md)**
- **[What would establish resolution](resolution.md)**
- **[Machine-readable status](incident-state.json)**
- **[Report the same symptom](https://github.com/COOLak/gemini-attachment-menu-incident/issues/new?template=report.md)**

## Short summary

| Question | Evidence |
|---|---|
| What failed? | An existing conversation's attachment menu opened as an empty shell in Gemini's standalone Safari web app. |
| What triggered the observed failure? | Legacy `DEEP_RESEARCH` sources converted to an empty citation-card array; rendering attempted to read a missing first card. |
| Why could a citation break attachments? | A render exception left deferred work stranded in the scheduler used to load other interface elements. |
| What worked? | A narrow local citation guard plus queue recovery restored the menu and a harmless test attachment in September. Android also opened the menu for that same conversation. |
| Was there an upstream response? | [Angular #70730](https://github.com/angular/angular/pull/70730) merged. A [post-merge follow-up](https://github.com/angular/angular/issues/70728#issuecomment-5721025628) demonstrates remaining failure at the merge and both backports. |
| Is it fixed today? | The original Safari web-app failure persists in the October 7 UTC retest. Chrome and Firefox work without the patch in the same conversation. See the [comparison and limits](browser-comparison.md). |
| How many people are affected? | [One detailed independent symptom report and one terse reply](reports.md) were verified in one public thread; browser and root cause are unknown. The affected population is not established. |

## Evidence available here

- [Exact v1.2.0 userscript](workaround/gemini-attachment-menu-fix.user.js), already published in the upstream technical discussion.
- [Standalone source reproduction](repro/angular-merged70730-repro.mjs), which needs Node and access to public Angular source, but no Gemini account or browser.
- [Recorded September source-test observations](evidence/angular-merged70730-results.jsonl): six normal controls drained; twelve error cases stalled across three pinned revisions.
- [Fresh browser comparison](browser-comparison.md) and privacy-cropped screenshots, October 7 UTC.
- [SHA-256 manifest](evidence/manifest.json) for those files. Hashes establish file identity, not independent verification of every claim.

The recordings and support correspondence are retained privately. This repository contains no private conversation text, conversation URL, account identifiers, or raw support messages.

## Upstream links

- [Angular issue #70728](https://github.com/angular/angular/issues/70728) — scheduler defect report; closed as completed.
- [Angular PR #70730](https://github.com/angular/angular/pull/70730) — merged September 17.
- [Workaround and PR-head test results](https://github.com/angular/angular/issues/70728#issuecomment-5716083265).
- [Post-merge results and request to track the remaining defect](https://github.com/angular/angular/issues/70728#issuecomment-5721025628).

Upstream state was checked October 7, 2026 at 14:14 UTC. Historical source tests are not tests of the current Gemini deployment.
