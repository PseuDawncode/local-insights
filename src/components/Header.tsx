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

interface TransportData {
  from: string;
  to: string;
  platform: string;
  time: string;
  type: string;
}

interface HeaderProps {
  title: string;
  onSearch: (coordinates: GeocodeResult | null) => void;
}

const Header: React.FC<HeaderProps> = ({ title, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [transportData, setTransportData] = useState<TransportData[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getCoordinates = async () => {
    try {
      const response = await axios.get<GoogleGeocodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`,
        {
          params: {
            address: searchTerm,
            key: 'AIzaSyBOShUQH0RF7USNk8kQNL9W6Li9dVpdU88', 
          },
        }
      );

      const result = response.data.results[0];
      if (result) {
        const location = result.geometry.location;
        onSearch({ lat: location.lat, lng: location.lng });
        setError(null);

        // Fetch transportation data
        getTransportData(); 
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

  const getTransportData = () => {
    const sampleData: TransportData[] = [
      { from: '', to: '', platform: '', time: '', type: '' },
      { from: 'Helsingborg', to: 'Gothenburg', platform: '3', time: '11:30 AM', type: 'Train' },
      { from: 'Helsingborg', to: 'Copenhagen', platform: '5', time: '11:30 AM', type: 'Train' },
    ];

    setTransportData(sampleData);
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

      {/* logic for the table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Platform</th>
              <th>Time</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {transportData.length > 0 ? (
              transportData.map((data, index) => (
                <tr key={index}>
                  <td>{data.from}</td>
                  <td>{data.to}</td>
                  <td>{data.platform}</td>
                  <td>{data.time}</td>
                  <td>{data.type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No transport data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Header;
