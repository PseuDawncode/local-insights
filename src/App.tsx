import React from 'react';
import { useState } from 'react';
import Header from './components/Header';
import Departures from './components/Departures';
import Weather from './components/Weather';

const App: React.FC = () => {
    const handleSearch = (searchTerm: string) => {
        console.log('Search term:', searchTerm);
    };

    // const [coordinates, setCoordinates] = useState<{
    //     lat: number;
    //     lon: number;
    // } | null>(null);

    const [coordinates, setCoordinates] = useState<{
        lat: number;
        lon: number;
    } | null>({
        lat: 57.7089,
        lon: 11.9746, // Gothenburg coordinates for testing
    });

    return (
        <div className='App'>
            <Header
                logoUrl='https://example.com/logo.png'
                title='Local Travel and Weather Dashboard'
                onSearch={handleSearch}
            />
            {/* logic */}
            <div className='main-container'>
                <Departures />
                <div className='temp weather'>
                    <Weather coordinates={coordinates} />
                </div>

                <div className='temp opt-info' />
                <div className='temp traffic' />
            </div>
        </div>
    );
};

export default App;
