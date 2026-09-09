#!/usr/bin/env python3
"""Validate the UrduZaban data-expansion foundation and literature linkage layer.

Read-only checks for source provenance, literature source/work references,
poet → work → verse-unit → word linkage, and foreign-lexicon separation.
This complements tools/validate_repo.py.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ERRORS: list[str] = []
STATS: list[str] = []


def load(rel: str):
    path = ROOT / rel
    if not path.exists():
        ERRORS.append(f"missing file: {rel}")
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        ERRORS.append(f"invalid JSON {rel}: {exc}")
        return None


def unique_ids(rows, label: str):
    ids = []
    for i, row in enumerate(rows):
        if not isinstance(row, dict):
            ERRORS.append(f"{label}[{i}] is not an object")
            continue
        value = str(row.get("id") or "").strip()
        if not value:
            ERRORS.append(f"{label}[{i}] missing id")
            continue
        ids.append(value)
    duplicates = sorted({x for x in ids if ids.count(x) > 1})
    if duplicates:
        ERRORS.append(f"{label} duplicate ids: {duplicates[:12]}")
    return set(ids)


def main() -> int:
    registry = load("uz-data/source-registry-v1.json")
    adab_sources = load("uz-data/uz-adab-sources-v1.json")
    works_doc = load("uz-data/uz-adab-works-sample-v2.json")
    linkage_docs = [
        ("uz-data/uz-adab-linkage-sample-v1.json", load("uz-data/uz-adab-linkage-sample-v1.json")),
        ("uz-data/uz-adab-linkage-batch-02.json", load("uz-data/uz-adab-linkage-batch-02.json")),
        ("uz-data/uz-adab-linkage-batch-03-mir.json", load("uz-data/uz-adab-linkage-batch-03-mir.json")),
    ]
    people_doc = load("uz-data/uz-adab-log.json")
    if any(x is None for x in (registry, adab_sources, works_doc, people_doc)):
        return finish()
    if any(doc is None for _, doc in linkage_docs):
        return finish()

    registry_rows = registry.get("sources") if isinstance(registry, dict) else None
    source_rows = adab_sources.get("sources") if isinstance(adab_sources, dict) else None
    work_rows = works_doc.get("works") if isinstance(works_doc, dict) else None
    people_rows = people_doc.get("log") if isinstance(people_doc, dict) else None
    link_rows = []

    if not isinstance(registry_rows, list):
        ERRORS.append("source-registry-v1.json: sources is not a list")
        registry_rows = []
    if not isinstance(source_rows, list):
        ERRORS.append("uz-adab-sources-v1.json: sources is not a list")
        source_rows = []
    if not isinstance(work_rows, list):
        ERRORS.append("uz-adab-works-sample-v2.json: works is not a list")
        work_rows = []
    for rel, doc in linkage_docs:
        rows = doc.get("links") if isinstance(doc, dict) else None
        if not isinstance(rows, list):
            ERRORS.append(f"{rel}: links is not a list")
            continue
        link_rows.extend(rows)
    if not isinstance(people_rows, list):
        ERRORS.append("uz-adab-log.json: log is not a list")
        people_rows = []

    registry_ids = unique_ids(registry_rows, "source registry")
    literature_source_ids = unique_ids(source_rows, "literature sources")
    work_ids = unique_ids(work_rows, "literature works")
    link_ids = unique_ids(link_rows, "literature links")
    author_ids = {str(p.get("id")) for p in people_rows if isinstance(p, dict) and p.get("id")}
    linked_author_ids = {
        str(row.get("author_id"))
        for row in link_rows
        if isinstance(row, dict) and row.get("author_id")
    }
    works_by_id = {
        str(row.get("id")): row
        for row in work_rows
        if isinstance(row, dict) and row.get("id")
    }

    for row in registry_rows:
        if not isinstance(row, dict):
            continue
        for key in ("name", "url", "license", "status", "reviewed_on"):
            if not str(row.get(key) or "").strip():
                ERRORS.append(f"source registry {row.get('id')}: missing {key}")
        if not str(row.get("url") or "").startswith("https://"):
            ERRORS.append(f"source registry {row.get('id')}: source URL must be https")
        lang = row.get("language")
        if lang in {"ar", "fa", "en"} and row.get("id") != "open-english-wordnet":
            status = str(row.get("status") or "")
            if "separated" not in status and "crosscheck" not in status:
                ERRORS.append(f"source registry {row.get('id')}: foreign/Wiktionary source must remain separated")

    for row in source_rows:
        if not isinstance(row, dict):
            continue
        sid = row.get("id")
        aid = row.get("author_id")
        if aid not in author_ids:
            ERRORS.append(f"literature source {sid}: unknown author_id {aid}")
        for key in ("url", "rights_status", "reviewed_on"):
            if not str(row.get(key) or "").strip():
                ERRORS.append(f"literature source {sid}: missing {key}")
        if not str(row.get("url") or "").startswith("https://"):
            ERRORS.append(f"literature source {sid}: source URL must be https")
        rights_status = str(row.get("rights_status") or "")
        if "transcription-license-cc-by-sa" in rights_status:
            license_name = str(row.get("transcription_license") or "").strip()
            if not license_name.startswith("CC BY-SA"):
                ERRORS.append(f"literature source {sid}: CC BY-SA source missing explicit transcription_license")
            if not str(row.get("review_evidence") or "").strip():
                ERRORS.append(f"literature source {sid}: CC BY-SA source missing review_evidence")

    for row in work_rows:
        if not isinstance(row, dict):
            continue
        wid = row.get("id")
        aid = row.get("author_id")
        sid = row.get("source_id")
        if aid not in author_ids:
            ERRORS.append(f"literature work {wid}: unknown author_id {aid}")
        if sid not in literature_source_ids:
            ERRORS.append(f"literature work {wid}: unknown source_id {sid}")
        for key in ("kind", "title", "source_locator", "rights_status", "language"):
            if not str(row.get(key) or "").strip():
                ERRORS.append(f"literature work {wid}: missing {key}")
        if "text_ingest_allowed" not in row or not isinstance(row.get("text_ingest_allowed"), bool):
            ERRORS.append(f"literature work {wid}: text_ingest_allowed must be boolean")

    verse_ids: list[str] = []
    word_ids: list[str] = []
    verse_count = 0
    word_count = 0
    for row in link_rows:
        if not isinstance(row, dict):
            continue
        lid = row.get("id")
        aid = row.get("author_id")
        wid = row.get("work_id")
        sid = row.get("source_id")
        work = works_by_id.get(str(wid))
        if aid not in author_ids:
            ERRORS.append(f"literature link {lid}: unknown author_id {aid}")
        if wid not in work_ids:
            ERRORS.append(f"literature link {lid}: unknown work_id {wid}")
        if sid not in literature_source_ids:
            ERRORS.append(f"literature link {lid}: unknown source_id {sid}")
        if work and work.get("author_id") != aid:
            ERRORS.append(f"literature link {lid}: author_id does not match work")
        if work and work.get("source_id") != sid:
            ERRORS.append(f"literature link {lid}: source_id does not match work")
        if work and work.get("text_ingest_allowed") is not True:
            ERRORS.append(f"literature link {lid}: linked work is not approved for bounded text ingest")
        if not str(row.get("source_locator") or "").strip():
            ERRORS.append(f"literature link {lid}: missing source_locator")

        units = row.get("verse_units")
        if not isinstance(units, list) or not units:
            ERRORS.append(f"literature link {lid}: verse_units must be a non-empty list")
            continue

        for unit in units:
            if not isinstance(unit, dict):
                ERRORS.append(f"literature link {lid}: verse unit is not an object")
                continue
            vid = str(unit.get("id") or "").strip()
            if not vid:
                ERRORS.append(f"literature link {lid}: verse unit missing id")
            else:
                verse_ids.append(vid)
            lines = unit.get("lines")
            if not isinstance(lines, list) or not lines or any(not str(x).strip() for x in lines):
                ERRORS.append(f"verse unit {vid or lid}: lines must be a non-empty string list")
            words = unit.get("word_units")
            if not isinstance(words, list) or not words:
                ERRORS.append(f"verse unit {vid or lid}: word_units must be a non-empty list")
                continue
            verse_count += 1
            expected_position = 1
            for word in words:
                if not isinstance(word, dict):
                    ERRORS.append(f"verse unit {vid or lid}: word unit is not an object")
                    continue
                word_id = str(word.get("id") or "").strip()
                if not word_id:
                    ERRORS.append(f"verse unit {vid or lid}: word unit missing id")
                else:
                    word_ids.append(word_id)
                if word.get("position") != expected_position:
                    ERRORS.append(
                        f"verse unit {vid or lid}: word position {word.get('position')} != {expected_position}"
                    )
                expected_position += 1
                for key in ("surface", "lookup_key"):
                    if not str(word.get(key) or "").strip():
                        ERRORS.append(f"word unit {word_id or vid or lid}: missing {key}")
                word_count += 1

    duplicate_verse_ids = sorted({x for x in verse_ids if verse_ids.count(x) > 1})
    duplicate_word_ids = sorted({x for x in word_ids if word_ids.count(x) > 1})
    if duplicate_verse_ids:
        ERRORS.append(f"literature linkage duplicate verse ids: {duplicate_verse_ids[:12]}")
    if duplicate_word_ids:
        ERRORS.append(f"literature linkage duplicate word ids: {duplicate_word_ids[:12]}")

    required_registry = {
        "open-english-wordnet",
        "kaikki-arabic",
        "kaikki-persian",
        "kaikki-urdu",
        "urdu-wikisource",
    }
    missing = sorted(required_registry - registry_ids)
    if missing:
        ERRORS.append(f"source registry missing required foundation sources: {missing}")

    if len(literature_source_ids) < 6:
        ERRORS.append(f"literature source reviewed batch too small: {len(literature_source_ids)} < 6")
    if len(work_ids) < 40:
        ERRORS.append(f"literature work reviewed batch too small: {len(work_ids)} < 40")
    if len(link_ids) < 12:
        ERRORS.append(f"literature linkage sample too small: {len(link_ids)} < 12")
    if len(linked_author_ids) < 2:
        ERRORS.append(f"literature linkage author coverage too small: {len(linked_author_ids)} < 2")

    STATS.append(f"source registry: {len(registry_ids)} sources")
    STATS.append(f"literature source catalog: {len(literature_source_ids)} sources")
    STATS.append(f"literature reviewed work batch: {len(work_ids)} works")
    STATS.append(f"literature linkage: {len(link_ids)} links · {verse_count} verse units · {word_count} word units")
    STATS.append(f"literature authors with bounded linkage: {len(linked_author_ids)}")
    STATS.append(f"canonical literature people available for references: {len(author_ids)}")
    return finish()


def finish() -> int:
    print("\n=== UrduZaban data-expansion foundation ===")
    for stat in STATS:
        print("✓", stat)
    for error in ERRORS:
        print("✗", error)
    print(f"\nResult: {len(ERRORS)} errors")
    return 1 if ERRORS else 0


if __name__ == "__main__":
    sys.exit(main())
