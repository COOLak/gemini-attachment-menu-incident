# How many reports are there?

**Audit updated October 7, 2026 UTC: one detailed independent public symptom match, plus one terse corroborating reply, in one Reddit thread.** Neither establishes a browser or the same technical cause. The number of affected people remains unknown.

| Metric | Verified public count |
|---|---:|
| Detailed independent reports closely matching the empty, conversation-specific plus-menu symptom | 1 |
| Additional terse corroborating replies | 1 |
| Distinct independent matching threads | 1 |
| Independent reports technically confirming the same root cause | 0 |
| Independent reports confirming this symptom in Safari | 0 |
| This investigation's own case, excluded from the independent counts | 1 |

These are counts of accessible reports found and checked, not a census, prevalence estimate, or proof that only these accounts are affected. Distinct public accounts do not prove distinct real-world people. No Safari-wide or all-desktop-browser failure is established.

## Verified matching source

On **August 25, 2026 at 02:53:43 UTC**, the author of [“I can't add anything on this chat”](https://www.reddit.com/r/GeminiAI/comments/1vxnsfu/i_cant_add_anything_on_this_chat/) reported that clicking the plus beside Ask Gemini showed nothing in one conversation while other conversations worked. The post includes a cropped image. The text closely matches the visible symptom; browser, operating system, legacy Deep Research content, console errors and root cause are unknown.

A [reply in the same thread](https://www.reddit.com/r/GeminiAI/comments/1vxnsfu/i_cant_add_anything_on_this_chat/p5rotmw/) at **09:25:13 UTC** says “same for me too.” It comes from a different public account, but lacks enough detail to count as another fully described case. Both timestamps and the distinct account identifiers were checked against the thread's public JSON. The two entries are recorded in the [source ledger](evidence/report-ledger-2026-10-07.json).

## Related reports excluded from the matching count

| Source | Why it is different or unconfirmed |
|---|---|
| [Missing image/gallery option](https://www.reddit.com/r/GeminiAI/comments/1vqxbhj/bug_gemini_wont_let_me_upload_images_option_is/) | Upload files and Add from Drive remain visible; discussion concerns the secondary photo/file chooser. |
| [Pro model upload error](https://www.reddit.com/r/GeminiAI/comments/1qlgzzd/cant_upload_images_when_using_pro_model_on_web/) | File selection occurs, followed by an explicit error. The author later reports recovery. This is not an empty menu. |
| [Upload processing error](https://www.reddit.com/r/GeminiAI/comments/1nbjgxu/something_went_wrong_error_when_i_try_to_upload/) | Upload starts before failing. Old-chat/new-chat anecdotes do not make this the same failure stage. |
| [Gemini 2.5 Flash upload availability, May 10, 2025](https://9to5google.com/2025/05/10/gemini-2-5-flash-file-upload-free/) | Broader model/tier availability or greyed controls, later reported fixed; not this conversation-specific empty-menu defect. |
| [Google Help: users no longer have file upload option](https://support.google.com/gemini/thread/346437034/users-no-longer-have-file-upload-option-in-gemini-issue-ocurred-in-the-last-3-4-days?hl=en) | Potentially related title, but the accessible page did not expose enough report detail for a match. |

The search covered indexed Reddit, Google Help, GitHub, Apple/Safari communities and other public forums, including symptom wording in several languages. A Deep Research report was followed by direct checks of counted sources and key exclusions. Its search counter is not a measure of affected users. Private, deleted, unindexed and inaccessible reports are outside this count.

No public Google acknowledgement or repair announcement for this exact symptom was identified. [Google's file-upload documentation](https://support.google.com/gemini/answer/14903178?hl=en) describes expected behavior and constraints, not an acknowledgement of this incident. An upstream Angular merge does not establish a Gemini deployment.

## Counting method

The Angular issue, pull request, Google support case, and this repository all originate from that investigation. They must not be counted as separate affected people.

Search results for Gemini attachment problems mix several different symptoms: an empty attachment menu, greyed-out controls, upload errors after selection, missing uploaded files, account limits, and failures in Google AI Studio. Similar wording alone does not establish the same defect.

## Matching and deduplication rules

A closely matching symptom report should describe the **Gemini web app**, an **existing conversation**, and an **attachment menu that opens empty or fails to load its actions**. Deep Research history and a successful comparison in a new conversation or the native app strengthen the match. They do not prove the same root cause.

Mechanism confirmation requires relevant rendering/scheduler evidence or a controlled targeted-workaround comparison. Count distinct firsthand reporters, not comments, votes, search-result totals, copied posts, or reports about a different product.

Record each candidate's public URL, date, platform, symptom, match category, and duplicate relationship before counting it. Preserve uncertainty when identity across platforms cannot be established. Do not solicit or publish private chat contents.

## Contribute a report

Use the repository's [symptom report template](https://github.com/COOLak/gemini-attachment-menu-incident/issues/new?template=report.md). Include browser/app version, date, menu behavior, whether a new conversation works, and whether a local workaround was active. A report can be useful without a screenshot.

Do not post email addresses, private conversation links or contents, support identifiers, cookies, tokens, raw network archives, or screenshots with personal information.
