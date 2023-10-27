import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/Answer.css';

const Answer = () => {
    const token = localStorage.getItem('token'); 
    const [userResponses, setUserResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios
          .get('http://localhost:8000/api/userresponses', {
            headers: {
              'Authorization': `${token}`,
            },
          })
          .then((response) => {
            // Handle the response and store it in the state
            setUserResponses(response.data);
            setLoading(false);
          })
          .catch((error) => {
            // Handle errors and set an error message
            setErrorMessage('Error retrieving user responses. Please try again later.');
            setLoading(false);
          });
      }, [token]);

  return (
    <div className="answer-container">
      {loading && <p>Loading...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!loading && !errorMessage && userResponses.length === 0 && (
        <p className="info-message">Please fill the quiz first.</p>
      )}
      {!loading && userResponses.length > 0 && (
        <div>
          <h1 className="response-header">Your Responses:</h1>
          <ul className="response-list">
            {userResponses.map((response, index) => (
              <li key={index} className="response-item">
                <strong>Question: {response.question}</strong>
                <br />
                Answer: {response.selectedOption}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Answer;
