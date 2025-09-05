# Transit Accessibility Reporter

A web application for reporting and tracking transit accessibility issues. This project helps improve public transportation accessibility by allowing users to report problems like broken elevators, blocked ramps, and inaccessible vehicles.

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zakeertech3/Public_Transit_Accessibility_Reporter.git
   cd Public_Transit_Accessibility_Reporter
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

#### 1. Start the Backend Server

```bash
cd backend
python start_server.py
```

The API will be available at: **http://localhost:8000**

- Health check: http://localhost:8000/health
- API documentation: http://localhost:8000/docs

#### 2. Start the Frontend Server

Open a new terminal window:

```bash
cd frontend
python -m http.server 8080 --bind 127.0.0.1
```

The web application will be available at: **http://127.0.0.1:8080**

## 📁 Project Structure

```
├── backend/                    # FastAPI backend server
│   ├── main.py                # Main FastAPI application
│   ├── models.py              # Pydantic data models
│   ├── database.py            # SQLite database management
│   ├── start_server.py        # Server startup script
│   ├── reports.db             # SQLite database (auto-created)
│   └── README.md              # Backend documentation
├── frontend/                   # Web frontend
│   ├── index.html             # Report submission form
│   ├── map.html               # Interactive map view
│   ├── reports.html           # Reports list view
│   ├── styles.css             # Responsive CSS framework
│   ├── script.js              # JavaScript functionality
│   └── README.md              # Frontend documentation
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 🌟 Features

### Current Features
- **Report Submission**: Submit accessibility issues with location, category, description, and photos
- **Interactive Map**: View all reported issues on an interactive map
- **Reports List**: Browse all reports in a searchable list format
- **Mobile Responsive**: Optimized for mobile and desktop devices
- **Photo Upload**: Attach photos to reports (max 100KB)
- **Real-time Location**: Get current GPS location for accurate reporting

### Issue Categories
- Elevator Out of Service
- Blocked Ramp
- Inaccessible Vehicle
- Missing Audio Announcement
- Other

## 🛠 Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLite**: Lightweight database for data storage
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for FastAPI

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Responsive design with Flexbox/Grid
- **Vanilla JavaScript**: No framework dependencies
- **Leaflet.js**: Interactive mapping

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root endpoint |
| GET | `/health` | Health check |
| GET | `/api/reports` | Get all reports |
| POST | `/api/reports` | Create new report |
| DELETE | `/api/reports/{id}` | Delete report by ID |

## 🗄 Database Schema

The `reports` table contains:
- `id` - Primary key (auto-increment)
- `latitude` - Report location latitude
- `longitude` - Report location longitude
- `category` - Issue category
- `description` - Optional issue description
- `photo_base64` - Optional base64 encoded photo (max 100KB)
- `timestamp` - Report creation timestamp

## 🔧 Development

### Backend Development

```bash
cd backend
# Install dependencies
pip install -r ../requirements.txt

# Run with auto-reload
uvicorn main:app --reload

# Or use the startup script
python start_server.py
```

### Frontend Development

```bash
cd frontend
# Serve files locally
python -m http.server 8080 --bind 127.0.0.1

# Alternative with Node.js
npx serve .
```

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:8000/health
```

### API Testing
Visit http://localhost:8000/docs for interactive API documentation.

## 🌐 Browser Support

- Chrome/Chromium (mobile and desktop)
- Firefox (mobile and desktop)
- Safari (mobile and desktop)
- Microsoft Edge

## 📱 Mobile Features

- Touch-friendly interface
- GPS location detection
- Camera integration for photo capture
- Responsive hamburger menu
- Optimized for various screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure Python 3.8+ is installed
- Check if port 8000 is available
- Verify all dependencies are installed: `pip install -r requirements.txt`

**Frontend can't connect to backend:**
- Ensure backend is running on http://localhost:8000
- Check CORS configuration in `backend/main.py`
- Verify frontend is served from http://127.0.0.1:8080

**Database issues:**
- The SQLite database is created automatically
- Check file permissions in the backend directory
- Delete `reports.db` to reset the database

### Getting Help

- Check the [Issues](https://github.com/Zakeertech3/Public_Transit_Accessibility_Reporter/issues) page
- Review the backend and frontend README files for detailed documentation
- Ensure both servers are running on the correct ports

## 🎯 Roadmap

- [ ] User authentication and profiles
- [ ] Email notifications for reports
- [ ] Advanced filtering and search
- [ ] Report status tracking
- [ ] Integration with transit APIs
- [ ] Multi-language support