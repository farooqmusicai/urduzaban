# اردو زبان — 6 ستمبر 2026 حقیقی نتائج

## 1) GitHub repository public page

`README.md` کو مکمل project overview میں بدل دیا گیا اور `main` میں merge ہو گیا۔ اب GitHub visitor کو یہ چیزیں واضح نظر آتی ہیں:

- UrduZaban کیا ہے
- موجودہ لغت، کہاوت، ادب، قرینہ، ترجمان، corpus اور TTS
- founder message
- open/public philosophy
- multilingual Shajra direction
- Wikipedia-style moderated community vision
- repository map
- current roadmap
- production safety flow
- license اور contribution direction

## 2) About page

`about.html` پہلے ہی `main` میں merge ہو چکا ہے اور homepage navigation + sitemap سے linked ہے۔

## 3) Site-wide appearance controls

نئی shared files:

- `uz-ui.css`
- `uz-preferences.js`

16 public pages پر enabled:

- index
- about
- lughat
- kahawat
- adab
- shair
- sher
- nasr
- afsana
- mazameen
- tanz
- aqwal
- qarina-aeraab
- qarina-neural
- tarjuman
- sanad

### User controls

- theme: auto / paper / night / emerald / sapphire / plain
- font: Nastaliq / Naskh / Gulzar / Lateef / Amiri / Noto Sans Arabic
- text size: small / normal / large / extra large
- line spacing: compact / comfortable / airy
- reduced motion
- preferences stored in browser `localStorage`

Nastaliq اور Naskh site کے local fonts ہیں؛ optional fonts صرف user کے منتخب کرنے پر load ہوتے ہیں۔

## 4) Validation

Temporary feature-branch GitHub Action نے 16 public pages پر check کیا:

- `uz-ui.css` exactly once linked
- `uz-preferences.js` exactly once linked
- charset/style anchors موجود
- preference JS میں theme/font/spacing/motion/localStorage موجود
- shared CSS میں theme/font/panel selectors موجود

پہلی دو runs نے legacy Qarina page structure کی وجہ سے safely fail کیا؛ integration نے data یا production کو touch نہیں کیا۔ workflow کو legacy fragment pages کے مطابق درست کرنے کے بعد تیسری run کامیاب ہوئی۔

## 5) کیا نہیں بدلا

- `uz-lughat.json`
- `uz-kahawat.json`
- corpus data
- literature data
- API
- neural model files
- existing production workflows

## نتیجہ

آج کا visible deliverable صرف documentation نہیں: GitHub public project page مکمل ہوا، About production میں آیا، اور site-wide font/theme personalization layer 16 public pages پر test ہو کر feature branch میں تیار ہوئی۔
