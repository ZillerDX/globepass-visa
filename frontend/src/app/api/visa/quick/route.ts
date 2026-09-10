import { NextResponse } from 'next/server';
import rawPopularMatrix from '@/lib/data/popular_matrix.json';

const popularMatrix = rawPopularMatrix as Record<string, any>;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fromCode = (searchParams.get('from_country') || '').trim().toUpperCase();
  const toCode = (searchParams.get('to_country') || '').trim().toUpperCase();

  if (!fromCode || !toCode || !/^[A-Z]{2}$/.test(fromCode) || !/^[A-Z]{2}$/.test(toCode)) {
    return NextResponse.json(
      { error: 'Invalid or missing from_country or to_country. Must be 2 uppercase ISO letters.' },
      { status: 400 }
    );
  }

  const pairKey = `${fromCode}_${toCode}`;
  const match = popularMatrix[pairKey];

  if (match) {
    return NextResponse.json({
      from_country: fromCode,
      to_country: toCode,
      visa_type: match.visa_type || 'embassy_visa',
      days: match.days,
      label: match.label || 'Visa Required',
      raw: match.raw || ''
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
      }
    });
  }

  return NextResponse.json({
    from_country: fromCode,
    to_country: toCode,
    visa_type: 'embassy_visa',
    days: null,
    label: 'Embassy Visa Required',
    raw: 'visa required'
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
    }
  });
}
