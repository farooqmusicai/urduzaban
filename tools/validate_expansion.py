#!/usr/bin/env python3
"""Validate the UrduZaban data-expansion foundation.

Read-only checks for source provenance, literature source/work references and
separation rules. This complements tools/validate_repo.py.
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
    people_doc = load("uz-data/uz-adab-log.json")
    if any(x is None for x in (registry, adab_sources, works_doc, people_doc)):
        return finish()

    registry_rows = registry.get("sources") if isinstance(registry, dict) else None
    source_rows = adab_sources.get("sources") if isinstance(adab_sources, dict) else None
    work_rows = works_doc.get("works") if isinstance(works_doc, dict) else None
    people_rows = people_doc.get("log") if isinstance(people_doc, dict) else None

    if not isinstance(registry_rows, list):
        ERRORS.append("source-registry-v1.json: sources is not a list")
        registry_rows = []
    if not isinstance(source_rows, list):
        ERRORS.append("uz-adab-sources-v1.json: sources is not a list")
        source_rows = []
    if not isinstance(work_rows, list):
        ERRORS.append("uz-adab-works-sample-v2.json: works is not a list")
        work_rows = []
    if not isinstance(people_rows, list):
        ERRORS.append("uz-adab-log.json: log is not a list")
        people_rows = []

    registry_ids = unique_ids(registry_rows, "source registry")
    literature_source_ids = unique_ids(source_rows, "literature sources")
    work_ids = unique_ids(work_rows, "literature works")
    author_ids = {str(p.get("id")) for p in people_rows if isinstance(p, dict) and p.get("id")}

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
        for key in ("kind", "title", "rights_status", "language"):
            if not str(row.get(key) or "").strip():
                ERRORS.append(f"literature work {wid}: missing {key}")
        if "text_ingest_allowed" not in row or not isinstance(row.get("text_ingest_allowed"), bool):
            ERRORS.append(f"literature work {wid}: text_ingest_allowed must be boolean")

    required_registry = {"open-english-wordnet", "kaikki-arabic", "kaikki-persian", "kaikki-urdu", "urdu-wikisource"}
    missing = sorted(required_registry - registry_ids)
    if missing:
        ERRORS.append(f"source registry missing required foundation sources: {missing}")

    if len(work_ids) < 10:
        ERRORS.append(f"literature work proof batch too small: {len(work_ids)} < 10")

    STATS.append(f"source registry: {len(registry_ids)} sources")
    STATS.append(f"literature source catalog: {len(literature_source_ids)} sources")
    STATS.append(f"literature work proof batch: {len(work_ids)} works")
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
