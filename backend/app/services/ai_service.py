import json
import re
import urllib.request
import urllib.error
from typing import Dict, Any, Optional
from app.config import settings
from app.services.passport_data import passport_service

class AIService:
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.groq_key = settings.GROQ_API_KEY

    def synthesize_visa_guide(self, from_code: str, to_code: str, lang: str = "th") -> Dict[str, Any]:
        """
        Synthesizes a comprehensive visa guide for from_code -> to_code.
        Attempts Gemini first, then Groq, then local deterministic generator.
        """
        from_country = passport_service.get_country(from_code) or {"name_en": from_code, "name_th": from_code}
        to_country = passport_service.get_country(to_code) or {"name_en": to_code, "name_th": to_code}
        baseline = passport_service.get_quick_requirement(from_code, to_code) or {}

        # 1. Try Gemini
        try:
            result = self._call_gemini(from_country, to_country, baseline, lang)
            if result:
                return self._sanitize_result(result, from_code, to_code, lang)
        except Exception as e:
            print(f"[AIService] Gemini error: {e}")

        # 2. Try Groq
        try:
            result = self._call_groq(from_country, to_country, baseline, lang)
            if result:
                return self._sanitize_result(result, from_code, to_code, lang)
        except Exception as e:
            print(f"[AIService] Groq error: {e}")

        # 3. Local Deterministic Fallback
        return self._generate_fallback(from_country, to_country, baseline, lang)

    def _call_gemini(self, from_country: dict, to_country: dict, baseline: dict, lang: str) -> Optional[dict]:
        prompt = self._build_prompt(from_country, to_country, baseline, lang)
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.gemini_key}"
        
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.2
            }
        }
        
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json"}
        )
        
        with urllib.request.urlopen(req, timeout=20) as resp:
            resp_data = json.loads(resp.read().decode("utf-8"))
            candidates = resp_data.get("candidates", [])
            if not candidates:
                return None
            parts = candidates[0].get("content", {}).get("parts", [])
            if not parts:
                return None
            content_text = parts[0].get("text", "")
            return self._parse_json(content_text)

    def _call_groq(self, from_country: dict, to_country: dict, baseline: dict, lang: str) -> Optional[dict]:
        prompt = self._build_prompt(from_country, to_country, baseline, lang)
        url = "https://api.groq.com/openai/v1/chat/completions"
        
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": "You are a professional consular visa advisor. Output strictly valid JSON."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2
        }
        
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Authorization": f"Bearer {self.groq_key}",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0"
            }
        )
        
        with urllib.request.urlopen(req, timeout=15) as resp:
            resp_data = json.loads(resp.read().decode("utf-8"))
            choices = resp_data.get("choices", [])
            if not choices:
                return None
            content_text = choices[0].get("message", {}).get("content", "")
            return self._parse_json(content_text)

    def _build_prompt(self, from_country: dict, to_country: dict, baseline: dict, lang: str) -> str:
        lang_instruction = "Respond entirely in Thai language (ภาษาไทย)." if lang == "th" else "Respond entirely in English."
        base_status = baseline.get("label", "Unknown")
        base_days = baseline.get("days")
        base_type = baseline.get("visa_type", "embassy_visa")

        return f"""
Analyze the visa requirements for a traveler from {from_country.get('name_en')} ({from_country.get('code')}) traveling to {to_country.get('name_en')} ({to_country.get('code')}) for general short-term tourism or business.

Baseline Verified Index Data:
- Baseline status: {base_status}
- Visa type hint: {base_type}
- Allowed days hint: {base_days if base_days else 'N/A'}

Language Rule: {lang_instruction}

Return a STRICT JSON object with these EXACT keys:
{{
  "visa_type": "visa_free" | "visa_on_arrival" | "evisa" | "embassy_visa",
  "stay_duration": "string (e.g. 15 วัน / Up to 15 days, 30 วัน, etc.)",
  "processing_time": "string (e.g. อนุมัติทันที / 3-5 วันทำการ / 2-3 สัปดาห์)",
  "estimated_cost": "string (e.g. ฟรี / ประมาณ 1,200 บาท / USD 35 / N/A)",
  "official_portal_url": "string (Valid official government or embassy portal URL)",
  "summary": "string (Concise summary of rules, conditions, and entry requirements)",
  "required_documents": [
    "string (Document 1)",
    "string (Document 2)"
  ],
  "steps": [
    {{"step_number": 1, "title": "string", "description": "string"}},
    {{"step_number": 2, "title": "string", "description": "string"}}
  ]
}}

Ensure all values are practical, realistic, and match official consular regulations.
"""

    def _parse_json(self, text: str) -> Optional[dict]:
        text = text.strip()
        # Strip markdown code blocks if wrapped
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        return json.loads(text)

    def _sanitize_result(self, data: dict, from_code: str, to_code: str, lang: str) -> dict:
        # Validate and enforce valid visa_type
        valid_types = {"visa_free", "visa_on_arrival", "evisa", "embassy_visa"}
        vtype = data.get("visa_type", "embassy_visa").lower().replace(" ", "_")
        if vtype not in valid_types:
            vtype = "embassy_visa"

        # Ensure required_documents is a list of strings
        docs = data.get("required_documents")
        if not isinstance(docs, list):
            docs = [str(docs)] if docs else ["Valid Passport (at least 6 months validity)"]

        # Ensure steps is formatted correctly
        raw_steps = data.get("steps", [])
        clean_steps = []
        if isinstance(raw_steps, list):
            for i, step in enumerate(raw_steps, 1):
                if isinstance(step, dict):
                    clean_steps.append({
                        "step_number": int(step.get("step_number", i)),
                        "title": str(step.get("title", f"Step {i}")),
                        "description": str(step.get("description", ""))
                    })
                elif isinstance(step, str):
                    clean_steps.append({
                        "step_number": i,
                        "title": f"Step {i}",
                        "description": step
                    })
        if not clean_steps:
            clean_steps = [
                {"step_number": 1, "title": "Check Validity", "description": "Ensure passport is valid for at least 6 months."},
                {"step_number": 2, "title": "Prepare Documents", "description": "Prepare return ticket and proof of funds."},
                {"step_number": 3, "title": "Entry / Submission", "description": "Present documents to immigration upon arrival."}
            ]

        return {
            "visa_type": vtype,
            "stay_duration": str(data.get("stay_duration", "N/A")),
            "processing_time": str(data.get("processing_time", "N/A")),
            "estimated_cost": str(data.get("estimated_cost", "N/A")),
            "official_portal_url": str(data.get("official_portal_url", "https://www.google.com")),
            "summary": str(data.get("summary", "")),
            "required_documents": [str(d) for d in docs],
            "steps": clean_steps,
            "cached": False,
            "from_country": from_code.upper(),
            "to_country": to_code.upper(),
            "lang": lang
        }

    def _generate_fallback(self, from_country: dict, to_country: dict, baseline: dict, lang: str) -> dict:
        """Deterministic offline fallback if AI APIs cannot be reached."""
        vtype = baseline.get("visa_type", "embassy_visa")
        days = baseline.get("days")
        to_name = to_country.get("name_th" if lang == "th" else "name_en")
        from_name = from_country.get("name_th" if lang == "th" else "name_en")

        if lang == "th":
            duration = f"สูงสุด {days} วัน" if days else "ตามที่กำหนดในวีซ่า"
            processing = "อนุมัติทันที ณ ด่านตรวจ" if vtype in ["visa_free", "visa_on_arrival"] else "3 - 7 วันทำการ"
            cost = "ฟรี (ไม่มีค่าธรรมเนียม)" if vtype == "visa_free" else "ประมาณ 1,500 - 3,500 บาท"
            summary = f"ข้อกำหนดเบื้องต้นสำหรับผู้ถือหนังสือเดินทาง {from_name} ที่เดินทางไปยัง {to_name}: อยู่ในเกณฑ์ {baseline.get('label', 'ต้องใช้วีซ่า')} โปรดเตรียมเอกสารการเดินทางให้ครบถ้วน"
            docs = [
                "หนังสือเดินทางที่มีอายุการใช้งานเหลือไม่น้อยกว่า 6 เดือน",
                "ตั๋วเครื่องบินไป-กลับหรือตั๋วเดินทางต่อไปยังประเทศที่สาม",
                "หลักฐานการจองที่พักตลอดการพำนัก",
                "หลักฐานทางการเงินที่ครอบคลุมค่าใช้จ่ายระหว่างเดินทาง"
            ]
            steps = [
                {"step_number": 1, "title": "ตรวจสอบอายุพาสปอร์ต", "description": "ตรวจสอบว่าหนังสือเดินทางมีอายุเหลืออย่างน้อย 6 เดือนก่อนวันออกเดินทาง"},
                {"step_number": 2, "title": "เตรียมเอกสารสำคัญ", "description": "เตรียมตั๋วเครื่องบิน แผนการเดินทาง และหลักฐานการเงิน"},
                {"step_number": 3, "title": "ยื่นขอหรือแสดงเอกสาร", "description": "ยื่นคำร้องผ่านระบบทางการ หรือแสดงเอกสารต่อเจ้าหน้าที่ด่านตรวจคนเข้าเมืองเมื่อเดินทางถึง"}
            ]
        else:
            duration = f"Up to {days} days" if days else "As granted on visa"
            processing = "Immediate upon arrival" if vtype in ["visa_free", "visa_on_arrival"] else "3 - 7 business days"
            cost = "Free (No visa fee)" if vtype == "visa_free" else "Approx. USD 35 - 100"
            summary = f"Standard entry regulation for {from_name} passport holders traveling to {to_name}: Status is {baseline.get('label', 'Visa Required')}. Ensure all mandatory travel documentation is in order."
            docs = [
                "Valid passport with at least 6 months validity remaining",
                "Confirmed round-trip or onward travel ticket",
                "Proof of confirmed accommodation",
                "Proof of sufficient financial means for the duration of stay"
            ]
            steps = [
                {"step_number": 1, "title": "Verify Passport Validity", "description": "Ensure your passport has at least 6 months validity from departure date."},
                {"step_number": 2, "title": "Prepare Travel Credentials", "description": "Gather confirmed flight tickets, hotel reservations, and financial proof."},
                {"step_number": 3, "title": "Border Inspection / Submission", "description": "Present your documents to immigration control upon arrival or submit online."}
            ]

        return {
            "visa_type": vtype,
            "stay_duration": duration,
            "processing_time": processing,
            "estimated_cost": cost,
            "official_portal_url": f"https://www.google.com/search?q={to_country.get('name_en')}+official+visa+portal",
            "summary": summary,
            "required_documents": docs,
            "steps": steps,
            "cached": False,
            "from_country": from_country.get("code", "").upper(),
            "to_country": to_country.get("code", "").upper(),
            "lang": lang
        }

ai_service = AIService()
