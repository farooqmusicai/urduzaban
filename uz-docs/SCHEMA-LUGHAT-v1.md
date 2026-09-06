# لغت — موجودہ schema اور v2 سمت

**مقصد:** پہلے موجودہ `uz-lughat.json` کو سمجھنا، پھر بغیر live site توڑے schema کو مضبوط کرنا۔

## موجودہ fields — UI سے ثابت

| field | مطلب |
|---|---|
| `id` | مستقل record id |
| `w` | لفظ، بے اعراب |
| `a` | اعراب والا روپ |
| `r` | Roman |
| `alt` | Roman کی دوسری spellings |
| `en` | English gloss |
| `ur` | اردو معنی / اشارہ |
| `pos` | part of speech |
| `f` | frequency/commonness sort |
| `g` | group: dict / ambig / plain / name / wk وغیرہ |
| `nm` | عام لفظ نام کے طور پر بھی |
| `gen` | نام کی صنف |
| `org` | نام کی اصل زبان label |
| `nen` | نام کے معنی |
| `asl` | etymology/origin note |
| `re` | machine-made Roman flag |
| `s` | speak-form |
| `ex` | مثال |
| `src` | source id |
| `t` | date |
| `gd` | grammatical gender |
| `wk` | Wiktionary-related marker |

## Extended data

`uz-lughat-ext.json` میں heavy/optional fields رکھنا موجودہ اچھا pattern ہے:

- etymology text
- IPA
- scholarly transliteration
- Hindi spelling
- multiple senses
- examples
- synonyms

## v2 اصول

### Main Urdu dictionary میں رہیں

- Urdu headword
- aeraab
- Roman
- meanings
- POS/grammar
- pronunciation/speak form
- Urdu usage examples
- source/confidence markers

### Main dictionary میں foreign lexicon merge نہ ہو

Arabic/Persian/English source dictionaries الگ رہیں۔ `uz-shajra.json` یا equivalent linked file میں صرف relationship ہو۔

### ممکنہ future linked fields

```json
{
  "id": 123,
  "w": "مثال",
  "a": "مِثال",
  "r": "misaal",
  "ur": "...",
  "en": "example",
  "pos": "n",
  "shajra_id": "sh-123",
  "related_ids": [456,789]
}
```

`shajra_id` ابھی production میں شامل نہ کیا جائے جب تک 20-word sample approve نہ ہو۔

## Validation جو لازمی ہونی چاہیے

- ہر `id` unique
- `w` خالی نہ ہو
- duplicate readings صرف intentional ہوں
- `r`, `a`, `s` update سے پہلے count نہ بدلے
- source id موجود ہو
- JSON parse ہو
- referenced files/labels موجود ہوں
- bulk change میں before/after counts report ہوں

## Performance direction

10k records پر full browser load قابلِ عمل ہے۔ بہت بڑا ہونے پر:

- compact search index
- detail shards
- letter shards
- lazy details
- version manifest

**ابھی migration نہیں — پہلے documentation اور validation۔**
