
import React, { Component, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom'; 
import '../index.css';
import Login from './Login';
import { AuthContext } from '../contexts/AuthContext';

function Users(props) {
  
  // const { token, renderModifyUsers, logout, username } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const [usernameAdd, setUsernameAdd] = useState();
  const [usernameRemove, setUsernameRemove] = useState();
  const [password, setPassword] = useState();
  const [level, setLevel] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [verifyRef, setVerifyRef] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [retrievedUsers, setRetrievedUsers] = useState(false);
  const [invalid, setInvalid] = useState(false);
  
  const getUsers = async () => {
    
    
    const promise = await fetch('http://127.0.0.1:8000/get-users', { 
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cookies': document.cookie
  
      }
    }); 
    
    if (promise.status != 200) {
      alert('Failed to retrieve users');
    } 

    const response = await promise.json();
    
    setUsers(response.users);
    
  }
  
  if (!retrievedUsers) {
    getUsers(); 
    setRetrievedUsers(true);
  }
  const addUserCredentials = (event) => {
    event.preventDefault();
    
    if (!props.token) {
      navigate('/login');
    }
    
    if ((!usernameAdd) || (!password) || (!props.renderModifyUsers)) {
      alert('Invalid data or credentials');
      return;
    }

    // make post request to api with attributes
    const addUserResource = async () => {
      
      const promise = await fetch('http://127.0.0.1:8000/add-user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cookies': document.cookie
        },
        body: JSON.stringify({ 'username' : usernameAdd, 'password': password, 'level': level })
      }); 

      
      const response = await promise.json(); 
      
      if ((!response.addedUser) || (promise.status != 200)) {
        setInvalid(true);
         
      } else {
        
        setUsers(prevState => [...prevState, usernameAdd]);
        setInvalid(false);
        
      }
       
    };
    
    addUserResource();
    

  }

  const removeUserCredentials = (event) => {
    event.preventDefault();

    if (!props.token) {
      navigate('/login');
    }
     
    if ((!usernameRemove) || (!props.renderModifyUsers)) {
      alert('Invalid data or credentials');
      return; 
    }

    const removeUserResource = async () => {
      const promise = await fetch('http://127.0.0.1:8000/remove-user', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cookies': document.cookie
        },
        body: JSON.stringify({ 'username' : usernameRemove })
      }); 
      
      const response = await promise.json(); 
      if ((!response.removedUser) || (promise.status != 200)) {
        setInvalid(true);
      } 
      else {
        setInvalid(false);
        const copy = [...users];
        setUsers(copy.filter(username => username !== usernameRemove));
        
      }
      
    };

    removeUserResource(); 

    

  }

  
  return (
    <div>
      
      <div className = 'navbar-test' id = { verifyRef && 'form-displayed'}>
  
        <div className = 'general-information-container'>
          <img src = '/gabriel_pastor_logo.png' className = 'logo-image' />

          <div className = 'name-slogan'>
            <h5 className = 'el-name-slogan'>
              Gabriel Pastor 
              <br />
              Foundation
            </h5>
          </div> 
        </div>

        <div>
          <div>
            <div className = 'home-profile'>
              <img className = {props.renderModifyUsers ? 'nav-option'  : 'home-button-false' } src = '/home_button.png' onClick = { () => navigate('/home') }/> 
          
              
              <h5 className = { props.renderModifyUsers ? 'add-remove-user' : 'add-remove-user-false' } > 
                Add/Remove User
              </h5>

              
              
            </div>

          </div>

          <div className = 'navbar-options'>   

            <img className = { !props.renderModifyUsers ? 'home-button' : 'home-button-false'} src = '/home_button.png' onClick = { () => navigate('/home') } /> 
            <h5 className = 'username-attribute'> 
              { props.username }
            </h5>

            <button className = 'logout' onClick = { () =>  { setVerifyRef(true) } } > Logout </button>
          </div> 

        
        </div>
        

      </div> 

      <div className = 'main-page' id = { verifyRef ? 'form-displayed-user' : 'user-manipulation' } >
        <div>
          <p className = 'manipulate-user-title'>
            Add User
          </p>
    
    
          <form className = 'add-user-credentials'>
            <input placeholder = 'User name' type = 'text' onChange = { e => setUsernameAdd(e.target.value) } required /> 
            <div className = 'add-user-credentials-password'>
              <input placeholder = 'User password' type = { showPassword ? 'text' : 'password' } onChange = { e => setPassword(e.target.value) } required /> 
              <img className = { showPassword ? 'password-image-false' : 'show-password-button'} src = 'https://static.thenounproject.com/png/777494-200.png' onClick = { () => setShowPassword(true) }/>
              <img className = { showPassword ? 'show-password-button' : 'password-image-false' } src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXMz0uM0TFgQDWUQc1vPMDbbusXNoOoNWOMIcCjc3o7egKnrj5gYXcxx86DPutraU24Kw&usqp=CAU' onClick = { () => setShowPassword(false)}/>
            </div>
            <div>
              <input name = 'level' type="radio" 
                     required onChange = { () => setLevel(true) }/>
              <label>Chief</label>
            </div>

            <div>
              <input name = 'level' type="radio" required onChange = { () => setLevel(false) }/>
              <label >Employee</label>
            </div>
    
            <div>
            
              <input id = 'manipulate-add' className = 'submit-form' type = 'submit' onClick = {() => addUserCredentials(event)  } />
            </div>
          </form>
      
        </div>

        <div>
          <p className = 'manipulate-user-title'>
            Remove User
          </p>
    
          <form>
            <input placeholder = 'User credentials' type = 'text' required onChange = { e => setUsernameRemove(e.target.value) } /> 
            <input id = 'manipulate-subs' className = 'submit-form' type = 'submit' onClick = { () => removeUserCredentials(event) } /> 
          </form>
          
        </div>

        <div>
          <p className = 'all-users-title'>
            All registered users
          </p>
      
          <div>
            {
              users.map(user => {
                return (
                <ul>
                  <li> 
                    { user }
                  </li>
                </ul>
                );
              })
            }
          </div> 
            
        </div>

        
    
      </div>
      

      <p className = { invalid ? 'invalid-remove-credential' : 'invalid-remove-credential-false'} >
        The credentials you entered either already exist
        <br />
        or don't exist (in case you want to remove them)
      </p>
    
      <p className = 'info-manipulation'>
        Don't use accents and use proper spelling
      </p>

      <div className = { verifyRef ? 'verify-button' : 'verify-button-false' }>
        <h5> Are you sure you want to do this? <br /> You can't undo this action </h5>
    
        <div className = 'verifying-buttons'>
          <button className = 'submit-form' id = 'verify-yes' onClick = { () => props.logout(props.username) } >
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