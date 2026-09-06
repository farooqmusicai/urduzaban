# UrduZaban Data Expansion — Worklog

**Date:** 6 September 2026  
**Branch:** `data/lexicon-literature-expansion-2026-09-06`  
**Production status:** not merged; live data untouched

## Work started

The project has now moved from infrastructure-only work into a dedicated real-data expansion branch.

### Added

- `uz-data/source-registry-v1.json`
  - Open English WordNet
  - Kaikki/Wiktionary Arabic
  - Kaikki/Wiktionary Persian
  - Kaikki/Wiktionary Urdu cross-check
  - Urdu Wikisource
  - Platts historical reference
  - license/provenance policy per source

- `uz-data/uz-adab-sources-v1.json`
  - verified source catalog for Ghalib, Iqbal and Mir starting points

- `uz-data/uz-adab-works-sample-v2.json`
  - 10 first-class literature work records
  - stable work IDs
  - author IDs
  - collection/source/rights metadata

- `uz-docs/DATA-EXPANSION-EXECUTION-PLAN.md`
  - dictionary, literature, multilingual and corpus expansion flow
  - ingestion pipeline and quality gates

## Important licensing decision

Open English WordNet can serve as the preferred direct English lexical source under CC BY 4.0 plus required WordNet notices.

Kaikki/Wiktionary Arabic/Persian/Urdu source data is kept separated because Wiktionary data carries CC BY-SA/GFDL obligations. It will not be blindly copied into the canonical UrduZaban CC BY data layer.

## Next real-data batch

1. expand literature metadata from 10 to 25–30 reviewed works
2. add Ghazal records, not only Nazm records
3. build a 20-word Shajra v2 reviewed sample
4. build a bounded Open English WordNet import sample
5. build bounded Arabic/Persian source samples and candidate Urdu links

## Safety

No change has been made to:

- `uz-lughat.json`
- `uz-kahawat.json`
- current live adab files
- corpus
- API
- TTS models
- production HTML

The branch is deliberately isolated until the first data batches validate cleanly.
