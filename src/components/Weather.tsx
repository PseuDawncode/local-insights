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


    return ( 
        <div className="weather-container">
            
        </div>
    );
}
 
export default Weather;