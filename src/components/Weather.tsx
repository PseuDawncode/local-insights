import React, { useState, useEffect } from 'react';

interface WeatherProps {
    coordinates: { lat: number; lon: number };
}

const Weather: React.FC<WeatherProps> = ({ coordinates }) => {
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
                    `/weather/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
                );

                // const weatherResponse = await fetch(
                //     `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current&units=metric&appid=${apiKey}`
                // );

                // const weatherResponse = await fetch(
                //     `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
                // );

                console.log('Full weather response:', weatherResponse);

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

    const dailyData =
        weatherData?.list?.filter((item: any) =>
            item.dt_txt.includes('12:00:00')
        ) || [];

    return (
        <div>
            <div className='weather-forecast'>
                <h3>5-Day Weather Forecast for Selected Location</h3>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : weatherData ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Temperature (°C)</th>
                                <th>Rain Probability (%)</th>
                                <th>Weather</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyData.map((day: any, index: number) => (
                                <tr key={index}>
                                    <td>
                                        {new Date(
                                            day.dt_txt
                                        ).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                        })}
                                    </td>
                                    <td>{day.main.temp}°C</td>
                                    <td>{(day.pop * 100).toFixed(0)}%</td>
                                    <td>
                                        <img
                                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                                            alt={day.weather[0].description}
                                        />
                                        {day.weather[0].description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No weather data available.</p>
                )}
            </div>
        </div>
    );
};

export default Weather;
