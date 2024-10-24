import React, { useState } from 'react';
//import '../App.css'; 
import UserInput from '../components/UserInput/searchInput'; 


interface HeaderProps {
  title: string;
  logoSrc: string;
}

const Header: React.FC<HeaderProps> = ({ title, logoSrc }) => {
  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);

  // Handler for updating coordinates
  const handleSetCoordinates = (coords: { lat: number, lng: number }) => {
    setCoordinates(coords);
    console.log('Coordinates received:', coords); 
  };

  return (
    <div className="header-container">
      <header className="header">
        {/* Logo Section */}
        <div className="logo-container">
          <img src={logoSrc} alt="Logo" className="logo" />
        </div>

        {/* Title Section */}
        <div className="title-container">
          <h1 className="title">{title}</h1>
        </div>

        {/* Search Input Section */}
        <div className="search-input-container">
          <UserInput setCoordinates={handleSetCoordinates} />
        </div>
      </header>

      {/* Coordinates Display */}
      {coordinates && (
        <div className="coordinates-display">
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
        </div>
      )}
    </div>
  );
};

export default Header;
