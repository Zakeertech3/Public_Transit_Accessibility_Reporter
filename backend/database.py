import sqlite3
from contextlib import contextmanager
from typing import Generator

DATABASE_PATH = "reports.db"

def init_db():
    """Initialize the SQLite database with the reports table."""
    conn = sqlite3.connect(DATABASE_PATH)
    try:
        conn.execute('''CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            photo_base64 TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )''')
        conn.commit()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise
    finally:
        conn.close()

@contextmanager
def get_db_connection() -> Generator[sqlite3.Connection, None, None]:
    """Context manager for database connections with dict-like row access."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Enable dict-like access to rows
    try:
        yield conn
    finally:
        conn.close()

def validate_photo_size(photo_base64: str) -> bool:
    """Validate that base64 photo is under 100KB limit."""
    if not photo_base64:
        return True
    
    # Check base64 string length (roughly 4/3 of original file size)
    # 100KB * 4/3 ≈ 133KB base64 string
    if len(photo_base64) > 133000:
        return False
    return True