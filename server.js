import express from "express";
import cors from "cors";
import axios from "axios";

const backend = express();
const port = 3000;

backend.use(
  cors({
    origin: "http://localhost:5173", // Replace with your GitHub Pages link if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
backend.use(express.json()); // Middleware for parsing JSON

const apiKey = "3fb464c5-8fbb-4337-886b-cd5baa31e8d0"; // Replace with actual key
const googleApiKey = "AIzaSyBOShUQH0RF7USNk8kQNL9W6Li9dVpdU88"; // Replace with actual key
const departuresUrl = `https://api.resrobot.se/v2.1/departureBoard`;

// Fetch predictions based on user input for location autocomplete
backend.get("/api/predictions", async (req, res) => {
  const { input } = req.query; // Get 'input' from query string

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input,
          key: googleApiKey,
        },
      }
    );
    res.json(response.data.predictions || []);
  } catch (error) {
    console.error("Error fetching autocomplete predictions:", error);
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
});

// Get departure board data for a specific station
backend.get("/api/location/:stationId", async (req, res) => {
  const { stationId } = req.params;

  try {
    if (stationId) {
      const response = await axios.get(departuresUrl, {
        params: {
          id: stationId,
          format: "json",
          accessId: apiKey,
        },
      });
      const departure = response.data.Departure.slice(0, 5);
      res.json({ departure });
    } else {
      res.status(400).json({ error: "No station found near the location" });
    }
  } catch (error) {
    console.error("Error fetching departure board:", error);
    res.status(500).json({ error: "Server error" });
  }
});

backend.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
