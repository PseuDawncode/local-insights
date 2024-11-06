import React from 'react';
import { useState } from 'react';
import './App.css';
import Departures from './components/Departures';
import Weather from './components/Weather';
import SearchInput from './components/SearchInput';
import 'bootstrap/dist/css/bootstrap.min.css';

export const LocationContext: React.Context<{ lat: number, lon: number }> = React.createContext(undefined as any);

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

    const handleSearch = (locationCoords: { lat: number; lon: number }) => {
        setCoordinates(locationCoords);
    };

    return (
        <div className='App'>
                <LocationContext.Provider value={coordinates ? coordinates : { lat: 0, lon: 0 }}>
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
                </LocationContext.Provider >
        </div>
    );
};

export default App;
