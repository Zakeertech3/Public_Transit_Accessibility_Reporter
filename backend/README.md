# Transit Accessibility Reporter - Backend

FastAPI backend for the Transit Accessibility Reporter application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Project Structure

- `main.py` - FastAPI application with CORS middleware
- `database.py` - SQLite database initialization and connection management
- `models.py` - Pydantic models for data validation
- `requirements.txt` - Python dependencies
- `reports.db` - SQLite database file (created automatically)

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check endpoint
- Additional endpoints will be added in subsequent tasks

## Database Schema

The `reports` table contains:
- `id` - Primary key (auto-increment)
- `latitude` - Report location latitude
- `longitude` - Report location longitude  
- `category` - Issue category
- `description` - Optional issue description
- `photo_base64` - Optional base64 encoded photo (max 100KB)
- `timestamp` - Report creation timestamp

## Testing

Run the setup verification:
```bash
python test_setup.py
python verify_imports.py
```