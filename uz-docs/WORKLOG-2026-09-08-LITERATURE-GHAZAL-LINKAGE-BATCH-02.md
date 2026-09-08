# UrduZaban Worklog — 2026-09-08 — Literature Ghazal Linkage Batch 02

## Milestone

Current data-expansion foundation continued with a second bounded public-domain literature batch: **Ghalib, Deewan-e-Ghalib, Radeef Alif, ghazals 16–30**. The goal was to increase reviewed source/work coverage and extend poet → work → verse → word linkage without bulk-copying literary text.

## Branch / PR / commits

- Base `main`: `9652c214979cfb45f38c058dbab484f67322f8bb`
- Feature branch: `data/literature-ghazal-linkage-batch-02-2026-09-08`
- Pull request: **#9 — data: add reviewed Ghalib ghazal batch 16-30 and linkage shard**
- Source record commit: `f793884e4cab190c21a979c8324b488c7a8b8a37`
- Work metadata commit: `d1ff11af628bf634423444feede64bb4f823d690`
- Linkage shard commit: `f63f5729ce3a932616f4350e4e61dfc3af4040cf`
- Validator commit: `642dc6944d85a1a6b054850c1222256b496c9fbe`
- Final feature-branch head: `e6feae1ab3acdc0706c31cddc8f62e3fce848cb9`
- Production squash merge: `a0c008e6876893da9660f9b364771bfcda5902da`

## Verified source / rights

Reviewed on **2026-09-08**:

- Urdu Wikisource: `دیوان غالب/غزلیات/ردیف الف/ردیف الف غزل 16 تا 30`
- URL: https://ur.wikisource.org/wiki/دیوان_غالب/غزلیات/ردیف_الف/ردیف_الف_غزل_16_تا_30
- The page contains numbered sections **16 through 30**.
- The page footer states that text is available under Creative Commons Attribution/Share-Alike terms.
- Ghalib died in 1869; the underlying classical poems are treated as public-domain by author age in this project, while Wikisource transcription attribution/license metadata is retained.

No bulk literary ingestion was performed. Only **five first couplets** were added to the new bounded linkage shard.

## Files changed

1. `uz-data/uz-adab-sources-v1.json`
   - reviewed literature sources: **5 → 6**
   - added source ID: `ws-ghalib-radeef-alif-16-30`
2. `uz-data/uz-adab-works-sample-v2.json`
   - reviewed work records: **25 → 40**
   - added stable work IDs for Ghalib ghazals **16–30**
3. `uz-data/uz-adab-linkage-batch-02.json`
   - new shard with **5 links / 5 verse units / 80 word units**
   - linked ghazals: **16, 19, 21, 28, 29**
4. `tools/validate_expansion.py`
   - validates both linkage shards together
   - raises reviewed minimum gates to **6 sources / 40 works / 10 links**
   - rejects linkage text when the referenced work does not have `text_ingest_allowed=true`
5. This dated worklog.

## Validation results

GitHub Actions **UrduZaban site health run #21** first validated the data/code head `642dc6944d85a1a6b054850c1222256b496c9fbe`. After the worklog was added, **run #22** validated the complete PR head `e6feae1ab3acdc0706c31cddc8f62e3fce848cb9`. Both runs completed successfully.

### `tools/validate_repo.py` — final PR run #22

- required files checked: **18**
- lughat: **10,731 entries / 10,683 distinct words / 3,939 Urdu meanings**
- kahawat: **2,853 rows / 799 meanings**
- adab: **35 people / 79 listed works/text records**
- corpus: **11 poets / 5,198 records**
- local href/src checked: **395**
- appearance controls checked: **16 public pages**
- result: **0 errors / 0 warnings**

### `tools/validate_expansion.py` — final PR run #22

- source registry: **6 sources**
- literature source catalog: **6 sources**
- literature reviewed work batch: **40 works**
- aggregate literature linkage: **10 links / 10 verse units / 160 word units**
- canonical literature people available for references: **35**
- result: **0 errors**

## Diff review and merge decision

The complete PR #9 diff was reviewed before production merge. Scope was limited to the literature source catalog, work metadata, one bounded linkage shard, the expansion validator, and this worklog. No unexpected dictionary/proverb/corpus/UI files appeared in the diff. With final health run #22 green, PR #9 was squash-merged safely to `main` as `a0c008e6876893da9660f9b364771bfcda5902da`.

## Intentionally untouched

- `uz-lughat.json` — **not modified**; the separate 2026-09-08 main-branch dictionary batch remains at 10,731 entries and 3,939 meanings.
- `uz-kahawat.json` — **not modified**; remains 2,853 rows / 799 meanings.
- `uz-data/uz-missing-v1.json` — **not modified**; today's earlier missing-word reduction is preserved.
- Arabic, Persian and English source lexicons — **not imported or merged into `uz-lughat.json`**.
- Shajra v2 — intentionally deferred until the higher-priority current literature/data-expansion foundation is sufficiently established.
- Public HTML/site UI — not modified.

## Next step

Continue priority 2 with another verified public-domain/open literature batch, preferably adding a new poet/source or the next clearly licensed Ghalib group, while keeping verse text bounded and source-attributed. After that, return to priority 3 and expand Urdu dictionary meanings/new words in original Urdu wording.
