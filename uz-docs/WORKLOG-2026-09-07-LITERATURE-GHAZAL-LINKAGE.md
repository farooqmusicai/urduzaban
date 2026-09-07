# UrduZaban Literature Expansion — Ghalib Ghazal / Linkage Batch 01

**Date:** 7 September 2026  
**Branch:** `data/literature-ghazal-linkage-batch-01-2026-09-07`  
**Pull request:** #8 — `data: add reviewed Ghalib ghazal batch and verse-word linkage`

## Milestone completed

The next unfinished data-expansion foundation milestone is complete: the literature metadata proof layer now contains a verified real ghazal batch and the first explicit poet → work → verse-unit → word linkage sample.

### Concrete growth

- reviewed literature source catalog: **4 → 5 sources**
- first-class reviewed work metadata: **10 → 25 works**
- new Ghalib ghazal work IDs: **15** (`ghalib-diwan-radeef-alif-01` … `-15`)
- linkage sample: **5 poet/work links**
- linked verse units: **5 couplets / shers**
- linked word units: **80**
- canonical literature people available to references: **35**

The existing production data counts remain unchanged because their files were deliberately not edited:

- Urdu dictionary: **10,630 entries**
- distinct Urdu words: **10,582**
- Urdu meanings: **3,838**
- proverbs/idioms: **2,853**
- proverb/idiom meanings: **658**
- existing listed literature/text records: **79**
- corpus: **11 poets · 5,198 records**

## Source and rights review

Added a bounded source record for:

- **Urdu Wikisource** — `دیوان غالب / غزلیات / ردیف الف / غزل 1 تا 15`
- source: https://ur.wikisource.org/wiki/دیوان_غالب/غزلیات/ردیف_الف/ردیف_الف_غزل_1_تا_15
- reviewed: **2026-09-07**
- Ghalib death year recorded as **1869**; the underlying classical poems are public-domain by author age
- the reviewed Wikisource page states Creative Commons Attribution/Share-Alike availability for its transcription
- source attribution/provenance is retained in the source and linkage records

No bulk literary body text was imported. Only **five couplets** were stored as a deliberately bounded linkage proof; the remaining 15 work records are metadata/source locators only.

## Files changed

- `uz-data/uz-adab-sources-v1.json`
- `uz-data/uz-adab-works-sample-v2.json`
- `uz-data/uz-adab-linkage-sample-v1.json` — new
- `tools/validate_expansion.py`
- this worklog

## Branch commits before this worklog

- `c8edb670d25417b9605b4ec5fcf527976609e84d` — add verified Ghalib ghazal source batch
- `b84bf26b5dda778c2a8a603f40a64b89fea39b45` — expand reviewed literature works to 25
- `fd105997fc62948ac9cfe0c2b14901c04e78e19e` — add poet → work → verse → word linkage sample
- `51003c9cbc5a9858fbc6b2f31d66d8f912b7d055` — extend expansion validator for linkage integrity
- `e6e074bb6dc9d4826770c3f28c68271bae6bc137` — preserve Urdu letter identity in linkage lookup keys

## Validation and review

`UrduZaban site health` GitHub Actions run **#17** completed successfully on code head `e6e074bb6dc9d4826770c3f28c68271bae6bc137`.

The health workflow runs both repository validation and the data-expansion validator. The expansion validator now enforces:

- required source/provenance fields and HTTPS source URLs
- valid poet/author IDs and literature source IDs
- unique work IDs and a minimum reviewed batch of **25 works**
- explicit `source_locator`, rights state and `text_ingest_allowed`
- poet → work → source consistency
- unique verse-unit and word-unit IDs
- sequential word positions and non-empty `surface` / `lookup_key`
- a minimum linkage proof of **5 links**
- continued foreign-lexicon separation rules

Manual PR diff review found one normalization-quality issue before merge: an early lookup-key method decomposed Urdu letters such as `آ`, `ئ` and `ئے`. It was corrected so lookup keys remove explicit combining marks such as izafat while preserving Urdu letter identity. The corrected head passed health checks.

## Intentionally untouched

No changes were made to:

- `uz-lughat.json`
- `uz-kahawat.json`
- `uz-data/uz-adab-log.json`
- `uz-data/uz-adab-matn.json`
- `uz-data/uz-corpus-v1.json`
- `uz-data/source-registry-v1.json`
- public HTML / API / TTS / model files

No Arabic, Persian or English dictionary layer was merged into `uz-lughat.json`.

## Next step

Continue priority **public-domain literature expansion** with a second verified batch from eligible classical authors, preferably adding another **15–25 stable work IDs** across Ghalib/Mir and extending bounded verse linkage where source and rights metadata are explicit. After the literature layer is broad enough for a useful first library slice, resume Urdu dictionary meaning/new-word growth in original UrduZaban wording before moving to Shajra v2.
