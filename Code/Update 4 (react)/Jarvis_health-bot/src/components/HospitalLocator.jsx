import { useState, useEffect } from 'react';
import './HospitalLocator.css';

const HospitalLocator = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getNearbyHospitals = async (lat, lng) => {
    setLoading(true);
    try {
      // In a real app, you would use Google Maps API here
      // const response = await axios.get(`/api/hospitals?lat=${lat}&lng=${lng}`);
      // setHospitals(response.data);
      
      // Mock data for demo
      const mockHospitals = [
        {
          id: 1,
          name: "Apollo Hospital",
          address: "21, Greams Lane, Off Greams Road, Chennai",
          distance: "2.5 km",
          phone: "+91 44 2829 3333"
        },
        {
          id: 2,
          name: "Fortis Malar Hospital",
          address: "52, 1st Main Road, Gandhi Nagar, Adyar, Chennai",
          distance: "3.1 km",
          phone: "+91 44 4289 2222"
        },
        {
          id: 3,
          name: "MIOT International",
          address: "4/112, Mount Poonamallee Road, Manapakkam, Chennai",
          distance: "5.7 km",
          phone: "+91 44 2249 2288"
        }
      ];
      
      setTimeout(() => {
        setHospitals(mockHospitals);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          getNearbyHospitals(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // In a real app, you would search by location
      getNearbyHospitals(13.0827, 80.2707); // Default to Chennai coordinates
    }
  };

  return (
    <div className="hospital-locator">
      <div className="locator-header">
        <h2>Find Nearby Hospitals</h2>
        <div className="location-controls">
          <button onClick={getUserLocation} disabled={loading}>
            {loading ? 'Locating...' : 'Use My Location'}
          </button>
          <div className="search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter location..."
            />
            <button onClick={handleSearch}>
              <i className="ri-search-line"></i>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <i className="ri-loader-4-line"></i>
        </div>
      ) : (
        <div className="hospital-list">
          {hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <div key={hospital.id} className="hospital-card">
                <div className="hospital-icon">
                  <i className="ri-hospital-line"></i>
                </div>
                <div className="hospital-info">
                  <h3>{hospital.name}</h3>
                  <p>{hospital.address}</p>
                  <div className="hospital-meta">
                    <span><i className="ri-map-pin-line"></i> {hospital.distance}</span>
                    <span><i className="ri-phone-line"></i> {hospital.phone}</span>
                  </div>
                </div>
                <button className="direction-btn">
                  <i className="ri-map-pin-line"></i> Directions
                </button>
              </div>
            ))
          ) : (
            <div className="no-results">
              <i className="ri-map-pin-line"></i>
              <p>No hospitals found. Try searching another location.</p>
            </div>
          )}
        </div>
      )}

      <div className="map-container">
        {/* In a real app, you would integrate Google Maps here */}
        <div className="map-placeholder">
          <i className="ri-map-2-line"></i>
          <p>Map would display here with hospital locations</p>
        </div>
      </div>
    </div>
  );
};

export default HospitalLocator;