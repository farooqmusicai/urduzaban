# اردو زبان — کام کی یادداشت

## 6 ستمبر 2026 — About page + homepage link + roadmap

**Branch:** `feature/about-roadmap-2026-09-06`

### کیا بنایا

- `about.html` — مکمل Urdu-first About page
- `index.html` — navigation اور footer میں `ہمارے بارے میں` link
- `sitemap.xml` — About page شامل
- `uz-docs/WORK-ROADMAP-2026-09.md` — روزانہ 1–2 گھنٹے کے blocks والا dated roadmap

### About page میں

- محمد فاروق کا تعارف
- Doha, Qatar
- accounting میں 25+ years
- motto: `AI makes life easier`
- Farooq Music
- FarooqStars
- MyMandoob
- UrduZaban کا مقصد
- AI tools: Claude, Gemini, ChatGPT
- tech stack summary
- Flutter / Laravel / Convex / self-hosting learning
- QuickBooks since 1997 کا public profile note
- GitHub + social links
- عوامی، مفت، کھلے Urdu platform کا founder message
- future community contribution کی دعوت

### حفاظتی طریقہ

`main` براہِ راست edit نہیں کیا گیا۔

Homepage integration ایک temporary feature-branch GitHub Action سے کی گئی جس نے:

1. exact known anchors تلاش کیے؛
2. anchor نہ ملنے کی صورت میں fail ہونا تھا؛
3. About nav link اور footer link جوڑے؛
4. sitemap entry جوڑی؛
5. HTML sanity checks چلائے؛
6. صرف feature branch پر commit کیا۔

Action کامیاب ہوئی اور پھر temporary workflow repository سے حذف کر دیا گیا تاکہ production میں feature-specific workflow نہ جائے۔

### Validation

- `about.html` موجود
- `index.html` میں `href="about.html"` موجود
- `sitemap.xml` میں `https://www.urduzaban.com/about.html` موجود
- `index.html` اور `about.html` میں `<html>`, `</html>`, `<body>`, `</body>` sanity checks کامیاب
- branch main سے آگے، behind = 0

### کیا نہیں چھیڑا

- `uz-lughat.json`
- `uz-kahawat.json`
- adab data
- corpus
- API
- TTS
- existing workflows
- Hostinger settings

### اگلا قدم

PR review → merge to `main` → Hostinger deployment → live `about.html` اور homepage link verify۔
