# ادب — People / Works schema اور اگلی سمت

## موجودہ People data

`uz-data/uz-adab-log.json` میں stable `id` کے ساتھ لوگ موجود ہیں۔ اہم موجودہ fields:

- `id`
- `u` — اردو نام
- `t` — تخلص
- `e` — English name
- `paida`
- `wafat`
- `jagah`
- `daur`
- `kirdar[]`
- `corpus`
- `zindagi {ur,en}`
- `karname {ur,en}`
- `tasaneef[]`

یہ structure اچھی بنیاد ہے۔ اسے ضائع یا دوبارہ invent نہیں کرنا۔

## موجودہ Works data

`uz-data/uz-adab-matn.json` میں:

- `id`
- `kind`
- `by` — person id
- `title`
- `ws` — Wikisource page یا pages
- `saal`
- `taaruf {ur,en}`
- `more`

## اصل خلا

غزل، نظم اور دوسری شعری اصناف کو بھی first-class `work` record بنانا ہے، تاکہ:

`شاعر → work → اشعار → لغت الفاظ → corpus evidence`

کا مستقل رشتہ بن سکے۔

## v2 People record — ممکنہ اضافہ

```json
{
  "id": "ghalib",
  "u": "مرزا غالب",
  "t": "غالبؔ",
  "e": "Mirza Ghalib",
  "paida": 1797,
  "wafat": 1869,
  "jagah": ["آگرہ", "دہلی"],
  "daur": "klasiki",
  "kirdar": ["shair", "nasr"],
  "corpus": "ghalib",
  "works": [],
  "sources": [],
  "rights_note": "public-domain author"
}
```

ابھی existing fields نہ توڑے جائیں۔ array/string changes migration کے بغیر نہ ہوں۔

## v2 Work record

```json
{
  "id": "ghalib-ghazal-001",
  "kind": "ghazal",
  "by": "ghalib",
  "title": "...",
  "year": null,
  "source": {
    "type": "wikisource",
    "url": "..."
  },
  "rights": "public-domain",
  "taaruf": {"ur":"...","en":"..."},
  "sections": [],
  "corpus_ids": []
}
```

## Approved kinds — future vocabulary

- `ghazal`
- `nazm`
- `rubai`
- `qasida`
- `marsiya`
- `nasr`
- `afsana`
- `mazmoon`
- `tanz`
- `khat`
- `qaul`

نام ابھی schema vocabulary ہے؛ production UI میں سب ایک ساتھ شامل کرنا ضروری نہیں۔

## Poet profile URL

پہلا low-risk target:

`shair.html?id=<person-id>`

اس سے شاعر کا permanent shareable profile بن سکتا ہے، بغیر نئی folder routing کے۔

## Work URL

بعد میں:

`adab.html?work=<work-id>`

یا dedicated `work.html?id=<work-id>`۔ فیصلہ prototype کے بعد۔

## Validation

### People

- `id` unique
- `corpus` link اگر ہو تو corpus poet id موجود ہو
- birth/death year sensible order
- `daur` approved dictionary میں موجود
- `kirdar` approved labels میں موجود

### Works

- `id` unique
- `by` لازماً existing person id
- `kind` approved
- source/right status واضح
- Wikisource pages arrays یا strings دونوں normalize ہو سکیں
- duplicate title + author report

## اگلا implementation milestone

1. current people/work validator
2. غزل/نظم کے 5–10 sample work records
3. شاعر profile deep-link prototype
4. work → corpus verse linkage
5. پھر dedicated غزل/نظم rooms

**اصول:** موجودہ 35 ادبی شخصیات اور موجودہ works کو توڑ کر نئی شکل نہ دیں؛ پہلے backward-compatible layer بنائیں۔
