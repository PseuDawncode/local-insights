import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors()); // Allow requests from React frontend
app.use(express.json()); // Middleware to parse JSON bodies


// Function to get the nearest stationId based on geolocation
const getNearestStationId = async (latitude, longitude) => {
  try {
    const response = await axios.get(stationsProximityApiUrl, {
      params: {
        originCoordLat: latitude,
        originCoordLong: longitude,
        format: "json",
        accessId: apiKey,
      },
    });
    // Assuming the first station is the nearest one
    const nearestStation =
      response.data.stopLocationOrCoordLocation[0].StopLocation;
    // console.log(" nearestStation :" + JSON.stringify(nearestStation, null, 2));
    return nearestStation.id;
  } catch (error) {
    console.error("Error fetching nearest station:", error);
    throw error;
  }
};

// Function to get the departure board based on stationId
const getDepartureBoard = async (stationId) => {
  try {
    const response = await axios.get(departureBoardApiUrl, {
      params: {
        id: stationId,
        format: "json",
        accessId: apiKey,
      },
    });

    const departures = response.data.Departure.slice(0, 5); // Return first 5 departures
    return departures;
  } catch (error) {
    console.error("Error fetching departure board:", error);
    throw error;
  }
};

// POST route to handle the location sent from the frontend
app.post("/location", async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const stationId = await getNearestStationId(latitude, longitude);
    if (stationId) {
      const departures = await getDepartureBoard(stationId);
      res.json({ departures });
    } else {
      res.status(400).json({ error: "No station found near the location." });
    }
  } catch (error) {
    console.error("Server error: ", error); // More detailed error logging
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});