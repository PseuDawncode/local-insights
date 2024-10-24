import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [stationData, setStationData] = useState<any>(null);

  // Function to handle success when geolocation is retrieved
  const handleSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setLatitude(latitude);
    setLongitude(longitude);

    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    // Now send the location data to the backend
    sendLocationToBackend(latitude, longitude);
  };

  // Function to request geolocation
  const requestGeolocation = () => {
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess);
    } else {
      setLoading(false); // Stop loading if geolocation is not supported
    }
  };

  // Function to send location to the backend using axios
  const sendLocationToBackend = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.post("http://localhost:3000/location", {
        latitude,
        longitude,
      });
      setStationData(response.data); // Store the station data in state
    } catch (error) {
      console.error("Error sending location to backend:", error);
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
        ""
      );
      console.log("Nearest Station: " + cleanStationName);
    }
  }, [stationData]); // This useEffect runs whenever stationData is updated

  return (
    <div className="App">
      <h1>Find Nearby Departures</h1>
      <button onClick={requestGeolocation} disabled={loading}>
        {loading ? "Fetching location..." : "Get My Location"}
      </button>

      {stationData && (
        <div>
          {/* Clean the station name before displaying */}
          <h2>
            Nearest Station:{" "}
            {stationData.departures[0].stop.replace(/\s*\(.*?\)\s*/g, "")}
          </h2>
          <hr />
          <h3>Upcoming Departures:</h3>
          <ul>
            {stationData.departures.map((departure: any, index: number) => (
              <li key={index}>
                {departure.name} to{" "}
                {departure.direction.replace(/\s*\(.*?\)\s*/g, "")} at{" "}
                {departure.time.slice(0, 5)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {latitude && longitude && (
        <p>
          Your location: Latitude: {latitude}, Longitude: {longitude}
        </p>
      )}
    </div>
  );
};

export default App;