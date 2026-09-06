# UrduZaban — Growth Plan

یہ plan موجودہ site اور repository کو ایک بڑے، منظم Urdu language platform میں بڑھانے کے لیے ہے۔ اس کا مقصد نئی چیزیں صرف جمع کرنا نہیں بلکہ انہیں آپس میں جوڑنا ہے۔

## Vision

UrduZaban کو ایسے "زبان کے گھر" میں بڑھایا جائے جہاں:

- لفظ سے معنی، اعراب، تلفظ، اصل، مثال، کہاوت، شعر اور corpus usage جڑ سکے؛
- شاعر سے اس کی زندگی، تصانیف، غزلیں، نظمیں، اشعار اور متعلقہ الفاظ جڑ سکیں؛
- کہاوت سے معنی، موضوع، الفاظ اور استعمال کی مثال جڑ سکے؛
- ادب searchable, browsable اور source-aware ہو؛
- data آزاد، documented اور machine-readable رہے۔

## Phase 1 — Foundation

### Repository
- README, contribution guide, repository map
- واضح data schemas
- validation scripts
- pull-request based changes for larger work
- generated vs hand-edited files کی واضح نشاندہی

### Site
- مشترک header/footer/navigation component strategy
- consistent metadata, canonical URLs and OpenGraph fields
- accessibility review
- mobile search/navigation improvements

## Phase 2 — Dictionary 2.0

ہر لفظ کے لیے ممکنہ fields:

- Urdu headword
- fully/partially marked aeraab
- Roman spelling
- part of speech
- Urdu meaning(s)
- concise English gloss
- pronunciation / audio
- plural / feminine / grammatical notes where relevant
- origin language reference
- source / confidence metadata
- corpus examples
- related words
- sayings containing the word
- poetry/literature occurrences

### New user features
- filters by first letter, POS and origin
- "لفظِ امروز"
- recently added / recently completed meanings
- related-word graph
- shareable permanent URL for every word

## Phase 3 — Kahawat & Muhawara

ہر entry کو structured record بنایا جائے:

- text
- type: kahawat / muhawara
- meaning
- theme tags
- key words
- usage example
- variant forms
- source/provenance note
- audio

Site features:
- موضوع کے لحاظ سے browse: عقل، محبت، گھر، رزق، وقت، محنت…
- alphabet index
- random saying
- "آج کی کہاوت"
- dictionary cross-links

## Phase 4 — Adab as a proper knowledge graph

### People
ہر شاعر/ادیب کے لیے stable ID اور profile:
- نام
- تخلص
- پیدائش/وفات
- شہر/خطہ
- ادبی دور
- اصناف
- مختصر زندگی
- اہم تصانیف
- public-domain/source status

### Works
ہر تحریر/غزل/نظم/افسانہ کے لیے:
- stable ID
- title
- author ID
- genre
- source URL
- rights status
- introduction
- text sections / parts
- extracted vocabulary index

### Dedicated sections to add
- غزلیں
- نظمیں
- مرثیے
- قصیدے
- رباعیات
- خطوط
- مضامین
- افسانے
- طنز و مزاح

## Phase 5 — Poet pages

ہر شاعر کا page خود ایک mini-library بنے:

- biography card
- timeline
- works count
- selected ghazals/nazms
- famous couplets
- vocabulary cloud
- topics/tags
- source links
- related poets / era

## Phase 6 — Search 2.0

ایک unified search bar جو simultaneously تلاش کرے:

- لغت
- کہاوت
- شاعر
- غزل/نظم title
- full-text literature
- corpus

Results tabs کے ساتھ:
`سب | لغت | کہاوت | ادب | شاعر | متن`

Roman Urdu query کو Urdu results سے بھی match کیا جائے۔

## Phase 7 — Shajra / Etymology v2

اصل زبان کا data الگ source files میں رہے، Urdu dictionary میں foreign lexicon نہ ملے۔

Suggested linked schema:

```json
{
  "urdu_id": "...",
  "origin": "fa",
  "source_word": "...",
  "root": "...",
  "family": ["..."],
  "sources": ["..."]
}
```

User-facing card:
- اصل زبان
- اصل املا
- root/family
- related Urdu words

## Phase 8 — Corpus & evidence

Corpus کو صرف background file نہ رہنے دیں؛ اسے product feature بنائیں:

- word frequency
- author frequency
- first/last attested source where data supports it
- concordance lines
- phrase search
- collocations

یہ dictionary meanings اور pronunciation review کو evidence دے گا۔

## Phase 9 — Learning tools

- روز کا لفظ
- اعراب quiz
- Roman Urdu → Urdu practice
- kahawat matching quiz
- poet/verse identification
- saved word lists (browser-local)
- printable vocabulary sheets

## Phase 10 — Public data/API

جب schemas stable ہو جائیں:

- versioned JSON releases
- downloadable dictionary/kahawat datasets
- documented read-only API
- schema version field
- changelog

## Priority: next 30 days

1. Repository docs + schemas + validation
2. Dictionary schema documentation
3. Kahawat schema + meaning backlog continue
4. Poet/work stable IDs
5. Add dedicated Ghazal and Nazm sections
6. Unified search prototype
7. 20-word Shajra v2 sample
8. automated link/JSON/site smoke checks

## What not to do yet

- موجودہ root HTML files کو فوراً folders میں move نہ کریں
- foreign dictionaries کو main Urdu dictionary میں merge نہ کریں
- thousands of new records add کرنے سے پہلے schemas stabilize کیے بغیر bulk import نہ کریں
- copyrighted literary text mirror نہ کریں جب usage right واضح نہ ہو

ترقی کی سمت: **زیادہ data + زیادہ ربط + زیادہ سند + کم بے ترتیبی۔**
