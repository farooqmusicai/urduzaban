# UrduZaban — Real Data Expansion Execution Plan

**Date:** 6 September 2026  
**Goal:** Move from infrastructure work to steady, reviewable growth of dictionary, literature, corpus and multilingual word-history data.

## 1. Current baseline

Latest repository health baseline:

- Urdu dictionary: 10,436 entries
- Distinct Urdu words: 10,388
- Urdu meanings written: 3,644
- Proverbs/idioms: 2,853
- Proverbs/idioms with meanings: 534
- Literary people: 35
- Listed literature/work records: 79
- Poetry corpus records: 5,198

## 2. Four parallel data streams

### A — Urdu Dictionary Growth

Target data per reviewed Urdu entry:

- headword
- aeraab
- Roman
- Urdu meaning written in UrduZaban's own words
- short English gloss
- part of speech
- grammatical gender where relevant
- pronunciation/speak form
- example
- source/provenance
- related words
- links to proverbs, literature and corpus

**Rule:** imported dictionaries are evidence/sources, not automatic replacement text for UrduZaban definitions.

### B — Literature Growth

Create first-class work records for:

- ghazal
- nazm
- rubai
- qasida
- marsiya
- prose
- afsana
- essay
- satire
- letters/other eligible genres

Every ingested work must have:

- stable `work_id`
- `author_id`
- title / first line when appropriate
- genre
- collection
- source URL/scan
- rights status
- source review date
- text or verse-unit IDs

Priority is public-domain material with a clear source trail.

### C — Multilingual Lexicons and Shajra

Keep each language separate:

```text
uz-data/languages/ur/
uz-data/languages/ar/
uz-data/languages/fa/
uz-data/languages/en/
```

Relationships live separately in a graph such as:

`uz-data/uz-shajra-v2.json`

Target experience:

`Urdu word → source language → source form/root → intermediate language (if any) → earliest evidence → related forms`

No foreign dictionary is to be bulk-merged into `uz-lughat.json`.

### D — Corpus and Cross-links

Build reusable indexes:

- word → verses
- word → poets
- word → works
- poet → vocabulary
- work → dictionary headwords
- proverb → words
- word frequency
- concordance / collocations later

## 3. Ingestion pipeline

Every source follows this flow:

```text
SOURCE DOWNLOAD / FETCH
        ↓
RAW SNAPSHOT (unchanged + source/license metadata)
        ↓
NORMALIZATION
        ↓
LICENSE / RIGHTS FILTER
        ↓
DEDUPLICATION + ID MAPPING
        ↓
CANDIDATE DATASET
        ↓
AUTOMATIC VALIDATION
        ↓
HUMAN/REVIEWED SAMPLE
        ↓
CANONICAL DATA
        ↓
SEARCH / CROSS-LINK INDEXES
        ↓
SITE UI
```

Raw source files and canonical UrduZaban data must never be confused.

## 4. Approved source direction

See `uz-data/source-registry-v1.json`.

Initial source choices:

- **English:** Open English WordNet — preferred primary English lexical source because it is available under CC BY 4.0 with required WordNet notices/attribution.
- **Arabic:** Kaikki/English Wiktionary extraction — separated source layer under Wiktionary licenses; use for discovery and reviewed Shajra links.
- **Persian:** Kaikki/English Wiktionary extraction — separated source layer under Wiktionary licenses; use for discovery and reviewed Shajra links.
- **Urdu cross-check:** Kaikki Urdu + historical public-domain dictionaries such as Platts.
- **Literature:** Urdu Wikisource/public-domain scans, with per-work rights review.

## 5. Licensing rule that prevents future trouble

Wiktionary/Kaikki material is CC BY-SA/GFDL. Therefore it must not be silently copied into a dataset presented only as CC BY 4.0.

We will either:

1. keep Wiktionary-derived source data in a clearly separated BY-SA source layer; or
2. use it as evidence/discovery and independently author/review canonical UrduZaban fields; or
3. preserve required share-alike licensing and attribution on any redistributed derived subset.

Open English WordNet is a better direct English import target because its current project data is published under CC BY 4.0 with underlying WordNet notices.

## 6. Batch order

### Batch 1 — Literature proof batch

- move the already prepared source catalog into a fresh branch based on current `main`
- 20–30 reviewed public-domain work records
- mix of ghazal + nazm
- stable IDs and rights metadata
- no live UI dependency yet

### Batch 2 — Shajra proof batch

- 20 common Urdu words
- reviewed Arabic/Persian/English source links
- root/path/source/confidence
- no bulk foreign data in main Urdu dictionary

### Batch 3 — English lexicon import prototype

- ingest a bounded Open English WordNet sample
- preserve source IDs and attribution
- create English search index separately
- test English → Urdu link table

### Batch 4 — Arabic/Persian source snapshots

- fetch bounded machine-readable samples first
- normalize script, transliteration and root fields
- retain source license/provenance
- build candidate links to Urdu words

### Batch 5 — Scale literature

- 100+ public-domain works
- verse/unit IDs
- poet → work pages
- work → dictionary cross-links

## 7. Quality gates

A batch cannot reach `main` unless:

- JSON parses
- IDs are unique
- author/work references resolve
- source exists
- rights/license field exists
- no unexpected drop in existing counts
- no overwrite of canonical Urdu data by raw imported text
- health action passes

## 8. What counts as "done"

Not just a downloaded file.

A data batch is complete only when it has:

- source record
- normalized records
- IDs
- license/provenance
- validation
- review note
- a documented next use in the UI/search/graph

## 9. Immediate next real-data targets

1. bring the existing 10 literature prototype work records onto this fresh data branch
2. expand to 25–30 reviewed public-domain works
3. create the first 20-word `uz-shajra-v2` sample
4. create the first bounded Open English WordNet import sample
5. add Arabic/Persian source samples only after preserving their separate licensing layer

**Operating principle:** first make a small batch correct and traceable; then automate and scale it to hundreds or thousands.
