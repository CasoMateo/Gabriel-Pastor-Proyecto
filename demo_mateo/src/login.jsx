import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom'; 
import './index.css';
import TokenContext from './contexts/TokenContext';

class Login extends Component {
  // login arguments 
  // repeated username
  const { login, renderVerifyCredentials } = useContext(TokenContext);

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  render() {
    return (
      <div>
        <div class="imgcontainer">
          <img src="logo512.png" alt="Avatar" class="avatar"/>       
        </div>
      
        <div id="userpassword">
          <div class = 'main-form'> 
            <label for="username"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name = 'username' id = 'uname'></input>

            <label for="password"><b>Password</b></label>
            <input type="text" placeholder="Enter Password" name = 'password' id = 'psw' required onChange = { e => (setPassword(e.target.value)) }></input>

            <div class = 'submit-options'> 
              <a ref = 'https://docs.google.com/document/d/1Bkheg3NJuFecYHbKSZ8gIlWDWWqm3bgzd-OLUSv7KRE/edit' class = 'more-information'> More information here... </a>
              <button type="submit" id = 'login' onClick = { login(username, password) } > Login </button>

            </div>
          </div>

          <p className = { renderVerifyCredentials ? 'invalid-login-credentials-true' : 'invalid-login-credentials' } > Invalid credentials
          </p>
      
        </div>
      </div>
    )
  }

}

export default Login;