# اردو زبان — UrduZaban

**اپنی زبان کا اپنا گھر — لکھیے، بولیے، سنیے، سیکھیے، اور مل کر بڑھائیے۔**

🌐 **Live website:** https://www.urduzaban.com  
👤 **Founder:** Mohammad Farooq — Doha, Qatar  
📜 **Data & original content:** CC BY 4.0 · **Code:** MIT  
🌍 **Status:** Public, free, open and actively growing

---

## اردو زبان کیا ہے؟

**UrduZaban** ایک کھلا، عوامی اور طویل مدتی اردو language platform ہے۔ مقصد صرف ایک dictionary بنانا نہیں، بلکہ ایسا مکمل گھر بنانا ہے جہاں:

- اردو **لغت** ہو؛
- **اعراب**، Roman Urdu، تلفظ اور آواز کے اوزار ہوں؛
- **کہاوتیں اور محاورے** محفوظ ہوں؛
- **شاعر، غزلیں، نظمیں، نثر، افسانے، مضامین اور طنز** منظم صورت میں ملیں؛
- ہر لفظ کے ساتھ اس کا **معنی، تلفظ، اصل، شجرہ، حوالہ، corpus evidence اور ادبی استعمال** جڑ سکے؛
- Arabic, Persian اور English lexicons الگ رہیں مگر Urdu words کے ساتھ علمی ربط قائم ہو؛
- اور مستقبل میں لوگ Wikipedia-style طریقے سے **تجاویز، corrections، نئے الفاظ، معنی، ادب اور حوالہ جات** شامل کر سکیں — review اور history کے ساتھ۔

> **اردو کسی ایک شخص کی ملکیت نہیں۔ یہ کروڑوں لوگوں کی زبان ہے، اس لیے اس کا علمی data بھی کھلا، قابلِ استعمال اور قابلِ بڑھوتری ہونا چاہیے۔**

---

## موجودہ حالت

**Snapshot — 5/6 September 2026**

| حصہ | موجودہ حالت |
|---|---:|
| لغت کے اندراج | 10,436 |
| الگ الفاظ | 10,388 |
| اردو معنی والے اندراج | 3,644 |
| کہاوتیں / محاورے | 2,853 |
| مطلب لکھے جا چکے | 534 |
| ادبی شخصیات | 35 |
| شعری corpus | 5,190 |
| نثر | 11 |
| افسانے | 11 |
| مضامین | 30 |
| طنز و مزاح | 19 |
| اقوال | 8 |

یہ اعداد مسلسل بڑھ رہے ہیں۔

---

## ابھی site پر کیا موجود ہے؟

### 📖 لغت

`lughat.html`

- Urdu / Roman / English search
- اعراب
- Roman spelling
- English gloss
- اردو معنی
- part of speech
- نام، صنف اور origin metadata
- pronunciation / speak-form
- source / sanad
- extended details: IPA, etymology, synonyms, examples, multiple senses
- متعلقہ کہاوتوں کے links

### 🪔 کہاوت و محاورہ

`kahawat.html`

- 2,853 records
- مکمل text + Roman
- کہاوت / محاورہ classification
- معنی
- موقعِ استعمال
- لفظ پر click سے لغت / آواز integration

### 🖋 قرینہ

`qarina-aeraab.html`

Browser-based Urdu aeraab/diacritic system۔

- text browser میں process ہوتا ہے
- معلوم / مشتبہ / نامعلوم الفاظ الگ نشان زد
- pronunciation tools
- اپنی Urdu voice / TTS integration

### 🔁 ترجمان

`tarjuman.html`

- Roman Urdu → Urdu
- Urdu → Roman
- browser-first transliteration

### 🏛 ادب

`adab.html`

موجودہ ادبی کمرے:

- شاعر
- شعر
- نثر
- افسانے
- مضامین
- طنز و مزاح
- اقوال

Literature metadata stable author/work IDs کی طرف بڑھ رہا ہے، تاکہ مستقبل میں:

