import React, { useState, useEffect } from 'react';

const Weather: React.FC<{
    coordinates: { lat: number; lon: number } | null;
}> = ({ coordinates }) => {
    const [weatherData, setWeatherData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!coordinates) return;

        const fetchWeatherData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                // console.log('API Key:', import.meta.env.VITE_WEATHER_API_KEY);

                if (!apiKey) throw new Error('API key not found');

                const { lat, lon } = coordinates;

                console.log(
                    `Fetching weather data for lat: ${lat}, lon: ${lon}`
                );

                const weatherResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
                );

                if (!weatherResponse.ok) {
                    const errorMsg = `Failed to fetch weather data: ${weatherResponse.status} ${weatherResponse.statusText}`;
                    console.error(errorMsg);
                    throw new Error(errorMsg);
                }

                const weatherData = await weatherResponse.json();
                console.log(
                    'Weather data:',
                    JSON.stringify(weatherData, null, 2)
                );
                console.log('Weather data:', weatherData);
                setWeatherData(weatherData);
            } catch (error: any) {
                setError(error.message || 'Failed to fetch weather data');
                console.error('Error fetching weather data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeatherData();
    }, [coordinates]);

    // const dailyData = weatherData?.daily?.slice(0, 5) || [];
    // const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div>
            <div className='weather-forecast'>
                <h3>
                    Current Weather for{' '}
                    {coordinates ? 'Selected Location' : 'Gothenburg'}
                </h3>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : weatherData ? (
                    <div>
                        <p>Temperature: {weatherData.main.temp}°C</p>
                        <p>Weather: {weatherData.weather[0].description}</p>
                        <img
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                            alt={weatherData.weather[0].description}
                        />
                    </div>
                ) : (
                    <p>No weather data available.</p>
                )}
            </div>
        </div>
    );
};

export default Weather;
