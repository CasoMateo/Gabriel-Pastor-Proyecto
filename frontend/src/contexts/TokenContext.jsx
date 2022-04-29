import React, { Component, createContext} from 'react';
import { useNavigate } from 'react-router-dom'; 
export const TokenContext = createContext();
import Cookies from 'js-cookie';

class TokenContextProvider extends Component {
  // rethink context and login logic 
  state = {                                                                           
    token: Cookies.get('session-id'),
    renderModifyUsers: Cookies.get('user-chief'),
    username: Cookies.get('username'),
    renderVerifyCredentials: false
  }

  navigate = useNavigate();


  setSessionAttributes = () => {
    this.setState({ token: Cookies.get('session-id')});
    this.setState({ renderModifyUsers: Cookies.get('user-chief') }); 
    this.setState({ username: Cookies.get('username') });
    
  }

  login = ( username, password ) => {
    
    if ((!username) || (!password)) {
      this.setState({ renderVerifyCredentials: true });
      return;
    }
    
    const loginResource = async () => {
      const promise = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: { 'username': username, 'password': password }
      }); 

      const response = await promise.json();

      if ((response.loggedIn) && (promise.status_code == 200)) {
        this.setState({ renderVerifyCredentials: false });
        this.setSessionAttributes();
        this.navigate('/home');
      } else if (promise.status == 400) {
        this.navigate('/home');
        
      } else {
        this.setState({ renderVerifyCredentials: true });
      }
    };

    loginResource();
    
  }

  logout = ( username ) => {
  
    const logoutResource = async () => {
      const promise = await fetch('http://127.0.0.1:8000/logout', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: { 'username': username }
      }); 

      const response = promise.json();

      if ((promise.status == 200) || (response.loggedOut)) {
        this.setSessionAttributes();
        this.navigate('/login');
      } else {
        alert('Not able to log you out');
      }
    };

    logoutResource();
    
  }

  render() {
    return (
      <TokenContext.Provider value = {{...this.state, login: this.login, logout: this.logout}}> 
        { this.props.children }
      </TokenContext.Provider>
    )
  }

}

export default TokenContextProvider; 