import { escapeXml, wrapArabicText } from './text';

export type InvitationInput = {
  guestName: string;
  title?: string;
  groomName?: string;
  familyName?: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  mapText?: string;
  fontBase64?: string;
};

export function createInvitationSvg(input: InvitationInput): string {
  const width = 1080;
  const height = 1350;

  const guestLines = wrapArabicText(
    input.guestName || 'الأخ / أحمد سالم عبدالله',
    28
  );

  const groomName = escapeXml(input.groomName || 'عبدالله بن محمد');
  const familyName = escapeXml(input.familyName || 'عائلتا المثال');
  const eventDate = escapeXml(input.eventDate || 'مساء الجمعة 15 / 8 / 2026');
  const eventTime = escapeXml(input.eventTime || '8:30 مساءً');
  const venue = escapeXml(input.venue || 'قاعة المثال للاحتفالات');
  const mapText = escapeXml(input.mapText || 'سيتم إرسال موقع القاعة مع الدعوة');

  const fontBase64 = input.fontBase64 || '';

  const fontCss = fontBase64
    ? `
      @font-face {
        font-family: 'InvitationArabic';
        src: url("data:font/ttf;base64,${fontBase64}") format("truetype");
        font-weight: normal;
        font-style: normal;
      }
    `
    : '';

  const arabicFont = fontBase64
    ? 'InvitationArabic, Arial, sans-serif'
    : 'Arial, sans-serif';

  const guestTspans = guestLines
    .map((line, index) => {
      const dy = index === 0 ? 0 : 56;
      return `<tspan x="540" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join('');

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style><![CDATA[
      ${fontCss}
    ]]></style>

    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFF8EA"/>
      <stop offset="0.52" stop-color="#F6E7C8"/>
      <stop offset="1" stop-color="#EFE0C1"/>
    </linearGradient>

    <radialGradient id="glow" cx="50%" cy="18%" r="70%">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>

    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#5A3E1E" flood-opacity="0.17"/>
    </filter>
  </defs>

  <rect width="1080" height="1350" fill="url(#bg)"/>
  <rect width="1080" height="1350" fill="url(#glow)"/>

  <rect x="58" y="58" width="964" height="1234" rx="42" fill="none" stroke="#B78A45" stroke-width="5"/>
  <rect x="88" y="88" width="904" height="1174" rx="34" fill="rgba(255,255,255,0.50)" stroke="#D6B46D" stroke-width="2"/>

  <g opacity="0.26" fill="none" stroke="#B78A45" stroke-width="3">
    <path d="M105 190 C210 90, 310 90, 420 190"/>
    <path d="M660 190 C770 90, 870 90, 975 190"/>
    <path d="M105 1160 C210 1260, 310 1260, 420 1160"/>
    <path d="M660 1160 C770 1260, 870 1260, 975 1160"/>
  </g>

  <text x="540" y="165" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="${arabicFont}" font-size="34" fill="#6E4E23">بسم الله الرحمن الرحيم</text>

  <text x="540" y="265" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="${arabicFont}" font-size="74" font-weight="700" fill="#7B5628">دعوة زواج</text>

  <line x1="325" y1="310" x2="755" y2="310" stroke="#B78A45" stroke-width="3"/>

  <text x="540" y="395" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="${arabicFont}" font-size="34" fill="#4B3A2A">يتشرف ${familyName} بدعوتكم لحضور حفل زواج</text>

  <text x="540" y="480" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="${arabicFont}" font-size="58" font-weight="700" fill="#8B2E2E">${groomName}</text>

  <text x="540" y="585" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="${arabicFont}" font-size="31" fill="#5E4A35">الدعوة موجهة إلى</text>

  <g filter="url(#shadow)">
    <rect x="150" y="625" width="780" height="178" rx="28" fill="#FFFFFF" fill-opacity="0.82" stroke="#CDA45F" stroke-width="3"/>
  </g>

  <text x="540" y="704" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="${arabicFont}" font-size="48" font-weight="700" fill="#6F1D1B">${guestTspans}</text>

  <text x="540" y="890" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="${arabicFont}" font-size="34" fill="#4B3A2A">وذلك بمشيئة الله تعالى</text>

  <g font-family="${arabicFont}" direction="rtl" unicode-bidi="plaintext" text-anchor="middle" fill="#4B3A2A">
    <text x="540" y="970" font-size="34">${eventDate}</text>
    <text x="540" y="1025" font-size="34">الوقت: ${eventTime}</text>
    <text x="540" y="1080" font-size="34">المكان: ${venue}</text>
    <text x="540" y="1135" font-size="24" fill="#7A6041">${mapText}</text>
  </g>

  <text x="540" y="1235" text-anchor="middle" direction="rtl" unicode-bidi="plaintext" font-family="${arabicFont}" font-size="25" fill="#7B5628">حضوركم يشرفنا ويسعدنا</text>
</svg>`;
}
