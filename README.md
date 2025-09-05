# Transit Accessibility Reporter

A comprehensive web application for reporting and tracking accessibility issues across various environments. This project helps improve accessibility for people with disabilities by allowing users to report problems like broken elevators, blocked ramps, and inaccessible vehicles in real-time.

## 🌟 Project Impact & Applications

### 🏘️ Gated Communities & Residential Areas

**Internal Transportation & Infrastructure:**
- Report broken elevators in community buildings and parking structures
- Document blocked wheelchair ramps or accessibility paths within the community
- Track issues with community shuttle services, golf carts, and internal transportation
- Monitor accessibility problems at clubhouses, gyms, pools, and common areas
- Report missing or broken accessibility features like handrails, audio announcements, and tactile indicators

**Benefits for Residents:**
- Elderly residents can easily report mobility barriers they encounter daily
- Property management receives real-time updates on accessibility issues
- Creates documented history for maintenance planning and budget allocation
- Helps ensure compliance with Fair Housing Act and ADA regulations
- Improves quality of life for residents with disabilities and mobility challenges

### 🏢 Commercial & Professional Environments

**Office Buildings & Workplaces:**
- Employees can report workplace accessibility barriers affecting productivity
- Track elevator maintenance needs and service disruptions
- Document blocked emergency exits or accessibility paths
- Help employers maintain ADA compliance and avoid legal issues
- Ensure equal workplace opportunities for employees with disabilities

**Shopping Centers & Retail:**
- Document broken escalators, elevators, and moving walkways
- Report blocked accessible parking spaces or charging stations
- Track issues with accessible restroom facilities and changing rooms
- Monitor problems with automatic doors, ramps, and tactile surfaces
- Help retailers create inclusive shopping experiences

### 🎓 Educational Institutions

**Universities & Schools:**
- Students can report broken elevators in dormitories and academic buildings
- Track accessibility issues in cafeterias, libraries, laboratories, and recreational facilities
- Monitor campus transportation accessibility (buses, shuttles, parking)
- Help institutions maintain Section 504 and ADA compliance
- Ensure equal access to educational opportunities and campus life

### 🏥 Healthcare & Medical Facilities

**Hospitals & Clinics:**
- Report broken patient lifts, accessible entrances, and medical equipment access
- Track issues with accessible parking and pathways to medical facilities
- Monitor elevator outages that affect patient transport
- Ensure emergency evacuation routes remain accessible
- Help healthcare providers maintain patient care standards

### 🏛️ Public Services & Government

**Civic Buildings & Services:**
- Citizens can report accessibility barriers in courthouses, DMV offices, and city halls
- Track maintenance needs for public accessibility features
- Document issues affecting access to voting locations and polling stations
- Ensure equal access to government services and civic participation
- Help municipalities comply with public accessibility laws

### 🏨 Tourism & Hospitality

**Hotels & Tourist Attractions:**
- Hotels can track accessibility issues in guest rooms, lobbies, and amenities
- Tourist attractions can monitor accessibility barrier reports from visitors
- Help improve accessibility for travelers with disabilities
- Ensure compliance with hospitality industry accessibility standards
- Create more inclusive travel experiences

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

## 🌟 Key Features

### Current Features
- **Real-time Report Submission**: Submit accessibility issues with precise location, category, description, and photos
- **Interactive Map Visualization**: View all reported issues on an interactive map with detailed popups
- **Comprehensive Reports List**: Browse, search, and filter all reports in an organized list format
- **Mobile-First Design**: Fully responsive and optimized for mobile and desktop devices
- **Photo Documentation**: Attach photos to reports with automatic compression (max 100KB)
- **GPS Location Services**: Automatically capture precise GPS coordinates for accurate reporting
- **Reverse Geocoding**: Convert coordinates to readable addresses for better context

### Issue Categories
- **Elevator Out of Service**: Building elevators and lifts not functioning
- **Blocked Ramp**: Wheelchair ramps blocked or inaccessible
- **Inaccessible Vehicle**: Transit vehicles without proper accessibility features
- **Missing Audio Announcement**: Lack of audio accessibility features
- **Other**: Custom categories for specific community needs

## 🛠 Technology Stack

### Backend
- **FastAPI**: Modern Python web framework with automatic API documentation
- **SQLite**: Lightweight, serverless database for reliable data storage
- **Pydantic**: Data validation and serialization with type safety
- **Uvicorn**: High-performance ASGI server for FastAPI applications

### Frontend
- **HTML5**: Semantic, accessible markup structure
- **CSS3**: Responsive design with modern Flexbox and Grid layouts
- **Vanilla JavaScript**: No framework dependencies for faster loading
- **Leaflet.js**: Interactive, mobile-friendly mapping library

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root endpoint with API information |
| GET | `/health` | Health check for monitoring |
| GET | `/api/reports` | Retrieve all accessibility reports |
| POST | `/api/reports` | Create new accessibility report |
| DELETE | `/api/reports/{id}` | Delete specific report by ID |

## 🗄 Database Schema

The `reports` table contains:
- `id` - Primary key (auto-increment)
- `latitude` - Report location latitude (precise GPS coordinates)
- `longitude` - Report location longitude (precise GPS coordinates)
- `category` - Issue category (standardized accessibility types)
- `description` - Optional detailed issue description
- `photo_base64` - Optional base64 encoded photo (max 100KB for performance)
- `timestamp` - Report creation timestamp (ISO format with timezone)

