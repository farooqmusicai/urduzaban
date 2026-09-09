# UrduZaban Worklog — 2026-09-09 — Mir Nazm Linkage Batch 03

## Milestone

Priority 2 (public-domain literature) continued with a bounded Mir Taqi Mir nazm linkage batch. The goal is to diversify the existing poet → work → verse → word foundation beyond Ghalib while keeping literary text small, source-attributed and rights-reviewed.

## Branch / PR / commits

- Base `main`: `7dae5c66d195e29b778138ffe3b838eb3e2194eb`
- Feature branch: `data/literature-mir-nazm-linkage-batch-03-2026-09-09`
- Pull request: **#11 — data: add reviewed Mir nazm linkage batch and rights audit**
- Rights/source metadata commit: `3caf1dcc5da2d9d127d4a80304833ac23d73033a`
- Mir linkage shard commit: `7f14778c848c7e6f980d95a58ed181718001952a`
- Validator commit: `dc134d844c92540d1cebb4799e9583a52eb12627`
- Worklog commit: recorded by GitHub after this file is created
- Production merge: **pending final health checks and diff review**

## Verified sources / rights

Reviewed on **2026-09-09**:

1. Urdu Wikisource — `ساقی نامہ (میر تقی میر)`  
   https://ur.wikisource.org/wiki/ساقی_نامہ_(میر_تقی_میر)
2. Urdu Wikisource — `جنگ نامہ (میر تقی میر)`  
   https://ur.wikisource.org/wiki/جنگ_نامہ_(میر_تقی_میر)

Mir Taqi Mir died in 1810, so the underlying classical poems are treated as public-domain by author age in this project. Both reviewed Urdu Wikisource pages contain the transcribed works and state Creative Commons Attribution/Share-Alike availability in the footer. The footer's linked BY-SA license reference resolves to **CC BY-SA 3.0**.

This review also corrected the explicit transcription-license version recorded for the two existing Ghalib Wikisource source records from `CC BY-SA 4.0` to **`CC BY-SA 3.0`**. Their public-domain-author status and existing source links are otherwise unchanged.

No bulk literary ingestion was performed. Only **four opening couplets** across two Mir works are stored in the new bounded linkage shard.

## Files changed

1. `uz-data/uz-adab-sources-v1.json`
   - literature source count remains **6**
   - Mir `ساقی نامہ` and `جنگ نامہ` source records now carry explicit `transcription_license`, refreshed review date/evidence and the CC BY-SA rights state
   - the two existing Ghalib transcription records now record the rechecked CC BY-SA 3.0 license version
2. `uz-data/uz-adab-linkage-batch-03-mir.json`
   - new bounded shard
   - **2 poet→work links**
   - **4 verse units / couplets**
   - **48 word units**
   - works linked: `mir-saqi-nama`, `mir-jang-nama`
3. `tools/validate_expansion.py`
   - validates the third literature linkage shard
   - CC BY-SA literature source records must now carry explicit `transcription_license` and `review_evidence`
   - aggregate linkage minimum raised from **10 → 12 links**
   - requires at least **2 authors** with bounded literature linkage
4. This dated worklog.

## Counts

### Production baseline from `main` health run #26

- Urdu dictionary: **10,915 entries / 10,867 distinct words / 4,123 Urdu meanings**
- Proverbs/idioms: **2,853 rows / 916 meanings**
- Adab live catalog: **35 people / 79 listed works/text records**
- Corpus: **11 poets / 5,198 records**
- Literature source catalog: **6 reviewed sources**
- Literature reviewed work metadata: **40 works**
- Literature linkage before this batch: **10 links / 10 verse units / 160 word units / 1 linked author**

### Expected bounded-literature aggregate on this branch

- Literature sources: **6** (unchanged; two existing Mir records were re-reviewed)
- Reviewed work metadata: **40 works** (unchanged; existing Mir work IDs are reused)
- Literature linkage: **12 links / 14 verse units / 208 word units**
- Authors with bounded linkage: **2** (`ghalib`, `mir`)

## Validation status

The base `main` health run #26 passed with:

- `tools/validate_repo.py`: **0 errors / 0 warnings**
- `tools/validate_expansion.py`: **0 errors**

The feature-branch/PR validation for the final worklog head is **pending**. This batch must not merge until the final PR health run succeeds and the complete diff is reviewed.

## Intentionally untouched

- `uz-lughat.json` — untouched; no Mir/Arabic/Persian/English source dictionary material was merged into the canonical Urdu dictionary.
- `uz-kahawat.json` — untouched.
- `uz-data/uz-missing-v1.json` — untouched.
- Arabic, Persian and English lexicon layers — untouched and still separate.
- Shajra v2 — not started in this milestone.
- Corpus files — untouched.
- Public HTML/site UI — untouched.
- Existing 40 literature work IDs — no IDs were renamed or deleted.

## Merge decision

**Pending.** Merge only if the final PR health checks are green and the diff contains only the intended source-rights metadata, bounded Mir linkage shard, validator changes and this worklog.

## Next step

After this batch is validated and merged, continue priority 2 only with another clearly verified public-domain/open work/source that adds useful poet/work coverage without bulk copying. If no equally clean literature batch is available, move to priority 3 and expand canonical Urdu dictionary meanings/new words using UrduZaban's own wording while preserving the multilingual separation rule.
