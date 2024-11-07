import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { MagnifyingGlass, Spinner } from '../assets/SVGs';

interface UserInputProps {
  setCoordinates: (coordinates: { lat: number; lon: number }) => void;
}

const UserInput: React.FC<UserInputProps> = ({ setCoordinates }) => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [predictionSelected, setPredictionSelected] = useState<boolean>(false);
  const [autoPredictions, setAutoPredictions] = useState<any[]>([]);

  // Fetch autocomplete predictions when `location` updates and is more than 3 characters
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/predictions?input=${location}`
        );
        const data = await response.json();
        setAutoPredictions(data || []);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    if (location.length > 3 && !predictionSelected) {
      fetchPredictions();
    } else {
      setAutoPredictions([]);
    }
  }, [location, predictionSelected]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
    setPredictionSelected(false);
  };

  const handleAutoPredictionClick = (prediction: string) => {
    setLocation(prediction);
    setPredictionSelected(true);
    setAutoPredictions([]);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!location) {
      alert("Please enter a location.");
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyBOShUQH0RF7USNk8kQNL9W6Li9dVpdU88`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        setCoordinates({
          lat: data.results[0].geometry.location.lat,
          lon: data.results[0].geometry.location.lng,
        });
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    } finally {
      setLoading(false);
  }
  };
  if (loading) {
    return <div id='Load_Overlay'><Spinner/></div>
}
  return (
    <Container fluid id="user-input-section">
      <div className="input-wrapper">
        <InputGroup>
          <Form.Control
            placeholder="Enter location"
            type="text"
            value={location}
            onChange={handleInputChange}
          />
          <Button onClick={handleSubmit} variant="success" id="button-addon2">
            Search
            <MagnifyingGlass/>
          </Button>
        </InputGroup>

        {autoPredictions.length > 0 && (
          <div className="list-group-container">
            <ListGroup>
              {autoPredictions.map((autoPrediction) => (
                <ListGroup.Item
                  key={autoPrediction.place_id}
                  action
                  onClick={() =>
                    handleAutoPredictionClick(autoPrediction.description)
                  }
                >
                  {autoPrediction.description}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </div>
    </Container>
  );
};

export default UserInput;