**شاعر → غزل/نظم → شعر → لفظ → لغت → corpus → شجرہ**

ایک دوسرے سے جڑ سکیں۔

### 📜 سند / Corpus

`sanad.html` + `uz-data/uz-corpus-v1.json`

مقصد یہ ہے کہ لغت اور ادبی claims صرف اندازے پر نہ ہوں بلکہ جہاں ممکن ہو source/corpus evidence کے ساتھ ہوں۔

### 🔊 اپنی Urdu آواز

`qarina-tts/`

Browser میں چلنے والی Urdu speech/TTS پر کام جاری ہے، جس میں neural voice assets اور pronunciation pipeline شامل ہیں۔

---

## نیا: About page

اب website پر باقاعدہ **ہمارے بارے میں** صفحہ موجود ہے:

https://www.urduzaban.com/about.html

اس میں founder **Mohammad Farooq**، project کا پیغام، journey، دوسرے projects، technical background اور open-community vision درج ہیں۔

---

## بانی کا پیغام

یہ گھر **محمد فاروق** قطر سے اپنی زبان کے لیے بنا رہے ہیں۔ سفر Farooq Music سے شروع ہوا، جہاں Urdu songs اور ghazals کے تلفظ، اعراب اور آواز کے مسائل نے language tools بنانے کی ضرورت پیدا کی۔

آج مقصد یہ ہے کہ UrduZaban کسی ایک developer کی بند website نہ رہے بلکہ ایسا آزاد platform بنے جہاں دنیا بھر کے لوگ:

- سیکھیں؛
- سکھائیں؛
- غلطیاں درست کریں؛
- نئے الفاظ اور معنی دیں؛
- کہاوتیں اور محاورے محفوظ کریں؛
- public-domain ادب شامل کریں؛
- تلفظ اور اعراب بہتر کریں؛
- اور Urdu language data کو آنے والی نسلوں کے لیے زیادہ مضبوط بنائیں۔

---

## Repository کا نقشہ

```text
urduzaban/
├── index.html                 # home
├── about.html                 # founder + mission
├── lughat.html                # dictionary
├── kahawat.html               # proverbs / idioms
├── qarina-aeraab.html         # aeraab
├── tarjuman.html              # Roman ⇄ Urdu
├── sanad.html                 # source / corpus-facing page
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
├── uz-lughat.json             # main Urdu dictionary
├── uz-lughat-ext.json         # extended word details
├── uz-kahawat.json            # sayings / idioms
├── uz-data/                   # corpus, literature and supporting data
├── uz-docs/                   # architecture, roadmap, logs, schemas
├── api/                       # small server-side endpoints
├── qarina-tts/                # speech / TTS assets
├── fonts/                     # local Urdu fonts
└── .github/workflows/         # automation / surveys / data tools
```

---

## Data architecture — اہم اصول

### 1. Urdu dictionary صرف Urdu رہے گی

Arabic, Persian اور English lexicons کو `uz-lughat.json` میں bulk merge نہیں کیا جائے گا۔

Future model:

```text
Urdu lexicon
Arabic lexicon
Persian lexicon
English lexicon
      ↓
Shajra / relation graph
```

### 2. شجرۂ لفظ الگ layer ہوگا

ہر Urdu word کے ساتھ جہاں evidence ہو:

- اصل زبان
- اصل املا
- root
- intermediary language
- related words
- known historical evidence
- earliest known attestation

جوڑا جا سکے گا۔

### 3. معنی اپنے لفظوں میں

Copyrighted dictionaries کی definitions جوں کی توں copy نہیں کی جاتیں۔ facts verify کیے جا سکتے ہیں، مگر UrduZaban کے explanatory meanings اپنے الفاظ میں لکھے جاتے ہیں۔

### 4. ادب میں rights پہلے

Public-domain / clearly licensed texts پہلے شامل کیے جاتے ہیں۔ Source اور rights status record کا حصہ ہونا چاہیے۔

---

## Community vision — Wikipedia-style مگر محفوظ

Future contribution model:

