import { useEffect, useState } from "react";

function Departures() {

    const [departureData, setDepartureData] = useState<{
        fromStop: string;
        toStop: string;
        departureTime: string;
        transportType: string
    }[]>([]);

    const departuresData = async () => {

        // const apiKey = import.meta.env.TRAFIKVERKET_API_KEY;
        try {//             const nearbyStops = await fetch(`https://api.resrobot.se/v2.1/departureBoard?id=740000002&format=json&accessId=${import.meta.env.VITE_TRAFIKVERKET_API_KEY}`);

            const nearbyStops = await fetch(`http://localhost:3000/location/740000002`);
            if (!nearbyStops.ok) {
                throw new Error("Network response unavailable");
            }
            const finalData = await nearbyStops.json();
            console.log(finalData)

            const displayData = [
                {
                    fromStop: finalData.departure[0].stop,
                    toStop: finalData.departure[0].direction,
                    departureTime: finalData.departure[0].time,
                    transportType: finalData.departure[0].Product[0].catOutL
                },
                {
                    fromStop: finalData.departure[1].stop,
                    toStop: finalData.departure[1].direction,
                    departureTime: finalData.departure[1].time,
                    transportType: finalData.departure[1].Product[0].catOutL
                },
                {
                    fromStop: finalData.departure[2].stop,
                    toStop: finalData.departure[2].direction,
                    departureTime: finalData.departure[2].time,
                    transportType: finalData.departure[2].Product[0].catOutL
                },
                {
                    fromStop: finalData.departure[3].stop,
                    toStop: finalData.departure[3].direction,
                    departureTime: finalData.departure[3].time,
                    transportType: finalData.departure[3].Product[0].catOutL
                },
                {
                    fromStop: finalData.departure[4].stop,
                    toStop: finalData.departure[4].direction,
                    departureTime: finalData.departure[4].time,
                    transportType: finalData.departure[4].Product[0].catOutL
                },
            ];

            setDepartureData(displayData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        departuresData()
    }, [])
    console.log(departureData)

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