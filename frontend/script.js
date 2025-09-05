// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// Utility functions for future use
const Utils = {
    // Show loading state
    showLoading: function(element) {
        if (element) {
            element.innerHTML = '<p>Loading...</p>';
        }
    },

    // Show error message
    showError: function(element, message) {
        if (element) {
            element.innerHTML = `<p class="error">Error: ${message}</p>`;
        }
    },

    // Format timestamp for display
    formatTimestamp: function(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },

    // Format coordinates for display
    formatCoordinates: function(lat, lng) {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    },

    // Validate base64 image size
    validateImageSize: function(base64String, maxSizeKB = 100) {
        if (!base64String) return true;
        
        // Remove data URL prefix if present
        const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
        
        // Calculate approximate file size (base64 is ~4/3 of original size)
        const sizeInBytes = (base64Data.length * 3) / 4;
        const sizeInKB = sizeInBytes / 1024;
        
        return sizeInKB <= maxSizeKB;
    }
};

// API configuration - automatically detects environment
const API_CONFIG = {
    baseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:8000' 
        : '', // Use localStorage for Vercel demo
    endpoints: {
        reports: '/api/reports'
    },
    useLocalStorage: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
};

// Report Form Functionality
class ReportForm {
    constructor() {
        this.form = document.getElementById('reportForm');
        this.currentLocation = null;
        this.capturedPhoto = null;
        this.isManualLocationMode = false;
        
        if (this.form) {
            this.initializeForm();
        }
    }

    initializeForm() {
        // Get DOM elements
        this.getLocationBtn = document.getElementById('getLocationBtn');
        this.locationStatus = document.getElementById('locationStatus');
        this.manualLocation = document.getElementById('manualLocation');
        this.toggleManualLocationBtn = document.getElementById('toggleManualLocation');
        this.latitudeInput = document.getElementById('latitude');
        this.longitudeInput = document.getElementById('longitude');
        this.categorySelect = document.getElementById('category');
        this.customCategoryGroup = document.getElementById('customCategoryGroup');
        this.customCategoryInput = document.getElementById('customCategory');
        this.descriptionTextarea = document.getElementById('description');
        this.capturePhotoBtn = document.getElementById('capturePhotoBtn');
        this.photoInput = document.getElementById('photoInput');
        this.photoPreview = document.getElementById('photoPreview');
        this.submitBtn = document.getElementById('submitBtn');
        this.statusMessage = document.getElementById('statusMessage');
        this.charCounter = document.querySelector('.char-counter');

        // Bind event listeners
        this.bindEvents();
        
        // Initialize form validation
        this.updateSubmitButton();
    }

    bindEvents() {
        // Location events
        this.getLocationBtn.addEventListener('click', () => this.getCurrentLocation());
        this.toggleManualLocationBtn.addEventListener('click', () => this.toggleLocationMode());
        
        // Form validation events
        this.categorySelect.addEventListener('change', () => {
            this.handleCategoryChange();
            this.updateSubmitButton();
        });
        this.customCategoryInput.addEventListener('input', () => {
            this.updateCustomCategoryCounter();
            this.updateSubmitButton();
        });
        this.latitudeInput.addEventListener('input', () => this.updateSubmitButton());
        this.longitudeInput.addEventListener('input', () => this.updateSubmitButton());
        
        // Description character counter
        this.descriptionTextarea.addEventListener('input', () => this.updateCharCounter());
        
        // Photo events
        this.capturePhotoBtn.addEventListener('click', () => this.capturePhoto());
        this.photoInput.addEventListener('change', (e) => this.handlePhotoSelection(e));
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showLocationError('Geolocation is not supported by this browser.');
            this.showManualLocationEntry();
            return;
        }

