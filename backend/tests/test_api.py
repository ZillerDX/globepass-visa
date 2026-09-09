import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models import VisaCache, Country

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "GlobePass" in data["service"]

def test_list_countries():
    response = client.get("/api/countries")
    assert response.status_code == 200
    countries = response.json()
    assert len(countries) >= 190
    # Check Thailand exists
    th = next((c for c in countries if c["code"] == "TH"), None)
    assert th is not None
    assert th["name_en"] == "Thailand"
    assert th["name_th"] == "ไทย"

def test_quick_visa_check():
    # TH -> JP (Visa free 15 days)
    resp = client.get("/api/visa/quick?from_country=TH&to_country=JP")
    assert resp.status_code == 200
    data = resp.json()
    assert data["visa_type"] == "visa_free"
    assert data["days"] == 15

    # TH -> SG (Visa free 30 days)
    resp2 = client.get("/api/visa/quick?from_country=TH&to_country=SG")
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["visa_type"] == "visa_free"
    assert data2["days"] == 30

def test_ai_guide_and_cache():
    payload = {
        "from_country": "TH",
        "to_country": "JP",
        "lang": "th",
        "force_refresh": True
    }
    resp = client.post("/api/visa/ai-guide", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    
    # Assert strict schema compliance
    assert data["visa_type"] in ["visa_free", "visa_on_arrival", "evisa", "embassy_visa"]
    assert "stay_duration" in data and len(data["stay_duration"]) > 0
    assert "processing_time" in data and len(data["processing_time"]) > 0
    assert "estimated_cost" in data and len(data["estimated_cost"]) > 0
    assert "official_portal_url" in data and len(data["official_portal_url"]) > 0
    assert "summary" in data and len(data["summary"]) > 0
    assert isinstance(data["required_documents"], list) and len(data["required_documents"]) > 0
    assert isinstance(data["steps"], list) and len(data["steps"]) > 0
    assert "step_number" in data["steps"][0]
    assert "title" in data["steps"][0]
    assert "description" in data["steps"][0]

    # Second call without force_refresh MUST return cached: True!
    payload["force_refresh"] = False
    resp_cached = client.post("/api/visa/ai-guide", json=payload)
    assert resp_cached.status_code == 200
    data_cached = resp_cached.json()
    assert data_cached["cached"] is True
    assert data_cached["visa_type"] == data["visa_type"]

def test_firebase_export():
    resp = client.post("/api/firebase/export")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["metadata"]["total_countries"] >= 190
