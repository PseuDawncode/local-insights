import express from "express";
import cors from "cors";
import axios from "axios";

const backend = express();
const port = 3000;

backend.use(cors()); // allows requests from the React frontend
backend.use(express.json()); // middleware for parsin JSON

const apiKey = "3fb464c5-8fbb-4337-886b-cd5baa31e8d0";
const departures = `https://api.resrobot.se/v2.1/departureBoard`;

const getDepartureBoardData = async (stationId) => {
    try {
        const response = await axios.get(departures, {
            params: {
                id: stationId,
                format: "json",
                accessId: apiKey,
            },
        });
        console.log(response)
        const departure = response.data.Departure.slice(0, 5);
        return departure;
    } catch (error) {
        console.error("Error fetching departure board: ", error);
        throw error;
    }
};

backend.get("/location/:stationId", async (req, res) => {
    const { stationId } = req.params;

    try {
        if (stationId) {
            const departure = await getDepartureBoardData(stationId);
            res.json({ departure });
        } else {
            res.status(400).json({ error: "No station found near the location" });
        }

    } catch (error) {
        console.error("Server error: ", error);
        res.status(500).json({error: "Server error"});
    }
});

backend.listen(port, () => {
    console.log(`It's aliiiive on port ${port}!`);
});