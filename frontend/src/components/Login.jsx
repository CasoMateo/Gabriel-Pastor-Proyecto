import React, { Component, useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom'; 
import '../index.css';
import { AuthContext } from '../contexts/AuthContext';

function Login(props) {
  // login arguments 
  // repeated username
  
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  
  return (
    <div>
      <div className="imgcontainer">
        <img src="gabriel_pastor_logo.png" alt="Logo" className="logo-image-form"/>       
      </div>
      
      <div>
        <div className = 'main-form'> 
          <label ><b>Username</b></label>
          <input type="text" placeholder="Enter Username" id = 'uname' required onChange = { e => setUsername(e.target.value) }></input>

          <label><b>Password</b></label>
          <input type="password" placeholder="Enter Password"id = 'psw' required onChange = { e => (setPassword(e.target.value)) }></input>

          
          <a href = 'https://docs.google.com/document/d/1Bkheg3NJuFecYHbKSZ8gIlWDWWqm3bgzd-OLUSv7KRE/edit' className = 'more-information'> More information here... </a>
          <button type="submit" id = 'login' onClick = { () => props.login(username, password) } > Login </button>

        
        </div>
          
        <p className = { props.renderVerifyCredentials ? 'invalid-login-credentials' : 'invalid-login-credentials-false' } > Invalid credentials
        </p>
      </div>
        
    </div>  
  );
}



export default Login;