import React, { useEffect, useState } from 'react';
import './searchInput.css';
import { Button, Container, Form, InputGroup, ListGroup} from 'react-bootstrap';
 
interface UserInputProps {
    setCoordinates: (coordinates: { lat: number, lng: number }) => void;
  }

const UserInput: React.FC<UserInputProps> = ({ setCoordinates }) => {
  const [location, setLocation] = useState<string>('');
  const [predictionSelected, setPredictionSelected] = useState<boolean>(false);
  const [autoPredictions, setAutoPredictions] = useState<any[]>([]);
 
 
  const apiKey = 'AIzaSyBOShUQH0RF7USNk8kQNL9W6Li9dVpdU88';
 
  const fetchPredictions = async () => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&key=${apiKey}`
    );
    const data = await response.json();
    console.log(data);
 
    setAutoPredictions(data.predictions);
  }
 
  useEffect(() => {
    if (location.length > 3 && !predictionSelected) {
      fetchPredictions().catch(console.error);
    } else {
      setAutoPredictions([]);
    }
  }, [location]);
 
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = event.target.value;
    setPredictionSelected(false);
    setLocation(userInput);
  };
 
  const handleAutoPredictionClick = (prediction: string) => {
    setLocation(prediction);
    setPredictionSelected(true);
    setAutoPredictions([]);
  };
 
  const handleSubmit = async () => {
    if (!location) {
      alert("Lütfen bir yer girin.");
      return;
    }
 
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`
      );
      const data = await response.json();
      console.log('Coordinates:', data);
      setCoordinates(data.results[0].geometry.location);
    } catch (error) {
      console.error('Hata:', error);
    }
  }
 
  return (
    <Container fluid id="user-input-section">
      <div className="input-wrapper">
        <InputGroup >
          <Form.Control
            placeholder="From"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            type= "text"
            value={location}
            onChange={handleInputChange}
          />
          <Button onClick={handleSubmit} variant="success" id="button-addon2">
            Search
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search ms-1 mb-1" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </Button>
        </InputGroup>
 
        {autoPredictions.length > 0 && (
          <div className='list-group-container'>
            <ListGroup>
              {autoPredictions.map((autoPrediction) => (
                <ListGroup.Item
                  key={autoPrediction.place_id}
                  action
                  onClick={() => handleAutoPredictionClick(autoPrediction.description)}
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
}
 
export default UserInput;