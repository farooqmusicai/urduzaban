# UrduZaban — Repository Map

یہ document repository کو سمجھنے کے لیے ہے۔ مقصد یہ ہے کہ آنے والا contributor فوراً جان سکے کون سی file live site کا حصہ ہے، کون سا data authoritative ہے، اور کون سی چیز research/supporting material ہے۔

## 1) Production pages

Root میں موجود HTML files live website کے public routes ہیں۔ انہیں محض repository tidiness کے لیے folders میں move نہ کریں، کیونکہ Hostinger deployment اور existing links ان paths پر depend کر سکتے ہیں۔

### Core rooms
- `index.html` — home / project entrance
- `lughat.html` — dictionary
- `kahawat.html` — sayings and idioms
- `qarina-aeraab.html` — aeraab tool
- `tarjuman.html` — Roman Urdu / Urdu language tool
- `sanad.html` — corpus/source-facing room

### Literature wing
- `adab.html` — literature entrance
- `shair.html` — poets / literary personalities
- `sher.html` — poetry corpus
- `nasr.html` — prose
- `afsana.html` — short stories
- `mazameen.html` — essays
- `tanz.html` — satire
- `aqwal.html` — quotations

### Supporting/public pages
- `qarina-neural.html` — neural/aeraab-related experimental page
- `uz-admin.html` — administrative/support interface

## 2) Main data

- `uz-lughat.json` — main Urdu dictionary dataset
- `uz-kahawat.json` — sayings / idioms dataset
- `qarina-dict.json` — Qarina supporting dictionary
- `uz-lughat-ext.json` — extended dictionary support data
- `uz-lughat-alt.tsv` — alternate forms/support data
- `uz-lughat-speak.tsv` — pronunciation/speech support

### Important rule

Foreign-language source dictionaries or datasets must not be merged into `uz-lughat.json`. Origin/etymology should be represented as linked metadata or separate source files.

## 3) `uz-data/`

This folder contains corpus, literature metadata, source samples, review queues and supporting datasets. Examples currently include:

- `uz-corpus-v1.json` — corpus
- `uz-missing-v1.json` — words missing from the main dictionary, prioritised for review
- `uz-adab-log.json` — literary personalities / metadata
- `uz-adab-matn.json` — literature text metadata / references
- `tajweez-aeraab.tsv` — aeraab suggestions
- Persian/Arabic review/sample TSVs
- historical backups and research support files

### Recommended future structure

Without breaking live references, new source material should gradually follow a clearer naming convention:

```text
uz-data/
├── core/          # production-ready structured data
├── corpus/        # corpus and missing-word queues
├── adab/          # literature metadata
├── review/        # human-review queues
├── derived/       # generated secondary data
└── archive/       # historical backups only
```

This is a migration target, not an instruction to move current files immediately.

## 4) `uz-docs/`

Research notes, logs and planning documents live here. Existing documents include aeraab logs, corpus schema notes, Lughat surveys, Platts review notes, Roman review notes and roadmap files.

Recommended long-term split:

```text
uz-docs/
├── architecture/
├── data-schemas/
├── research/
├── operations/
├── roadmaps/
└── archive/
```

Again, migrate only with link checks.

## 5) Code / services

- `api/lexicon.php` — server-side lexicon endpoint
- `uz-keyboard.js` — Urdu keyboard/input support
- `uz-translit.js` — transliteration logic/data
- `qarina-tts/` — TTS/voice assets and logic
- `fonts/` — locally served Urdu fonts

## 6) Automation

`.github/workflows/` contains multiple dictionary/research automation workflows, including alternate form, Arabic/Persian, Platts, Roman, speech, survey and neural-model sync jobs.

Because some of these workflows pre-date newer data-separation rules, changes to them should be reviewed carefully before enabling or extending them.

## 7) Deployment model

Current operational model:

```text
local work → GitHub repository → main branch → Hostinger deployment → urduzaban.com
```

For larger changes, safer model:

```text
main
  └── feature/docs/data branch
       └── Pull Request
            └── review + validation
                 └── merge
                      └── Hostinger deploy
```

## 8) What should be organised first

Priority order:

1. documentation and contribution rules
2. data schemas
3. validation scripts / CI
4. content indexes and IDs
5. only then physical movement of files

The important principle is: **make the repository understandable before making it prettier.**
