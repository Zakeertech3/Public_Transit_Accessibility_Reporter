#!/usr/bin/env python3
"""
Simple script to start the Transit Accessibility Reporter API server.
"""

import uvicorn
import sys
import socket
from main import app

def check_port(port):
    """Check if a port is available."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.bind(('localhost', port))
        sock.close()
        return True
    except OSError:
        return False

if __name__ == "__main__":
    print("🚀 Starting Transit Accessibility Reporter API Server")
    print("=" * 60)
    
    # Check if port 8000 is available
    if not check_port(8000):
        print("❌ Error: Port 8000 is already in use!")
        print("💡 Try closing other applications or use a different port")
        print("🔍 To find what's using port 8000, run: netstat -ano | findstr :8000")
        sys.exit(1)
    
    print("✅ Port 8000 is available")
    print("Server will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    print("=" * 60)
    print("Press Ctrl+C to stop the server")
    print()
    
    try:
        uvicorn.run(
            "main:app",  # Use import string to avoid reload warning
            host="127.0.0.1", 
            port=8000, 
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)