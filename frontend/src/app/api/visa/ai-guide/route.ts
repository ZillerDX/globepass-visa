import { NextResponse } from 'next/server';
import { Country, VisaGuideResponse } from '@/types/visa';
import rawCountries from '@/lib/data/countries.json';
import rawPopularMatrix from '@/lib/data/popular_matrix.json';

const countriesList: Country[] = rawCountries as Country[];
const popularMatrix = rawPopularMatrix as Record<string, any>;

function getBaseline(fromCode: string, toCode: string) {
  const pairKey = `${fromCode.toUpperCase()}_${toCode.toUpperCase()}`;
  const match = popularMatrix[pairKey];
  
  if (match) {
    return {
      visa_type: match.visa_type || 'embassy_visa',
      days: match.days,
      label: match.label || 'Visa Required',
      raw: match.raw || ''
    };
  }
  
  return {
    visa_type: 'embassy_visa',
    days: null,
    label: 'Embassy Visa Required',
    raw: 'visa required'
  };
}

function generateDeterministicFallback(
  fromCountry: Country,
  toCountry: Country,
  baseline: ReturnType<typeof getBaseline>,
  lang: 'th' | 'en'
): VisaGuideResponse {
  const isTh = lang === 'th';
  const vtype = baseline.visa_type;

  let stay = isTh ? 'ตามที่สถานทูตกำหนด' : 'As authorized by consular officials';
  let processing = isTh ? '5 - 15 วันทำการ' : '5 - 15 business days';
  let cost = isTh ? 'ขึ้นอยู่กับประเภทวีซ่า' : 'Varies by visa category';
  let summary = '';
  let docs: string[] = [];
  let steps: Array<{ step_number: number; title: string; description: string }> = [];

  const defaultPortal = `https://www.google.com/search?q=${encodeURIComponent(
    `${toCountry.name_en} official embassy visa requirements for ${fromCountry.name_en} citizens`
  )}`;

  if (vtype === 'visa_free') {
    stay = baseline.days ? (isTh ? `สูงสุด ${baseline.days} วัน` : `Up to ${baseline.days} days`) : (isTh ? 'ตามข้อตกลงยกเว้นวีซ่า' : 'Under visa waiver agreement');
    processing = isTh ? 'ได้รับการยกเว้น / ตรวจลงตราที่ด่านฯ' : 'Exempted / Instant clearance at border';
    cost = isTh ? 'ไม่มีค่าธรรมเนียม (ฟรี)' : 'Free of Charge';
    summary = isTh
      ? `ผู้ถือหนังสือเดินทาง${fromCountry.name_th} ได้รับสิทธิ์ยกเว้นการตรวจลงตรา (Visa Free) ในการเดินทางเข้าสู่${toCountry.name_th} เพื่อการท่องเที่ยวหรือธุรกิจระยะสั้น สูงสุด ${baseline.days || 30} วัน`
      : `Holders of ${fromCountry.name_en} passports enjoy visa-free entry to ${toCountry.name_en} for short-term tourism or business purposes.`;
    docs = isTh
      ? [
          'หนังสือเดินทาง (Passport) มีอายุคงเหลือมากกว่า 6 เดือน',
          'บัตรโดยสารเครื่องบินไป-กลับ หรือหลักฐานการเดินทางออกนอกประเทศ',
          'หลักฐานการสำรองที่พักหรือหนังสือเชิญจากเจ้าบ้าน',
          'แบบฟอร์มตรวจคนเข้าเมือง / บัตรขาเข้าอิเล็กทรอนิกส์ (Arrival Card) หากประเทศปลายทางกำหนด'
        ]
      : [
          'Valid passport with at least 6 months validity',
          'Confirmed return or onward flight ticket',
          'Proof of accommodation reservation',
          'Completed digital immigration arrival card if mandated'
        ];
    steps = isTh
      ? [
          { step_number: 1, title: 'ตรวจสอบวันหมดอายุหนังสือเดินทาง', description: 'ตรวจสอบให้แน่ใจว่าพาสปอร์ตมีอายุคงเหลือไม่น้อยกว่า 6 เดือนก่อนวันเดินทาง' },
          { step_number: 2, title: 'เตรียมเอกสารการเดินทางและที่พัก', description: 'พิมพ์หรือบันทึกตั๋วเครื่องบินขากลับและใบจองที่พักในโทรศัพท์มือถือ' },
          { step_number: 3, title: 'ผ่านการตรวจคนเข้าเมือง ณ ด่านฯ', description: 'ยื่นพาสปอร์ตพร้อมเอกสารประกอบต่อเจ้าหน้าที่ด่านตรวจคนเข้าเมืองขาเข้า' }
        ]
      : [
          { step_number: 1, title: 'Check Passport Validity', description: 'Verify passport remains valid for at least 6 months beyond intended stay.' },
          { step_number: 2, title: 'Prepare Travel Documents', description: 'Keep return flight tickets and hotel bookings easily accessible.' },
          { step_number: 3, title: 'Border Clearance', description: 'Present your passport and return proof at destination border control.' }
        ];
  } else if (vtype === 'evisa') {
    stay = baseline.days ? (isTh ? `สูงสุด ${baseline.days} วัน` : `Up to ${baseline.days} days`) : (isTh ? '30 - 90 วัน' : '30 - 90 days');
    processing = isTh ? '1 - 3 วันทำการ (ออนไลน์)' : '1 - 3 business days online';
    cost = isTh ? 'ประมาณ 30 - 80 USD' : 'Approx. 30 - 80 USD';
    summary = isTh
      ? `ผู้เดินทางจาก${fromCountry.name_th} สามารถยื่นคำร้องขอวีซ่าอิเล็กทรอนิกส์ (eVisa หรือ ETA) ล่วงหน้าผ่านพอร์ทัลทางการทางอินเทอร์เน็ตได้โดยไม่ต้องเดินทางไปยังสถานทูต`
      : `Travelers from ${fromCountry.name_en} can apply online for an Electronic Visa (eVisa/ETA) through the government consular portal prior to departure.`;
    docs = isTh
      ? [
          'ไฟล์สแกนหน้าหนังสือเดินทางความละเอียดสูง',
          'รูปถ่ายหน้าตรงพื้นหลังสีขาวขนาดตามระเบียบสากล',
          'บัตรเครดิตหรือเดบิตสำหรับชำระค่าธรรมเนียมออนไลน์',
          'กำหนดการเดินทางและที่พักในประเทศปลายทาง'
        ]
      : [
          'High-resolution biometric passport scan',
          'Recent passport photograph against white backdrop',
          'Credit/Debit card for online application processing fee',
          'Travel itinerary and confirmed accommodation'
        ];
    steps = isTh
      ? [
          { step_number: 1, title: 'เข้าสู่พอร์ทัลทางการ', description: 'เข้าไปที่เว็บไซต์ระบบวีซ่าอิเล็กทรอนิกส์ทางการของรัฐบาลประเทศปลายทาง' },
          { step_number: 2, title: 'กรอกแบบฟอร์มและแนบเอกสาร', description: 'ระบุข้อมูลส่วนบุคคล อัปโหลดรูปถ่าย และหน้าพาสปอร์ต' },
          { step_number: 3, title: 'ชำระค่าธรรมเนียมและรออนุมัติ', description: 'ชำระเงินออนไลน์และพิมพ์เอกสารอนุมัติ eVisa เก็บไว้แสดงคู่กับพาสปอร์ต' }
        ]
      : [
          { step_number: 1, title: 'Access Official Portal', description: 'Visit the official government immigration electronic visa system.' },
          { step_number: 2, title: 'Fill Form & Upload Assets', description: 'Provide travel info, passport scans, and recent biometric photos.' },
          { step_number: 3, title: 'Pay Fee & Receive Approval', description: 'Pay the processing fee and print the electronic approval grant.' }
        ];
  } else {
    // embassy_visa
    summary = isTh
      ? `ผู้ถือหนังสือเดินทาง${fromCountry.name_th} มีความจำเป็นต้องยื่นคำร้องขอรับการตรวจลงตรา (Visa) ผ่านทางสถานเอกอัครราชทูต สถานกงสุล หรือศูนย์รับคำร้องวีซ่าอย่างเป็นทางการ (VFS/TLS) ก่อนการเดินทาง`
      : `Citizens of ${fromCountry.name_en} require an advance consular visa approved through the embassy or official visa application center before boarding.`;
    docs = isTh
      ? [
          'หนังสือเดินทางฉบับจริง มีอายุเหลือมากกว่า 6 เดือน พร้อมสำเนา',
          'แบบฟอร์มคำร้องขอวีซ่าที่กรอกข้อมูลครบถ้วนและลงนาม',
          'รูปถ่ายสีขนาดตามระเบียบของสถานทูต (ไม่เกิน 6 เดือน)',
          'หลักฐานทางการเงิน (รายการเดินบัญชีธนาคารย้อนหลัง 3 - 6 เดือน)',
          'หนังสือรับรองการทำงาน หรือหนังสือรับรองการจดทะเบียนบริษัท',
          'หลักฐานการจองบัตรโดยสารเครื่องบินและที่พัก'
        ]
      : [
          'Original passport with at least 6 months validity',
          'Completed and signed official visa application form',
          'Standard biometric passport photographs taken within 6 months',
          'Financial proof (Bank statements for the last 3-6 months)',
          'Employment confirmation letter or business registration',
          'Flight itinerary and accommodation reservation'
        ];
    steps = isTh
      ? [
          { step_number: 1, title: 'จัดเตรียมเอกสารตามข้อกำหนด', description: 'รวบรวมเอกสารประจำตัว เอกสารการเงิน และหลักฐานการทำงานให้ครบถ้วน' },
          { step_number: 2, title: 'นัดหมายคิวล่วงหน้า', description: 'จองคิวยื่นเอกสารผ่านเว็บไซต์ของสถานทูตหรือศูนย์รับคำร้อง (VFS / TLScontact)' },
          { step_number: 3, title: 'ยื่นเอกสารและเก็บข้อมูลชีวมิติ', description: 'เดินทางไปยื่นเอกสาร สแกนลายนิ้วมือ ถ่ายรูป และชำระค่าธรรมเนียม' },
          { step_number: 4, title: 'รอผลพิจารณาและรับเล่มคืน', description: 'ติดตามสถานะคำร้องและเดินทางไปรับเล่มหนังสือเดินทางคืนเมื่อได้รับแจ้ง' }
        ]
      : [
          { step_number: 1, title: 'Assemble Document Dossier', description: 'Collect certified financial statements, employment letters, and bookings.' },
          { step_number: 2, title: 'Book Biometrics Appointment', description: 'Schedule your appointment with the official embassy or visa center.' },
          { step_number: 3, title: 'Submit Dossier & Biometrics', description: 'Attend appointment in person for document verification and fingerprinting.' },
          { step_number: 4, title: 'Passport Return Collection', description: 'Collect passport once visa stamping processing is completed.' }
        ];
  }

  return {
    visa_type: vtype,
    stay_duration: stay,
    processing_time: processing,
    estimated_cost: cost,
    official_portal_url: defaultPortal,
    summary,
    required_documents: docs,
    steps,
    cached: false,
    from_country: fromCountry.code,
    to_country: toCountry.code,
    lang: lang === 'en' ? 'en' : 'th'
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { from_country, to_country, lang = 'th' } = body || {};

    if (!from_country || !to_country || typeof from_country !== 'string' || typeof to_country !== 'string') {
      return NextResponse.json(
        { error: 'Invalid parameters: from_country and to_country are required' },
        { status: 400 }
      );
    }

    const fromCode = from_country.trim().toUpperCase();
    const toCode = to_country.trim().toUpperCase();

    // Security regex: ISO 3166-1 alpha-2 format only
    if (!/^[A-Z]{2}$/.test(fromCode) || !/^[A-Z]{2}$/.test(toCode)) {
      return NextResponse.json(
        { error: 'Invalid country code format. Must be 2 uppercase ISO letters.' },
        { status: 400 }
      );
    }

    const fromCountry = countriesList.find((c) => c.code === fromCode) || {
      code: fromCode,
      name_en: fromCode,
      name_th: fromCode,
      flag: ''
    };
    const toCountry = countriesList.find((c) => c.code === toCode) || {
      code: toCode,
      name_en: toCode,
      name_th: toCode,
      flag: ''
    };

    const baseline = getBaseline(fromCode, toCode);
    const apiKey = process.env.GEMINI_API_KEY || '';

    // If Gemini key is available on the server environment, synthesize via Gemini Flash
    if (apiKey) {
      try {
        const langInstruction = lang === 'th' ? 'Respond entirely in Thai language (ภาษาไทย).' : 'Respond entirely in English.';
        const prompt = `Analyze the visa requirements for a traveler from ${fromCountry.name_en} (${fromCountry.code}) traveling to ${toCountry.name_en} (${toCountry.code}) for general short-term tourism or business.

Baseline Verified Index Data:
- Baseline status: ${baseline.label}
- Visa type hint: ${baseline.visa_type}
- Allowed days hint: ${baseline.days || 'N/A'}

Language Rule: ${langInstruction}

Return a STRICT JSON object with these EXACT keys:
{
  "visa_type": "visa_free" | "visa_on_arrival" | "evisa" | "embassy_visa",
  "stay_duration": "string (e.g. 15 วัน / Up to 15 days)",
  "processing_time": "string (e.g. อนุมัติทันที / 3-5 วันทำการ)",
  "estimated_cost": "string (e.g. ฟรี / ประมาณ 1,200 บาท / USD 35 / N/A)",
  "official_portal_url": "string (Valid official government or embassy consular portal URL)",
  "summary": "string (Concise official consular advice)",
  "required_documents": [
    "string (Document 1)",
    "string (Document 2)"
  ],
  "steps": [
    {"step_number": 1, "title": "string", "description": "string"},
    {"step_number": 2, "title": "string", "description": "string"}
  ]
}

Ensure all values are practical, realistic, and match official consular regulations.`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.2
              }
            }),
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (geminiRes.ok) {
          const json = await geminiRes.json();
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            const validTypes = new Set(['visa_free', 'visa_on_arrival', 'evisa', 'embassy_visa']);
            const vtype = validTypes.has(parsed.visa_type) ? parsed.visa_type : (baseline.visa_type || 'embassy_visa');

            const result: VisaGuideResponse = {
              visa_type: vtype,
              stay_duration: parsed.stay_duration || (baseline.days ? `${baseline.days} วัน` : 'ตามระเบียบกงสุล'),
              processing_time: parsed.processing_time || '3-5 วันทำการ',
              estimated_cost: parsed.estimated_cost || 'ตามระเบียบสถานทูต',
              official_portal_url: parsed.official_portal_url || `https://www.google.com/search?q=${encodeURIComponent(`${toCountry.name_en}+official+visa+portal`)}`,
              summary: parsed.summary || '',
              required_documents: Array.isArray(parsed.required_documents) && parsed.required_documents.length > 0
                ? parsed.required_documents
                : ['หนังสือเดินทาง (อายุเหลือมากกว่า 6 เดือน)'],
              steps: Array.isArray(parsed.steps) ? parsed.steps : [],
              cached: false,
              from_country: fromCode,
              to_country: toCode,
              lang: lang === 'en' ? 'en' : 'th'
            };

            return NextResponse.json(result, {
              headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
              }
            });
          }
        }
      } catch (geminiError) {
        console.warn('[API Serverless] Gemini synthesis error, utilizing verified baseline fallback:', geminiError);
      }
    }

    // Fallback if Gemini key not set or timed out
    const fallback = generateDeterministicFallback(fromCountry, toCountry, baseline, lang === 'en' ? 'en' : 'th');
    return NextResponse.json(fallback, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('[API Serverless] Internal error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing visa guide request' },
      { status: 500 }
    );
  }
}
