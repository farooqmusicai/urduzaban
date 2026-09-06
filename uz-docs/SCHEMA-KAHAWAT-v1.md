# کہاوت و محاورہ — موجودہ schema اور v2 سمت

## موجودہ production format

`uz-kahawat.json` compact rows رکھتی ہے:

```text
[متن، قسم، Roman، مطلب، موقع]
```

قسم:

- `k` = کہاوت
- `m` = محاورہ

یہ format browser کے لیے ہلکا ہے، مگر انسانی editing اور future features کے لیے محدود ہے۔

## مسئلہ کہاں آئے گا

آگے ہمیں ممکنہ طور پر یہ سب چاہیے ہوگا:

- مستقل ID
- موضوعات
- کلیدی الفاظ
- variant forms
- استعمال کی مثال
- source/provenance
- audio
- متعلقہ لغت الفاظ
- duplicate/near-duplicate relation

compact array میں fields بڑھاتے رہنا پڑھنے اور maintain کرنے میں مشکل ہوگا۔

## تجویز: source schema الگ، production build الگ

Authoritative source record:

```json
{
  "id": "kh-000001",
  "text": "آ بیل مجھے مار",
  "type": "muhawara",
  "roman": "aa bail mujhe maar",
  "meaning": "خود مصیبت کو دعوت دینا",
  "usage": "جب کوئی جان بوجھ کر مشکل میں پڑے",
  "themes": ["مصیبت", "حماقت"],
  "keywords": ["بیل", "مار"],
  "variants": [],
  "source": null,
  "status": "reviewed"
}
```

پھر build script موجودہ compact production rows بنا سکتا ہے تاکہ live site فوری نہ بدلے۔

## ID اصول

ID متن سے نہ بنائیں؛ مستقل sequential یا generated stable ID رکھیں۔ متن/اعراب بعد میں درست ہو سکے مگر ID نہ بدلے۔

## Cross-links

Future indexes:

- `word_id → kahawat_ids`
- `theme → kahawat_ids`
- `variant → canonical_kahawat_id`

موجودہ `lughat.html` پہلے ہی لفظ search سے کہاوتوں کو ڈھونڈتا ہے۔ future میں string search کی جگہ prebuilt relation index زیادہ مضبوط ہوگا۔

## Validation

- ID unique
- text non-empty
- type صرف approved values
- meaning/usage optional مگر واضح status
- Roman optional مگر malformed نہ ہو
- duplicate exact text report
- near-duplicate report الگ، auto-merge نہیں
- build کے بعد row count before/after match

## Migration rule

موجودہ `uz-kahawat.json` کو فوری replace نہیں کرنا۔ پہلے source schema + converter + validation branch میں تیار ہوں؛ output current format کے برابر ثابت ہو، پھر migration پر فیصلہ ہو۔
