# اردو زبان — UrduZaban

**اپنی زبان کا اپنا گھر — لکھیے، بولیے، سنیے، سیکھیے۔**

UrduZaban is an open, browser-first home for Urdu language tools, dictionary data, sayings, pronunciation, transliteration and classical literature.

🌐 **Live:** https://www.urduzaban.com  
👤 **Created by:** Mohammad Farooq — Doha, Qatar  
📜 **Data/content:** CC BY 4.0 · **Code:** MIT

---

## کیا ہے؟ / What is UrduZaban?

UrduZaban is being built as a long-term public language resource, not as a single dictionary page. The project currently brings together:

- **لغت (Dictionary):** Urdu words, aeraab, Roman spelling, meanings, pronunciation and related metadata.
- **کہاوت و محاورہ:** searchable Urdu sayings and idioms, with meanings being added continuously.
- **قرینہ:** automatic aeraab / diacritic assistance in the browser.
- **ترجمان:** Roman Urdu ↔ Urdu tools.
- **آواز:** Urdu pronunciation / TTS experiments and browser-based listening tools.
- **ادب:** poets, poetry, prose, short stories, essays, satire and quotations, with public-domain/Wikisource material where appropriate.
- **سند / corpus:** source and corpus work used to strengthen the dictionary and language tools.

The site is designed to remain useful without paid subscriptions and to keep as much work as possible inside the user's own browser.

---

## موجودہ حالت / Project snapshot

Snapshot from **5 September 2026**:

| Area | Current snapshot |
|---|---:|
| Dictionary entries | 10,436 |
| Distinct dictionary words | 10,388 |
| Entries with Urdu meanings | 3,644 |
| Sayings / idioms | 2,853 |
| Sayings with written meanings | 534 |
| Poets / literary personalities | 35 |
| Poetry corpus | 5,190 |
| Prose | 11 |
| Short stories | 11 |
| Essays | 30 |
| Satire | 19 |
| Quotations | 8 |

These numbers change as the project grows.

---

## Repository map

```text
urduzaban/
├── index.html                 # home
├── lughat.html                # dictionary UI
├── kahawat.html               # sayings / idioms
├── qarina-aeraab.html         # aeraab tool
├── tarjuman.html              # transliteration / translation-facing tool
├── sanad.html                 # corpus / source-facing page
│
├── adab.html                  # literature entrance
├── shair.html                 # poets
├── sher.html                  # poetry
├── nasr.html                  # prose
├── afsana.html                # short stories
├── mazameen.html              # essays
├── tanz.html                  # satire
├── aqwal.html                 # quotations
│
├── uz-lughat.json             # main Urdu dictionary data
├── uz-kahawat.json            # sayings / idioms data
├── uz-data/                   # corpus, literature and supporting data
├── uz-docs/                   # research notes, logs and project documentation
├── api/                       # small server-side endpoints where needed
├── qarina-tts/                # voice / TTS related assets
├── fonts/                     # local Urdu fonts
└── .github/workflows/         # data/build/research automation
```

A fuller explanation is in [`uz-docs/REPOSITORY-MAP.md`](uz-docs/REPOSITORY-MAP.md).

---

## بنیادی اصول / Data principles

1. **Urdu dictionary stays Urdu.** Persian, Arabic and English source-language datasets are not merged into `uz-lughat.json`; etymology/origin work should remain linked separately.
2. **Meanings are written in our own words.** Source material can be used for verification, but copyrighted dictionary definitions are not copied verbatim.
3. **Literature must have a clear right to be used.** Public-domain material and appropriately licensed sources are preferred; Wikisource is used for eligible texts.
4. **Source and transformation should be traceable.** Corpus, research notes and derived data should be documented so future contributors can understand where a field came from.
5. **Do not break the live site for repository tidiness.** Public file paths are part of the deployed website; reorganising production files must be planned as a migration, not done casually.

---

## Deployment

The production site is hosted on **Hostinger**. The working repository is GitHub, and updates merged/pushed to the production branch are deployed to the website through the existing Hostinger/GitHub setup.

For normal contributions, use a branch + pull request where possible. This keeps the live site safe while changes are reviewed.

---

## How to contribute

Contributions are welcome in areas such as:

- Urdu meanings and aeraab review
- sayings / idioms and explanations
- literary metadata and public-domain texts
- poet / author biographies and bibliographies
- corpus cleanup and source verification
- transliteration and pronunciation
- accessibility, mobile UI and search
- tests, validation and documentation

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before changing data or site files.

---

## Roadmap

The long-term direction is to grow UrduZaban into an organised language house with connected rooms rather than disconnected pages: dictionary, sayings, literature, people, works, corpus, pronunciation, aeraab, transliteration, etymology and learning tools.

See [`uz-docs/GROWTH-PLAN.md`](uz-docs/GROWTH-PLAN.md) for the proposed structure and priorities.

---

## License

- **Data and original content:** Creative Commons Attribution 4.0 International (CC BY 4.0)
- **Code:** MIT
- **Classical public-domain literature:** remains public domain
- **Third-party material:** remains under its own applicable license

See [`LICENSE`](LICENSE) for the project pledge and full repository licensing notes.

---

> **اردو کروڑوں انسانوں کی زبان ہے۔ اسے بند نہیں، بڑھنا چاہیے۔**
