# اردو زبان — گہرا مطالعہ اور حفاظتی آڈٹ

**تاریخ:** 6 ستمبر 2026  
**دائرہ:** GitHub repository + موجودہ live-site structure + data flows + automation + آئندہ بڑھوتری  
**حالت:** صرف documentation branch پر — production files نہیں بدلی گئیں

---

## 1) سب سے پہلے: حفاظت

اس مطالعے کا پہلا اصول یہ ہے کہ موجودہ چلتی ہوئی ویب سائٹ کو repository کی صفائی یا نئی تعمیر کے دوران نقصان نہ پہنچے۔

اس لیے:

- `main` کو production branch سمجھ کر محفوظ رکھا جائے؛
- بڑی تبدیلیاں الگ branch میں ہوں؛
- data یا live HTML بدلنے سے پہلے diff دیکھا جائے؛
- پھر test/check ہو؛
- اس کے بعد ہی merge کیا جائے؛
- صرف repository خوبصورت دکھانے کے لیے live paths فوراً move نہ کیے جائیں۔

موجودہ documentation work branch:

`docs/repo-foundation-2026-09-06`

اس branch پر کام ہونے سے `main` خود نہیں بدلتا۔ جب تک branch کو `main` میں merge نہ کیا جائے، اس branch کی تبدیلیاں production branch کا حصہ نہیں بنتیں۔

> Hostinger کے panel کی branch setting اس repository سے نظر نہیں آتی؛ اس لیے production safety کا مستقل اصول یہ رہے گا کہ `main` کو بلا ضرورت نہ چھیڑا جائے اور merge سے پہلے واضح review ہو۔

---

## 2) موجودہ project کی اصل نوعیت

UrduZaban اب ایک سادہ dictionary site نہیں ہے۔ موجودہ repository میں کم از کم یہ بڑے نظام موجود ہیں:

1. **لغت** — `lughat.html` + `uz-lughat.json` + `uz-lughat-ext.json`
2. **کہاوت / محاورہ** — `kahawat.html` + `uz-kahawat.json`
3. **قرینہ / اعراب** — `qarina-aeraab.html`, `qarina-dict.json`, TTS/voice code
4. **ترجمان / transliteration** — `tarjuman.html` + `uz-translit.js`
5. **ادب** — `adab.html`, `shair.html`, `sher.html`, `nasr.html`, `afsana.html`, `mazameen.html`, `tanz.html`, `aqwal.html`
6. **ادبی data** — `uz-data/uz-adab-log.json`, `uz-data/uz-adab-matn.json`
7. **Corpus / سند** — `uz-data/uz-corpus-v1.json` + `sanad.html`
8. **آواز / neural TTS** — `qarina-tts/`
9. **چھوٹا server-side API** — `api/lexicon.php`
10. **تحقیق / logs / reports** — `uz-docs/`
11. **GitHub automation** — `.github/workflows/`

یعنی project کی صحیح آئندہ شناخت یہ ہونی چاہیے:

> **اردو زبان کا مربوط علمی، ادبی، لغوی اور صوتی platform**

---

## 3) لغت — موجودہ architecture

### مرکزی لغت

`uz-lughat.json` اصل Urdu dictionary data ہے۔ موجودہ UI سے واضح fields میں یہ شامل ہیں:

- `id` — مستقل شناخت
- `w` — بے اعراب لفظ
- `a` — اعراب والا روپ
- `r` — Roman
- `alt` — Roman کی دوسری spellings
- `en` — English gloss
- `ur` — اردو معنی / اشارہ
- `pos` — part of speech
- `f` — frequency/commonness ranking میں استعمال
- `g` — record group (`dict`, `ambig`, `plain`, `name`, `wk` وغیرہ)
- `nm` — لفظ نام کے طور پر بھی استعمال ہو
- `gen` — نام کی صنف
- `org` — نام کی origin label
- `nen` — نام کے معنی
- `asl` — موجودہ etymology/origin field
- `re` — machine-made Roman کی نشانی
- `s` — voice engine کے لیے speak-form
- `ex` — مثال
- `src` — source id
- `t` — date
- `gd` — grammatical gender
- `wk` — Wiktionary-related marker

### Extended dictionary

`uz-lughat-ext.json` الگ file کے طور پر lazy-load ہوتی ہے۔ UI اس میں سے یہ چیزیں دکھاتا ہے:

- etymology text
- IPA
- Hindi spelling
- scholarly transliteration
- multiple senses
- usage examples
- synonyms

یہ separation اچھی بنیاد ہے، کیونکہ ہر چیز main dictionary record میں بھرنے کی ضرورت نہیں۔

### موجودہ خوبی

