# Timeline

Dates are investigation dates. Private account, conversation, and support-case identifiers are omitted.

| Date | Event | Evidence and limit |
|---|---|---|
| September 15, 2026 | Empty attachment menu investigated in an existing Safari web-app conversation. Legacy Deep Research citation conversion and a stranded deferred queue identified. | Local diagnostic observations; the private conversation is not published. |
| September 15 | A targeted local script restored the menu and an unsent test attachment. Angular issue #70728 opened; Gemini feedback submitted. | [Upstream issue](https://github.com/angular/angular/issues/70728). Feedback acknowledgement was not a resolution. |
| September 17 | The earlier script no longer matched changed production identifiers. Version 1.2.0 handled the two inspected builds. | [Dated public update and source](https://github.com/angular/angular/issues/70728#issuecomment-5716083265). |
| September 17 | The same conversation worked in Android; the Safari web app failed without the revised workaround and worked with it. Three fresh web loads and a harmless attachment were recorded. | Privacy-masked recordings retained privately; historical comparison, not today's result. |
| September 17 | Workaround source and three recordings supplied to Google support. | Delivery verified privately. Support correspondence is not published. |
| September 17 | Angular PR #70730 merged into main and two release branches. | [Merge record](https://github.com/angular/angular/pull/70730#issuecomment-5718397456). |
| September 17 UTC | Post-merge reproduction found the remaining expired-handle problem in all three pinned revisions. | [Eighteen observations reported](https://github.com/angular/angular/issues/70728#issuecomment-5721025628). |
| September 18 | Google support acknowledged higher-tier review and said the case would stay open. | Acknowledgement, not an engineering fix or confirmed deployment. |
| October 7 | Upstream issue and PR checked: issue remains closed, PR remains merged, post-merge follow-up remains unanswered in the checked discussion. | GitHub readback at 14:14 UTC. No current Gemini unpatched result is claimed. |
| October 7 | Dedicated public tracker prepared from the retained evidence. | Current unpatched test pending; independent matching-report count not established. |
| October 7 UTC | Fresh original-conversation comparison: Safari web app failed with script disabled before reload; restoring v1.2.0 restored menu and a harmless attachment. Chrome and Firefox worked without the script. | [Detailed comparison](browser-comparison.md). One account/conversation; no fresh internal stack or deployment ID. Attachments removed unsent and patch restored. |
