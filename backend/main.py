from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ReportCreate, ReportResponse
from datetime import datetime, timezone
import os

from database import init_db, get_db_connection, validate_photo_size

app = FastAPI(title="Transit Accessibility Reporter API")

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8080",  # For local frontend testing
        "*"  # Allow all origins for local development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root():
    return {"message": "Transit Accessibility Reporter API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/reports", response_model=list[ReportResponse])
async def get_reports():
    """Retrieve all accessibility reports for map and list display."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, latitude, longitude, category, description, photo_base64, timestamp
                FROM reports
                ORDER BY timestamp DESC
            """)
            rows = cursor.fetchall()
        
        # Format reports for frontend consumption
        reports = []
        for row in rows:
            # Format timestamp for display (ISO format for frontend parsing)
            timestamp_str = row['timestamp']
            if timestamp_str:
                try:
                    # SQLite CURRENT_TIMESTAMP format: "YYYY-MM-DD HH:MM:SS"
                    # Convert to ISO format with timezone info
                    dt = datetime.fromisoformat(timestamp_str)
                    # Assume SQLite timestamp is UTC and add timezone info
                    dt_utc = dt.replace(tzinfo=timezone.utc)
                    formatted_timestamp = dt_utc.isoformat()
                except Exception as e:
                    # Fallback: create a current timestamp
                    print(f"Error parsing timestamp '{timestamp_str}': {e}")
                    formatted_timestamp = datetime.now(timezone.utc).isoformat()
            else:
                formatted_timestamp = datetime.now(timezone.utc).isoformat()
            
            report = ReportResponse(
                id=row['id'],
                latitude=row['latitude'],
                longitude=row['longitude'],
                category=row['category'],
                description=row['description'],
                photo_base64=row['photo_base64'],
                timestamp=formatted_timestamp
            )
            reports.append(report)
        
        return reports
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve reports: {str(e)}")

@app.post("/api/reports", response_model=dict)
async def create_report(report: ReportCreate):
    """Create a new accessibility report."""
    try:
        # Additional photo size validation (redundant with Pydantic but explicit)
        if report.photo_base64 and not validate_photo_size(report.photo_base64):
            raise HTTPException(status_code=400, detail="Photo size exceeds 100KB limit")
        
        # Insert report into database
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO reports (latitude, longitude, category, description, photo_base64)
                VALUES (?, ?, ?, ?, ?)
            """, (
                report.latitude,
                report.longitude,
                report.category,
                report.description,
                report.photo_base64
            ))
            conn.commit()
            report_id = cursor.lastrowid
        
        return {
            "id": report_id,
            "message": "Report created successfully",
            "status": "success"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create report: {str(e)}")