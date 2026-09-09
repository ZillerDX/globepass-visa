from pydantic import BaseModel, Field
from typing import List, Optional

class StepItem(BaseModel):
    step_number: int = Field(..., description="Order of the step")
    title: str = Field(..., description="Step title")
    description: str = Field(..., description="Detailed instructions for this step")

class VisaGuideRequest(BaseModel):
    from_country: str = Field(..., min_length=2, max_length=4, description="Origin passport country code, e.g. TH")
    to_country: str = Field(..., min_length=2, max_length=4, description="Destination country code, e.g. JP")
    lang: str = Field("th", description="Response language: 'th' or 'en'")
    force_refresh: bool = Field(False, description="Bypass cache if true")

class VisaGuideResponse(BaseModel):
    visa_type: str = Field(..., description="visa_free | visa_on_arrival | evisa | embassy_visa")
    stay_duration: str = Field(..., description="Allowed duration of stay, e.g. 15 days, 30 days")
    processing_time: str = Field(..., description="Standard processing time or N/A")
    estimated_cost: str = Field(..., description="Estimated cost or Free")
    official_portal_url: str = Field(..., description="Verified official government/embassy visa portal URL")
    summary: str = Field(..., description="Overview summary of visa rules")
    required_documents: List[str] = Field(..., description="List of required documents")
    steps: List[StepItem] = Field(..., description="Step-by-step application instructions")
    
    # Context metadata
    cached: bool = False
    from_country: str
    to_country: str
    lang: str

class VisaQuickResponse(BaseModel):
    from_country: str
    to_country: str
    visa_type: str
    days: Optional[int] = None
    label: str
    raw: str

class CountryItem(BaseModel):
    code: str
    name_en: str
    name_th: str
    flag: Optional[str] = None

    class Config:
        from_attributes = True

class CacheStats(BaseModel):
    cached_queries_count: int
    countries_count: int
