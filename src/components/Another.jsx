import axios from 'axios';
import React, { useState, useEffect } from 'react';
import quizQuestions from '../utils/questions';

const Another = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const existingResponse = responses.find(
      (response) => response.question === currentQuestion.question
    );

    if (existingResponse) {
      setSelectedOption(existingResponse.selectedOption);
    } else {
      setSelectedOption(null);
    }
  }, [currentQuestionIndex, responses]);

  const handleOptionSelect = (optionText) => {
    setSelectedOption(optionText);

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const existingResponseIndex = responses.findIndex(
      (response) => response.question === currentQuestion.question
    );

    if (existingResponseIndex !== -1) {
      // If an existing response is found, update it
      const updatedResponses = [...responses];
      updatedResponses[existingResponseIndex] = {
        question: currentQuestion.question,
        selectedOption: optionText,
      };
      setResponses(updatedResponses);
      // Send a PATCH request to update the response
      sendResponseToBackend('PATCH', currentQuestion.question, optionText);
    } else {
      // If no existing response is found, add a new response
      setResponses([
        ...responses,
        {
          question: currentQuestion.question,
          selectedOption: optionText,
        },
      ]);
      // Send a POST request to create a new response
      sendResponseToBackend('POST', currentQuestion.question, optionText);
    }
  };

  const sendResponseToBackend = (method, question, selectedOptionText) => {
    // Define the endpoint URL based on the method
    const encodedQuestion = encodeURIComponent(question);

    const endpoint =
      method === 'PATCH'
        ? `http://localhost:8000/api/userresponses/${encodedQuestion}`
        : 'http://localhost:8000/api/userresponses';

    // Send the response and answer to the backend
    fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        selectedOption: selectedOptionText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  useEffect(() => {
    // Make a GET request to retrieve "use cases"
    axios.get('http://localhost:8000/api/userresponses')
      .then(response => {
        // Handle the response
        console.log('User responses :', response.data);
        // Now you can use the retrieved data in your component's state or display it as needed
      })
      .catch(error => {
        // Handle errors
        console.error('Error retrieving:', error);
      });
  }, []);

  const renderQuestion = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];

    const renderInput = () => {
        switch (currentQuestion.type) {
          case 'single-line-text':
            return (
              <input
                type="text"
                value={selectedOption || ''}
                onChange={(e) => handleOptionSelect(e.target.value)}
                placeholder="Type your answer here"
                required
              />
            );
          case 'textarea':
            return (
              <textarea
                value={selectedOption || ''}
                onChange={(e) => handleOptionSelect(e.target.value)}
                placeholder="Type your answer here"
                required
              />
            );
          case 'multiple-choice':
            return (
              <div className="options">
                {currentQuestion.options.map((option, index) => (
                  <label key={index}>
                    <input
                      type="radio"
                      name="option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => handleOptionSelect(option)}
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            );
          default:
            return null;
        }
      };
    return (
      <>
        <div className="question-container">
          <div className="question">
            <p>{currentQuestion.question}</p>
          </div>
          <div className="options">
            {/* {currentQuestion.options.map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionSelect(option)}
                />
                {option}
              </label>
            ))} */}
            {renderInput()}
          </div>
        </div>
        <div className="button-container">
          {currentQuestionIndex > 0 && (
            <button onClick={handlePreviousQuestion}>Back</button>
          )}
          {submitted ? (
            <p>Thank you for submitting your responses!</p>
          ) : (
            <>
              <button onClick={handleNextQuestion}>
                {currentQuestionIndex === quizQuestions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <div>
      <h1>Quiz App</h1>
      {renderQuestion()}
    </div>
  );
};

export default Another;