لغت پہلے ہی کہاوتوں سے cross-link ہو رہی ہے: کسی لفظ کی search کے بعد `uz-kahawat.json` میں وہ لفظ تلاش کر کے متعلقہ کہاوتیں دکھائی جاتی ہیں۔ یہ وہی direction ہے جسے پورے project میں بڑھانا چاہیے۔

### آئندہ اصول

`uz-lughat.json` صرف اردو لغت رہے۔ فارسی، عربی، English source dictionaries کو اس میں merge نہ کیا جائے۔ etymology/shajra الگ linked dataset میں رہے۔

---

## 4) کہاوت / محاورہ — موجودہ schema

`uz-kahawat.json` ایک compact array format استعمال کرتی ہے:

`[متن، قسم، Roman، مطلب، موقع/استعمال]`

موجودہ metadata کے مطابق:

- `k` = کہاوت
- `m` = محاورہ

یہ format چھوٹا اور browser کے لیے تیز ہے، مگر project بڑھنے پر readable/editable schema زیادہ مفید ہوگا۔

### اگلا محفوظ قدم

فوری migration نہیں۔ پہلے schema document بنے، مثلاً:

```json
{
  "id": "kh-000001",
  "text": "...",
  "type": "kahawat",
  "roman": "...",
  "meaning": "...",
  "usage": "...",
  "themes": [],
  "keywords": [],
  "variants": [],
  "source": null
}
```

پھر build step compact production format بنا سکتا ہے۔

---

## 5) ادب — اچھی بنیاد پہلے ہی موجود ہے

### لوگ

`uz-data/uz-adab-log.json` میں ادیب/شاعر stable `id` کے ساتھ محفوظ ہیں۔ موجودہ fields میں:

- `id`
- اردو نام
- تخلص
- English name
- پیدائش / وفات
- جگہ
- دور
- کردار / اصناف
- corpus linkage
- زندگی
- کارنامے
- تصانیف

یہ بہت اہم ہے: **People schema دوبارہ صفر سے بنانے کی ضرورت نہیں؛ اسے version 2 میں بڑھانا ہے۔**

### تحریریں

`uz-data/uz-adab-matn.json` میں works بھی `id` کے ساتھ ہیں:

- `id`
- `kind`
- `by` (person id)
- `title`
- `ws` (Wikisource page یا pages)
- `saal`
- `taaruf`
- `more`

یہ بھی knowledge graph کی اچھی ابتدا ہے۔

### اصل missing حصہ

غزل اور نظم کو first-class **work records** بنانا ابھی باقی ہے۔ corpus میں اشعار موجود ہیں، مگر future library کے لیے شاعر → work → غزل/نظم → اشعار → لفظ کا رشتہ الگ مضبوط schema مانگتا ہے۔

---

## 6) Corpus

`uz-data/uz-corpus-v1.json` صرف background data نہیں رہنا چاہیے۔ موجودہ poet pages اسے نمونۂ کلام دکھانے کے لیے استعمال کر رہے ہیں۔

آگے اس سے بنایا جا سکتا ہے:

- لفظ کتنی بار آیا
- کس شاعر کے ہاں آیا
- کن شعروں میں آیا
- phrase/concordance search
- collocations
- شاعر کی vocabulary profile
- لغت کے لیے حقیقی مثالیں

Corpus کو UrduZaban کی سب سے بڑی علمی طاقتوں میں بدلا جا سکتا ہے۔

---

## 7) Front-end architecture — سب سے بڑا maintainability مسئلہ

موجودہ HTML pages خود کفیل ہیں اور ان میں کافی CSS/JS inline ہے۔ ادب کے کئی صفحات ایک ہی navigation, fonts, theme, cards, popup, dictionary lookup اور language-switch logic کی نقل رکھتے ہیں۔

### فائدہ

- ہر page الگ کھل جاتا ہے
- build system پر کم dependency
- Hostinger پر سادہ deployment

### نقصان

- ایک nav change کئی files میں کرنا پڑتا ہے
- style bug کئی جگہ الگ الگ ٹھیک کرنا پڑتا ہے
- code drift ہو سکتا ہے
- pages بڑھنے کے ساتھ maintenance مشکل ہوگا

### حل — مگر مرحلہ وار

فوراً rewrite نہیں۔ پہلے مشترک files نکالیں:

- `assets/css/uz-base.css`
- `assets/js/uz-shell.js`
- `assets/js/uz-lughat-client.js`
- `assets/js/uz-adab-client.js`

پہلے ایک non-critical page پر test، پھر باقی pages پر آہستہ migration۔

---

## 8) Performance — ابھی ٹھیک، مگر growth سے پہلے تیاری ضروری

Repository میں کئی بڑی production files ہیں:

