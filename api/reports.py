"""
Reports API endpoint for Vercel deployment.
"""
import json
import os
from datetime import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# In-memory storage for Vercel (replace with database in production)
reports_storage = []

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
        
        response = {"reports": reports_storage}
        self.wfile.write(json.dumps(response).encode())
        
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8'))
            
            # Validate required fields
            required_fields = ['category', 'latitude', 'longitude']
            for field in required_fields:
                if field not in body or body[field] is None:
                    self.send_error_response(400, f"Missing required field: {field}")
                    return
            
            # Create report
            report = {
                "id": len(reports_storage) + 1,
                "category": body['category'],
                "description": body.get('description', ''),
                "latitude": float(body['latitude']),
                "longitude": float(body['longitude']),
                "photo_base64": body.get('photo_base64'),
                "timestamp": datetime.now().isoformat(),
                "status": "open"
            }
            
            reports_storage.append(report)
            
            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', '*')
            self.end_headers()
            
            response = {"message": "Report created successfully", "report": report}
            self.wfile.write(json.dumps(response).encode())
            
        except json.JSONDecodeError:
            self.send_error_response(400, "Invalid JSON in request body")
        except ValueError as e:
            self.send_error_response(400, f"Invalid data: {str(e)}")
        except Exception as e:
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
    
    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
        
        error_response = {"error": message}
        self.wfile.write(json.dumps(error_response).encode())