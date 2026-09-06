# اردو زبان — UI Modernization + Personalization Plan

**مقصد:** UrduZaban کا look زیادہ جدید، صاف، تیز اور user-friendly بنانا — مگر موجودہ شناخت (کاغذی/سنہری Urdu feel) ضائع کیے بغیر۔ ساتھ ہی user کو اپنی پسند کا theme، Urdu font، font size اور reading density چننے کا اختیار دینا۔

---

## موجودہ حالت

موجودہ site میں پہلے ہی اچھی بنیادیں ہیں:

- light/dark color variables
- local Urdu fonts
- responsive mobile navigation
- Urdu/English mode
- cards, shadows, accent color اور Nastaliq identity

موجودہ repository کے `fonts/` folder میں یہ local fonts ہیں:

- Noto Nastaliq Urdu
- Noto Naskh Arabic 400
- Noto Naskh Arabic 700

یعنی personalization صفر سے نہیں بنانی؛ موجودہ CSS variables کے اوپر ایک مشترک preference layer بنانی ہے۔

---

## UI کے پانچ بنیادی اصول

1. **سادگی:** ہر صفحہ پہلی نظر میں سمجھ آئے۔
2. **اردو first:** Nastaliq/Naskh readability مرکزی رہے۔
3. **اختیار:** user theme, font, size خود چنے۔
4. **رسائی:** keyboard, contrast, larger text, reduced motion کا خیال۔
5. **رفتار:** cosmetic choice کی وجہ سے dictionary/corpus loading سست نہ ہو۔

---

## Global settings panel

ہر page پر ایک چھوٹا ⚙ / `Aa` control ہو، جس سے ایک side/bottom sheet کھلے۔

### Theme

- **خودکار** — device light/dark کے مطابق
- **کاغذ** — موجودہ warm cream + gold
- **رات** — warm dark
- **سبز** — emerald accent
- **نیلا** — slate/sapphire modern theme
- **سادہ** — high-readability neutral light

### Urdu font

دو قسمیں:

#### Offline/local
- Noto Nastaliq Urdu
- Noto Naskh Arabic

#### Optional online open fonts
- Gulzar
- Lateef
- Amiri
- Noto Sans Arabic

Online font منتخب ہونے پر ہی اس کا stylesheet load ہو؛ default page load پر تمام fonts download نہ ہوں۔ Offline ہونے پر local fallback استعمال ہو۔

### Text controls

- font size: چھوٹا / معمول / بڑا / بہت بڑا
- line spacing: compact / comfortable / airy
- animation: normal / reduced

### Reset

`اصل حالت بحال کریں`

---

## Preferences کہاں محفوظ ہوں

Browser `localStorage` میں صرف cosmetic settings:

```json
{
  "theme":"paper",
  "font":"nastaliq",
  "size":"md",
  "spacing":"comfortable",
  "motion":"auto"
}
```

کوئی account یا private data لازم نہیں۔

---

## Technical architecture

نئی shared files:

```text
uz-ui.css
uz-preferences.js
```

`uz-ui.css`:

- theme variable overrides
- typography presets
- settings panel styles
- accessibility focus states
- modern button/card refinements

`uz-preferences.js`:

- saved settings load
- `data-uz-theme`, `data-uz-font`, `data-uz-size`, `data-uz-spacing`
- settings panel inject
- optional Google/open font stylesheet lazy-load
- reset

یہ layer موجودہ pages کے code کو rewrite کیے بغیر اوپر بیٹھ سکتی ہے۔

---

## CSS variable contract

موجودہ pages پہلے ہی variables استعمال کرتے ہیں:

- `--paper`
- `--card`
- `--card2`
- `--ink`
- `--muted`
- `--line`
- `--accent`
- `--accent-hi`
- `--accent-soft`
- `--nastaliq`
- `--naskh`

نئی UI layer انہی variables کو override کرے گی۔ اس سے migration کم خطرناک رہتی ہے۔

---

## Main page redesign — سمت

Homepage کو صرف rooms کی list نہ رکھا جائے بلکہ ایک modern language dashboard بنایا جائے:

### Hero
- UrduZaban brand
- ایک واضح global search
- تین فوری actions: لفظ تلاش، متن پر اعراب، ادب کھولیں

### Live counters
- لغت
- کہاوتیں
- شاعر
- ادبی تحریریں

### Explore cards
- لغت
- کہاوت
- ادب
- قرینہ
- ترجمان
- آواز
- سند

### Daily discovery
- آج کا لفظ
- آج کی کہاوت
- آج کا شعر

### Community preview
- حالیہ شامل شدہ الفاظ
- حالیہ درستیاں
- contribution کا دروازہ (future)

### Footer
- license
- GitHub
- data openness
- project status

---

## Mobile

Settings panel bottom sheet ہو۔

- font size touch-friendly
- theme chips
- font preview ہر option میں اسی font میں
- nav horizontally scrollable مگر active room واضح
- global search ہمیشہ آسانی سے دستیاب

---

## Accessibility

- visible keyboard focus
- 44px touch targets جہاں ممکن ہو
- contrast-friendly presets
- `prefers-reduced-motion`
- zoom پر layout نہ ٹوٹے
- Urdu text selection/copy آسان
- icon-only buttons کے `aria-label`

---

## Performance

- default fonts local
- optional fonts lazy-load
- preferences script چھوٹا اور dependency-free
- settings load page paint سے پہلے جتنا ممکن ہو تاکہ theme flash کم ہو
- heavy shadows/blur mobile پر محدود

---

## Rollout

### Step 1 — Prototype

shared CSS + JS بنائیں، production data نہ چھیڑیں۔

### Step 2 — Homepage

`index.html` پر نئی layer لگائیں اور visual check کریں۔

### Step 3 — لغت + کہاوت

interactive/search-heavy pages پر regression check۔

### Step 4 — ادب rooms

shared typography اور settings ہر room پر۔

### Step 5 — باقی tools

قرینہ، ترجمان، سند، admin وغیرہ۔

### Step 6 — Main redesign

personalization stable ہونے کے بعد homepage کا deeper layout refresh۔

---

## Safety

- `main` پر براہ راست experimental UI نہ جائے۔
- نئی theme system پہلے feature branch پر۔
- existing CSS variables اور URLs نہ توڑے جائیں۔
- local/default font ہمیشہ fallback رہے۔
- preference failure کی صورت میں موجودہ site کا look ہی نظر آئے۔

---

## نتیجہ

UrduZaban کا look ایک ہی design پر user کو مجبور نہیں کرے گا۔ project کی اپنی visual identity برقرار رہے گی، مگر user اپنی reading comfort کے مطابق theme، Urdu font اور text density بدل سکے گا۔
