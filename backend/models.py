from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class ReportCreate(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitude coordinate")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude coordinate")
    category: str = Field(..., min_length=1, max_length=100, description="Issue category")
    description: Optional[str] = Field(None, max_length=500, description="Issue description")
    photo_base64: Optional[str] = Field(None, description="Base64 encoded photo (max 100KB)")
    
    @validator('photo_base64')
    def validate_photo_size(cls, v):
        if v and len(v) > 133000:  # ~100KB limit
            raise ValueError('Photo size exceeds 100KB limit')
        return v
    
    @validator('category')
    def validate_category(cls, v):
        if not v or not v.strip():
            raise ValueError('Category cannot be empty')
        return v.strip()

class ReportResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    category: str
    description: Optional[str]
    photo_base64: Optional[str]
    timestamp: str

    class Config:
        from_attributes = True