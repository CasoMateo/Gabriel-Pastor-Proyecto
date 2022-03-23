
import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom'; 
import '../index.css';


function Error404() { 
  // check medicine, alerts, dates, and quantities from api 
  const navigate = useNavigate(); 

  const handleRedirect = () => {
    navigate('/login'); 
  }

  return (
    <div>
      

      <div class = 'error-404'> 
        <img className = 'image-404' src = 'https://leetcode.com/static/images/404_face.png' />
        <div>
          <p> The page you are looking for doesn't exist </p>
          <button class = 'submit-form' onClick = { () => handleRedirect() }>
            Go Home
          </button>
        </div>
      </div>
      
    </div>

  );

}

export default Error404;