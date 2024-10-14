import React, { useState } from 'react';
import Header from './Header';  // Import your Header component
import axios from 'axios';

const TravelDashboard = () => {
  const [travelData, setTravelData] = useState([]);

  interface TravelResponse {
    departure: TravelData[]; // Assuming `departure` is an array of `TravelData` items
  }
  

  const fetchTravelData = () => {
    // Replace this with the actual API endpoint from Trafiklab or other service
    axios.get(`https://geocode.maps.co/search?q=luftkabelgatan%208%20stockholm&api_key=6707a255441e8184375584qlg3f5e72`)
      .then(response => {
        // Assuming response.data contains an array of travel data
        setTravelData(response.data.departure); // Adjust according to your API structure
      })
      .catch(error => {
        console.error('Error fetching travel data:', error);
      });
  };

  return (
    <div className="travel-dashboard">
      {/* Pass the search function to the Header */}
      <Header 
        logoUrl="/images/logo.png" 
        title="Local Travel and Weather Dashboard" 
        onSearch={fetchTravelData} 
      />

      {/* Travel Table that updates based on the search result */}
      <table className="travel-table">
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
          {travelData.length > 0 ? (
            travelData.map((travel, index) => (
              <tr key={index}>
                <td>{travel.from}</td>
                <td>{travel.to}</td>
                <td>{travel.platform}</td>
                <td>{travel.time}</td>
                <td>{travel.type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TravelDashboard;
