import { useState, useEffect, useContext } from "react";
import "../App.css";
import { LocationContext } from "../App";

const Situations = () => {
  const searchInputData = useContext(LocationContext);
  const [deviationData, setDeviationData] = useState<any[]>([]);
  
  const formatDateTime = (stringConvert: string | number | Date) => {
    const date = new Date(stringConvert);
    return date.toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })
  };

  const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

  useEffect(() => {
    if (searchInputData?.lat && searchInputData?.lon) {
      const fetchTrafficData = async () => {
        const xmlData = `
          <REQUEST>
            <LOGIN authenticationkey="${import.meta.env.VITE_TRAFIKVERKET_API_KEY}"/>
            <QUERY objecttype="Situation" schemaversion="1" limit="10">
              <FILTER>
                <NEAR name="Deviation.Geometry.WGS84" value="${searchInputData.lat} ${searchInputData.lon}"/>
                <GT name="Deviation.CreationTime" value="2024-10-23"/>
              </FILTER>
            </QUERY>
          </REQUEST>
        `;
        try {
          const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "text/xml" }, body: xmlData });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          };

          const data = await response.json();
          const situations = data.RESPONSE.RESULT[0].Situation || [];
          const parsedData = situations.slice(0, 5).map((situation: any) => ({
            message: situation.Deviation[0].Message,
            locationDescriptor: situation.Deviation[0].LocationDescriptor,
            startTime: formatDateTime(situation.Deviation[0].StartTime),
            roadNumber: situation.Deviation[0].RoadNumber || "-",
            severityText: situation.Deviation[0].SeverityText,
          }));

          setDeviationData(parsedData);
          console.log("Data fetched successfully:", parsedData);
        } catch (error: any) {
          console.error("Error fetching data:", error.message);
        };
      };
      fetchTrafficData();
    } else {
      console.log("No coordinates found");
    }
  }, [searchInputData]);

  return (
    <div className="container" id="Situations">
      <h3>Latest Traffic Deviations</h3>
      <table id="log">
        <tbody>
          <tr>
            <th>Deviations</th>
            <th>Location</th>
            <th>Message</th>
            <th>Road</th>
            <th>Disturbance</th>
          </tr>
          {deviationData.length > 0 ? (deviationData.map((situation, index) => (
            <tr key={index}>
              <td>{situation.message}</td>
              <td>{situation.locationDescriptor}</td>
              <td>{situation.startTime}</td>
              <td>{situation.roadNumber}</td>
              <td>{situation.severityText}</td>
            </tr>
            )))
            :
            (<tr>No deviations fetched for the selected location.</tr>)}
        </tbody>
      </table>
    </div>
  );
};
export default Situations;