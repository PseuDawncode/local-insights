import React, {useState, useEffect} from 'react';
import SearchBar from './SearchBar';

  
interface WeatherProps {
    lat: number;
    lon: number;
}

const Weather: WeatherProps = ({lat, lng}) => {
    const (weatherData, setWeatherData) = useState <any | null>;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        setIsLoading(true);
        setError(null);

        try{
            const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
            const weatherResponse = await fetch ('');
            const weatherData =await weatherResponse.json();
            setWeatherData (weatherData);
        }catch (error){
            setError ('Failed to fetch weather data')
        }finally{
            isLoading(false);
        }
    })
    

    const dailyData = weatherData?.daily.slice(0, 5) || [];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


    return (
        <div className="weather-forecast">
          <h3>Weather Forecast (Monday to Friday)</h3>
          {weatherData ? (
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
                    <td>{daysOfWeek[index]}</td>
                    <td>{day.temp.day}°C</td>
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
      );
    };
 
export default Weather;