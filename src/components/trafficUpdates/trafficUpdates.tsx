import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './trafficStyle.css';

interface TrafficUpdatesProps {
  coordinates: { lat: number; lng: number } | null;
}

const TrafficUpdates: React.FC<TrafficUpdatesProps> = ({ coordinates }) => {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = 'ed14f57660e248a08c5acfad1d1c0c39';

  useEffect(() => {
    if (!coordinates || !apiKey) return;

    const fetchTrafficUpdates = async () => {
      const requestBody = `
        <REQUEST>
          <LOGIN authenticationkey="${apiKey}"/>
          <QUERY objecttype="Situation" schemaversion="1" limit="10">
            <FILTER>
              <NEAR name="Deviation.Geometry.WGS84" value="${coordinates.lng} ${coordinates.lat}"/>
              <GT name="Deviation.CreationTime" value="2024-10-23T10:27:24.717+02:00"/>
            </FILTER>
          </QUERY>
        </REQUEST>`;

      try {
        setLoading(true);
        const response = await fetch('https://api.trafikinfo.trafikverket.se/v2/data.json', {
          method: 'POST',
          headers: { 'Content-Type': 'text/xml' },
          body: requestBody,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch traffic data');
        }

        const data = await response.json();
        const situations = data.RESPONSE?.RESULT[0]?.Situation || [];
        setTrafficData(situations);
        setError(null); 
      } catch (error) {
        console.error('Failed to fetch traffic data:', error);
        setError('Failed to load traffic updates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrafficUpdates();
  }, [coordinates, apiKey]);

 
  const mapCenter = coordinates ? [coordinates.lat, coordinates.lng] : [59.3293, 18.0686]; //Default Stockholm coords

  return (
    <div className="traffic-updates-container">
      <h2>Traffic Updates</h2>

      {loading ? (
        <p>Loading traffic updates...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {coordinates ? (
            <MapContainer
              center={mapCenter}
              zoom={12}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {trafficData.length > 0 ? (
                trafficData.map((incident, index) => {
                  const latLng = incident.Deviation?.Geometry?.WGS84?.split(' ').map(Number);

                
                  if (latLng && latLng.length === 2 && !isNaN(latLng[0]) && !isNaN(latLng[1])) {
                    return (
                      <Marker key={index} position={[latLng[1], latLng[0]]} icon={L.icon({ iconUrl: '/marker-icon.png' })}>
                        <Popup>
                          <strong>{incident.Title}</strong><br />
                          {incident.Description}
                        </Popup>
                      </Marker>
                    );
                  } else {
                    console.error('Invalid coordinates for incident:', incident);
                    return null;
                  }
                })
              ) : (
                <p>No traffic updates available.</p>
              )}
            </MapContainer>
          ) : (
            <p>Please provide valid coordinates to display the map.</p>
          )}
        </>
      )}
    </div>
  );
};

export default TrafficUpdates;
