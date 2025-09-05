# Transit Accessibility Reporter - Frontend

A responsive web application for reporting and viewing transit accessibility issues.

## Project Structure

```
frontend/
├── index.html      # Report form page (main entry point)
├── map.html        # Interactive map view
├── reports.html    # Reports list view
├── styles.css      # Mobile-responsive CSS framework
├── script.js       # JavaScript utilities and navigation
└── README.md       # This file
```

## Features

- **Responsive Design**: Mobile-first approach with touch-friendly interfaces
- **Navigation**: Clean navigation between three main views
- **Leaflet.js Integration**: Ready for interactive mapping functionality
- **Mobile Menu**: Hamburger menu for mobile devices
- **Accessibility**: Semantic HTML and keyboard navigation support

## Technology Stack

- HTML5 with semantic markup
- CSS3 with Flexbox and Grid
- Vanilla JavaScript (ES6+)
- Leaflet.js for mapping (CDN)

## Browser Support

- Chrome/Chromium (mobile and desktop)
- Firefox (mobile and desktop)
- Safari (mobile and desktop)
- Edge

## Development

To run locally, simply open `index.html` in a web browser or serve the files using a local HTTP server:

```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```

## Next Steps

The following functionality will be implemented in subsequent tasks:
- Report submission form (Task 6)
- Interactive map with markers (Task 7)
- Reports list display (Task 8)
- Enhanced mobile optimization (Task 9)