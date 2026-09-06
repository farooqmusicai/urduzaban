# UrduZaban Data Expansion — Foundation Worklog

**Date:** 6 September 2026  
**Branch:** `data/data-expansion-foundation-v1-2026-09-06`  
**Pull request:** #7 — `data: establish validated expansion foundation`  
**Validated head before this log:** `f26bff83ac2207ce5a6911def57a1120da98509d`

## Milestone completed

The previously isolated data-expansion idea has been rebuilt on top of the latest `main` data checkpoint so it does not lose the 6 September dictionary/proverb growth.

### Added

- `uz-data/source-registry-v1.json`
  - 6 reviewed source records
  - Open English WordNet
  - Kaikki Arabic / Persian / Urdu
  - Urdu Wikisource
  - Platts historical reference
  - explicit license, source URL, review date and separation status

- `uz-data/uz-adab-sources-v1.json`
  - 4 literature source records
  - Ghalib collection source
  - Iqbal author catalog as metadata-only/work-level-review-required
  - Mir `ساقی نامہ` and `جنگ نامہ`

- `uz-data/uz-adab-works-sample-v2.json`
  - 10 stable work-ID metadata records
  - no body-text bulk ingest
  - `text_ingest_allowed` is explicit per work

- `uz-docs/DATA-EXPANSION-EXECUTION-PLAN.md`
  - dictionary, literature, Shajra, multilingual and corpus pipeline
  - merge quality gates and batch order

- `tools/validate_expansion.py`
  - validates source IDs, work IDs, author/source references, rights/review fields and foreign-source separation rules

- `.github/workflows/site-health.yml`
  - now runs both the existing production health validator and the new data-expansion validator on PRs/main pushes

## Fresh source/licensing review

Reviewed on 6 September 2026:

- Open English WordNet official site states CC BY 4.0.
- Kaikki states Wiktionary-derived machine-readable data is under the same Wiktionary licenses: CC BY-SA and GFDL.
- Wikisource copyright policy requires works to be public domain or appropriately licensed; therefore UrduZaban still applies per-work review before text ingest.

## CI / validation result

PR #7 health run passed both validators:

### Existing repository health

- required files: 18 checked
- Urdu dictionary: **10,630 entries**
- distinct Urdu words: **10,582**
- Urdu meanings: **3,838**
- proverbs/idioms: **2,853**
- proverb/idiom meanings: **658**
- literary people: **35**
- existing listed works/text records: **79**
- corpus: **11 poets · 5,198 records**
- local href/src: 395 checked
- appearance controls: 16 public pages
- result: **0 errors · 0 warnings**

### Data-expansion foundation

- source registry: **6 sources**
- literature source catalog: **4 sources**
- work-ID proof batch: **10 works**
- canonical literature people available for references: **35**
- result: **0 errors**

## Intentionally untouched

No changes were made to:

- `uz-lughat.json`
- `uz-kahawat.json`
- `uz-data/uz-adab-log.json`
- `uz-data/uz-adab-matn.json`
- `uz-data/uz-corpus-v1.json`
- public HTML
- API/TTS/model files

No Arabic, Persian or English dictionary data was merged into the canonical Urdu dictionary.

## Next milestone

Expand literature metadata from 10 to **25–30 reviewed work records**, including a real ghazal batch, with stable `work_id`, source locator, rights state and a first poet → work → verse-unit linkage sample.
