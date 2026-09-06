# UrduZaban — Repository Health / Validation

**پہلی baseline:** 6 ستمبر 2026

یہ validation system read-only ہے۔ اس کا مقصد data بدلنا نہیں بلکہ pull request / push کے وقت بنیادی خرابی پکڑنا ہے۔

## خودکار checks

`tools/validate_repo.py` یہ چیزیں دیکھتا ہے:

- ضروری production files موجود ہیں
- `uz-lughat.json` valid JSON ہے
- لغت کے IDs duplicate نہیں
- لغت entries میں `id` اور `w` موجود ہیں
- stated dictionary count اور actual count میں فرق ہو تو warning
- `uz-kahawat.json` valid ہے اور rows کی basic shape درست ہے
- adab people IDs duplicate نہیں
- adab work IDs duplicate نہیں
- ہر `by` ایک موجود author/person ID کی طرف جاتا ہے
- corpus poet IDs اور record poet indexes درست ہیں
- public HTML کے local `href` / `src` targets موجود ہیں
- 16 public pages shared appearance layer (`uz-ui.css`, `uz-preferences.js`) سے جڑے ہیں

## GitHub Action

`.github/workflows/site-health.yml`

- `main` پر push کے بعد چلتا ہے
- `main` کے pull requests پر چلتا ہے
- صرف `contents: read` permission رکھتا ہے
- failure کی صورت میں data یا site modify نہیں کرتا

## 6 ستمبر 2026 baseline result

```text
✓ required files checked: 18
✓ lughat: 10,436 entries · 10,388 distinct words · 3,644 Urdu meanings
✓ kahawat: 2,853 rows · 534 meanings
✓ adab: 35 people · 79 listed works/text records
✓ corpus: 11 poets · 5,198 records
✓ local href/src checked: 395
✓ appearance controls checked: 16 public pages

Result: 0 errors · 0 warnings
```

## کیوں ضروری ہے؟

UrduZaban کے بڑھنے کے ساتھ ایک چھوٹی structural غلطی ہزاروں records یا کئی pages پر اثر ڈال سکتی ہے۔ یہ checks merge سے پہلے بنیادی guardrail ہیں۔ آگے اس validator میں مزید checks شامل ہوں گے، مثلاً:

- Shajra relationship validation
- new literature work-schema validation
- source/rights metadata checks
- search-index consistency
- generated-file drift checks

> اصول: **پہلے جانچ، پھر merge، پھر deploy۔**
