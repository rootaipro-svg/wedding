import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import React from 'react';
import { buildDisplayName, normalizePhone, wrapArabicText } from '@/lib/text';

export const runtime = 'edge';

function h(type: any, props: any, ...children: any[]) {
  return React.createElement(type, props, ...children);
}

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

export async function GET(req: NextRequest) {
  try {
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

    const displayName = buildDisplayName(name, title);
    const guestLines = wrapArabicText(displayName, 26);

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
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: '#F8F1E5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'InvitationArabic',
          color: '#4B3A2A',
          direction: 'rtl',
        },
      },

      h(
        'div',
        {
          style: {
            marginTop: '70px',
            fontSize: '34px',
            textAlign: 'center',
          },
        },
        'بسم الله الرحمن الرحيم'
      ),

      h(
        'div',
        {
          style: {
            marginTop: '35px',
            fontSize: '72px',
            fontWeight: '700',
            color: '#7B5628',
            textAlign: 'center',
          },
        },
        'دعوة زواج'
      ),

      h('div', {
        style: {
          width: '420px',
          height: '3px',
          backgroundColor: '#B78A45',
          marginTop: '24px',
        },
      }),

      h(
        'div',
        {
          style: {
            marginTop: '55px',
            fontSize: '34px',
            textAlign: 'center',
            width: '900px',
          },
        },
        `يتشرف ${familyName} بدعوتكم لحضور حفل زواج`
      ),

      h(
        'div',
        {
          style: {
            marginTop: '24px',
            fontSize: '56px',
            fontWeight: '700',
            color: '#8B2E2E',
            textAlign: 'center',
          },
        },
        groomName
      ),

      h(
        'div',
        {
          style: {
            marginTop: '55px',
            fontSize: '32px',
            textAlign: 'center',
          },
        },
        'الدعوة موجهة إلى'
      ),

      h(
        'div',
        {
          style: {
            width: '780px',
            minHeight: '160px',
            border: '3px solid #CDA45F',
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            boxSizing: 'border-box',
          },
        },
        ...guestLines.map((line, index) =>
          h(
            'div',
            {
              key: index,
              style: {
                fontSize: guestLines.length === 1 ? '52px' : '42px',
                fontWeight: '700',
                color: '#6F1D1B',
                textAlign: 'center',
                lineHeight: '1.4',
              },
            },
            line
          )
        )
      ),

      h(
        'div',
        {
          style: {
            marginTop: '70px',
            fontSize: '32px',
            textAlign: 'center',
          },
        },
        'وذلك بمشيئة الله تعالى'
      ),

      h(
        'div',
        {
          style: {
            marginTop: '30px',
            fontSize: '32px',
            textAlign: 'center',
            lineHeight: '1.8',
            width: '900px',
          },
        },
        `${eventDate}\nالوقت: ${eventTime}\nالمكان: ${venue}`
      ),

      h(
        'div',
        {
          style: {
            marginTop: '90px',
            fontSize: '28px',
            color: '#7B5628',
            textAlign: 'center',
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
  } catch (error: any) {
    return new Response(`Image generation error: ${error?.message || 'Unknown error'}`, {
      status: 500,
    });
  }
}
