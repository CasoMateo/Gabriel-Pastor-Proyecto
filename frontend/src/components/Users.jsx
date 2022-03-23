
import React, { Component, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom'; 
import '../index.css';
import Login from './Login';

function Users(props) {
  
  // const { token, renderModifyUsers, logout, username } = useContext(TokenContext);
  const navigate = useNavigate(); 

  const token = true; 
  const renderModifyUsers = true; 
  const logout = () => {
    alert('hola');
  }

  const username = 'mateo';

  const [usernameAdd, setUsernameAdd] = useState();
  const [usernameRemove, setUsernameRemove] = useState();
  const [password, setPassword] = useState();
  const [level, setLevel] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [verifyRef, setVerifyRef] = useState(false);
  
  const [invalid, setInvalid] = useState(false);
  
  const addUserCredentials = () => {

    if (!token) {
      navigate('/login');
    }
    
    if ((!usernameAdd) || (!password) || (!level) || (!renderModifyUsers)) {
      alert('Invalid data or credentials');
      return;
    }

    // make post request to api with attributes
    const addUserResource = async () => {
      const promise = await fetch('https://localhost.com/add-user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name' : usernameAdd, 'password': password, 'level': level })
      }); 

      const response = await promise.json(); 
      return response;
    };

    const status = addUserResource(); 

    if ((!status.addUser) || (status.status_code != 201)) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }

  }

  const removeUserCredentials = () => {

    if (!token) {
      navigate('/login');
    }
    if ((!usernameRemove) || (!renderModifyUsers)) {
      alert('Invalid data or credentials');
      return; 
    }

    const removeUserResource = async () => {
      const promise = await fetch('https://localhost.com/remove-user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name' : usernameRemove })
      }); 
      
      const response = await promise.json(); 
      return response; 
    };

    const status = removeUserResource(); 

    if ((!status.removedUser) || (status.status_code != 200)) {
      setInvalid(true);
    } 
    else {
      setInvalid(false);
    }

  }

  
  return (
    <div>
      <div className = 'navbar'>
  
        <div className = 'general-information-container'>
          <img src = '/logo192.png' className = 'logo-image' />

          <div className = 'name-slogan'>
            <h5 className = 'el-name-slogan'>
              Nursing Home Name 
              <br /> 
              This is their slogan
            </h5>
          </div> 
        </div>

        <div className = 'navbar-buttons'>
          <div className = 'action-navbar'>
            <div className = 'home-profile'>
              <img className = 'nav-option' id = 'home-button' src = '/home_button.png' onClick = { () => navigate('/home') } /> 

              <img className = 'nav-option' id = 'profile-button' src = '/profile_button.png' onHover = { () => setMoreOptions(true) } onMouseOut = { () => setMoreOptions(false) } />
              
              <div onMouseOver = { () => setMoreOptions(true) } onMouseOut = { () => setMoreOptions(false) } className = { moreOptions ? 'hover-profile' : 'hover-profile-false' }>
                <p className = 'profile-user-credentials'> { username } </p>
                <button className = 'logout' onClick = { () => setVerifyRef(true) } > Logout </button>
              </div>
               
              

              
              
              
            </div>

          </div>

        </div>

      </div> 

      <div className = 'main-page' id = 'user-manipulation'>
        <div>
          <p className = 'manipulate-user-title'>
            Add User
          </p>
    
    
          <form className = 'add-user-credentials'>
            <input placeholder = 'User name' type = 'text' onChange = { e => setUsernameAdd(e.target.value) } required /> 
            <input placeholder = 'User password' type = 'text' onChange = { e => setPassword(e.target.value) } required /> 
            
            <div>
              <input type="radio" id="chief"
                     required/>
              <label for="chief">Chief</label>
            </div>

            <div>
              <input type="radio" id="employee" required/>
              <label for="employee">Employee</label>
            </div>
    
 
            <input id = 'manipulate-add' className = 'submit-form' type = 'submit' onClick = {() => addUserCredentials()  } />
          </form>
      
        </div>

        <div>
          <p className = 'manipulate-user-title'>
            Remove User
          </p>
    
          <form>
            <input placeholder = 'User credentials' type = 'text' required onChange = { e => setUsernameRemove(e.target.value) } /> 
            <input id = 'manipulate-subs' className = 'submit-form' type = 'submit' onClick = { () => removeUserCredentials() } /> 
          </form>
          
        </div>
    
      </div>

      <p className = { invalid ? 'invalid-remove-credential' : 'invalid-remove-credential-false'} >
        The credentials you entered either already exist
        <br />
        or don't exist (in case you want to remove them)
      </p>
    
      <p className = 'info-manipulation'>
        Don't use accents and use proper punctuation
      </p>

      <div className = { verifyRef ? 'verify-button' : 'verify-button-false' }>
        <h5> Are you sure you want to do this? <br /> You can't undo this action </h5>
    
        <div className = 'verifying-buttons'>
          <button className = 'submit-form' id = 'verify-yes' onClick = { () => logout(username) } >
              YES
          </button>
    
          <button onClick = { () => setVerifyRef(false) } className = 'submit-form' id = 'verify-no'>
              CANCEL
          </button>
        </div>
        
      </div>
      
      
    
    </div>

  
  );
  

}

export default Users;