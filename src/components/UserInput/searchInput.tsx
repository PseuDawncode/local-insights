import React, { useEffect, useState } from 'react';
//import './searchInput.css';
import { Button, Container, Form, InputGroup, ListGroup } from 'react-bootstrap';

interface UserInputProps {
  setCoordinates: (coordinates: { lat: number; lng: number }) => void;
}

interface Prediction {
  description: string;
  place_id: string;
}

const UserInput: React.FC<UserInputProps> = ({ setCoordinates }) => {
  const [location, setLocation] = useState<string>('');
  const [predictionSelected, setPredictionSelected] = useState<boolean>(false);
  const [autoPredictions, setAutoPredictions] = useState<Prediction[]>([]);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

  // Fetch location predictions from the Google Places API
  const fetchPredictions = async () => {
    if (!location) return; // No need to fetch predictions if input is empty

    try {
      const response = await fetch(`${apiEndpoint}?input=${location}&key=${apiKey}`);
      const data = await response.json();
      setAutoPredictions(data.predictions || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  useEffect(() => {
    if (location.length > 3 && !predictionSelected) {
      fetchPredictions();
    } else {
      setAutoPredictions([]); // Clear predictions if no match or input is too short
    }
  }, [location]);

  // Handle input changes for search field
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
    setPredictionSelected(false);
  };

  // Handle click on an autocomplete prediction
  const handleAutoPredictionClick = (prediction: string) => {
    setLocation(prediction);
    setPredictionSelected(true);
    setAutoPredictions([]);
  };

  // Handle form submission to geocode the selected location
  const handleSubmit = async () => {
    if (!location) {
      alert('Please enter a location.');
      return;
    }

    try {
      const response = await fetch(`${apiEndpoint}?input=${location}&key=${apiKey}`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const coordinates = data.results[0].geometry.location;
        setCoordinates(coordinates);
        console.log('Coordinates:', coordinates);
      } else {
        alert('No coordinates found for the given location.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  return (
    <Container fluid id="user-input-section">
      <div className="input-wrapper">
        <InputGroup>
          <Form.Control
            placeholder="Enter a location"
            type="text"
            value={location}
            onChange={handleInputChange}
          />
          <Button onClick={handleSubmit} variant="success">
            Search
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search ms-1 mb-1"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </Button>
        </InputGroup>

        {autoPredictions.length > 0 && (
          <div className="list-group-container">
            <ListGroup>
              {autoPredictions.map((prediction) => (
                <ListGroup.Item
                  key={prediction.place_id}
                  action
                  onClick={() => handleAutoPredictionClick(prediction.description)}
                >
                  {prediction.description}
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
