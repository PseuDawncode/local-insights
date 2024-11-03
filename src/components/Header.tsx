import React, { useState } from 'react';
import '../App.css'; 
import UserInput from '../components/UserInput/searchInput';
import TrafficUpdates from '../components/trafficUpdates/trafficUpdates';

interface HeaderProps {
  title: string;
  logoSrc: string;
}

const Header: React.FC<HeaderProps> = ({ title, logoSrc }) => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Handler for updating coordinates
  const handleSetCoordinates = (coords: { lat: number; lng: number }) => {
    setCoordinates(coords);
    console.log('Coordinates received:', coords); 
  };

  return (
    <div className="header-container">
    <header className="header">
        <div className="logo-container">
          <img src={logoSrc} alt="Logo" className="logo" />
        </div>

        <div className="title-container">
          <h1 className="title">{title}</h1>
        </div>

        <div className="search-input-container">
          <UserInput setCoordinates={handleSetCoordinates} />
        </div>
      </header>


        {/* Display TrafficUpdates only when coordinates are available */}
        {coordinates && (
          <div className="map-section">
            <TrafficUpdates coordinates={coordinates} />
          </div>
        )}
      </div>

      <img src="/images/logo.png" alt="Logo" className="logo" />
      </div>
      <div className="title-container">
        <h1 className="title">{title}</h1>
      </div>
      <div className="searchbar-container">
        <form className="search-bar" onSubmit={handleSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Location..."
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
    </header>
    </div>
  );
};

export default Header;

