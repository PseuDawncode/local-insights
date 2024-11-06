import React, { useEffect, useState } from 'react';
import {
    Container,
    Button,
    Form,
    InputGroup,
    ListGroup,
} from 'react-bootstrap';
import { MagnifyingGlass, Spinner } from '../assets/SVGs';

interface UserInputProps {
    setCoordinates: (coordinates: { lat: number; lon: number }) => void;
}

const UserInput: React.FC<UserInputProps> = ({ setCoordinates }) => {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<string>('');
    const [predictionSelected, setPredictionSelected] =
        useState<boolean>(false);
    const [autoPredictions, setAutoPredictions] = useState<any[]>([]);

    const apiKey = 'AIzaSyBOShUQH0RF7USNk8kQNL9W6Li9dVpdU88';

    const fetchPredictions = async () => {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&key=${apiKey}`
        );
        const data = await response.json();
        console.log(data);

        setAutoPredictions(data.predictions);
    };

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
        setLoading(true);

        if (!location) {
            alert(`It's not working!`);
            return;
        }
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`
            );
            const data = await response.json();
            console.log('Coordinates:', data);
            setCoordinates({
                lat: data.results[0].geometry.location.lat,
                lon: data.results[0].geometry.location.lng
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div id='Load_Overlay'><Spinner/></div>
    }

    return (
        <Container fluid id='user-input-section'>
            <div className='input-wrapper'>
                <InputGroup>
                    <Form.Control
                        placeholder='From'
                        aria-label="Recipient's username"
                        aria-describedby='basic-addon2'
                        type='text'
                        value={location}
                        onChange={handleInputChange}
                    />
                    <Button
                        onClick={handleSubmit}
                        variant='success'
                        id='button-addon2'
                    >
                        Search
                        <MagnifyingGlass/>
                    </Button>
                </InputGroup>

                {autoPredictions.length > 0 && (
                    <div className='list-group-container'>
                        <ListGroup>
                            {autoPredictions.map((autoPrediction) => (
                                <ListGroup.Item
                                    key={autoPrediction.place_id}
                                    action
                                    onClick={() =>
                                        handleAutoPredictionClick(
                                            autoPrediction.description
                                        )
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
