import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Departures from './components/Departures';
import Weather from './components/Weather';
import SearchInput from './components/SearchInput';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
    const [coordinates, setCoordinates] = useState<{
        lat: number;
        lon: number;
    } | null>(null);

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [stationData, setStationData] = useState<any>(null);

    // Function to handle geolocation success
    const handleSuccess = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

        // Also set the coordinates for the weather component
        setCoordinates({ lat: latitude, lon: longitude });

        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        sendLocationToBackend(latitude, longitude);
    };

    // Request geolocation
    const requestGeolocation = () => {
        setLoading(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handleSuccess);
        } else {
            setLoading(false); // Stop loading if geolocation is not supported
        }
    };

    // Send geolocation to backend
    const sendLocationToBackend = async (latitude: number, longitude: number) => {
        try {
            const response = await axios.post('http://localhost:3000/location', {
                latitude,
                longitude,
            });
            setStationData(response.data); // Store the station data in state
        } catch (error) {
            console.error('Error sending location to backend:', error);
        } finally {
            setLoading(false); // Stop loading after request finishes
        }
    };

    // Log stationData only after it's updated
    useEffect(() => {
        if (stationData) {
            // Clean station name
            const cleanStationName = stationData.departures[0].stop.replace(
                /\s*\(.*?\)\s*/g,
                ''
            );
            console.log('Nearest Station: ' + cleanStationName);
        }
    }, [stationData]);

    const handleSearch = (locationCoords: { lat: number; lng: number }) => {
        // Map lng (Google API) to lon (OpenWeather API)
        const mappedCoordinates = {
            lat: locationCoords.lat,
            lon: locationCoords.lng,
        };
        setCoordinates(mappedCoordinates);
    };

    return (
        <div className="App">
            <h1>Find Nearby Departures</h1>
            <button onClick={requestGeolocation} disabled={loading}>
                {loading ? "Fetching location..." : "Get My Location"}
            </button>

            {/* Search Input */}
            <SearchInput setCoordinates={handleSearch} />

            {coordinates && (
                <div className='coordinates-display'>
                    <h2>Coordinates:</h2>
                    <p>Latitude: {coordinates.lat}</p>
                    <p>Longitude: {coordinates.lon}</p>
                </div>
            )}

            {/* Display nearby departures */}
            {stationData && (
                <div>
                    <h2>
                        Nearest Station:{' '}
                        {stationData.departures[0].stop.replace(/\s*\(.*?\)\s*/g, '')}
                    </h2>
                    <hr />
                    <h3>Upcoming Departures:</h3>
                    <ul>
                        {stationData.departures.map((departure: any, index: number) => (
                            <li key={index}>
                                {departure.name} to{' '}
                                {departure.direction.replace(/\s*\(.*?\)\s*/g, '')} at{' '}
                                {departure.time.slice(0, 5)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Weather Component */}
            <div className='main-container'>
                <Departures />
                <div className='temp weather'>
                    {coordinates && (
                        <Weather
                            coordinates={{
                                lat: coordinates.lat,
                                lon: coordinates.lon,
                            }}
                        />
                    )}
                </div>
                <div className='temp opt-info' />
                <div className='temp traffic' />
            </div>

            {latitude && longitude && (
                <p>
                    Your location: Latitude: {latitude}, Longitude: {longitude}
                </p>
            )}
        </div>
    );
};

export default App;