```text
User suggestion
      ↓
Pending change
      ↓
Automatic validation
      ↓
Human review
      ↓
Approved canonical data
      ↓
Build / deploy
```

مقصد openness کے ساتھ vandalism اور غلط data سے حفاظت بھی ہے۔

Future roles:

- Reader
- Contributor
- Reviewer / Editor

اور ہر approved change کی version history محفوظ رہے گی۔

---

## UI / Reading experience — کام جاری ہے

UrduZaban صرف data project نہیں؛ reading experience بھی اہم ہے۔ موجودہ development میں یہ چیزیں شامل ہیں:

- multiple color themes
- Nastaliq / Naskh font choice
- optional open Urdu/Arabic fonts
- text-size control
- line-spacing control
- reduced-motion accessibility
- user preference browser میں محفوظ

یہ features پہلے safe feature branch میں test ہو رہے ہیں، پھر production pages میں مرحلہ وار آئیں گے۔

---

## آج ہم کس پر کام کر رہے ہیں؟

Current work plan repository میں موجود ہے:

[`uz-docs/WORK-ROADMAP-2026-09.md`](uz-docs/WORK-ROADMAP-2026-09.md)

قریب ترین priorities:

1. site-wide theme + font controls
2. automatic JSON / ID / link validation
3. public-domain ghazal/nazm source catalog
4. first-class literature work records
5. poet profile deep links
6. unified search across dictionary + sayings + literature
7. Shajra v2 sample
8. moderated community contribution prototype

---

## GitHub workflow اور production safety

Production website Hostinger پر ہے اور `main` branch سے deploy ہوتی ہے۔

اس لیے بڑی تبدیلیوں کا محفوظ طریقہ:

```text
main
  ↓
feature branch
  ↓
work + tests
  ↓
pull request
  ↓
review
  ↓
merge to main
  ↓
Hostinger deploy
```

صرف repository صاف دکھانے کے لیے live paths move نہیں کیے جاتے۔

---

## Contribution

Contributions مستقبل میں کئی سطحوں پر welcome ہوں گی:

- اردو معنی
- اعراب
- Roman spelling
- pronunciation
- کہاوت / محاورہ
- شاعر اور ادیب metadata
- public-domain literature sources
- corpus cleanup
- etymology evidence
- accessibility / UI
- tests / validation
- documentation

بڑی contribution سے پہلے project structure اور rights discipline سمجھنا ضروری ہے۔

---

## License

### Data & original content

**Creative Commons Attribution 4.0 International — CC BY 4.0**

آپ data لے سکتے ہیں، بانٹ سکتے ہیں، بدل سکتے ہیں، research، teaching، speech، TTS، AI یا commercial work میں استعمال کر سکتے ہیں — attribution کے ساتھ۔

### Code

**MIT License**

### Classical/public-domain literature

اپنے اصل public-domain status میں رہتا ہے۔

### Third-party material

اس پر اس کا اپنا applicable license لاگو ہوگا۔

تفصیل: [`LICENSE`](LICENSE)

---

## متعلقہ منصوبے

- **Farooq Music** — https://www.farooqmusic.com
- **FarooqStars** — https://www.farooqstars.com
- **MyMandoob** — https://www.mymandoob.com
- **GitHub profile** — https://github.com/farooqmusicai

---

## English summary

**UrduZaban** is a free, public, browser-first Urdu language platform being built by Mohammad Farooq in Doha, Qatar. It combines a growing Urdu dictionary, aeraab tools, Roman Urdu transliteration, pronunciation/TTS, proverbs and idioms, literature, corpus evidence and future multilingual etymology links.

The long-term goal is an open, community-editable Urdu knowledge platform: contributors can propose words, meanings, corrections, literary records and sources, while changes remain reviewable, traceable and reversible.

**Live:** https://www.urduzaban.com

---

> **زبان کو بند نہیں کرنا — اسے محفوظ کرنا، سمجھنا، بانٹنا اور مل کر بڑھانا ہے۔**
