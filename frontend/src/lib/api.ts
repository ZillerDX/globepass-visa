import { Country, VisaGuideResponse, QuickVisaInfo, MatrixEntry, VisaType } from '@/types/visa';
import rawCountries from './data/countries.json';
import rawPopularMatrix from './data/popular_matrix.json';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const countriesList: Country[] = rawCountries as Country[];
const popularMatrix = rawPopularMatrix as Record<string, MatrixEntry>;

export function getCountries(): Country[] {
  return countriesList;
}

export function getQuickBaseline(fromCode: string, toCode: string): QuickVisaInfo {
  const pairKey = `${fromCode.toUpperCase()}_${toCode.toUpperCase()}`;
  const match = popularMatrix[pairKey];
  
  if (match) {
    return {
      from_country: fromCode.toUpperCase(),
      to_country: toCode.toUpperCase(),
      visa_type: match.visa_type || 'embassy_visa',
      days: match.days,
      label: match.label || 'Visa Required',
      raw: match.raw || ''
    };
  }
  
  return {
    from_country: fromCode.toUpperCase(),
    to_country: toCode.toUpperCase(),
    visa_type: 'embassy_visa',
    days: null,
    label: 'Embassy Visa Required',
    raw: 'visa required'
  };
}

export async function fetchQuickBaseline(fromCode: string, toCode: string): Promise<QuickVisaInfo> {
  const local = getQuickBaseline(fromCode, toCode);
  if (local.label !== 'Embassy Visa Required' || local.visa_type !== 'embassy_visa') {
    return local;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const targetUrl = BACKEND_URL
      ? `${BACKEND_URL}/api/visa/quick?from_country=${fromCode}&to_country=${toCode}`
      : `/api/visa/quick?from_country=${fromCode}&to_country=${toCode}`;
    const res = await fetch(targetUrl, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback to local
  }

  return local;
}

export async function fetchVisaGuide(
  fromCode: string,
  toCode: string,
  lang: 'th' | 'en' = 'th',
  forceRefresh: boolean = false
): Promise<{ data: VisaGuideResponse; source: 'backend' | 'offline_baseline' }> {
  // 1. Try Serverless Route Handler or Backend with 9s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);
    const targetUrl = BACKEND_URL ? `${BACKEND_URL}/api/visa/ai-guide` : '/api/visa/ai-guide';

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_country: fromCode,
        to_country: toCode,
        lang,
        force_refresh: forceRefresh
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { data, source: 'backend' };
    }
  } catch (err) {
    console.warn('[API Client] Backend not reachable, checking client fallback:', err);
  }

  // 2. Complete Offline Baseline Fallback (if server route or network unreachable)
  const baseline = getQuickBaseline(fromCode, toCode);
  const toCountry = countriesList.find(c => c.code === toCode.toUpperCase());
  const fromCountry = countriesList.find(c => c.code === fromCode.toUpperCase());
  const isThai = lang === 'th';

  return {
    data: {
      visa_type: (baseline.visa_type as VisaType) || 'embassy_visa',
      stay_duration: baseline.days ? (isThai ? `สูงสุด ${baseline.days} วัน` : `Up to ${baseline.days} days`) : (isThai ? 'ตามที่กำหนดในวีซ่า' : 'As determined on visa'),
      processing_time: baseline.visa_type === 'visa_free' ? (isThai ? 'อนุมัติทันที ณ ด่านตรวจ' : 'Immediate upon entry') : (isThai ? '3 to 7 วันทำการ' : '3 to 7 business days'),
      estimated_cost: baseline.visa_type === 'visa_free' ? (isThai ? 'ฟรี (ไม่มีค่าธรรมเนียม)' : 'Free') : (isThai ? 'ประมาณ 1,500 ถึง 3,500 บาท' : 'Approx. USD 35 to 100'),
      official_portal_url: `https://www.google.com/search?q=${toCountry?.name_en || toCode}+embassy+visa+official+website`,
      summary: isThai
        ? `ข้อมูลจากฐานข้อมูลสำหรับผู้ถือหนังสือเดินทาง ${fromCountry?.name_th || fromCode} ไปยัง ${toCountry?.name_th || toCode}: สถานะอยู่ในเกณฑ์ ${baseline.label}`
        : `Baseline immigration policy for ${fromCountry?.name_en || fromCode} passport traveling to ${toCountry?.name_en || toCode}: Current requirement is ${baseline.label}.`,
      required_documents: isThai
        ? [
            'หนังสือเดินทางที่มีอายุการใช้งานเหลือไม่น้อยกว่า 6 เดือน',
            'ตั๋วเครื่องบินไปกลับหรือตั๋วเดินทางต่อไปยังประเทศที่สาม',
            'หลักฐานการสำรองที่พักหรือจดหมายเชิญจากผู้พำนัก',
            'หลักฐานแสดงความพร้อมทางการเงินสำหรับการพำนัก'
          ]
        : [
            'Passport with at least 6 months validity beyond intended stay',
            'Confirmed onward or return flight ticket',
            'Accommodation reservation or host sponsorship documentation',
            'Sufficient funds demonstration for the duration of stay'
          ],
      steps: isThai
        ? [
            {
              step_number: 1,
              title: 'ตรวจสอบข้อกำหนดและเตรียมเอกสาร',
              description: 'จัดเตรียมหนังสือเดินทางและหลักฐานการเดินทางให้ครบถ้วนก่อนการเดินทาง'
            },
            {
              step_number: 2,
              title: 'ยื่นคำร้องผ่านช่องทางทางการ',
              description: 'ดำเนินการยื่นคำร้องต่อสถานทูตหรือระบบลงทะเบียนทางการตามข้อกำหนดของประเทศปลายทาง'
            },
            {
              step_number: 3,
              title: 'เดินทางและแสดงเอกสาร ณ ด่านตรวจคนเข้าเมือง',
              description: 'แสดงเอกสารยืนยันและรับการตรวจลงตรา ณ ด่านคนเข้าเมืองเพื่อผ่านเข้าประเทศ'
            }
          ]
        : [
            {
              step_number: 1,
              title: 'Verify Eligibility and Gather Credentials',
              description: 'Compile valid passport and travel documents required for destination admission.'
            },
            {
              step_number: 2,
              title: 'Submit Application via Official Channels',
              description: 'File petition with embassy, consulate, or official national portal as required.'
            },
            {
              step_number: 3,
              title: 'Present Clearance at Port of Entry',
              description: 'Present visa credentials and onward documentation to immigration border officers.'
            }
          ],
      cached: true,
      from_country: fromCode.toUpperCase(),
      to_country: toCode.toUpperCase(),
      lang
    },
    source: 'offline_baseline'
  };
}
