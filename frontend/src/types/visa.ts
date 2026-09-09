export type VisaType = 'visa_free' | 'visa_on_arrival' | 'evisa' | 'embassy_visa' | 'domestic' | 'no_admission';

export interface StepItem {
  step_number: number;
  title: string;
  description: string;
}

export interface VisaGuideResponse {
  visa_type: VisaType;
  stay_duration: string;
  processing_time: string;
  estimated_cost: string;
  official_portal_url: string;
  summary: string;
  required_documents: string[];
  steps: StepItem[];
  cached?: boolean;
  from_country: string;
  to_country: string;
  lang: 'th' | 'en';
}

export interface Country {
  code: string;
  name_en: string;
  name_th: string;
  flag?: string;
}

export interface QuickVisaInfo {
  from_country: string;
  to_country: string;
  visa_type: string;
  days?: number | null;
  label: string;
  raw?: string;
}
