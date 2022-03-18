import React, { Component, useState, useContext } from 'react';
import ReactDOM from 'react-dom'; 
import '../index.css';
import TokenContext from '../contexts/TokenContext';

function Login() {
  // login arguments 
  // repeated username
  
  // const { login, renderVerifyCredentials } = useContext(TokenContext);
  const login = (username, password) => {
    console.log(username, password);
  }

  const renderVerifyCredentials = false;
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  
  return (
    <div>
      <div className="imgcontainer">
        <img src="logo512.png" alt="Avatar" class="avatar"/>       
      </div>
      
      <div>
        <div className = 'main-form'> 
          <label for="username"><b>Username</b></label>
          <input type="text" placeholder="Enter Username" name = 'username' id = 'uname' required onChange = { e => setUsername(e.target.value) }></input>

          <label for="password"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name = 'password' id = 'psw' required onChange = { e => (setPassword(e.target.value)) }></input>

          
          <a href = 'https://docs.google.com/document/d/1Bkheg3NJuFecYHbKSZ8gIlWDWWqm3bgzd-OLUSv7KRE/edit' className = 'more-information'> More information here... </a>
          <button type="submit" id = 'login' onClick = { function() { alert(username); alert(password) } }> Login </button>

        
        </div>
          
        <p className = { renderVerifyCredentials ? 'invalid-login-credentials' : 'invalid-login-credentials-false' } > Invalid credentials
        </p>
      </div>
        
    </div>  
  );
}



export default Login;