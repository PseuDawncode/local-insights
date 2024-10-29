import { useState } from "react";

function Departures() {

    const [departureData, setDepartureData] = useState<{
        fromStop: string;
        toStop: string;
        departureTime: string;
        transportType: string
    }[]>([]);

    const departuresData = async () => {
        
         // const apiKey = import.meta.env.TRAFIKVERKET_API_KEY;
        try {
            const nearbyStops = await fetch(`https://api.resrobot.se/v2.1/departureBoard?id=740000002&format=json&accessId=${import.meta.env.VITE_TRAFIKVERKET_API_KEY}`);
            if (!nearbyStops.ok) {
                throw new Error("Network response unavailable");
            }
            const finalData = await nearbyStops.json();

            const displayData = [
                {
                    fromStop: finalData.Departure[0].stop,
                    toStop: finalData.Departure[0].direction,
                    departureTime: finalData.Departure[0].time,
                    transportType: finalData.Departure[0].Product.catOutL
                },
                {
                    fromStop: finalData.Departure[1].stop,
                    toStop: finalData.Departure[1].direction,
                    departureTime: finalData.Departure[1].time,
                    transportType: finalData.Departure[1].Product.catOutL
                },
                {
                    fromStop: finalData.Departure[2].stop,
                    toStop: finalData.Departure[2].direction,
                    departureTime: finalData.Departure[2].time,
                    transportType: finalData.Departure[2].Product.catOutL
                },
                {
                    fromStop: finalData.Departure[3].stop,
                    toStop: finalData.Departure[3].direction,
                    departureTime: finalData.Departure[3].time,
                    transportType: finalData.Departure[3].Product.catOutL
                },
                {
                    fromStop: finalData.Departure[4].stop,
                    toStop: finalData.Departure[4].direction,
                    departureTime: finalData.Departure[4].time,
                    transportType: finalData.Departure[4].Product.catOutL
                },
            ];

            setDepartureData(displayData);
        } catch (error) {
            console.error(error);
        }
    };

    departuresData();

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
                            <td>Insert API platform here</td>
                            <td>{departureInfo.departureTime}</td>
                            <td>{departureInfo.transportType}</td>
                        </tr>
                    ))}


                </tbody>
            </table>
        </section>
    )
}

export default Departures;