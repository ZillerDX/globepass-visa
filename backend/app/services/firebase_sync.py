import json
import os
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import VisaCache, Country
from app.services.passport_data import passport_service

class FirebaseSyncService:
    @staticmethod
    def export_firestore_bundle(db: Session) -> Dict[str, Any]:
        """
        Exports all database countries and cached visa guides into a standard
        Firestore document format ready for batch import or static GitHub Pages consumption.
        """
        # 1. Countries collection
        countries = passport_service.get_all_countries()
        countries_docs = {}
        for c in countries:
            countries_docs[c["code"]] = {
                "code": c["code"],
                "name_en": c["name_en"],
                "name_th": c["name_th"],
                "flag": c.get("flag", "")
            }

        # 2. Visa cache collection
        cached_records = db.query(VisaCache).all()
        visa_docs = {}
        for r in cached_records:
            doc_id = f"{r.from_country}_{r.to_country}_{r.lang}"
            visa_docs[doc_id] = {
                "from_country": r.from_country,
                "to_country": r.to_country,
                "lang": r.lang,
                "visa_type": r.visa_type,
                "stay_duration": r.stay_duration,
                "processing_time": r.processing_time,
                "estimated_cost": r.estimated_cost,
                "official_portal_url": r.official_portal_url,
                "summary": r.summary,
                "required_documents": json.loads(r.required_documents_json),
                "steps": json.loads(r.steps_json),
                "updated_at": r.updated_at.isoformat() if r.updated_at else None
            }

        bundle = {
            "metadata": {
                "version": "1.0",
                "total_countries": len(countries_docs),
                "total_cached_guides": len(visa_docs),
                "target_collections": ["countries", "visa_guides"]
            },
            "collections": {
                "countries": countries_docs,
                "visa_guides": visa_docs
            }
        }

        # Save to local file for GitHub Pages or Firebase CLI import
        export_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "seed", "firebase_export.json")
        with open(export_path, "w", encoding="utf-8") as f:
            json.dump(bundle, f, ensure_ascii=False, indent=2)

        return bundle

firebase_sync_service = FirebaseSyncService()
