import React, { useState } from 'react'
import quizQuestions from '../utils/questions';

const Quiz = () => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
  
    const handleOptionSelect = (optionText) => {
        setSelectedOption(optionText);
    
        // Send the selected option text to the backend immediately
        sendResponseToBackend(optionText);
      };
    
      const sendResponseToBackend = (selectedOptionText) => {
        const currentQuestion = quizQuestions[currentQuestionIndex];

        console.log({
            question: currentQuestion.question,
            selectedOption: selectedOptionText, // Assuming the first option is the correct answer
          })
        
        // Send the response and answer to the backend
        fetch('http://localhost:8000/api/userresponses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: currentQuestion.question,
            selectedOption: selectedOptionText, // Assuming the first option is the correct answer
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
          setSelectedOption(null); // Clear selected option for the next question
        } else {
          setSubmitted(true);
        }
      };
      

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
          setSelectedOption(null);
        }
      };

    const renderQuestion = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];

    return (
      <>
        <div className="question-container">
          <div className="question">
            <p>{currentQuestion.question}</p>
          </div>
          <div className="options">
          {currentQuestion.options.map((option, index) => (
            <label key={index}>
                <input
                type="radio"
                name="option"
                value={option} // Use the option text as the value
                checked={selectedOption === option}
                onChange={() => handleOptionSelect(option)} // Pass the option text to the handler
                />
                {option}
            </label>
            ))}
          </div>
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
      {submitted ? (
        <p>Thank you for submitting your responses!</p>
      ) : (
        renderQuestion()
      )}
    </div>
  )
}

export default Quiz
