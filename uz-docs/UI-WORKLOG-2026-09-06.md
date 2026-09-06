# UI Worklog — 6 ستمبر 2026

**Branch:** `feature/ui-personalization-2026-09-06`

## کیا بنایا

- `uz-ui.css` — shared theme, typography, accessibility اور settings-panel styles
- `uz-preferences.js` — saved user preferences، optional font lazy-loading، reset
- `uz-ui-demo.html` — production سے الگ محفوظ demo page

## موجودہ font options

Local/offline:
- Noto Nastaliq Urdu
- Noto Naskh Arabic

Optional online, صرف user کے انتخاب پر load:
- Gulzar
- Lateef
- Amiri
- Noto Sans Arabic

## Theme options

- Auto
- Paper
- Night
- Emerald
- Sapphire
- Plain

## Reading controls

- text size: small / normal / large / extra large
- line spacing: compact / comfortable / airy
- reduced motion

## حفاظت

- `main` نہیں چھیڑا گیا
- live Hostinger page نہیں بدلا
- production JSON/data نہیں بدلا
- موجودہ fonts delete/replace نہیں ہوئے
- نئی UI پہلے demo page پر رکھی گئی ہے

## اگلا قدم

1. demo visual review
2. `index.html` پر feature branch میں integration
3. لغت/کہاوت regression check
4. ادب pages integration
5. پھر review کے بعد PR

## اصول

UI personalization cosmetic layer ہے؛ preference fail ہو تو site کا موجودہ default look برقرار رہنا چاہیے۔