- `uz-lughat.json` تقریباً 2.2 MB
- `uz-lughat-ext.json` تقریباً 2.76 MB
- `uz-data/uz-corpus-v1.json` تقریباً 1.39 MB
- `sanad.html` تقریباً 1.2 MB
- `uz-translit.js` تقریباً 676 KB

لغت کا صفحہ پوری dictionary browser میں load کر کے index بناتا ہے۔ 10 ہزار entries پر یہ قابلِ عمل ہے؛ 50 ہزار، 100 ہزار یا اس سے اوپر بڑھنے پر structure بدلنا پڑ سکتا ہے۔

### آئندہ strategy

- search index الگ compact file
- details lazy-load
- alphabet/ID shards
- versioned data manifests
- optional Service Worker cache
- heavy corpus search کے لیے prebuilt indexes

یہ کام ابھی فوراً نہیں؛ schema stabilization کے بعد۔

---

## 9) TTS models — repository وزن کا بڑا سبب

Repository metadata کے مطابق repository تقریباً 196 MB کے قریب ہے۔ صرف neural voice models میں:

- `model.onnx` تقریباً 72.9 MB
- `female.onnx` تقریباً 63.5 MB
- `male.onnx` تقریباً 63.5 MB

یعنی تین model files ہی تقریباً 200 MB بنتی ہیں۔

### اس کا مطلب

Site کے لیے یہ assets ضروری ہو سکتے ہیں، مگر Git history/clone وزن تیزی سے بڑھ سکتا ہے اگر models بار بار replace ہوں۔

### ابھی کیا نہ کریں

انہیں فوراً repo سے نہ نکالیں؛ موجودہ Hostinger deployment ان paths پر منحصر ہے۔

### بعد میں جائزہ

- GitHub Releases
- Git LFS
- الگ model repository / static asset hosting
- deploy-time model sync

پہلے deployment compatibility ثابت ہوگی، پھر migration۔

---

## 10) GitHub Actions — کون سا workflow کیا کرتا ہے

### Research-only / نسبتاً محفوظ

- `lughat-survey.yml` — survey/report؛ لغت میں data merge نہیں کرتا
- `lughat-platts.yml` — Platts survey/sample؛ لغت نہیں بدلتا
- `lughat-arbi-farsi.yml` — موجودہ comment/code کے مطابق suggestions/reports بناتا ہے، main Urdu dictionary میں Arabic/Persian lexicon merge نہیں کرتا

### Dictionary کو واقعی بدلنے والے

- `lughat-roman-naye.yml` — manual run پر خالی Roman fields بھر کر `uz-lughat.json` بدلتا ہے
- `lughat-alt.yml` — TSV push پر `alt` spellings `uz-lughat.json` میں merge کرتا ہے
- `lughat-speak.yml` — TSV/workflow push پر speak-form `s` main dictionary میں لکھتا ہے

### Voice assets کو بدلنے والا

- `sync-neural-model.yml` — external release سے ONNX models لاتا اور repository میں commit/push کرتا ہے

### Safety recommendation

Data-changing workflows کے لیے:

1. dry-run/report mode
2. expected count checks
3. JSON validation
4. branch/PR output جہاں ممکن ہو
5. production `main` پر direct bot push کم کرنا

خاص طور پر future میں اگر data بہت بڑھے تو bot کا direct `main` push خطرہ بڑھائے گا۔

---

## 11) API / admin — اچھی سوچ، مگر hardening چاہیے

`api/lexicon.php` میں اچھی باتیں:

- admin key repository میں نہیں رکھی جاتی
- private data `public_html` سے باہر `uz-private` میں رکھنے کی کوشش
- admin actions پر `hash_equals`
- saved pronunciation data کی shape/length limits
- public health endpoint راز ظاہر نہیں کرتا

### دو اہم حفاظتی نکات

#### A. پہلی admin key

اگر config/key موجود نہ ہو تو `setkey` پہلی key بغیر پہلے سے authentication کے set کر سکتا ہے۔ عام حالت میں key موجود ہونے کے بعد endpoint بند ہو جاتا ہے، لیکن fresh/recovery state میں یہ ایک takeover window بن سکتا ہے۔

آگے بہتر setup:

- one-time server-side setup token، یا
- setup endpoint کو manual enable/disable، یا
- پہلی setup کے بعد code path مستقل بند۔

#### B. public suggestions

`suggest` endpoint public ہے اور total queue cap تو ہے، مگر proper per-IP/time rate limit نظر نہیں آتا۔ spam سے بچنے کے لیے lightweight rate-limit/honeypot مناسب ہوگا۔

### Browser admin key

