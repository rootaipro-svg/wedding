import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import React from 'react';
import { buildDisplayName, normalizePhone, wrapArabicText } from '@/lib/text';

export const runtime = 'edge';

function requireApiKey(req: NextRequest): Response | null {
  const configured = process.env.INVITATION_API_KEY;
  if (!configured) return null;

  const incoming =
    req.headers.get('x-api-key') || req.nextUrl.searchParams.get('apiKey');

  if (incoming !== configured) {
    return Response.json(
      { ok: false, error: 'Unauthorized: invalid INVITATION_API_KEY' },
      { status: 401 }
    );
  }

  return null;
}

function h(type: any, props: any, ...children: any[]) {
  return React.createElement(type, props, ...children);
}

export async function GET(req: NextRequest) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const p = req.nextUrl.searchParams;

  const name = p.get('name') || 'أحمد سالم عبدالله';
  const title = p.get('title') || 'الأخ';
  const phone = p.get('phone') || '';

  const groomName = p.get('groomName') || 'محمد بن عبدالله';
  const familyName = p.get('familyName') || 'عائلتنا الكريمة';
  const eventDate = p.get('eventDate') || 'مساء الجمعة 15 / 8 / 2026';
  const eventTime = p.get('eventTime') || '8:30 مساءً';
  const venue = p.get('venue') || 'قاعة المثال للاحتفالات';
  const mapText = p.get('mapText') || 'سيتم إرسال موقع القاعة مع الدعوة';

  const displayName = buildDisplayName(name, title);
  const guestLines = wrapArabicText(displayName, 26);

  // تحميل الخط من مجلد public بطريقة مستقرة
  const fontUrl = new URL('/fonts/NotoNaskhArabic-Regular.ttf', req.nextUrl.origin);
  const fontRes = await fetch(fontUrl);

  if (!fontRes.ok) {
    return new Response(`Font not found: ${fontUrl.toString()}`, { status: 500 });
  }

  const fontData = await fontRes.arrayBuffer();

  const width = 1080;
  const height = 1350;

  const element = h(
    'div',
    {
      style: {
        width,
        height,
        display: 'flex',
        position: 'relative',
        background: 'linear-gradient(135deg, #FFF8EA 0%, #F6E7C8 55%, #EFE0C1 100%)',
        fontFamily: 'InvitationArabic',
        direction: 'rtl',
        color: '#4B3A2A',
      },
    },

    h('div', {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
        background: 'radial-gradient(circle at 50% 18%, rgba(255,255,255,0.95), rgba(255,255,255,0) 65%)',
      },
    }),

    h('div', {
      style: {
        position: 'absolute',
        left: 58,
        top: 58,
        width: 964,
        height: 1234,
        border: '5px solid #B78A45',
        borderRadius: 42,
      },
    }),

    h('div', {
      style: {
        position: 'absolute',
        left: 88,
        top: 88,
        width: 904,
        height: 1174,
        border: '2px solid #D6B46D',
        borderRadius: 34,
        background: 'rgba(255,255,255,0.45)',
      },
    }),

    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 145,
          width: '100%',
          textAlign: 'center',
          fontSize: 38,
          color: '#6E4E23',
        },
      },
      'بسم الله الرحمن الرحيم'
    ),

    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 230,
          width: '100%',
          textAlign: 'center',
          fontSize: 78,
          fontWeight: 700,
          color: '#7B5628',
        },
      },
      'دعوة زواج'
    ),

    h('div', {
      style: {
        position: 'absolute',
        left: 325,
        top: 318,
        width: 430,
        height: 3,
        background: '#B78A45',
      },
    }),

    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 380,
          width: '100%',
          textAlign: 'center',
          fontSize: 36,
          color: '#4B3A2A',
        },
      },
      `يتشرف ${familyName} بدعوتكم لحضور حفل زواج`
    ),

    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 465,
          width: '100%',
          textAlign: 'center',
          fontSize: 60,
          fontWeight: 700,
          color: '#8B2E2E',
        },
      },
      groomName
    ),

    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 575,
          width: '100%',
          textAlign: 'center',
          fontSize: 34,
          color: '#5E4A35',
        },
      },
      'الدعوة موجهة إلى'
    ),

    h('div', {
      style: {
        position: 'absolute',
        left: 150,
        top: 630,
        width: 780,
        height: 180,
        border: '3px solid #CDA45F',
        borderRadius: 28,
        background: 'rgba(255,255,255,0.82)',
        boxShadow: '0 18px 30px rgba(90,62,30,0.16)',
      },
    }),

    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: 150,
          top: guestLines.length === 1 ? 682 : 655,
          width: 780,
          height: 150,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: guestLines.length === 1 ? 54 : 44,
          fontWeight: 700,
          lineHeight: 1.35,
          color: '#6F1D1B',
        },
      },
      ...guestLines.map((line, index) =>
        h('div', { key: index, style: { display: 'flex' } }, line)
      )
    ),

    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 890,
          width: '100%',
          textAlign: 'center',
          fontSize: 36,
          color: '#4B3A2A',
        },
      },
      'وذلك بمشيئة الله تعالى'
    ),

    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 970,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          fontSize: 36,
          lineHeight: 1.55,
          color: '#4B3A2A',
        },
      },
      h('div', { style: { display: 'flex' } }, eventDate),
      h('div', { style: { display: 'flex' } }, `الوقت: ${eventTime}`),
      h('div', { style: { display: 'flex' } }, `المكان: ${venue}`),
      h(
        'div',
        {
          style: {
            display: 'flex',
            marginTop: 12,
            fontSize: 26,
            color: '#7A6041',
          },
        },
        mapText
      )
    ),

    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 1225,
          width: '100%',
          textAlign: 'center',
          fontSize: 30,
          color: '#7B5628',
        },
      },
      'حضوركم يشرفنا ويسعدنا'
    )
  );

  const image = new ImageResponse(element, {
    width,
    height,
    fonts: [
      {
        name: 'InvitationArabic',
        data: fontData,
        style: 'normal',
        weight: 400,
      },
    ],
  });

  image.headers.set('Cache-Control', 'no-store');

  const normalizedPhone = phone ? normalizePhone(phone) : 'sample';
  image.headers.set(
    'Content-Disposition',
    `inline; filename="wedding-invitation-${normalizedPhone}.png"`
  );

  return image;
}
