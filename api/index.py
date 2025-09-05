"""
Vercel serverless function entry point for the Transit Accessibility Reporter API.
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app

# Vercel expects the app to be available as 'app'
# This is the entry point for Vercel serverless functions