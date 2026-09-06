# اردو زبان — عملی کام کا شیڈول

**آغاز:** اتوار 6 ستمبر 2026  
**اصول:** روز 1–2 گھنٹے کے واضح blocks؛ ہر block کے آخر میں قابلِ دکھائی نتیجہ، validation اور project-memory update۔  
**Production:** `main` صرف reviewed/approved تبدیلی کے لیے۔

---

## آج — اتوار 6 ستمبر 2026

### پہلا گھنٹہ — About / شناخت ✔
- GitHub profile سے founder information پڑھی
- Urdu-first `about.html` بنایا
- محمد فاروق کا تعارف، پیغام، projects، tech stack، learning اور social links شامل
- عوامی شراکت کی دعوت شامل
- mobile + dark-mode friendly layout

**نتیجہ:** ایک مکمل About page تیار۔

### دوسرا گھنٹہ — About کو site میں جوڑنا + safety
- homepage navigation میں `ہمارے بارے میں` link
- homepage پر مختصر founder/about card
- `sitemap.xml` میں `about.html`
- HTML/link smoke check
- PR diff review

**Gate:** test کے بعد ہی `main` merge؛ merge ہوتے ہی Hostinger deployment observe کرنا۔

---

## پیر 7 ستمبر — UI / Theme / Fonts

### گھنٹہ 1
- shared UI preference layer final
- theme switcher: auto / paper / night / emerald / sapphire / plain
- Urdu font selector: Nastaliq / Naskh + optional open fonts
- text size + line spacing + reduced motion

### گھنٹہ 2
- پہلے `index.html`, `about.html`, `lughat.html` پر apply
- mobile QA
- localStorage preference persistence
- broken layout check

**Deliverable:** user اپنی پوری site کا font/theme بدل سکے۔

---

## منگل 8 ستمبر — Validation / Repository Safety

### گھنٹہ 1
- JSON parse validation
- duplicate IDs
- adab `by` references
- corpus poet references
- required-file checks

### گھنٹہ 2
- internal link checker
- counts regression guard
- report output `uz-docs/VALIDATION-REPORT.md`
- safe GitHub Action (read-only/report first)

**Deliverable:** ہر بڑے change سے پہلے automatic health check۔

---

## بدھ 9 ستمبر — ادب: غزل / نظم model

### گھنٹہ 1
- verified public-domain source catalog بڑھانا
- غالب، میر، اقبال اور دوسرے eligible classical authors
- rights/source status واضح

### گھنٹہ 2
- 20–30 first-class work records
- `work_id`, `author_id`, genre, collection, source, rights, title
- corpus linkage sample

**Deliverable:** غزل/نظم collection data layer کا پہلا حقیقی batch۔

---

## جمعرات 10 ستمبر — شاعر profile v2

### گھنٹہ 1
- deep-link: `shair.html?id=...`
- شاعر کا profile card
- زندگی، دور، تصانیف، roles، corpus count

### گھنٹہ 2
- شاعر → works
- شاعر → منتخب اشعار
- شاعر → vocabulary / related dictionary links prototype

**Deliverable:** شاعر mini-library experience۔

---

## جمعہ 11 ستمبر — Search 2.0

### گھنٹہ 1
- unified search manifest
- لغت + کہاوت + شاعر + work titles
- Urdu + Roman query normalization

### گھنٹہ 2
- results tabs: `سب | لغت | کہاوت | ادب | شاعر`
- mobile search UX
- permanent query URL

**Deliverable:** ایک search، پورا UrduZaban۔

---

## ہفتہ 12 ستمبر — Shajra v2

### گھنٹہ 1
- Arabic / Persian / English lexicon separation schema
- `uz-shajra-v2.json` sample structure
- evidence/source fields

### گھنٹہ 2
- 20 reviewed Urdu words sample
- origin word, root/family, intermediary language, earliest-known evidence
- لغت popup میں read-only prototype

**Deliverable:** لفظ کی تاریخ کا پہلا علمی prototype۔

---

## اتوار 13 ستمبر — Community contribution prototype

### گھنٹہ 1
- change-record schema
- user suggestion → pending record
- field-level old/new diff

### گھنٹہ 2
- reviewer queue mock/prototype
- approve/reject/review-note
- version-history model

**Deliverable:** Wikipedia-style future editing کی محفوظ بنیاد۔

---

# دوسرا ہفتہ — 14 تا 20 ستمبر

## ترجیح

1. ادب sources 100+ works تک
2. غزل / نظم dedicated pages
3. dictionary permanent word IDs/URLs
4. kahawat readable source schema
5. corpus concordance prototype
6. sitemap/SEO expansion
7. TTS/pronunciation UX polish

روزانہ 1–2 گھنٹے کے blocks میں۔

---

# تیسرا ہفتہ — 21 تا 27 ستمبر

## ترجیح

1. public contributor form alpha
2. moderation queue
3. source/copyright flags
4. contributor history
5. automatic spam/duplicate checks
6. saved words / روز کا لفظ / آج کی کہاوت

---

# چوتھا ہفتہ — 28 ستمبر تا 4 اکتوبر

## ترجیح

1. multilingual lexicon prototypes
2. Arabic root/family viewer
3. Persian source-word viewer
4. English definition/reference layer
5. Roman Urdu transliteration preferences
6. performance/sharding plan for 50k+ entries

---

# ہر session کا لازمی اختتام

ہر 1–2 گھنٹے کے بعد:

1. کیا بنایا — مختصر summary
2. کون سی files بدلی
3. validation کیا ہوئی
4. live site چھیڑی یا نہیں
5. screenshot / preview قابلِ دکھائی ہو
6. `PROJECT-MEMORY.md` update
7. اگلے session کا ایک واضح target

---

## کامیابی کا معیار

صرف "فائلیں بڑھ گئیں" کامیابی نہیں۔ ہر ہفتے user کو کم از کم ایک ایسی چیز دکھائی دے جو وہ browser میں استعمال کر سکے۔

> **روز ایک اینٹ — مگر ہر اینٹ سیدھی، جانچی ہوئی اور اگلی منزل کے قابل۔**
