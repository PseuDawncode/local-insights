import { useState, useEffect, useContext } from "react";
import "../App.css";
import "./Situations.css"
import { LocationContext } from "../App";

const Situations = () => {
  const searchInputData = useContext(LocationContext);
  const API_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";
  const [deviationData, setDeviationData] = useState<string>("");
  
  useEffect (() => {
    if (searchInputData) {
      const fetchTrafficData = async () => {
        const xmlData = `
          <REQUEST>
            <LOGIN authenticationkey="${import.meta.env.VITE_TRAFIKVERKET_API_KEY}"/>
            <QUERY objecttype="Situation" schemaversion="1" limit="10">
              <FILTER>
                <NEAR name="Deviation.Geometry.WGS84" value='${searchInputData.lat} ${searchInputData.lon}'/>
                <GT name="Deviation.CreationTime" value="2024-10-23T10:27:24.717+02:00"/>
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
          setDeviationData(JSON.stringify(data, null, 2));
          console.log("Data fetched successfully:", data);
        }
        catch (error: any) {
          setDeviationData(`Error: ${error.message}`);
          console.error("Error fetching data:", error.message);
        };
      };
    fetchTrafficData();
    };
  }, [searchInputData])

  return (
    <div className="container" id="Situations">
      <h1>Fetch Traffic Data</h1>
      <div id="log">
        {searchInputData? `${deviationData}`:""}
      </div>
    </div>
  );
};
export default Situations;