        this.getLocationBtn.disabled = true;
        this.getLocationBtn.textContent = '📍 Getting Location...';
        this.showLocationStatus('Getting your location...', 'loading');

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        };

        navigator.geolocation.getCurrentPosition(
            (position) => this.handleLocationSuccess(position),
            (error) => this.handleLocationError(error),
            options
        );
    }

    async handleLocationSuccess(position) {
        this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        // Get address from coordinates
        try {
            const address = await this.getAddressFromCoordinates(
                this.currentLocation.latitude, 
                this.currentLocation.longitude
            );
            this.currentLocation.address = address;
            this.showLocationStatus(`📍 Location found: ${address}`, 'success');
        } catch (error) {
            console.warn('Could not get address:', error);
            const locationText = `📍 Location found: ${this.currentLocation.latitude.toFixed(4)}, ${this.currentLocation.longitude.toFixed(4)}`;
            this.showLocationStatus(locationText, 'success');
        }
        
        this.getLocationBtn.disabled = false;
        this.getLocationBtn.textContent = '📍 Update Location';
        
        this.updateSubmitButton();
    }

    async getAddressFromCoordinates(lat, lng) {
        try {
            // Using OpenStreetMap Nominatim API for reverse geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'Transit-Accessibility-Reporter/1.0'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Geocoding failed');
            }
            
            const data = await response.json();
            
            if (data && data.display_name) {
                // Format the address nicely
                const address = data.address;
                let formattedAddress = '';
                
                if (address) {
                    const parts = [];
                    if (address.house_number && address.road) {
                        parts.push(`${address.house_number} ${address.road}`);
                    } else if (address.road) {
                        parts.push(address.road);
                    }
                    
                    if (address.neighbourhood || address.suburb) {
                        parts.push(address.neighbourhood || address.suburb);
                    }
                    
                    if (address.city || address.town || address.village) {
                        parts.push(address.city || address.town || address.village);
                    }
                    
                    if (address.state) {
                        parts.push(address.state);
                    }
                    
                    formattedAddress = parts.join(', ');
                }
                
                return formattedAddress || data.display_name;
            }
            
            throw new Error('No address found');
        } catch (error) {
            console.warn('Geocoding error:', error);
            throw error;
        }
    }

    handleLocationError(error) {
        let errorMessage = 'Unable to get your location. ';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage += 'Location access was denied.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage += 'Location information is unavailable.';
                break;
            case error.TIMEOUT:
                errorMessage += 'Location request timed out.';
                break;
            default:
                errorMessage += 'An unknown error occurred.';
                break;
        }
        
        this.showLocationError(errorMessage);
        this.showManualLocationEntry();
        
        this.getLocationBtn.disabled = false;
        this.getLocationBtn.textContent = '📍 Try Again';
    }

    showLocationStatus(message, type) {
        this.locationStatus.textContent = message;
        this.locationStatus.className = `location-status ${type}`;
        this.locationStatus.style.display = 'block';
    }

    showLocationError(message) {
        this.showLocationStatus(message + ' Please enter coordinates manually.', 'error');
    }

    showManualLocationEntry() {
        this.manualLocation.style.display = 'block';
        this.isManualLocationMode = true;
        this.toggleManualLocationBtn.textContent = 'Use GPS Instead';
    }

    toggleLocationMode() {
        if (this.isManualLocationMode) {
            // Switch to GPS mode
            this.manualLocation.style.display = 'none';
            this.isManualLocationMode = false;
            this.latitudeInput.value = '';
            this.longitudeInput.value = '';
            this.locationStatus.style.display = 'none';
            this.getCurrentLocation();
        } else {
            // Switch to manual mode
            this.showManualLocationEntry();
        }
        this.updateSubmitButton();
    }

    capturePhoto() {
        this.photoInput.click();
    }

    handlePhotoSelection(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Check file size (100KB limit as per requirements)
        const maxSize = 100 * 1024; // 100KB
        if (file.size > maxSize) {
            this.showStatusMessage('Photo is too large. Please choose a photo smaller than 100KB.', 'error');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            this.showStatusMessage('Please select a valid image file.', 'error');
            return;
        }

        // Show loading state for mobile users
        this.capturePhotoBtn.disabled = true;
        this.capturePhotoBtn.textContent = '📷 Processing...';

        const reader = new FileReader();
        reader.onload = (e) => {
            this.capturedPhoto = e.target.result; // This is the base64 data URL
            this.showPhotoPreview(e.target.result);
            
            // Reset button state
            this.capturePhotoBtn.disabled = false;
            this.capturePhotoBtn.textContent = '📷 Take Photo';
        };
        
        reader.onerror = () => {
            this.showStatusMessage('Failed to process photo. Please try again.', 'error');
            this.capturePhotoBtn.disabled = false;
            this.capturePhotoBtn.textContent = '📷 Take Photo';
        };
        
        reader.readAsDataURL(file);
    }

    showPhotoPreview(dataUrl) {
        this.photoPreview.innerHTML = `
            <img src="${dataUrl}" alt="Captured photo preview">
            <button type="button" class="remove-photo" onclick="reportForm.removePhoto()">
                Remove Photo
            </button>
        `;
    }

    removePhoto() {
        this.capturedPhoto = null;
        this.photoPreview.innerHTML = '';
        this.photoInput.value = '';
    }

    updateCharCounter() {
        const length = this.descriptionTextarea.value.length;
        const maxLength = 500;
        this.charCounter.textContent = `${length}/${maxLength} characters`;
        
        if (length > maxLength * 0.9) {
            this.charCounter.className = 'char-counter warning';
        } else if (length >= maxLength) {
            this.charCounter.className = 'char-counter error';
        } else {
            this.charCounter.className = 'char-counter';
        }
    }

    handleCategoryChange() {
        const selectedCategory = this.categorySelect.value;
        
        if (selectedCategory === 'Custom') {
            this.customCategoryGroup.style.display = 'block';
            this.customCategoryInput.required = true;
            this.customCategoryInput.focus();
        } else {
            this.customCategoryGroup.style.display = 'none';
            this.customCategoryInput.required = false;
            this.customCategoryInput.value = '';
        }
    }

    updateCustomCategoryCounter() {
        const length = this.customCategoryInput.value.length;
        const maxLength = 100;
        const counter = this.customCategoryGroup.querySelector('.char-counter');
        counter.textContent = `${length}/${maxLength} characters`;
        
        if (length > maxLength * 0.9) {
            counter.className = 'char-counter warning';
        } else if (length >= maxLength) {
            counter.className = 'char-counter error';
        } else {
            counter.className = 'char-counter';
        }
    }

    updateSubmitButton() {
        const hasLocation = this.currentLocation || (
            this.isManualLocationMode && 
            this.latitudeInput.value.trim() && 
            this.longitudeInput.value.trim()
        );
        
        let hasCategory = false;
        const selectedCategory = this.categorySelect.value.trim();
        
        if (selectedCategory === 'Custom') {
            hasCategory = this.customCategoryInput.value.trim().length > 0;
        } else {
            hasCategory = selectedCategory.length > 0;
        }
        
        this.submitBtn.disabled = !(hasLocation && hasCategory);
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        // Prepare form data
        const formData = this.prepareFormData();
        if (!formData) return;

        // Show loading state
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Submitting...';
        this.showStatusMessage('Submitting your report...', 'loading');

        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.reports}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                this.handleSubmitSuccess(result);
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit report');
            }
        } catch (error) {
            this.handleSubmitError(error);
        }
    }

    prepareFormData() {
        // Get location data
        let latitude, longitude;
        if (this.isManualLocationMode) {
            latitude = parseFloat(this.latitudeInput.value);
            longitude = parseFloat(this.longitudeInput.value);
            
            if (isNaN(latitude) || isNaN(longitude)) {
                this.showStatusMessage('Please enter valid latitude and longitude values.', 'error');
                return null;
            }
        } else if (this.currentLocation) {
            latitude = this.currentLocation.latitude;
            longitude = this.currentLocation.longitude;
        } else {
            this.showStatusMessage('Please provide a location for your report.', 'error');
            return null;
        }

        // Validate required fields and get category
        const selectedCategory = this.categorySelect.value.trim();
        let finalCategory = selectedCategory;
        
        if (!selectedCategory) {
            this.showStatusMessage('Please select an issue category.', 'error');
            return null;
        }
        
        if (selectedCategory === 'Custom') {
            const customCategory = this.customCategoryInput.value.trim();
            if (!customCategory) {
                this.showStatusMessage('Please enter a custom issue type.', 'error');
                return null;
            }
            finalCategory = customCategory;
        }

        // Prepare form data
        const formData = {
            latitude: latitude,
            longitude: longitude,
            category: finalCategory,
            description: this.descriptionTextarea.value.trim() || null
        };

        // Add photo if captured
        if (this.capturedPhoto) {
            // Extract base64 data from data URL
            const base64Data = this.capturedPhoto.split(',')[1];
            formData.photo_base64 = base64Data;
        }

        return formData;
    }

    handleSubmitSuccess(result) {
        this.showStatusMessage('Report submitted successfully! Thank you for helping improve transit accessibility.', 'success');
        
        // Reset form
        this.form.reset();
        this.currentLocation = null;
        this.capturedPhoto = null;
        this.removePhoto();
        this.locationStatus.style.display = 'none';
        this.manualLocation.style.display = 'none';
        this.customCategoryGroup.style.display = 'none';
        this.customCategoryInput.required = false;
        this.isManualLocationMode = false;
        this.updateCharCounter();
        
        // Reset buttons
        this.submitBtn.textContent = 'Submit Report';
        this.getLocationBtn.textContent = '📍 Get Current Location';
        this.updateSubmitButton();
    }

    handleSubmitError(error) {
        console.error('Submit error:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to submit report: ';
        if (error.message === 'Failed to fetch') {
            errorMessage += 'Cannot connect to server. Make sure the backend is running on http://localhost:8000';
        } else if (error.message.includes('NetworkError')) {
            errorMessage += 'Network connection failed. Check your internet connection and server status.';
        } else if (error.message.includes('CORS')) {
            errorMessage += 'Cross-origin request blocked. Check server CORS configuration.';
        } else {
            errorMessage += error.message;
        }
        
        this.showStatusMessage(errorMessage, 'error');
        
        // Reset submit button
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = 'Submit Report';
        this.updateSubmitButton();
    }

    showStatusMessage(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        this.statusMessage.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.statusMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// Map View Functionality
class MapView {
    constructor() {
        this.map = null;
        this.markers = [];
        this.reports = [];
        
        // Category colors matching the legend
        this.categoryColors = {
            'Elevator Out of Service': '#e74c3c',
            'Blocked Ramp': '#f39c12',
            'Inaccessible Vehicle': '#f1c40f',
            'Missing Audio': '#3498db',
            'Other': '#95a5a6'
        };
        
        if (document.getElementById('map')) {
            this.initializeMap();
        }
    }

    initializeMap() {
        try {
            // Initialize Leaflet map with OpenStreetMap tiles
            this.map = L.map('map', {
                center: [40.7128, -74.0060], // Default to NYC
                zoom: 12,
                zoomControl: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                touchZoom: true,
                dragging: true,
                tap: true,
                tapTolerance: 15,
                maxZoom: 18,
                minZoom: 3
            });

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
                tileSize: 256,
                zoomOffset: 0
            }).addTo(this.map);

            // Make map touch-friendly for mobile
            this.map.on('focus', () => {
                this.map.scrollWheelZoom.enable();
            });

            this.map.on('blur', () => {
                this.map.scrollWheelZoom.disable();
            });

            // Improve mobile touch interaction
            if (this.isMobileDevice()) {
                // Disable scroll wheel zoom by default on mobile
                this.map.scrollWheelZoom.disable();
                
                // Add touch-friendly controls
                this.map.touchZoom.enable();
                this.map.doubleClickZoom.enable();
                this.map.boxZoom.disable();
                
                // Add tap tolerance for better touch interaction
                this.map.options.tapTolerance = 20;
            }

            // Load and display reports
            this.loadReports();

            console.log('Map initialized successfully');
        } catch (error) {
            console.error('Error initializing map:', error);
            this.showMapError('Failed to initialize map. Please refresh the page.');
        }
    }

    async loadReports() {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.reports}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.reports = await response.json();
            this.displayReports();
            
            // Adjust map view to show all markers if reports exist
            if (this.reports.length > 0) {
                this.fitMapToMarkers();
            }
            
            console.log(`Loaded ${this.reports.length} reports`);
        } catch (error) {
            console.error('Error loading reports:', error);
            this.showMapError('Failed to load reports. Please check your connection and try again.');
        }
    }

    displayReports() {
        // Clear existing markers
        this.clearMarkers();

        // Add markers for each report
        this.reports.forEach(report => {
            this.addReportMarker(report);
        });
    }

    addReportMarker(report) {
        try {
            const color = this.categoryColors[report.category] || this.categoryColors['Other'];
            
            // Create custom marker icon
            const markerIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: ${color};
                    border: 3px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    cursor: pointer;
                "></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [0, -10]
            });

            // Create marker
            const marker = L.marker([report.latitude, report.longitude], {
                icon: markerIcon
            }).addTo(this.map);

            // Create popup content (async)
            marker.bindPopup('Loading...', {
                maxWidth: 300,
                minWidth: 200,
                closeButton: true,
                autoClose: true,
                closeOnEscapeKey: true
            });
            
            // Load popup content asynchronously
            this.createPopupContent(report).then(popupContent => {
                marker.setPopupContent(popupContent);
            }).catch(error => {
                console.warn('Error creating popup content:', error);
                // Fallback to basic content
                const timestamp = Utils.formatTimestamp(report.timestamp);
                const coordinates = Utils.formatCoordinates(report.latitude, report.longitude);
                const fallbackContent = `
                    <div class="popup-content">
                        <h4>🚨 Accessibility Issue</h4>
                        <div class="popup-category">${report.category}</div>
                        ${report.description ? `<div class="popup-description">${this.escapeHtml(report.description)}</div>` : ''}
                        <div class="popup-timestamp">📅 Reported: ${timestamp}</div>
                        <div class="popup-location">📍 Location: ${coordinates}</div>
                    </div>
                `;
                marker.setPopupContent(fallbackContent);
            });

            // Add to markers array for management
            this.markers.push(marker);

            // Add click event for mobile accessibility
            marker.on('click', () => {
                marker.openPopup();
            });

        } catch (error) {
            console.error('Error adding marker for report:', report, error);
        }
    }

    async createPopupContent(report) {
        const timestamp = Utils.formatTimestamp(report.timestamp);
        
        // Try to get address for the report location
        let locationText = '';
        try {
            const address = await this.getAddressFromCoordinates(report.latitude, report.longitude);
            locationText = address;
        } catch (error) {
            locationText = Utils.formatCoordinates(report.latitude, report.longitude);
        }
        
        let popupHTML = `
            <div class="popup-content">
                <h4>🚨 Accessibility Issue</h4>
                <div class="popup-category">${report.category}</div>
        `;

        if (report.description && report.description.trim()) {
            popupHTML += `<div class="popup-description">${this.escapeHtml(report.description)}</div>`;
        }

        popupHTML += `
                <div class="popup-timestamp">📅 Reported: ${timestamp}</div>
                <div class="popup-location">📍 Location: ${locationText}</div>
        `;

        if (report.photo_base64) {
            popupHTML += `
                <div class="popup-photo">
                    <img src="data:image/jpeg;base64,${report.photo_base64}" 
                         alt="Photo of accessibility issue" 
                         loading="lazy">
                </div>
            `;
        }

        popupHTML += `</div>`;
        
        return popupHTML;
    }

    clearMarkers() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }

    fitMapToMarkers() {
        if (this.markers.length === 0) return;

        try {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds(), {
                padding: [20, 20],
                maxZoom: 15
            });
        } catch (error) {
            console.error('Error fitting map to markers:', error);
        }
    }

    showMapError(message) {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    text-align: center;
                    color: #e74c3c;
                    padding: 2rem;
                ">
                    <div>
                        <p style="margin-bottom: 1rem; font-weight: 500;">${message}</p>
                        <button onclick="location.reload()" style="
                            background-color: #3498db;
                            color: white;
                            border: none;
                            padding: 0.5rem 1rem;
                            border-radius: 4px;
                            cursor: pointer;
                        ">Refresh Page</button>
                    </div>
                </div>
            `;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async getAddressFromCoordinates(lat, lng) {
        try {
            // Using OpenStreetMap Nominatim API for reverse geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'Transit-Accessibility-Reporter/1.0'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Geocoding failed');
            }
            
            const data = await response.json();
            
            if (data && data.display_name) {
                // Format the address nicely
                const address = data.address;
                let formattedAddress = '';
                
                if (address) {
                    const parts = [];
                    if (address.house_number && address.road) {
                        parts.push(`${address.house_number} ${address.road}`);
                    } else if (address.road) {
                        parts.push(address.road);
                    }
                    
                    if (address.neighbourhood || address.suburb) {
                        parts.push(address.neighbourhood || address.suburb);
                    }
                    
                    if (address.city || address.town || address.village) {
                        parts.push(address.city || address.town || address.village);
                    }
                    
                    if (address.state) {
                        parts.push(address.state);
                    }
                    
                    formattedAddress = parts.join(', ');
                }
                
                return formattedAddress || data.display_name;
            }
            
            throw new Error('No address found');
        } catch (error) {
            console.warn('Geocoding error:', error);
            throw error;
        }
    }

    // Helper method to detect mobile devices
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }

    // Method to refresh reports (can be called externally)
    async refreshReports() {
        await this.loadReports();
    }
}

// Reports List Functionality
class ReportsList {
    constructor() {
        this.reports = [];
        this.container = document.getElementById('reportsContainer');
        this.reportsList = document.getElementById('reportsList');
        this.reportsCount = document.getElementById('reportsCount');
        this.refreshBtn = document.getElementById('refreshReportsBtn');
        this.emptyState = document.getElementById('emptyState');
        this.loadingState = document.getElementById('loadingState');
        this.errorState = document.getElementById('errorState');
        this.retryBtn = document.getElementById('retryBtn');
        
        if (this.container) {
            this.initializeReportsList();
        }
    }

    initializeReportsList() {
        // Bind event listeners
        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => this.loadReports());
        }
        
        if (this.retryBtn) {
            this.retryBtn.addEventListener('click', () => this.loadReports());
        }
        
        // Load reports on initialization
        this.loadReports();
    }

    async loadReports() {
        this.showLoadingState();
        
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.reports}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.reports = await response.json();
            
            // Sort reports by timestamp (newest first)
            this.reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            this.displayReports();
            
            console.log(`Loaded ${this.reports.length} reports for list view`);
        } catch (error) {
            console.error('Error loading reports:', error);
            this.showErrorState();
        }
    }

    async displayReports() {
        this.hideAllStates();
        
        if (this.reports.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Update reports count
        const countText = this.reports.length === 1 ? '1 Report' : `${this.reports.length} Reports`;
        this.reportsCount.textContent = countText;
        
        // Clear existing reports
        this.reportsList.innerHTML = '';
        
        // Create report items (async)
        for (let i = 0; i < this.reports.length; i++) {
            const reportElement = await this.createReportElement(this.reports[i], i);
            this.reportsList.appendChild(reportElement);
        }
        
        // Show the reports container
        this.container.style.display = 'block';
    }

    async getAddressFromCoordinates(lat, lng) {
        try {
            // Using OpenStreetMap Nominatim API for reverse geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'Transit-Accessibility-Reporter/1.0'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Geocoding failed');
            }
            
            const data = await response.json();
            
            if (data && data.display_name) {
                // Format the address nicely
                const address = data.address;
                let formattedAddress = '';
                
                if (address) {
                    const parts = [];
                    if (address.house_number && address.road) {
                        parts.push(`${address.house_number} ${address.road}`);
                    } else if (address.road) {
                        parts.push(address.road);
                    }
                    
                    if (address.neighbourhood || address.suburb) {
                        parts.push(address.neighbourhood || address.suburb);
                    }
                    
                    if (address.city || address.town || address.village) {
                        parts.push(address.city || address.town || address.village);
                    }
                    
                    if (address.state) {
                        parts.push(address.state);
                    }
                    
                    formattedAddress = parts.join(', ');
                }
                
                return formattedAddress || data.display_name;
            }
            
            throw new Error('No address found');
        } catch (error) {
            console.warn('Geocoding error:', error);
            throw error;
        }
    }

    async createReportElement(report, index) {
        const reportDiv = document.createElement('div');
        reportDiv.className = 'report-item';
        reportDiv.setAttribute('data-report-id', report.id);
        
        // Format timestamp
        const timestamp = this.formatTimestamp(report.timestamp);
        
        // Get address for location
        let locationText = 'Loading location...';
        try {
            const address = await this.getAddressFromCoordinates(report.latitude, report.longitude);
            locationText = address;
        } catch (error) {
            locationText = this.formatLocation(report.latitude, report.longitude);
        }
        
        // Get category class for styling
        const categoryClass = this.getCategoryClass(report.category);
        
        // Create basic report info (always visible)
        reportDiv.innerHTML = `
            <div class="report-header">
                <div class="report-category ${categoryClass}">${report.category}</div>
                <div class="report-timestamp">${timestamp}</div>
                <div class="expand-indicator">▼</div>
            </div>
            <div class="report-location">📍 ${locationText}</div>
            ${report.description ? `<div class="report-description">${this.escapeHtml(report.description)}</div>` : ''}
            <div class="report-details" id="details-${index}">
                <div class="report-full-info">
                    <strong>📋 Full Details:</strong>
                    <div style="margin-top: 0.5rem;">
                        <div><strong>🏷️ Category:</strong> ${report.category}</div>
                        <div><strong>📅 Reported:</strong> ${timestamp}</div>
                        <div><strong>📍 Location:</strong> ${locationText}</div>
                        <div><strong>🗺️ Coordinates:</strong> ${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}</div>
                        ${report.description ? `<div><strong>📝 Description:</strong> ${this.escapeHtml(report.description)}</div>` : ''}
                    </div>
                    ${report.photo_base64 ? `
                        <div class="report-photo">
                            <img src="data:image/jpeg;base64,${report.photo_base64}" 
                                 alt="Photo of accessibility issue" 
                                 loading="lazy">
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Add click handler to toggle details
        reportDiv.addEventListener('click', () => {
            this.toggleReportDetails(reportDiv, index);
        });
        
        return reportDiv;
    }

    toggleReportDetails(reportElement, index) {
        const detailsElement = document.getElementById(`details-${index}`);
        const isExpanded = reportElement.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            reportElement.classList.remove('expanded');
            detailsElement.classList.remove('expanded');
        } else {
            // Expand
            reportElement.classList.add('expanded');
            detailsElement.classList.add('expanded');
        }
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    }

    formatLocation(lat, lng) {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    getCategoryClass(category) {
        const categoryMap = {
            'Elevator Out of Service': 'elevator',
            'Blocked Ramp': 'ramp',
            'Inaccessible Vehicle': 'vehicle',
            'Missing Audio': 'audio',
            'Other': 'other'
        };
        return categoryMap[category] || 'other';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoadingState() {
        this.hideAllStates();
        this.loadingState.classList.remove('hidden');
        this.reportsCount.textContent = 'Loading...';
    }

    showEmptyState() {
        this.hideAllStates();
        this.emptyState.classList.remove('hidden');
        this.reportsCount.textContent = 'No Reports';
    }

    showErrorState() {
        this.hideAllStates();
        this.errorState.classList.remove('hidden');
        this.reportsCount.textContent = 'Error Loading';
    }

    hideAllStates() {
        this.loadingState.classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.errorState.classList.add('hidden');
        this.reportsList.style.display = 'block';
    }

    // Method to refresh reports (can be called externally)
    async refreshReports() {
        await this.loadReports();
    }
}

// Mobile device detection and optimization
const MobileOptimizations = {
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    },

    isIOS: function() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    },

    isAndroid: function() {
        return /Android/.test(navigator.userAgent);
    },

    // Prevent zoom on input focus for iOS
    preventZoomOnFocus: function() {
        if (this.isIOS()) {
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    document.querySelector('meta[name=viewport]').setAttribute(
                        'content', 
                        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                    );
                });
                
                input.addEventListener('blur', function() {
                    document.querySelector('meta[name=viewport]').setAttribute(
                        'content', 
                        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                    );
                });
            });
        }
    },

    // Improve touch scrolling
    improveTouchScrolling: function() {
        if (this.isMobile()) {
            document.body.style.webkitOverflowScrolling = 'touch';
            document.body.style.overflowScrolling = 'touch';
        }
    },

    // Test camera availability
    testCameraAvailability: function() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    // Camera is available
                    stream.getTracks().forEach(track => track.stop());
                    console.log('Camera access available');
                })
                .catch(function(error) {
                    console.log('Camera access not available:', error);
                });
        }
    },

    // Initialize all mobile optimizations
    init: function() {
        this.preventZoomOnFocus();
        this.improveTouchScrolling();
        this.testCameraAvailability();
        
        // Add mobile class to body for CSS targeting
        if (this.isMobile()) {
            document.body.classList.add('mobile-device');
        }
        
        if (this.isIOS()) {
            document.body.classList.add('ios-device');
        }
        
        if (this.isAndroid()) {
            document.body.classList.add('android-device');
        }
    }
};

// Initialize report form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile optimizations first
    MobileOptimizations.init();

    // Initialize existing navigation functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Initialize report form
    window.reportForm = new ReportForm();
    
    // Initialize map view
    window.mapView = new MapView();
    
    // Initialize reports list
    window.reportsList = new ReportsList();

    // Add orientation change handler for mobile
    if (MobileOptimizations.isMobile()) {
        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                // Refresh map if it exists
                if (window.mapView && window.mapView.map) {
                    window.mapView.map.invalidateSize();
                }
            }, 100);
        });
    }
});