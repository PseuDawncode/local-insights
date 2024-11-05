import React from 'react';
import { useState } from 'react';
import Departures from './components/Departures';
import Weather from './components/Weather';
import SearchInput from './components/SearchInput';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
    const [coordinates, setCoordinates] = useState<{
        lat: number;
        lon: number;
    } | null>(null);

    // const [coordinates, setCoordinates] = useState<{
    //     lat: number;
    //     lon: number;
    // } | null>({
    //     lat: 57.7089,
    //     lon: 11.9746, // Gothenburg coordinates for testing
    // });

    const handleSearch = (locationCoords: { lat: number; lng: number }) => {
        // Map lng (Google API) to lon (OpenWeather API)
        const mappedCoordinates = {
            lat: locationCoords.lat,
            lon: locationCoords.lng,
        };
        setCoordinates(mappedCoordinates);
    };

    return (
        <div className='App'>
            <header className='App-header'>
                <h1>Local Travel and Weather Dashboard</h1>
            </header>

            {/* <SearchInput setCoordinates={setCoordinates} /> */}
            <SearchInput setCoordinates={handleSearch} />

            {coordinates && (
                <div className='coordinates-display'>
                    <h2>Coordinates:</h2>
                    <p>Latitude: {coordinates.lat}</p>
                    <p>Longitude: {coordinates.lon}</p>
                </div>
            )}
            {/* logic */}
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
        </div>
    );
};

export default App;
