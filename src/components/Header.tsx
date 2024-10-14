import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

interface GeocodeResult {
  lat: number;
  lng: number;
}

interface GoogleGeocodeResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
}

interface HeaderProps {
  title: string;  
  onSearch: (coordinates: GeocodeResult | null) => void; 
}

const Header: React.FC<HeaderProps> = ({ title, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getCoordinates = async () => {
    try {
      const response = await axios.get<GoogleGeocodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: searchTerm,
            key: 'YOUR_GOOGLE_API_KEY', // Replace with your API key
          },
        }
      );

      const result = response.data.results[0];
      if (result) {
        const location = result.geometry.location;
        onSearch({ lat: location.lat, lng: location.lng });
        setError(null);
      } else {
        setError('No results found for the given address.');
        onSearch(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to fetch coordinates: ${err.message}`);
      } else {
        setError('Failed to fetch coordinates. Please try again.');
      }
      onSearch(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm) {
      getCoordinates();
    } else {
      setError('Please enter a valid address.');
    }
  };

  return (
    <div className="header-container">
      <header className="header">
        <div className="logo-container">
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

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Header;
