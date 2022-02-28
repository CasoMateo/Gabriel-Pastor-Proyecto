import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom'; 
import './index.css';
import Login from 'Login';

class Users extends Component {
  
  const { token, renderModifyUsers, logout, username } = useContext(TokenContext);

  const [usernameAdd, setUsernameAdd] = useState();
  const [usernameRemove, setUsernameRemove] = useState();
  const [password, setPassword] = useState();
  const [level, setLevel] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [verifyRef, setVerifyRef] = useState();
  
  const [invalid, setInvalid] = useState(false);
  
  addUserCredentials = () => {

    if (!token) {
      return <Login/>;
    }
    
    if (!usernameAdd) || (!password) || (!level) || (!renderModifyUsers) {
      alert('Invalid data or credentials');
      return;
    }

    // make post request to api with attributes
    const addUserResource = async () => {
      const addUser = await fetch('https://localhost.com/add-user', () => {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name' : usernameAdd, 'password': password, 'level': level })
    })}};

    const response = addUserResource(); 
    const status = response.json();

    if (!status.addUser) || (status.status_code != 201) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }

  }

  removeUserCredentials = () => {

    if (!token) {
      return <Login/>;
    }
    if (!usernameRemove) || (!renderModifyUsers) {
      alert('Invalid data or credentials');
      return; 
    }

    const removeUserResource = async () => {
      const removeUser = await fetch('https://localhost.com/remove-user', () => {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'name' : usernameRemove })
    })}};

    const response = removeUserResource(); 
    const status = response.json();

    if (!status.removedUser) || (status.status_code != 200) {
      setInvalid(true);
    } 
    else {
      setInvalid(false);
    }

  }

  render() {
    return (
     <div>
      <div className = 'navbar'>
  
        <div className = 'general-information-container'>
          <img src = './public/download (14) (1).png' className = 'logo-image'></img>

          <div className = 'name-slogan'>
            <h5 className = 'el-name-slogan'>
              Nursing Home Name 
              <br> 
              This is their slogan
            </h5>
          </div> 
        </div>

      <div className = 'navbar-buttons'>
        <div className = 'action-navbar'>
          <div className = 'home-profile'>
            <img className = 'nav-option' id = 'home-button' src = './public/images (1).png' onClick = 'redirectHome()'> </img>
          
            <img className = 'nav-option' id = 'profile-button' src = './public/41-410093_circled-user-icon-user-profile-icon-png.png' onHover = { setMoreOptions(true) } onMouseOut = { setMoreOptions(false) }> </img> 

            <div onMouseOver = { setMoreOptions(true) } onMouseOut = { setMoreOptions(false) } className = { moreOptions ? 'hover-profile' : 'hover-profile-false' } className = 'hover-profile'> 
              <p className = 'profile-user-credentials'> { username } </p>
              <button className = 'logout' onClick = { setVerifyRef(true) } > Logout </button>
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
          <input placeholder = 'User name' type = 'text' onChange = { e => setUserNameAdd(e.target.value)) } required> </input>
          <input placeholder = 'User password' type = 'text' onChange = { e => setPassword(e.target.value) } required> </input>
          <div> 
            <input type="radio" id = 'chief' name = 'level' required onChange = { e => setLevel(true) }> Chief </input>
            <input type="radio" id = 'employee' name = 'level' required onChange = { e => setLevel(false) } > Employee </input> 

          </div>
          <input id = 'manipulate-add' className = 'submit-form' type = 'submit'> </input>
        </form>
    
      </div>

      <div> 
        <p className = 'manipulate-user-title'> 
          Remove User 
        </p>

        <form>
          <input placeholder = 'User credentials' type = 'text' required onChange = { e => setUsernameRemove(e.target.value) }> </input>
          <input id = 'manipulate-subs' className = 'submit-form' type = 'submit'> </input>
        </form>
        
      </div>


    </div>

    <p className = { invalid ? 'invalid-remove-credential' : 'invalid-remove-credential-false'} > 
      The credentials you entered either already exist 
      <br>
      or don't exist (in case you want to remove them)
    </p>

    <p className = 'info-manipulation'>
      Don't use accents and use proper punctuation
    </p>

    <div className = { verifyRef ? 'verify-button' : 'verify-button-false' }>
      <h5> Are you sure you want to do this? <br/ > You can't undo this action </h5> 

      <div className = 'verifying-buttons'>
        <button className = 'submit-form' id = 'verify-yes' onClick = { logout }>
            YES 
        </button>

        <button onClick = { setVerifyRef(false) } className = 'submit-form' id = 'verify-no'>
            CANCEL 
        </button>
      </div>
      
    </div>
    
  
  </div>

  
    )
  }

}

export default Users;