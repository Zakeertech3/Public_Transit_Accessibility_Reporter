
// Utility function to get address from coordinates using reverse geocoding
async function getAddressFromCoordinates(lat, lng) {
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

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Report Form Logic
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        const getLocationBtn = document.getElementById('getLocationBtn');
        const locationStatus = document.getElementById('locationStatus');
        const category = document.getElementById('category');
        const submitBtn = document.getElementById('submitBtn');
        let userLocation = null;

        getLocationBtn.addEventListener('click', () => {
            // Show loading state
            getLocationBtn.disabled = true;
            getLocationBtn.textContent = '📍 Getting Location...';
            locationStatus.textContent = 'Getting your location...';
            locationStatus.style.color = '#0066cc';
            
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            };
            
            navigator.geolocation.getCurrentPosition(async position => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                // Get actual address from coordinates
                try {
                    const address = await getAddressFromCoordinates(
                        position.coords.latitude, 
                        position.coords.longitude
                    );
                    locationStatus.textContent = `📍 Location: ${address}`;
                    locationStatus.style.color = 'green';
                } catch (error) {
                    console.warn('Could not get address:', error);
                    const coords = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
                    locationStatus.textContent = `📍 Location: ${coords}`;
                    locationStatus.style.color = 'green';
                }
                
                // Reset button
                getLocationBtn.disabled = false;
                getLocationBtn.textContent = '📍 Update Location';
                validateForm();
            }, error => {
                let errorMessage = 'Error getting location. ';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location access was denied. Please enable location services.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                        break;
                }
                
                locationStatus.textContent = errorMessage;
                locationStatus.style.color = 'red';
                getLocationBtn.disabled = false;
                getLocationBtn.textContent = '📍 Try Again';
                console.error('Geolocation error:', error);
            }, options);
        });

        category.addEventListener('change', validateForm);

        function validateForm() {
            const isCategorySelected = category.value !== '';
            const isLocationAcquired = userLocation !== null;
            submitBtn.disabled = !isCategorySelected || !isLocationAcquired;
        }

        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(reportForm);
            const data = {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                category: formData.get('category'),
                description: formData.get('description'),
                photo_base64: null // Photo functionality to be added
            };

            try {
                const response = await fetch('http://localhost:8000/api/reports', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Report submitted successfully!');
                    reportForm.reset();
                    locationStatus.textContent = '';
                    userLocation = null;
                    submitBtn.disabled = true;
                    // Reset location button text
                    getLocationBtn.textContent = '📍 Get Current Location';
                } else {
                    alert('Error submitting report.');
                }
            } catch (error) {
                alert('Error submitting report.');
            }
        });
    }

    // Map Logic
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const refreshMapBtn = document.getElementById('refreshMapBtn');
        refreshMapBtn.addEventListener('click', fetchReportsForMap);

        async function fetchReportsForMap() {
            try {
                const response = await fetch('http://localhost:8000/api/reports');
                const reports = await response.json();
                reports.forEach(report => {
                    const marker = L.marker([report.latitude, report.longitude]).addTo(map);
                    marker.bindPopup(`<b>${report.category}</b><br>${report.description}`);
                });
            } catch (error) {
                console.error('Error fetching reports for map:', error);
            }
        }

        fetchReportsForMap();
    }

    // Reports List Logic
    const reportsListElement = document.getElementById('reportsList');
    if (reportsListElement) {
        const reportsCount = document.getElementById('reportsCount');
        const searchInput = document.getElementById('searchInput');
        const refreshReportsBtn = document.getElementById('refreshReportsBtn');
        let allReports = [];

        refreshReportsBtn.addEventListener('click', fetchAllReports);
        searchInput.addEventListener('input', filterReports);

        async function fetchAllReports() {
            try {
                const response = await fetch('http://localhost:8000/api/reports');
                allReports = await response.json();
                renderReports(allReports);
            } catch (error) {
                console.error('Error fetching all reports:', error);
            }
        }

        function renderReports(reports) {
            reportsListElement.innerHTML = '';
            reportsCount.textContent = `${reports.length} reports`;

            if (reports.length === 0) {
                document.getElementById('emptyState').classList.remove('hidden');
                return;
            }

            document.getElementById('emptyState').classList.add('hidden');
            reports.forEach(report => {
                const reportElement = document.createElement('div');
                reportElement.className = 'report-item';
                reportElement.innerHTML = `
                    <div class="report-header">
                        <div class="report-category">${report.category}</div>
                        <div class="report-timestamp">${new Date(report.timestamp).toLocaleString()}</div>
                    </div>
                    <div class="report-location">${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}</div>
                    <div class="report-description">${report.description}</div>
                    <button class="delete-btn" data-id="${report.id}">Delete</button>
                `;
                reportsListElement.appendChild(reportElement);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', handleDelete);
            });
        }

        async function handleDelete(event) {
            const reportId = event.target.dataset.id;
            if (confirm('Are you sure you want to delete this report?')) {
                try {
                    const response = await fetch(`http://localhost:8000/api/reports/${reportId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        fetchAllReports();
                    } else {
                        alert('Error deleting report.');
                    }
                } catch (error) {
                    alert('Error deleting report.');
                }
            }
        }

        function filterReports() {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredReports = allReports.filter(report => {
                return report.category.toLowerCase().includes(searchTerm) || 
                       report.description.toLowerCase().includes(searchTerm);
            });
            renderReports(filteredReports);
        }

        fetchAllReports();
    }
});