## 💡 Key Advantages

### **Community Empowerment**
People who experience accessibility barriers firsthand can directly report them, rather than relying on others to notice problems. This creates authentic, user-driven feedback.

### **Real-time Monitoring**
Issues are reported immediately when discovered, allowing organizations to respond quickly and prevent prolonged accessibility barriers.

### **Data-driven Decision Making**
Organizations can analyze collected data to identify patterns, prioritize improvements, and allocate resources effectively for maximum accessibility impact.

### **Cost-effective Solution**
Provides a comprehensive accessibility monitoring system without requiring expensive specialized equipment, extensive training, or dedicated staff.

### **Legal Compliance Support**
Helps organizations maintain compliance with ADA, Section 504, Fair Housing Act, and other accessibility laws by providing documentation and enabling faster issue resolution.

### **Inclusive Design Promotion**
Encourages organizations to think proactively about accessibility rather than reactively fixing problems, leading to better universal design practices.

### **Cross-platform Accessibility**
Works on any device with a web browser, ensuring the reporting tool itself is accessible to users with various technological capabilities.

## 🔧 Development

### Backend Development

```bash
cd backend
# Install dependencies
pip install -r ../requirements.txt

# Run with auto-reload for development
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
Visit http://localhost:8000/docs for interactive API documentation and testing interface.

## 🌐 Browser Support

- Chrome/Chromium (mobile and desktop) - Full feature support
- Firefox (mobile and desktop) - Full feature support  
- Safari (mobile and desktop) - Full feature support
- Microsoft Edge - Full feature support
- Progressive Web App capabilities for offline functionality

## 📱 Mobile Optimization

- **Touch-friendly Interface**: Large buttons and intuitive gesture controls
- **GPS Integration**: Automatic location detection with high accuracy
- **Camera Integration**: Direct photo capture and upload from mobile devices
- **Responsive Navigation**: Hamburger menu optimized for various screen sizes
- **Offline Capability**: Progressive Web App features for areas with poor connectivity

## 🤝 Contributing

We welcome contributions from developers, accessibility advocates, and community organizations:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/accessibility-improvement`)
3. Commit your changes (`git commit -m 'Add accessibility feature'`)
4. Push to the branch (`git push origin feature/accessibility-improvement`)
5. Open a Pull Request with detailed description

### Areas for Contribution
- Additional accessibility categories
- Multi-language support
- Integration with existing property management systems
- Enhanced reporting analytics and dashboards
- API integrations with municipal accessibility databases

## 📄 License

This project is open source and available under the [MIT License](LICENSE), making it freely available for communities, organizations, and developers worldwide.

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure Python 3.8+ is installed: `python --version`
- Check if port 8000 is available: `netstat -ano | findstr :8000`
- Verify all dependencies are installed: `pip install -r requirements.txt`

**Frontend can't connect to backend:**
- Ensure backend is running on http://localhost:8000
- Check CORS configuration in `backend/main.py`
- Verify frontend is served from http://127.0.0.1:8080

**Database issues:**
- The SQLite database is created automatically on first run
- Check file permissions in the backend directory
- Delete `reports.db` to reset the database if needed

**GPS/Location issues:**
- Ensure location services are enabled in browser settings
- Use HTTPS in production for location API access
- Check browser console for geolocation error messages

### Getting Help

- Check the [Issues](https://github.com/Zakeertech3/Public_Transit_Accessibility_Reporter/issues) page for known problems and solutions
- Review the backend and frontend README files for detailed technical documentation
- Ensure both servers are running on the correct ports before reporting issues

## 🎯 Roadmap & Future Development

### Phase 1 (Current)
- [x] Basic report submission and viewing
- [x] Interactive map visualization
- [x] Mobile-responsive design
- [x] Photo upload capability

### Phase 2 (Planned)
- [ ] User authentication and profiles for accountability
- [ ] Email notifications for report updates and resolutions
- [ ] Advanced filtering, search, and analytics dashboard
- [ ] Report status tracking (Open, In Progress, Resolved)
- [ ] Integration with popular property management systems

### Phase 3 (Future)
- [ ] Multi-language support for diverse communities
- [ ] API integrations with municipal accessibility databases
- [ ] Machine learning for automatic issue categorization
- [ ] Voice-to-text reporting for enhanced accessibility
- [ ] Integration with IoT sensors for automatic issue detection

### Phase 4 (Vision)
- [ ] Real-time collaboration with maintenance teams
- [ ] Predictive analytics for preventive maintenance
- [ ] Integration with smart city infrastructure
- [ ] Comprehensive accessibility compliance reporting tools

## 🌍 Making Communities More Accessible

This project represents more than just a reporting tool—it's a step toward creating truly inclusive communities where accessibility barriers are quickly identified, documented, and resolved. By empowering individuals to report issues directly, we create a feedback loop that benefits everyone and promotes universal design principles.

Whether you're managing a gated community, operating a business, running an educational institution, or serving the public, this tool helps ensure that accessibility is not an afterthought but an integral part of your operations.

**Together, we can build a more accessible world, one report at a time.**
