# اردو زبان — کثیر لسانی لغت اور شجرۂ الفاظ

**مقصد:** اردو لفظ کو عربی، فارسی، انگریزی، ہندی/ہندوی اور دوسری متعلقہ زبانوں کے ساتھ جوڑنا — مگر ہر زبان کی اپنی لغت الگ اور صاف رکھنا۔

---

## بنیادی اصول

`uz-lughat.json` صرف اردو لغت رہے گی۔

عربی، فارسی اور English کے پورے lexicons الگ datasets ہوں گے:

```text
uz-data/
  languages/
    ur/
    ar/
    fa/
    en/
```

اور زبانوں کے درمیان تعلق الگ graph میں:

```text
uz-data/uz-shajra-v2.json
```

---

## مطلوبہ تجربہ

User لفظ `کتاب` کھولے تو card میں یہ layers مل سکیں:

1. اردو معنی
2. تلفظ اور اعراب
3. Roman
4. grammatical information
5. موجودہ اردو مثالیں
6. کہاوت/ادب/corpus میں استعمال
7. اصل زبان
8. اصل لفظ اور script
9. root / خاندان
10. intermediary language، اگر ہو
11. تاریخی/قدیم استعمال کی سند
12. دوسری زبانوں میں cognates/related forms
13. source confidence

---

## الگ زبان کی entry

مثلاً Arabic source record:

```json
{
  "lang": "ar",
  "id": "ar-kitab-001",
  "headword": "كِتَاب",
  "root": "ك-ت-ب",
  "pos": "noun",
  "gloss_en": "book",
  "sources": []
}
```

Urdu record اپنی جگہ:

```json
{
  "id": "uz-...",
  "w": "کتاب",
  "a": "کِتاب"
}
```

اور رشتہ الگ:

```json
{
  "urdu_id": "uz-...",
  "relations": [
    {
      "type": "borrowed_from",
      "lang": "ar",
      "source_id": "ar-kitab-001",
      "path": ["ar", "ur"],
      "confidence": "high",
      "sources": []
    }
  ]
}
```

---

## اگر لفظ فارسی کے راستے آیا ہو

```json
{
  "urdu_id": "uz-...",
  "relations": [
    {
      "type": "borrowed_via",
      "path": ["ar", "fa", "ur"],
      "source_words": {
        "ar": "...",
        "fa": "...",
        "ur": "..."
      }
    }
  ]
}
```

اس طرح "اصل عربی ہے" اور "اردو میں فارسی کے راستے آیا" دونوں باتیں الگ محفوظ رہیں گی۔

---

## English dictionary

English data بھی اردو لغت میں merge نہیں ہوگا۔ الگ English lexicon کے فائدے:

- Urdu → English meaning
- English → Urdu reverse lookup
- English word history
- English etymology
- cognates
- technical vocabulary

Future unified search ایک query سے تمام language indexes دیکھ سکے گا، مگر result واضح language label کے ساتھ آئے گا۔

---

## Roman کیا ہے؟

Roman Urdu الگ زبان نہیں بلکہ Urdu کا transliteration layer ہے۔

اس لیے Roman forms Urdu record کے ساتھ رہیں:

- canonical Roman
- alternate Roman spellings
- machine-generated Roman marker

مثلاً:

```json
{
  "roman": {
    "preferred": "kitab",
    "variants": ["kitaab"],
    "reviewed": true
  }
}
```

موجودہ compact fields `r`, `alt`, `re` production compatibility کے لیے فی الحال برقرار رہ سکتے ہیں۔

---

## "یہ لفظ کب اردو میں آیا؟"

یہ field صرف معتبر evidence کے ساتھ بھری جائے۔ تین درجے:

- `attested` — کسی dated text میں لفظ ملا
- `estimated` — scholarly source کا اندازہ
- `unknown` — ابھی معلوم نہیں

مثال:

```json
{
  "history": {
    "earliest_attestation": {
      "year": 1805,
      "work_id": "...",
      "quote_ref": "..."
    },
    "note": "..."
  }
}
```

"لفظ کب ایجاد ہوا" جیسا دعویٰ اکثر ثابت نہیں ہو سکتا؛ site کو "قدیم ترین معلوم شہادت" دکھانی چاہیے، نہ کہ بلا دلیل پیدائش کی قطعی تاریخ۔

---

## source hierarchy

ترجیح:

1. تاریخی/اصل لغات اور primary texts
2. معتبر scholarly dictionaries
3. public-domain dictionaries
4. Wiktionary/Kaikki — discovery/support، human review کے ساتھ
5. corpus evidence

ہر relation کے ساتھ source اور confidence ضروری ہوگا۔

---

## UI کا مطلوبہ شجرہ

```text
کتاب
│
├── اردو: کِتاب
│   ├── معنی
│   ├── مثالیں
│   └── ادب / corpus
│
└── اصل
    └── عربی: كِتَاب
        └── جڑ: ك-ت-ب
            ├── كَتَبَ
            ├── كَاتِب
            └── مَكْتَب
```

بعد میں related Urdu family بھی:

`کتاب · کاتب · مکتب · مکتوب · کتابت`

---

## اگلے عملی قدم

1. `uz-shajra-v2.json` schema finalize
2. 20 عام اردو الفاظ کا reviewed sample
3. Arabic source folder
4. Persian source folder
5. English source folder
6. source citation format
7. لغت popup میں read-only prototype

---

**اصول:** ہر زبان اپنی جگہ آزاد؛ UrduZaban انہیں **ملائے نہیں، جوڑے۔**