`uz-admin.html` key کو `localStorage` میں رکھتا ہے۔ سہولت اچھی ہے، مگر shared/public computer پر یہ مناسب نہیں۔ مستقبل میں "remember key" اختیاری checkbox بہتر ہوگا۔

---

## 12) SEO اور discovery

`sitemap.xml` میں ابھی صرف چند بنیادی URLs ہیں اور نئے ادب/کہاوت صفحات شامل نہیں۔

### فوری کم خطرہ improvement

sitemap میں شامل کیے جا سکتے ہیں:

- `/kahawat.html`
- `/adab.html`
- `/shair.html`
- `/sher.html`
- `/nasr.html`
- `/afsana.html`
- `/mazameen.html`
- `/tanz.html`
- `/aqwal.html`

### بعد کا بڑا قدم

ہر شاعر اور ہر work کے permanent shareable URLs۔

مثلاً:

- `/shair.html?id=ghalib`
- `/work.html?id=...`

پھر static SEO pages یا server-side prerendering پر غور کیا جا سکتا ہے۔

---

## 13) Repository organisation — ابھی کیا بدلنا چاہیے، کیا نہیں

### ابھی محفوظ تبدیلیاں

- README
- CONTRIBUTING
- repository map
- growth plan
- project memory/worklog
- schema docs
- validation scripts
- tests

### ابھی root files move نہ کریں

کیونکہ live links اور Hostinger deployment انہی paths سے چل رہے ہیں۔

### Future target structure

```text
/
├── production HTML files (temporarily root)
├── assets/
│   ├── css/
│   └── js/
├── data/
│   ├── dictionary/
│   ├── sayings/
│   ├── literature/
│   ├── corpus/
│   └── etymology/
├── tools/
├── tests/
├── docs/
└── models/ or external model delivery
```

مگر یہ **target** ہے، آج کا move نہیں۔

---

## 14) سب سے اہم data-design فیصلہ

آئندہ UrduZaban کو تین تہوں میں سوچا جائے:

### A. Authoritative source data

انسانی طور پر edit ہونے والا صاف data۔

### B. Derived/build data

search index، compact arrays، generated pages، cross-reference indexes۔

### C. User interface

HTML/JS جو source data خود edit نہ کرے بلکہ اسے پڑھ کر دکھائے۔

اس separation سے:

- غلطی واپس لینا آسان ہوگا
- contributor سمجھ سکے گا کیا edit کرنا ہے
- generated files ہاتھ سے بدلنے کی غلطی کم ہوگی
- future API آسان ہوگا

---

## 15) اگلے کام — ترتیب

### مرحلہ A — Foundation & Safety

1. repository documentation مکمل
2. canonical `PROJECT-MEMORY.md`
3. dictionary schema document
4. kahawat schema document
5. adab people/work schema document
6. JSON/link validation scripts
7. basic smoke checks

### مرحلہ B — ادب کی مضبوط بنیاد

8. غزل / نظم کے work schema
9. شاعر profile URL
10. شاعر → works → verses linkage
11. غزل اور نظم کے dedicated rooms

### مرحلہ C — Search 2.0

12. unified search manifest
13. لغت + کہاوت + شاعر + work titles
14. Roman Urdu cross-search
15. بعد میں corpus full-text search

### مرحلہ D — Shajra v2

16. `uz-shajra.json` schema
17. 20-word sample
18. Arabic/Persian source data الگ
19. main Urdu dictionary untouched except stable linkage where absolutely needed

### مرحلہ E — Growth & learning

20. word of the day
21. saying of the day
22. saved words
23. aeraab / Roman practice
24. poet and verse discovery

---

## 16) پانچ مستقل حفاظتی اصول

1. **`main` کو production سمجھیں۔**
2. **بڑی تبدیلی branch + review کے بغیر production میں نہ جائے۔**
3. **data bulk-change سے پہلے backup/diff/count validation۔**
4. **generated اور hand-edited files واضح ہوں۔**
5. **ہر مکمل کام کا خلاصہ `uz-docs/PROJECT-MEMORY.md` میں درج ہو۔**

---

## نتیجہ

UrduZaban کی سب سے بڑی طاقت یہ ہے کہ بنیادی اینٹیں پہلے ہی موجود ہیں: لغت، stable IDs، corpus، literature metadata، Roman engine، pronunciation، source discipline اور open licensing۔ سب سے بڑا اگلا مرحلہ **مزید data جمع کرنا نہیں بلکہ موجود data کو مضبوط schemas اور محفوظ relations میں جوڑنا** ہے۔

ترتیب یہی رہے:

> **پہلے حفاظت → پھر schema → پھر validation → پھر نئی خصوصیات → پھر بڑے پیمانے پر data۔**
