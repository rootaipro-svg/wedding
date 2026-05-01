const sampleUrl = `/api/invitation-image?name=${encodeURIComponent('أحمد سالم عبدالله')}&title=${encodeURIComponent('الأخ')}&phone=777111111&groomName=${encodeURIComponent('عبدالله بن محمد')}&familyName=${encodeURIComponent('عائلتا المثال')}`;

export default function Home() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: 960, margin: '40px auto', padding: 24, lineHeight: 1.8 }}>
      <h1>Wedding Invitation Automation</h1>
      <p>هذا مشروع Vercel بسيط لتوليد صورة دعوة زواج شخصية باسم المدعو.</p>
      <h2>اختبار سريع</h2>
      <p>
        افتح الرابط التالي لتوليد صورة تجريبية:
        <br />
        <a href={sampleUrl} target="_blank">Generate sample invitation</a>
      </p>
      <h2>API</h2>
      <pre style={{ background: '#f6f6f6', padding: 16, overflowX: 'auto' }}>{`GET /api/invitation-image?name=أحمد سالم&title=الأخ&phone=777111111`}</pre>
      <p>بعد النشر على Vercel، سيستخدم n8n هذا الرابط لتوليد صورة لكل مدعو.</p>
    </main>
  );
}
