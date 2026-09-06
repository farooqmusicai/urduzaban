# UrduZaban — Real Data Expansion Execution Plan

**Date:** 6 September 2026  
**Goal:** move from infrastructure work to steady, reviewable growth of dictionary, literature, corpus and multilingual word-history data.

## Current production checkpoint

Latest `main` data commit (`d72be813…`) reports:

- Urdu dictionary: **10,630 entries**
- Proverbs/idioms with meanings: **658**
- Existing live literature/corpus files remain unchanged by this foundation milestone.

The repository health validator remains the authority for full live counts at each merge.

## Four data streams

### A — Urdu dictionary growth

Target fields per reviewed Urdu entry:

- headword and stable ID
- aeraab / pronunciation
- Roman Urdu
- Urdu meaning written in UrduZaban's own words
- short English gloss where useful
- part of speech / grammatical gender where relevant
- example and provenance
- links to proverbs, literature and corpus

**Rule:** imported dictionaries are sources/evidence, not automatic replacement prose for UrduZaban definitions.

### B — Literature growth

First-class records for ghazal, nazm, rubai, qasida, marsiya and eligible prose. Every work must carry a stable `work_id`, `author_id`, genre, source, rights status and review state before text ingest.

### C — Multilingual lexicons and Shajra

Keep language datasets separate:

```text
uz-data/languages/ur/
uz-data/languages/ar/
uz-data/languages/fa/
uz-data/languages/en/
```

Relationships live separately in `uz-data/uz-shajra-v2.json` (or a sharded successor).

**Hard guard:** Arabic, Persian and English source dictionaries must never be bulk-merged into `uz-lughat.json`.

### D — Corpus and cross-links

Build reusable indexes for word → verse, poet, work, proverb, frequency and concordance. These indexes are derived from canonical data and must be reproducible.

## Ingestion pipeline

```text
SOURCE
  ↓
RAW SNAPSHOT + source/license metadata
  ↓
NORMALIZATION
  ↓
RIGHTS / LICENSE FILTER
  ↓
DEDUPLICATION + ID MAPPING
  ↓
CANDIDATE DATASET
  ↓
AUTOMATIC VALIDATION
  ↓
REVIEWED SAMPLE
  ↓
CANONICAL DATA / SEPARATE LICENSED SOURCE LAYER
  ↓
SEARCH / SHAJRA / CORPUS INDEXES
  ↓
SITE UI
```

Raw external data and canonical UrduZaban data are never the same layer.

## Reviewed source direction

Canonical registry: `uz-data/source-registry-v1.json`.

- **English:** Open English WordNet — bounded direct-import prototype under CC BY 4.0 with attribution.
- **Arabic/Persian:** Kaikki/Wiktionary — separate source layers under Wiktionary CC BY-SA/GFDL obligations; reviewed facts may support Shajra.
- **Urdu cross-check:** Kaikki Urdu plus historical references; canonical Urdu meanings stay independently authored.
- **Literature:** Urdu Wikisource/public-domain or openly licensed sources, with per-work rights review.

## Batch order

### Batch 1 — Foundation + literature proof batch
- source registry
- reviewed literature source catalog
- stable work-ID sample
- automatic foundation validator
- no production HTML or live literary body text change

### Batch 2 — Literature expansion
- 25–30 reviewed work records
- include ghazal as well as nazm
- add source locators and rights metadata
- start poet → work → verse-unit IDs

### Batch 3 — Shajra proof batch
- 20 common Urdu words
- origin language/source form/root/path
- source and confidence fields
- no bulk foreign definitions in Urdu dictionary

### Batch 4 — English lexicon prototype
- bounded Open English WordNet sample
- preserve OEWN source IDs and attribution
- separate English index
- English → Urdu candidate link table

### Batch 5 — Arabic/Persian source snapshots
- bounded machine-readable samples
- separate licensing/provenance layer
- normalization and candidate Urdu links

## Merge quality gates

A batch cannot reach `main` unless:

- JSON parses
- IDs are unique
- author/work/source references resolve
- source and rights/license metadata exist
- live repository health checks pass
- existing production counts do not unexpectedly fall
- imported foreign/source prose does not overwrite canonical Urdu data
- diff is reviewed before merge

## Definition of done

A batch is complete only when it has source records, normalized IDs, rights/provenance, automatic validation, a review note and a documented next use.

**Operating principle:** make a small batch correct and traceable first; then automate and scale it to hundreds or thousands.
