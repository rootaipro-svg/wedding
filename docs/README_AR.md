# نظام دعوات زواج آلي - Vercel + n8n + WhatsApp Cloud API

## الهدف
هذا المشروع يولد صورة دعوة زواج شخصية لكل مدعو، ثم يمكن استخدام n8n لإرسالها عبر WhatsApp Cloud API أو تجهيز رابط واتساب للاختبار اليدوي.

## الملفات المهمة

- `app/api/invitation-image/route.ts`  
  API يولد صورة PNG مباشرة من بيانات الاسم.

- `data/guests-sample.csv`  
  ملف أسماء وأرقام تجريبي.

- `n8n_workflows/01-dry-run-generate-image-links.json`  
  Workflow اختبار لا يرسل واتساب، فقط يولد روابط الصور وروابط واتساب الجاهزة.

- `n8n_workflows/02-whatsapp-cloud-send-template-http.json`  
  Workflow إرسال فعلي عبر WhatsApp Cloud API باستخدام HTTP Request.

- `docs/whatsapp-template-example.md`  
  نموذج رسالة Template تقترحه في Meta.

- `supabase/schema.sql`  
  جدول Supabase اختياري لو أردت تخزين المدعوين والحالات.

## التشغيل المحلي

```bash
npm install
npm run dev
```

ثم افتح:

```text
http://localhost:3000
```

واختبر الصورة:

```text
http://localhost:3000/api/invitation-image?name=أحمد%20سالم&title=الأخ&phone=777111111
```

## النشر على Vercel

1. ارفع المجلد إلى GitHub.
2. اربط المشروع في Vercel.
3. أضف Environment Variables من ملف `.env.example`.
4. بعد النشر، اختبر:

```text
https://your-project.vercel.app/api/health
```

ثم:

```text
https://your-project.vercel.app/api/invitation-image?name=أحمد%20سالم&title=الأخ&phone=777111111
```

## إعداد n8n

### الاختبار الآمن أولاً
استورد هذا الملف:

```text
n8n_workflows/01-dry-run-generate-image-links.json
```

ثم اضبط Environment Variables في n8n:

```text
PUBLIC_BASE_URL=https://your-project.vercel.app
INVITATION_API_KEY=change-me-after-testing
```

شغل workflow. النتيجة ستكون روابط صور وروابط واتساب جاهزة، بدون إرسال فعلي.

### الإرسال الفعلي عبر WhatsApp Cloud API
استورد هذا الملف:

```text
n8n_workflows/02-whatsapp-cloud-send-template-http.json
```

ثم اضبط هذه المتغيرات في n8n:

```text
PUBLIC_BASE_URL=https://your-project.vercel.app
INVITATION_API_KEY=change-me-after-testing
WHATSAPP_API_VERSION=v22.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_permanent_or_temporary_token
WHATSAPP_TEMPLATE_NAME=wedding_invitation
WHATSAPP_TEMPLATE_LANGUAGE=ar
```

## ملاحظات مهمة

1. لا تبدأ بإرسال 500 دعوة. اختبر على رقمك أولاً.
2. الرسائل التي تبدأها أنت تحتاج غالبًا Template معتمد من Meta.
3. استخدم إرسال تدريجي: مثلاً 1 رسالة كل 20-60 ثانية.
4. أرقام اليمن المحلية مثل `777111111` يحولها الكود تلقائيًا إلى `967777111111`.
5. إذا غيرت قالب WhatsApp في Meta، عدل Body Parameters في workflow الثاني.

## تعديل بيانات الدعوة

عدّل القيم داخل node باسم:

```text
Build Payload Data
```

أهم القيم:

```javascript
groomName: 'عبدالله بن محمد'
familyName: 'عائلتا المثال'
eventDate: 'مساء الجمعة 15 / 8 / 2026'
eventTime: '8:30 مساءً'
venue: 'قاعة المثال للاحتفالات'
```

## توصية التشغيل
ابدأ بهذا الترتيب:

1. شغل Vercel محليًا.
2. افتح رابط الصورة وتأكد أن الاسم يظهر.
3. انشر على Vercel.
4. شغل n8n dry run.
5. اعتمد WhatsApp Template من Meta.
6. جرب إرسال فعلي إلى رقم واحد.
7. بعدها اربط Google Sheets أو Supabase وابدأ بالدفعات.
