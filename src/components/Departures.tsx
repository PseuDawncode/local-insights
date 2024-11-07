import { useEffect, useState, useContext } from "react";
import { LocationContext } from "../App";

function Departures() {
  const searchInputData = useContext(LocationContext);

  const [departureData, setDepartureData] = useState<
    {
      fromStop: string;
      toStop: string;
      platform: number;
      departureTime: string;
      transportType: string;
    }[]
  >([]);

  interface Departure {
    fromStop: string;
    toStop: string;
    platform: number;
    departureTime: string;
    transportType: string;
  }

  useEffect(() => {
    const departuresData = async () => {
      if (searchInputData) {
        try {
          // Fetch nearby stops using coordinates
          const nearbyStopsResponse = await fetch(
            `https://api.resrobot.se/v2.1/location.nearbystops?format=json&accessId=${
              import.meta.env.VITE_TRAFIKVERKET_API_KEY
            }&originCoordLat=${searchInputData.lat}&originCoordLong=${
              searchInputData.lon
            }`
          );
          if (!nearbyStopsResponse.ok) {
            throw new Error("Failed to fetch nearby stops");
          }
          const nearbyStopsData = await nearbyStopsResponse.json();

          // Check if stopLocationOrCoordLocation has at least one element
          const stopLocation =
            nearbyStopsData.stopLocationOrCoordLocation &&
            nearbyStopsData.stopLocationOrCoordLocation[0]?.StopLocation;

          if (!stopLocation?.id) {
            throw new Error(
              "No valid stop ID found for the provided coordinates."
            );
          }

          // Fetch departure board using stop ID
          const departuresResponse = await fetch(
            `https://api.resrobot.se/v2.1/departureBoard?id=${
              stopLocation.id
            }&format=json&accessId=${import.meta.env.VITE_TRAFIKVERKET_API_KEY}`
          );
          if (!departuresResponse.ok) {
            throw new Error("Network response unavailable");
          }
          const finalData = await departuresResponse.json();

          const displayData: Departure[] = [];

          // Loop over the first 5 results from the departures response JSON
          for (let i = 0; i < 5; i++) {
            if (finalData.Departure[i]) {
              displayData.push({
                fromStop: finalData.Departure[i].stop,
                toStop: finalData.Departure[i].direction,
                platform: finalData.Departure[i].rtTrack,
                departureTime: finalData.Departure[i].time,
                transportType: finalData.Departure[i].Product[0].catOutL,
              });
            } else {
              break; // Exit loop if no more departures are found
            }
          }

          setDepartureData(displayData);
        } catch (error) {
          console.log("please enter your location");
        }
      }
    };

    departuresData();
  }, [searchInputData]);

  return (
    <section id="departures-table">
      <div className="departures-heading">Transport Departures</div>
      <table>
        <tbody>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Platform</th>
            <th>Time</th>
            <th>Type</th>
          </tr>
          {departureData.map((departureInfo, positionInArray) => (
            <tr key={positionInArray}>
              <td>{departureInfo.fromStop}</td>
              <td>{departureInfo.toStop}</td>
              <td>{departureInfo.platform}</td>
              <td>{departureInfo.departureTime}</td>
              <td>{departureInfo.transportType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Departures;
