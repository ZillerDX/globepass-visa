import json
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base, get_db
from app.models import Country, VisaCache
from app.schemas import (
    VisaGuideRequest,
    VisaGuideResponse,
    VisaQuickResponse,
    CountryItem,
    CacheStats
)
from app.services.passport_data import passport_service
from app.services.ai_service import ai_service
from app.services.firebase_sync import firebase_sync_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables & seed countries if table empty
    Base.metadata.create_all(bind=engine)
    
    # Check if countries seeded
    db = next(get_db())
    try:
        count = db.query(Country).count()
        if count == 0:
            countries_data = passport_service.get_all_countries()
            for item in countries_data:
                country = Country(
                    code=item["code"],
                    name_en=item["name_en"],
                    name_th=item["name_th"],
                    flag=item.get("flag", "")
                )
                db.add(country)
            db.commit()
            print(f"[Lifespan] Seeded {len(countries_data)} countries into database.")
    except Exception as e:
        print(f"[Lifespan] Seeding check notice: {e}")
    finally:
        db.close()
        
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

@app.get("/api/countries", response_model=list[CountryItem])
def list_countries(db: Session = Depends(get_db)):
    """Returns all supported countries with ISO-2 codes and localized names."""
    # Read from passport data service (fast memory) or DB
    return passport_service.get_all_countries()

@app.get("/api/visa/quick", response_model=VisaQuickResponse)
def get_quick_visa(
    from_country: str = Query(..., min_length=2, max_length=4),
    to_country: str = Query(..., min_length=2, max_length=4)
):
    """Returns instant baseline requirement from Passport Index dataset."""
    req = passport_service.get_quick_requirement(from_country, to_country)
    if not req:
        raise HTTPException(status_code=404, detail="Country pair not found")
    return req

@app.post("/api/visa/ai-guide", response_model=VisaGuideResponse)
def get_or_generate_ai_guide(
    request: VisaGuideRequest,
    db: Session = Depends(get_db)
):
    """
    Returns cached visa guide if available; otherwise synthesizes via AI,
    caches to database, and returns the response.
    """
    from_c = request.from_country.upper()
    to_c = request.to_country.upper()
    lang = request.lang.lower()
    if lang not in ["th", "en"]:
        lang = "th"

    # 1. Check DB cache unless force_refresh is True
    if not request.force_refresh:
        cached_entry = db.query(VisaCache).filter(
            VisaCache.from_country == from_c,
            VisaCache.to_country == to_c,
            VisaCache.lang == lang
        ).first()

        if cached_entry:
            return VisaGuideResponse(
                visa_type=cached_entry.visa_type,
                stay_duration=cached_entry.stay_duration,
                processing_time=cached_entry.processing_time,
                estimated_cost=cached_entry.estimated_cost,
                official_portal_url=cached_entry.official_portal_url,
                summary=cached_entry.summary,
                required_documents=json.loads(cached_entry.required_documents_json),
                steps=json.loads(cached_entry.steps_json),
                cached=True,
                from_country=from_c,
                to_country=to_c,
                lang=lang
            )

    # 2. Synthesize with AI
    ai_result = ai_service.synthesize_visa_guide(from_c, to_c, lang)

    # 3. Store in DB cache (upsert)
    existing = db.query(VisaCache).filter(
        VisaCache.from_country == from_c,
        VisaCache.to_country == to_c,
        VisaCache.lang == lang
    ).first()

    if existing:
        existing.visa_type = ai_result["visa_type"]
        existing.stay_duration = ai_result["stay_duration"]
        existing.processing_time = ai_result["processing_time"]
        existing.estimated_cost = ai_result["estimated_cost"]
        existing.official_portal_url = ai_result["official_portal_url"]
        existing.summary = ai_result["summary"]
        existing.required_documents_json = json.dumps(ai_result["required_documents"], ensure_ascii=False)
        existing.steps_json = json.dumps(ai_result["steps"], ensure_ascii=False)
    else:
        new_entry = VisaCache(
            from_country=from_c,
            to_country=to_c,
            lang=lang,
            visa_type=ai_result["visa_type"],
            stay_duration=ai_result["stay_duration"],
            processing_time=ai_result["processing_time"],
            estimated_cost=ai_result["estimated_cost"],
            official_portal_url=ai_result["official_portal_url"],
            summary=ai_result["summary"],
            required_documents_json=json.dumps(ai_result["required_documents"], ensure_ascii=False),
            steps_json=json.dumps(ai_result["steps"], ensure_ascii=False)
        )
        db.add(new_entry)

    db.commit()

    return VisaGuideResponse(
        visa_type=ai_result["visa_type"],
        stay_duration=ai_result["stay_duration"],
        processing_time=ai_result["processing_time"],
        estimated_cost=ai_result["estimated_cost"],
        official_portal_url=ai_result["official_portal_url"],
        summary=ai_result["summary"],
        required_documents=ai_result["required_documents"],
        steps=ai_result["steps"],
        cached=False,
        from_country=from_c,
        to_country=to_c,
        lang=lang
    )

@app.get("/api/cache/stats", response_model=CacheStats)
def get_cache_stats(db: Session = Depends(get_db)):
    cached_count = db.query(VisaCache).count()
    countries_count = len(passport_service.get_all_countries())
    return CacheStats(
        cached_queries_count=cached_count,
        countries_count=countries_count
    )

@app.post("/api/firebase/export")
def export_to_firebase(db: Session = Depends(get_db)):
    """Export current cached guides & countries into Firestore format."""
    bundle = firebase_sync_service.export_firestore_bundle(db)
    return {
        "status": "success",
        "message": "Exported to firebase_export.json successfully",
        "metadata": bundle["metadata"]
    }
