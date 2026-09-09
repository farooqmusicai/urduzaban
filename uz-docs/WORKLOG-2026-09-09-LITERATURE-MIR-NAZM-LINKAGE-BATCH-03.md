# UrduZaban Worklog — 2026-09-09 — Mir Nazm Linkage Batch 03

## Milestone

Priority 2 (public-domain literature) continued with a bounded Mir Taqi Mir nazm linkage batch. The goal was to diversify the existing poet → work → verse → word foundation beyond Ghalib while keeping literary text small, source-attributed and rights-reviewed.

## Branch / PR / commits

- Base `main`: `7dae5c66d195e29b778138ffe3b838eb3e2194eb`
- Feature branch: `data/literature-mir-nazm-linkage-batch-03-2026-09-09`
- Pull request: **#11 — data: add reviewed Mir nazm linkage batch and rights audit**
- Rights/source metadata commit: `3caf1dcc5da2d9d127d4a80304833ac23d73033a`
- Mir linkage shard commit: `7f14778c848c7e6f980d95a58ed181718001952a`
- Validator commit: `dc134d844c92540d1cebb4799e9583a52eb12627`
- Feature-branch worklog commit / final PR head: `e58807378e84ebcc5765104dc0094305a6076084`
- Production squash merge: `5481c7fa79317e2fc650f782a9bc988d830d74ac`
- Docs-finalization branch: `docs/finalize-worklog-mir-batch-03-2026-09-09`
- Docs-finalization PR: pending creation at the time of this edit

## Verified sources / rights

Reviewed on **2026-09-09**:

1. Urdu Wikisource — `ساقی نامہ (میر تقی میر)`  
   https://ur.wikisource.org/wiki/ساقی_نامہ_(میر_تقی_میر)
2. Urdu Wikisource — `جنگ نامہ (میر تقی میر)`  
   https://ur.wikisource.org/wiki/جنگ_نامہ_(میر_تقی_میر)

Mir Taqi Mir died in 1810, so the underlying classical poems are treated as public-domain by author age in this project. Both reviewed Urdu Wikisource pages contain the transcribed works and state Creative Commons Attribution/Share-Alike availability in the footer. Following the footer's license path reaches the Creative Commons **CC BY-SA 3.0** deed.

This review also corrected the explicit transcription-license version recorded for the two existing Ghalib Wikisource source records from `CC BY-SA 4.0` to **`CC BY-SA 3.0`**. Their public-domain-author status and existing source links are otherwise unchanged.

No bulk literary ingestion was performed. Only **four opening couplets** across two Mir works are stored in the new bounded linkage shard.

## Files changed in production PR #11

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

## Production counts after this milestone

Final PR health run **#28** confirmed:

- Urdu dictionary: **10,915 entries / 10,867 distinct words / 4,123 Urdu meanings**
- Proverbs/idioms: **2,853 rows / 916 meanings**
- Adab live catalog: **35 people / 79 listed works/text records**
- Corpus: **11 poets / 5,198 records**
- Literature source catalog: **6 reviewed sources**
- Literature reviewed work metadata: **40 works**
- Literature linkage: **12 links / 14 verse units / 208 word units**
- Authors with bounded linkage: **2** (`ghalib`, `mir`)
- Canonical literature people available for references: **35**

Compared with the previous literature checkpoint, linkage grew **10 → 12 links**, **10 → 14 verse units**, **160 → 208 word units**, and bounded author coverage grew **1 → 2**.

## Validation results

GitHub Actions **UrduZaban site health run #28** validated the final PR #11 merge candidate containing feature head `e58807378e84ebcc5765104dc0094305a6076084` against current `main`.

### `tools/validate_repo.py` — run #28

- required files checked: **18**
- lughat: **10,915 entries / 10,867 distinct words / 4,123 Urdu meanings**
- kahawat: **2,853 rows / 916 meanings**
- adab: **35 people / 79 listed works/text records**
- corpus: **11 poets / 5,198 records**
- local href/src checked: **395**
- appearance controls checked: **16 public pages**
- result: **0 errors / 0 warnings**

### `tools/validate_expansion.py` — run #28

- source registry: **6 sources**
- literature source catalog: **6 sources**
- literature reviewed work batch: **40 works**
- literature linkage: **12 links / 14 verse units / 208 word units**
- literature authors with bounded linkage: **2**
- canonical literature people available for references: **35**
- result: **0 errors**

## Diff review and merge decision

The complete PR #11 diff was reviewed before production merge. It contained exactly **4 intended files**:

- `tools/validate_expansion.py`
- `uz-data/uz-adab-linkage-batch-03-mir.json`
- `uz-data/uz-adab-sources-v1.json`
- `uz-docs/WORKLOG-2026-09-09-LITERATURE-MIR-NAZM-LINKAGE-BATCH-03.md`

The two stored Mir opening couplets per work were checked against their reviewed Urdu Wikisource pages. No dictionary, proverb, missing-word, corpus, public HTML or foreign-lexicon file appeared in the production diff. With run #28 green and the diff limited to the intended scope, PR #11 was squash-merged safely to `main` as `5481c7fa79317e2fc650f782a9bc988d830d74ac`.

## Intentionally untouched

- `uz-lughat.json` — untouched; no Mir/Arabic/Persian/English source dictionary material was merged into the canonical Urdu dictionary.
- `uz-kahawat.json` — untouched.
- `uz-data/uz-missing-v1.json` — untouched.
- Arabic, Persian and English lexicon layers — untouched and still separate.
- Shajra v2 — not started in this milestone.
- Corpus files — untouched.
- Public HTML/site UI — untouched.
- Existing 40 literature work IDs — no IDs were renamed or deleted.

## Next step

Continue priority 2 only with another clearly verified public-domain/open work/source that adds useful poet/work coverage without bulk copying. If no equally clean literature batch is available, move to priority 3 and expand canonical Urdu dictionary meanings/new words using UrduZaban's own wording while preserving the multilingual separation rule.
