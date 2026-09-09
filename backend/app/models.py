from sqlalchemy import Column, Integer, String, Text, DateTime, UniqueConstraint, Boolean
from datetime import datetime
from app.database import Base

class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(4), unique=True, index=True, nullable=False) # e.g. TH, JP, US
    name_en = Column(String(100), nullable=False)
    name_th = Column(String(100), nullable=False)
    flag = Column(String(10), nullable=True)

class VisaCache(Base):
    __tablename__ = "visa_cache"

    id = Column(Integer, primary_key=True, index=True)
    from_country = Column(String(4), index=True, nullable=False)
    to_country = Column(String(4), index=True, nullable=False)
    lang = Column(String(5), default="en", nullable=False) # 'en' or 'th'
    
    visa_type = Column(String(50), nullable=False)
    stay_duration = Column(String(100), nullable=False)
    processing_time = Column(String(100), nullable=False)
    estimated_cost = Column(String(100), nullable=False)
    official_portal_url = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    
    # Store JSON strings for lists/objects
    required_documents_json = Column(Text, nullable=False) # list of str
    steps_json = Column(Text, nullable=False) # list of {step_number, title, description}
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("from_country", "to_country", "lang", name="uix_visa_from_to_lang"),
    )
