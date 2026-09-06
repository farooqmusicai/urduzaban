# اردو زبان — مرکزی یادداشت / PROJECT MEMORY

> **یہ فائل project کی مستقل خلاصہ یادداشت ہے۔**  
> ہر مکمل کام کے بعد یہاں مختصر مگر واضح اندراج کیا جائے گا تاکہ اگلی نشست میں معلوم ہو کہ کیا بدلا، کیوں بدلا، کس branch پر بدلا، اور اگلا محفوظ قدم کیا ہے۔

**Repository:** `farooqmusicai/urduzaban`  
**Live site:** https://www.urduzaban.com  
**Production branch:** `main` (Hostinger deployment screenshot سے تصدیق، 6 ستمبر 2026)  
**موجودہ feature branch:** `feature/adab-community-foundation-2026-09-06`

---

## مستقل حفاظتی اصول

1. `main` کو production سمجھ کر براہِ راست بڑی تبدیلی نہ کی جائے۔
2. بڑی تبدیلی الگ branch میں ہو، diff/review کے بعد merge ہو۔
3. live HTML/JSON paths صرف repository صاف دکھانے کے لیے move نہ کیے جائیں۔
4. bulk data change سے پہلے count/schema/link validation ہو۔
5. فارسی، عربی اور English source dictionaries کو `uz-lughat.json` میں merge نہ کیا جائے؛ ہر زبان الگ dataset، تعلق الگ shajra graph میں۔
6. معنی اپنے لفظوں میں لکھے جائیں؛ تیسرے فریق کا copyrighted متن جوں کا توں نہ اٹھایا جائے۔
7. ادب میں public-domain / واضح اجازت والے متن پہلے شامل ہوں۔
8. generated files اور ہاتھ سے edit ہونے والے source data کو آئندہ واضح طور پر الگ کرنا ہے۔
9. ہر مکمل کام کا خلاصہ اسی فائل میں شامل کیا جائے۔
10. عوامی contribution مستقبل میں moderated، traceable اور reversible ہو؛ public user کبھی production JSON براہِ راست edit نہ کرے۔

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

اس branch پر documentation-only تبدیلیاں رکھی گئیں تاکہ live website متاثر نہ ہو۔

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

### Files

- `uz-docs/SCHEMA-LUGHAT-v1.md`
- `uz-docs/SCHEMA-KAHAWAT-v1.md`
- `uz-docs/SCHEMA-ADAB-v1.md`

### نتیجہ

- موجودہ لغت fields document کیے گئے۔
- کہاوت کے compact production format کے لیے future readable source-schema تجویز ہوا۔
- ادب کے People IDs اور Work IDs کو future architecture کی بنیاد بنایا گیا۔
- غزل/نظم کو first-class work record بنانے کا راستہ طے ہوا۔

---

## 6 ستمبر 2026 — Community + multilingual + literature-source foundation

**Branch:** `feature/adab-community-foundation-2026-09-06`

### Files changed

- `uz-docs/COMMUNITY-PLATFORM-PLAN.md`
- `uz-docs/MULTILINGUAL-SHAJRA-PLAN.md`
- `uz-data/uz-adab-sources-v1.json`
- `uz-docs/PROJECT-MEMORY.md`

### کیا کیا

- Wikipedia-style مگر moderated contribution architecture لکھی: reader → contributor → reviewer۔
- ہر public edit کو pending change → validation → human review → approved canonical data flow سے گزارنے کا اصول رکھا۔
- contributor history, review roles, alternative readings اور reversible version history کی بنیاد لکھی۔
- multilingual architecture طے کی: Urdu, Arabic, Persian, English lexicons الگ؛ ان کے تعلق `uz-shajra-v2.json` میں۔
- Roman Urdu کو الگ زبان نہیں بلکہ Urdu transliteration layer قرار دیا۔
- etymology میں قطعی "لفظ کب ایجاد ہوا" کے بجائے evidence-based "قدیم ترین معلوم شہادت" model تجویز کیا۔
- public-domain/open literature کے لیے پہلا reviewed source catalog بنایا۔

### پہلے verified literature sources

`uz-data/uz-adab-sources-v1.json` میں metadata/source links درج کیے گئے:

- مرزا غالب — `دیوان غالب`، غزلیات index اور چند ردیف groups
- محمد اقبال — Wikisource author catalog، `بانگ درا` کی متعدد نظموں کی فہرست
- میر تقی میر — `ساقی نامہ`
- میر تقی میر — `جنگ نامہ`

یہ catalog metadata اور source discovery کے لیے ہے؛ bulk copyrighted text repo میں copy نہیں کیا گیا۔

### کیا نہیں چھیڑا

- `main`
- live Hostinger files
- `uz-lughat.json`
- `uz-kahawat.json`
- موجودہ adab production JSON
- API
- TTS
- workflows

### Validation / source discipline

- Hostinger screenshot سے deployment branch `main` کی تصدیق ہوئی۔
- Wikisource source pages browser/search سے verify کیے گئے۔
- source catalog میں rights/source notes رکھی گئیں۔

### نتیجہ

اب project کے پاس صرف roadmap نہیں بلکہ تین future pillars کی عملی foundation موجود ہے:

1. عوامی شراکت
2. کثیر لسانی شجرہ
3. public-domain literature source ingestion

---

## اگلا منظور شدہ کام

1. validation scripts اور JSON/link smoke checks
2. literature source catalog کو درجنوں verified public-domain works تک بڑھانا
3. غزل/نظم کے 5–10 first-class sample work records
4. شاعر profile deep-links
5. unified search prototype
6. `uz-shajra-v2.json` کا 20-word reviewed sample
7. community change-record JSON schema + prototype moderation queue

---

## کام درج کرنے کا سانچہ

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
