import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  // Check if a token is present in local storage
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Handler to navigate to the quiz page if token is present
  const navigateToQuiz = () => {
    if (token) {
      navigate('/quiz');
    } else {
      // Handle the case where there is no token (e.g., show an error message)
      console.log("You need to log in to access the Quiz.");
      alert ("Login first")
    }
  };

  // Handler to navigate to the usecases page if token is present
  const navigateToUseCases = () => {
    if (token) {
      navigate('/usecases');
    } else {
      // Handle the case where there is no token (e.g., show an error message)
      console.log("You need to log in to access the UseCases.");
      alert ("Login first")
    }
  };
  const navigateToAnswers = () => {
    if (token) {
      navigate('/answers');
    } else {
      // Handle the case where there is no token (e.g., show an error message)
      console.log("Please Fill the Quiz first.");
      alert ("Please Fill the Quiz first.")
    }
  };

  return (
    <nav>
      <ul>
        {token ? (
          // If token is present, show the "Logout" button
          <li>
            <button
              onClick={() => {
                // Remove the token from local storage on logout
                localStorage.removeItem('token');
                navigate('/login');

                // You can also perform any other logout-related actions here
              }}
            >
              Logout
            </button>
          </li>
        ) : (
          // If token is not present, show the "Login" and "Register" links
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
        <li>
          {/* Add onClick handlers to the Quiz and UseCases links */}
          <button onClick={navigateToQuiz}>Quiz</button>
        </li>
        <li>
          <button onClick={navigateToUseCases}>UseCases</button>
        </li>
        <li>
          <button onClick={navigateToAnswers}>Answers</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
