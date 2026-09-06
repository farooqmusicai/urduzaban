# اردو زبان — عوامی شراکت / Wikipedia-style Community Plan

**مقصد:** UrduZaban کو مستقبل میں ایسا کھلا علمی platform بنانا جہاں لوگ لغت، اعراب، معنی، کہاوت، شاعر، کلام، حوالہ اور تلفظ بہتر کرنے میں حصہ لے سکیں — مگر production data براہِ راست بے قابو نہ ہو۔

---

## بنیادی اصول

UrduZaban کا data عوامی رہے، مگر editing کا نظام **moderated** ہو۔ ہر آنے والی تبدیلی فوراً live نہ ہو بلکہ review سے گزرے۔

### تین سطحیں

1. **مہمان / Reader**
   - لفظ، کہاوت، شاعر یا تحریر کے لیے suggestion دے سکے
   - غلطی report کر سکے
   - source link دے سکے

2. **Contributor**
   - account کے ساتھ structured edit form استعمال کرے
   - نئی entry draft کرے
   - موجود entry میں correction تجویز کرے
   - اپنے edits کا history دیکھے

3. **Reviewer / Editor**
   - pending changes compare کرے
   - source/rights دیکھے
   - approve/reject/merge کرے
   - dispute notes رکھے

---

## live data کو کیسے محفوظ رکھا جائے

عوام کبھی `uz-lughat.json` یا production JSON کو سیدھا edit نہ کریں۔

درست flow:

```text
User suggestion
   ↓
Pending change record
   ↓
Automatic validation
   ↓
Human review
   ↓
Approved canonical data
   ↓
Build / deploy
```

اس سے Wikipedia جیسی openness ملے گی مگر خراب data یا vandalism فوراً live نہیں ہوگا۔

---

## Contribution record کا نمونہ

```json
{
  "id": "chg-2026-000001",
  "entity": "word",
  "entity_id": "uz-1234",
  "action": "update",
  "field": "ur_meaning",
  "old": "...",
  "new": "...",
  "reason": "...",
  "sources": ["..."],
  "submitted_by": "user-id",
  "submitted_at": "2026-09-06T...",
  "status": "pending",
  "reviewed_by": null,
  "review_note": null
}
```

---

## کن چیزوں پر عوام کام کر سکیں گے

### لغت
- نیا لفظ تجویز کرنا
- اردو معنی لکھنا
- Roman spelling
- اعراب
- part of speech
- grammatical gender
- مثال
- ماخذ
- تلفظ correction
- متعلقہ الفاظ

### کہاوت / محاورہ
- مطلب
- موقع استعمال
- variant
- علاقائی صورت
- source

### ادب
- شاعر/ادیب کی معلومات
- تاریخ correction
- تصانیف
- public-domain source
- غزل/نظم metadata
- متن میں typo correction

### شجرہ
- اصل زبان
- اصل لفظ
- root
- intermediary language
- تاریخی citation

---

## اعتماد / reputation

ہر contributor کے لیے points سے زیادہ **review history** اہم ہو:

- approved edits
- reverted edits
- source quality
- specialist areas

مثلاً:

- لغت reviewer
- عربی reviewer
- فارسی reviewer
- عروض reviewer
- اعراب reviewer
- ادب reviewer

---

## اختلاف کیسے سنبھالیں

زبان میں ایک ہی جواب ہمیشہ درست نہیں ہوتا۔ اس لیے system کو alternatives سنبھالنے چاہییں:

- مختلف تلفظ
- مختلف املا
- دہلی / لکھنؤ / دکنی استعمال
- قدیم / جدید معنی
- disputed etymology

ایسے cases میں ایک entry مٹانے کے بجائے multiple readings + source notes محفوظ ہوں۔

---

## moderation

Automatic checks:

- duplicate detection
- invalid Unicode
- empty required fields
- spam links
- prohibited HTML/script
- source URL validation
- rights/copyright flag

Human checks:

- معنی اپنے لفظوں میں ہے؟
- citation معتبر ہے؟
- copyrighted متن تو نہیں؟
- شاعر/مصنف کا record duplicate تو نہیں؟
- etymology دعویٰ source کے بغیر تو نہیں؟

---

## account system — بعد کا مرحلہ

شروع میں GitHub-based contribution یا simple account system کافی ہوگا۔ بعد میں:

- email/passkey login
- contributor profile
- edit history
- watchlist
- discussion page
- reviewer dashboard

---

## version history

ہر approved entity کی history رہنی چاہیے:

```text
v1  لفظ شامل
v2  اعراب درست
v3  اردو معنی شامل
v4  فارسی اصل کا حوالہ شامل
```

یہ scholarly transparency کے لیے بہت اہم ہے۔

---

## پہلا عملی مرحلہ

Community system فوراً مکمل نہیں بنایا جائے گا۔ پہلے:

1. canonical schemas مضبوط
2. stable IDs
3. validation
4. change-record schema
5. read-only history model
6. پھر contributor UI prototype

---

## اصول

> **کھلا data، کھلی شراکت — مگر ہر تبدیلی traceable, reviewable اور reversible۔**
