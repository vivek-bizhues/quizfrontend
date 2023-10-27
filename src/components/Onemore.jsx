import axios from 'axios';
import React, { useState, useEffect } from 'react';
import quizQuestions from '../utils/questions';

const Onemore = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [responseSent, setResponseSent] = useState({});
  const token = localStorage.getItem('token'); 

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
  };

  // const sendResponseToBackend = (method, question, selectedOptionText) => {
  //   // Define the endpoint URL based on the method
  //   const encodedQuestion = encodeURIComponent(question);
  //   const endpoint =
  //     method === 'PATCH'
  //       ? `http://localhost:8000/api/userresponses/${encodedQuestion}`
  //       : 'http://localhost:8000/api/userresponses';
  
  //   // Send the response to the backend
  //   fetch(endpoint, {
  //     method: method,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       question,
  //       selectedOption: selectedOptionText,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data.message);
  //       // Update the responseSent state to indicate that a response has been sent for this question
  //       setResponseSent((prevState) => ({
  //         ...prevState,
  //         [question]: true,
  //       }));
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // };

  const sendResponseToBackend = (method, question, selectedOptionText) => {
    const encodedQuestion = encodeURIComponent(question);
    const endpoint =
      method === 'PATCH'
        ? `http://localhost:8000/api/userresponses/${encodedQuestion}`
        : 'http://localhost:8000/api/userresponses';
  
    fetch(endpoint, {
      method: method,
      headers: {
        'Authorization': `${token}`, 
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
        setResponseSent((prevState) => ({
          ...prevState,
          [question]: true,
        }));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  const handleNextQuestion = () => {
    console.log("button pressed");
    if (currentQuestionIndex < quizQuestions.length - 1) {
      // Save the current response before moving to the next question
      const currentQuestion = quizQuestions[currentQuestionIndex];
      const response = {
        question: currentQuestion.question,
        selectedOption: selectedOption,
      };
  
      setResponses([...responses, response]);
  
      // Check if the question exists in the database
      const questionExistsInDatabase = responseSent[currentQuestion.question];
  
      // Determine the method based on whether the question exists
      const method = questionExistsInDatabase ? 'PATCH' : 'POST';
  
      // Send the response to the backend
      sendResponseToBackend(method, currentQuestion.question, selectedOption);
  
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        const response = {
          question: currentQuestion.question,
          selectedOption: selectedOption,
        };
    
        setResponses([...responses, response]);
    
        // Check if the question exists in the database
        const questionExistsInDatabase = responseSent[currentQuestion.question];
    
        // Determine the method based on whether the question exists
        const method = questionExistsInDatabase ? 'PATCH' : 'POST';
    
        // Send the response to the backend
        sendResponseToBackend(method, currentQuestion.question, selectedOption);
        setSubmitted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // useEffect(() => {
  //   // Make a GET request to retrieve "use cases"
  //   axios
  //     .get('http://localhost:8000/api/userresponses')
  //     .then((response) => {
  //       // Handle the response
  //       console.log('User responses:', response.data);
  //       // Now you can use the retrieved data in your component's state or display it as needed
  //     })
  //     .catch((error) => {
  //       // Handle errors
  //       console.error('Error retrieving:', error);
  //     });
  // }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/userresponses', {
        headers: {
          'Authorization': `${token}`,
        },
      })
      .then((response) => {
        // Handle the response and store it in your component's state or use it as needed
        console.log('User responses:', response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error('Error retrieving user responses:', error);
      });
  }, [token]);
  
  const renderInput = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];

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

  const renderQuestionContent = () => {
    if (submitted) {
      return (
        <div className="submitted-message">
          <p>Thank you for submitting your responses!</p>
        </div>
      );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];

    return (
      <>
        <div className="question-container">
          <div className="question">
            <p>{currentQuestion.question}</p>
          </div>
          <div className="options">{renderInput()}</div>
        </div>
        <div className="button-container">
          {currentQuestionIndex > 0 && (
            <button onClick={handlePreviousQuestion}>Back</button>
          )}
          <button onClick={handleNextQuestion}>
            {currentQuestionIndex === quizQuestions.length - 1
              ? 'Submit'
              : 'Next'}
          </button>
        </div>
      </>
    );
  };

  return (
    <div>
      <h1>Quiz App</h1>
      {renderQuestionContent()}
    </div>
  );
};

export default Onemore;
