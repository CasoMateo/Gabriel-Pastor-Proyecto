
import React, { Component } from 'react';
import ReactDOM from 'react-dom'; 
import './index.css';
import Home from './contexts/Home';

function error404() { 
  // check medicine, alerts, dates, and quantities from api 

  const redirectHome = () => {
    return <Home> </Home>;
  }
  
  return (
    <div class = 'error-404'> 
      <img src = 'public/Screenshot 2022-02-15 7.24.52 PM.png'></img>
      <div>
        <p> The page you are looking for doesn't exist </p>
        <button class = 'submit-form' onClick = { redirectHome() }> GO HOME </button>
      </div>
    </div>

  )

}

export default Medicine;