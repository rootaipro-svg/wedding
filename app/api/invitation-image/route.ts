import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { createInvitationSvg } from '@/lib/invitation-svg';
import { buildDisplayName, normalizePhone } from '@/lib/text';

export const runtime = 'nodejs';

function requireApiKey(req: NextRequest): Response | null {
  const configured = process.env.INVITATION_API_KEY;
  if (!configured) return null;
  const incoming = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('apiKey');
  if (incoming !== configured) {
    return Response.json({ ok: false, error: 'Unauthorized: invalid INVITATION_API_KEY' }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const p = req.nextUrl.searchParams;
  const name = p.get('name') || 'أحمد سالم عبدالله';
  const title = p.get('title') || 'الأخ';
  const phone = p.get('phone') || '';

  const displayName = buildDisplayName(name, title);
  const svg = createInvitationSvg({
    guestName: displayName,
    groomName: p.get('groomName') || undefined,
    familyName: p.get('familyName') || undefined,
    eventDate: p.get('eventDate') || undefined,
    eventTime: p.get('eventTime') || undefined,
    venue: p.get('venue') || undefined,
    mapText: p.get('mapText') || undefined
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  const normalizedPhone = phone ? normalizePhone(phone) : 'sample';
  const filename = `wedding-invitation-${normalizedPhone}.png`;

  return new Response(png, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
