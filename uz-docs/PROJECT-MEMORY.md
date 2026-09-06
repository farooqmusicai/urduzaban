# اردو زبان — مرکزی یادداشت / PROJECT MEMORY

> **یہ فائل project کی مستقل خلاصہ یادداشت ہے۔**  
> ہر مکمل کام کے بعد یہاں مختصر مگر واضح اندراج کیا جائے گا تاکہ اگلی نشست میں معلوم ہو کہ کیا بدلا، کیوں بدلا، کس branch پر بدلا، اور اگلا محفوظ قدم کیا ہے۔

**Repository:** `farooqmusicai/urduzaban`  
**Live site:** https://www.urduzaban.com  
**Production branch کا محفوظ مفروضہ:** `main`  
**موجودہ development/docs branch:** `docs/repo-foundation-2026-09-06`

---

## مستقل حفاظتی اصول

1. `main` کو production سمجھ کر براہِ راست بڑی تبدیلی نہ کی جائے۔
2. بڑی تبدیلی الگ branch میں ہو، diff/review کے بعد merge ہو۔
3. live HTML/JSON paths صرف repository صاف دکھانے کے لیے move نہ کیے جائیں۔
4. bulk data change سے پہلے count/schema/link validation ہو۔
5. فارسی، عربی اور English source dictionaries کو `uz-lughat.json` میں merge نہ کیا جائے۔
6. معنی اپنے لفظوں میں لکھے جائیں؛ تیسرے فریق کا copyrighted متن جوں کا توں نہ اٹھایا جائے۔
7. ادب میں public-domain / واضح اجازت والے متن ہی استعمال ہوں۔
8. generated files اور ہاتھ سے edit ہونے والے source data کو آئندہ واضح طور پر الگ کرنا ہے۔
9. ہر مکمل کام کا خلاصہ اسی فائل میں شامل کیا جائے۔

---

## 6 ستمبر 2026 — Repository foundation شروع

### کیا دیکھا گیا

- repository public ہے اور default branch `main` ہے۔
- root میں production HTML، dictionary JSON، sayings JSON، transliteration JS، API، TTS، docs اور data ساتھ موجود ہیں۔
- پرانا `README.md` تقریباً خالی تھا۔
- `uz-data/` میں dictionary support، corpus، literature metadata اور research data موجود ہے۔
- `uz-docs/` میں پہلے سے کئی logs/reports موجود ہیں۔
- `.github/workflows/` میں dictionary research، Roman، speak-form، alternate spellings اور neural model sync workflows موجود ہیں۔

### حفاظت کے لیے کیا کیا گیا

`main` پر براہِ راست تبدیلی نہیں کی گئی۔ الگ branch بنائی گئی:

`docs/repo-foundation-2026-09-06`

اس branch پر documentation-only تبدیلیاں رکھی گئی ہیں تاکہ live website متاثر نہ ہو۔

### شامل کی گئی documentation

- `README.md` — مکمل public project introduction
- `CONTRIBUTING.md` — contribution اور data-safety اصول
- `uz-docs/REPOSITORY-MAP.md` — repository کا نقشہ
- `uz-docs/GROWTH-PLAN.md` — بڑے منصوبے کا roadmap
- `uz-docs/DEEP-AUDIT-2026-09-06.md` — architecture, workflows, API, performance, SEO اور security کا گہرا جائزہ
- `uz-docs/PROJECT-MEMORY.md` — یہی مستقل یادداشت

### Pull Request

PR #1: `docs: organize UrduZaban repository foundation`

ابھی merge نہیں کیا گیا۔

---

## گہرے مطالعے کے اہم نتائج

### لغت

`lughat.html`:

- `uz-lughat.json` browser میں load کرتا ہے
- Roman/English/Urdu search بناتا ہے
- smart stemming / alternate spellings استعمال کرتا ہے
- dictionary card سے detailed popup کھولتا ہے
- `uz-lughat-ext.json` lazy-load کر کے IPA، etymology، examples، senses اور synonyms دکھاتا ہے
- `uz-kahawat.json` سے متعلقہ کہاوتیں دکھاتا ہے

یہ cross-linking UrduZaban کی آئندہ architecture کا نمونہ ہے۔

### کہاوت

`uz-kahawat.json` compact rows استعمال کرتا ہے:

`[متن، قسم، Roman، مطلب، موقع]`

