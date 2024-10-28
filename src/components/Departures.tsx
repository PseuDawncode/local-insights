function Departures() {

    const departuresData = async () => {
        const apiKey = import.meta.env.VITE_API_KEY;
       // let address: string = "Luftkabelgatan 8 Stockholm";

        try { 
        const dataValues: Response = await fetch(`https://geocode.maps.co/search?q=${address}&api_key=${apiKey}`);
        if(!dataValues.ok) {
            throw new Error("Network response unavailable");
        }
            const returnData = await dataValues.json();
            // const lat = returnData.lat;
            // const lon = returnData.lon;

            // console.log("Current latitude is: " + returnData[0].lat);
            // console.log("Current longitude is: " + returnData[0].lon);
            console.log(returnData[0].display_name)
        } catch (error) {
            console.error(error);
        }
    };

    departuresData();

    return (
        <table id="departures-table">
            <tbody>
                <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Platform</th>
                    <th>Time</th>
                    <th>Type</th>
                </tr>
                <tr>
                    <td>Insert API "From" town here</td>
                    <td>Insert API "To" town here</td>
                    <td>Insert API platform here</td>
                    <td>Insert API time here</td>
                    <td>Insert API type here</td>
                </tr>
                <tr>
                    <td>Insert API "From" town here</td>
                    <td>Insert API "To" town here</td>
                    <td>Insert API platform here</td>
                    <td>Insert API time here</td>
                    <td>Insert API type here</td>
                </tr>
                <tr>
                    <td>Insert API "From" town here</td>
                    <td>Insert API "To" town here</td>
                    <td>Insert API platform here</td>
                    <td>Insert API time here</td>
                    <td>Insert API type here</td>
                </tr>
            </tbody>
        </table>
    )
}

export default Departures;