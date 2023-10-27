import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import '../styles/Usecases.css';

const Usecases = () => {
    const [useCases, setUseCases] = useState([
        { useCase: '', subjectArea: '', useCaseOverview: '' },
      ]);
    
      const handleInputChange = (index, field, value) => {
        const newUseCases = [...useCases];
        newUseCases[index][field] = value;
        setUseCases(newUseCases);
      };
    
      const handleAddMore = () => {
        setUseCases([...useCases, { useCase: '', subjectArea: '', useCaseOverview: '' }]);
      };
    
      const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('Use Cases:', useCases);

        try{
          await axios.post('http://localhost:8000/api/usecases', useCases);
          console.log('Use Cases submitted successfully.');
          } catch (error) {
      console.error('Error submitting use cases:', error);
       }
      };

      useEffect(()=>{
        axios.get('http://localhost:8000/api/usecases')
        .then(response => {
          // Handle the response
          console.log('Use Cases retrieved successfully:', response.data);
          // Now you can use the retrieved data in your component's state or display it as needed
        })
        .catch(error => {
          // Handle errors
          console.error('Error retrieving Use Cases:', error);
        });   
      })
  return (
    <div>
      <h1>Use Case Form</h1>
      <form onSubmit={handleSubmit}>
        {useCases.map((useCase, index) => (
          <div key={index}>
            <div style={{marginTop:'10px'}}>
              <label htmlFor={`useCase${index}`}>Use Case:</label>
              <input
                type="text"
                id={`useCase${index}`}
                value={useCase.useCase}
                onChange={(e) => handleInputChange(index, 'useCase', e.target.value)}
                required
              />
            </div>
            <div style={{marginTop:'10px'}}>
              <label htmlFor={`subjectArea${index}`}>Subject Area:</label>
              <input
                type="text"
                id={`subjectArea${index}`}
                value={useCase.subjectArea}
                onChange={(e) => handleInputChange(index, 'subjectArea', e.target.value)}
                required
              />
            </div>
            <div style={{marginTop:'10px'}}>
              <label htmlFor={`useCaseOverview${index}`}>Use Case Overview:</label>
              <textarea
                id={`useCaseOverview${index}`}
                value={useCase.useCaseOverview}
                onChange={(e) => handleInputChange(index, 'useCaseOverview', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
        <button  style={{marginTop:'10px'}} type="submit">Submit</button>
      </form>
      <button style={{marginTop:'10px'}} onClick={handleAddMore}>Add Use Case</button>
    </div>
  )
}

export default Usecases
