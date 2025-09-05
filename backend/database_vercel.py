"""
Database configuration for Vercel deployment.
Uses in-memory storage for demo purposes since SQLite doesn't work on Vercel serverless.
For production, replace with PostgreSQL or other cloud database.
"""

import json
from typing import List, Dict, Any
from datetime import datetime

# In-memory storage for demo (replace with real database in production)
_reports_storage: List[Dict[str, Any]] = []
_next_id = 1

def init_db():
    """Initialize the database (no-op for in-memory storage)."""
    global _reports_storage, _next_id
    _reports_storage = []
    _next_id = 1
    print("In-memory database initialized for Vercel deployment")

def get_all_reports() -> List[Dict[str, Any]]:
    """Get all reports from storage."""
    return _reports_storage.copy()

def create_report(latitude: float, longitude: float, category: str, description: str = None, photo_base64: str = None) -> int:
    """Create a new report and return its ID."""
    global _next_id
    
    report = {
        'id': _next_id,
        'latitude': latitude,
        'longitude': longitude,
        'category': category,
        'description': description,
        'photo_base64': photo_base64,
        'timestamp': datetime.now().isoformat()
    }
    
    _reports_storage.append(report)
    report_id = _next_id
    _next_id += 1
    
    return report_id

def validate_photo_size(photo_base64: str) -> bool:
    """Validate that base64 photo is under 100KB limit."""
    if not photo_base64:
        return True
    
    # Check base64 string length (roughly 4/3 of original file size)
    # 100KB * 4/3 ≈ 133KB base64 string
    if len(photo_base64) > 133000:
        return False
    return True

# Context manager compatibility (for existing code)
class MockConnection:
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        pass
    
    def cursor(self):
        return MockCursor()

class MockCursor:
    def __init__(self):
        self.lastrowid = None
    
    def execute(self, query: str, params: tuple = None):
        global _next_id
        
        if query.startswith("INSERT"):
            # Mock insert operation
            if params:
                latitude, longitude, category, description, photo_base64 = params
                self.lastrowid = create_report(latitude, longitude, category, description, photo_base64)
        elif query.startswith("SELECT"):
            # Mock select operation
            self._results = []
            for report in _reports_storage:
                # Convert to Row-like object
                row = type('Row', (), report)()
                for key, value in report.items():
                    setattr(row, key, value)
                    # Also support dict-like access
                    row.__getitem__ = lambda self, key: getattr(self, key)
                self._results.append(row)
    
    def fetchall(self):
        return getattr(self, '_results', [])
    
    def commit(self):
        pass  # No-op for in-memory storage

def get_db_connection():
    """Get a database connection (mock for in-memory storage)."""
    return MockConnection()