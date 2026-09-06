#!/usr/bin/env python3
"""UrduZaban repository health checks.

Read-only: validates important data relationships and local public-file links.
Exits non-zero only for structural errors that can break the site/data.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
ERRORS: list[str] = []
WARNINGS: list[str] = []
STATS: list[str] = []


def err(msg: str) -> None:
    ERRORS.append(msg)


def warn(msg: str) -> None:
    WARNINGS.append(msg)


def load_json(rel: str):
    p = ROOT / rel
    if not p.exists():
        err(f"missing JSON: {rel}")
        return None
    try:
        with p.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        err(f"invalid JSON {rel}: {e}")
        return None


def duplicate_values(rows, key: str):
    seen, dup = set(), set()
    for row in rows:
        if not isinstance(row, dict):
            continue
        v = row.get(key)
        if v in (None, ""):
            continue
        if v in seen:
            dup.add(v)
        seen.add(v)
    return sorted(dup, key=str)


def check_required_files():
    required = [
        "index.html", "about.html", "lughat.html", "kahawat.html", "adab.html",
        "qarina-aeraab.html", "tarjuman.html", "sanad.html",
        "uz-lughat.json", "uz-lughat-ext.json", "uz-kahawat.json",
        "uz-data/uz-adab-log.json", "uz-data/uz-adab-matn.json",
        "uz-data/uz-corpus-v1.json", "uz-ui.css", "uz-preferences.js",
        "LICENSE", "README.md",
    ]
    for rel in required:
        if not (ROOT / rel).exists():
            err(f"missing required file: {rel}")
    STATS.append(f"required files checked: {len(required)}")


def check_lughat():
    j = load_json("uz-lughat.json")
    if not isinstance(j, dict):
        return
    entries = j.get("entries")
    if not isinstance(entries, list):
        err("uz-lughat.json: entries is not a list")
        return
    dups = duplicate_values(entries, "id")
    if dups:
        err(f"uz-lughat.json: duplicate ids ({len(dups)}): {dups[:12]}")
    missing_id = sum(1 for e in entries if not isinstance(e, dict) or e.get("id") in (None, ""))
    missing_word = sum(1 for e in entries if not isinstance(e, dict) or not str(e.get("w") or "").strip())
    if missing_id:
        err(f"uz-lughat.json: {missing_id} entries missing id")
    if missing_word:
        err(f"uz-lughat.json: {missing_word} entries missing w")
    stated = j.get("count")
    if isinstance(stated, int) and stated != len(entries):
        warn(f"uz-lughat.json: count={stated}, actual entries={len(entries)}")
    words = {str(e.get("w")) for e in entries if isinstance(e, dict) and e.get("w")}
    ur_mean = sum(1 for e in entries if isinstance(e, dict) and str(e.get("ur") or "").strip())
    STATS.append(f"lughat: {len(entries):,} entries · {len(words):,} distinct words · {ur_mean:,} Urdu meanings")


def check_kahawat():
    j = load_json("uz-kahawat.json")
    if not isinstance(j, dict):
        return
    rows = j.get("rows")
    if not isinstance(rows, list):
        err("uz-kahawat.json: rows is not a list")
        return
    bad = []
    for i, row in enumerate(rows):
        if not isinstance(row, list) or len(row) < 3:
            bad.append(i)
            continue
        if not str(row[0] or "").strip():
            bad.append(i)
        if len(row) > 1 and row[1] not in ("k", "m"):
            warn(f"uz-kahawat.json row {i}: unknown type {row[1]!r}")
    if bad:
        err(f"uz-kahawat.json: malformed rows: {bad[:15]}")
    stated = j.get("c")
    if isinstance(stated, int) and stated != len(rows):
        warn(f"uz-kahawat.json: c={stated}, actual rows={len(rows)}")
    with_meaning = sum(1 for r in rows if isinstance(r, list) and len(r) > 3 and str(r[3] or "").strip())
    STATS.append(f"kahawat: {len(rows):,} rows · {with_meaning:,} meanings")


def check_adab():
    people = load_json("uz-data/uz-adab-log.json")
    works = load_json("uz-data/uz-adab-matn.json")
    if not isinstance(people, dict) or not isinstance(works, dict):
        return
    log = people.get("log") or []
    matn = works.get("matn") or []
    if not isinstance(log, list):
        err("uz-adab-log.json: log is not a list")
        return
    if not isinstance(matn, list):
        err("uz-adab-matn.json: matn is not a list")
        return
    pdups = duplicate_values(log, "id")
    wdups = duplicate_values(matn, "id")
    if pdups:
        err(f"adab people duplicate ids: {pdups[:12]}")
    if wdups:
        err(f"adab works duplicate ids: {wdups[:12]}")
    person_ids = {p.get("id") for p in log if isinstance(p, dict) and p.get("id")}
    broken = []
    for w in matn:
        if not isinstance(w, dict):
            continue
        by = w.get("by")
        if by and by not in person_ids:
            broken.append((w.get("id"), by))
    if broken:
        err(f"adab works with missing author ids ({len(broken)}): {broken[:12]}")
    STATS.append(f"adab: {len(log):,} people · {len(matn):,} listed works/text records")


def check_corpus():
    j = load_json("uz-data/uz-corpus-v1.json")
    if not isinstance(j, dict):
        return
    poets = j.get("poets") or []
    records = j.get("records") or []
    if not isinstance(poets, list) or not isinstance(records, list):
        err("uz-corpus-v1.json: poets/records shape invalid")
        return
    ids = [p.get("id") for p in poets if isinstance(p, dict) and p.get("id")]
    if len(ids) != len(set(ids)):
        err("uz-corpus-v1.json: duplicate poet ids")
    bad_indexes = []
    for r in records:
        if not isinstance(r, dict):
            continue
        p = r.get("p")
        if isinstance(p, int) and not (0 <= p < len(poets)):
            bad_indexes.append((r.get("id"), p))
    if bad_indexes:
        err(f"corpus records with invalid poet indexes: {bad_indexes[:12]}")
    STATS.append(f"corpus: {len(poets):,} poets · {len(records):,} records")


ATTR_RE = re.compile(r'''(?:href|src)\s*=\s*["']([^"']+)["']''', re.I)
PUBLIC_HTML = [
    "index.html", "about.html", "lughat.html", "kahawat.html", "adab.html",
    "shair.html", "sher.html", "nasr.html", "afsana.html", "mazameen.html",
    "tanz.html", "aqwal.html", "qarina-aeraab.html", "qarina-neural.html",
    "tarjuman.html", "sanad.html",
]


def local_target(page: str, raw: str):
    raw = raw.strip()
    if not raw or raw.startswith(("#", "http://", "https://", "mailto:", "tel:", "data:", "javascript:")):
        return None
    raw = raw.split("#", 1)[0].split("?", 1)[0]
    if not raw:
        return None
    raw = unquote(raw)
    if raw.startswith("/"):
        return ROOT / raw.lstrip("/")
    return (ROOT / page).parent / raw


def check_local_links():
    broken = []
    total = 0
    for rel in PUBLIC_HTML:
        p = ROOT / rel
        if not p.exists():
            continue
        text = p.read_text(encoding="utf-8", errors="replace")
        for raw in ATTR_RE.findall(text):
            target = local_target(rel, raw)
            if target is None:
                continue
            total += 1
            if not target.exists():
                # Runtime/private/generated files are allowed when explicitly known.
                name = target.as_posix()
                if any(x in name for x in ("lexicon.live.json", "suggest.json", "uz-config.php")):
                    continue
                broken.append((rel, raw))
    if broken:
        # Broken local assets/links can break a public page, so this is an error.
        err(f"broken local href/src ({len(broken)}): {broken[:20]}")
    STATS.append(f"local href/src checked: {total:,}")


def check_ui_integration():
    for rel in PUBLIC_HTML:
        text = (ROOT / rel).read_text(encoding="utf-8", errors="replace")
        if 'href="uz-ui.css"' not in text:
            err(f"UI CSS not linked: {rel}")
        if 'src="uz-preferences.js"' not in text:
            err(f"UI preferences JS not linked: {rel}")
    STATS.append(f"appearance controls checked: {len(PUBLIC_HTML)} public pages")


def main():
    check_required_files()
    check_lughat()
    check_kahawat()
    check_adab()
    check_corpus()
    check_local_links()
    check_ui_integration()

    print("\n=== UrduZaban repository health ===")
    for s in STATS:
        print("✓", s)
    for w in WARNINGS:
        print("⚠", w)
    for e in ERRORS:
        print("✗", e)
    print(f"\nResult: {len(ERRORS)} errors · {len(WARNINGS)} warnings")
    return 1 if ERRORS else 0


if __name__ == "__main__":
    sys.exit(main())