موجودہ format production کے لیے ہلکا ہے مگر editing/expansion کے لیے future source schema الگ بنانا بہتر ہوگا۔

### ادب

`uz-data/uz-adab-log.json` میں لوگوں کے stable IDs پہلے سے موجود ہیں۔  
`uz-data/uz-adab-matn.json` میں works بھی IDs اور author linkage کے ساتھ موجود ہیں۔

یعنی شاعر/ادیب architecture صفر سے نہیں بنانا؛ موجودہ schema کو بڑھانا ہے۔

### Corpus

`uz-data/uz-corpus-v1.json` پہلے ہی poet pages میں نمونۂ کلام کے لیے استعمال ہو رہا ہے۔ اسے future میں concordance, frequency, author usage اور dictionary evidence تک بڑھایا جا سکتا ہے۔

### Workflows

Research-only workflows:

- `lughat-survey.yml`
- `lughat-platts.yml`
- `lughat-arbi-farsi.yml`

Dictionary کو واقعی بدلنے والے workflows:

- `lughat-roman-naye.yml`
- `lughat-alt.yml`
- `lughat-speak.yml`

Voice assets بدلنے والا:

- `sync-neural-model.yml`

آئندہ data-changing bots کے لیے PR/dry-run strategy بہتر ہوگی۔

### API/security

`api/lexicon.php` میں admin key repository سے باہر رکھنے کی اچھی کوشش ہے۔ دو future hardening کام نشان زد ہوئے:

- پہلی admin key set کرنے کے one-time endpoint کو مزید محفوظ کرنا
- public suggestion endpoint پر rate limiting / honeypot

### SEO

`sitemap.xml` میں نئے ادب اور کہاوت کے pages ابھی شامل نہیں۔ یہ low-risk future improvement ہے۔

### Performance

بڑی files اور neural models کی وجہ سے project grow کرتے وقت search/data loading strategy کو shard/index architecture کی طرف لے جانا ہوگا، مگر ابھی فوراً rewrite نہیں۔

---

## 6 ستمبر 2026 — Schema foundation مکمل

**Branch:** `docs/repo-foundation-2026-09-06`  
**Files changed:**

- `uz-docs/SCHEMA-LUGHAT-v1.md`
- `uz-docs/SCHEMA-KAHAWAT-v1.md`
- `uz-docs/SCHEMA-ADAB-v1.md`
- `uz-docs/PROJECT-MEMORY.md`

### کیا کیا

- موجودہ لغت fields کو UI/code سے document کیا۔
- `uz-lughat-ext.json` کی الگ heavy-detail layer کو محفوظ pattern کے طور پر نوٹ کیا۔
- کہاوت کے موجودہ compact row format کو document کیا اور future source-schema + production-build model تجویز کیا۔
- ادب کے موجودہ People IDs اور Work IDs کو نئی architecture کی بنیاد قرار دیا۔
- غزل/نظم کو future first-class work records بنانے کا backward-compatible راستہ لکھا۔

### کیا نہیں چھیڑا

- `main`
- live HTML
- `uz-lughat.json`
- `uz-kahawat.json`
- corpus
- ادب data
- API
- workflows
- Hostinger deployment

### Validation

Documentation-only commits؛ production data count یا live path میں کوئی تبدیلی نہیں۔

### نتیجہ

Foundation کے پہلے تین schema documents تیار ہیں۔ اب اگلا محفوظ technical مرحلہ validation scripts اور smoke checks ہے۔

---

## اگلا منظور شدہ کام

Foundation phase میں اگلی ترتیب:

1. validation plan اور executable checks
2. JSON/link smoke checks
3. workflows کے direct-main writes کے لیے safety proposal
4. غزل/نظم کے 5–10 sample first-class work records — production میں نہیں، پہلے sample data
5. شاعر profile deep-link prototype
6. unified search prototype
7. Shajra v2 کا 20-word sample

---

## کام درج کرنے کا سانچہ

آئندہ ہر کام کے بعد یہ مختصر block شامل کیا جائے:

```text
### YYYY-MM-DD — کام کا نام
Branch:
Files changed:
کیا کیا:
کیا نہیں چھیڑا:
Validation:
نتیجہ:
اگلا قدم:
```

---

**مرکزی اصول:**  
**پہلے حفاظت → پھر schema → پھر validation → پھر نئی خصوصیات → پھر bulk data۔**
