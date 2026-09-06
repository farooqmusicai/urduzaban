# Contributing to UrduZaban

اردو زبان میں خوش آمدید۔ یہ project صرف code repository نہیں بلکہ زبان، لغت، corpus، ادب اور اوزاروں کا مجموعہ ہے، اس لیے contribution کرتے وقت data integrity اور source discipline بہت اہم ہیں۔

## Golden rules

- `uz-lughat.json` میں صرف اردو لغت کا data رہے۔ فارسی/عربی/انگریزی source datasets الگ رہیں۔
- معنی اپنے لفظوں میں لکھیں؛ copyrighted dictionary text copy نہ کریں۔
- public-domain یا مناسب license والے ادبی متن ہی استعمال کریں۔
- generated pages کو ہاتھ سے بدلنے کے بجائے جہاں builder/data source موجود ہو وہاں source بدلیں۔
- live paths کو move/rename کرنے سے پہلے migration plan بنائیں۔
- بڑے data changes چھوٹے، reviewable batches میں کریں۔

## Suggested workflow

1. `main` سے نئی branch بنائیں۔
2. صرف متعلقہ files میں تبدیلی کریں۔
3. JSON/TSV syntax validate کریں۔
4. browser میں متعلقہ page کھول کر search, RTL rendering, mobile layout اور links دیکھیں۔
5. واضح commit message لکھیں، مثلاً:
   - `data: add 100 kahawat meanings`
   - `lughat: add corpus words batch N-6`
   - `adab: add public-domain prose metadata`
   - `docs: explain dictionary schema`
6. Pull Request میں یہ لکھیں: کیا بدلا، کیوں بدلا، source کیا تھا، اور کیا test کیا۔

## Data contribution checklist

### لغت
- لفظ کا املا درست ہے؟
- اعراب verified ہیں یا suggestion ہیں؟
- Roman spelling consistent ہے؟
- معنی original wording میں ہے؟
- duplicate reading جان بوجھ کر ہے یا accidental duplicate؟
- name/word dual use ہو تو existing record merge model follow کیا گیا؟

### کہاوت / محاورہ
- entry واقعی کہاوت/محاورہ ہے؟
- مطلب مختصر، صاف اور اپنے لفظوں میں ہے؟
- ambiguous item کو guess کرنے کے بجائے review کے لیے چھوڑا گیا؟

### ادب
- شخصیت کی شناخت واضح ہے؟
- وفات/rights status یا source license معلوم ہے؟
- public-domain/Wikisource URL documented ہے؟
- biography اور introduction original wording میں ہیں؟
- quote کسی موجود verified text سے لیا گیا ہے؟

## Repository areas

- Site pages: root `*.html`
- Main language data: `uz-lughat.json`, `uz-kahawat.json`, `uz-data/`
- Documentation/research logs: `uz-docs/`
- API: `api/`
- TTS/voice: `qarina-tts/`
- Automation: `.github/workflows/`

مزید architecture کے لیے `uz-docs/REPOSITORY-MAP.md` دیکھیں۔

## Licensing

Contribution کرتے وقت آپ اس بات سے اتفاق کرتے ہیں کہ repository کے اصل data/content پر project کی CC BY 4.0 policy اور code پر MIT policy لاگو ہوگی، جبکہ third-party material اپنے license کے تحت رہے گا۔
