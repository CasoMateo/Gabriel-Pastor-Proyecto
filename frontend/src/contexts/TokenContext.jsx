import React, { Component, createContext} from 'react';

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
      const checkLogin = await fetch('https://localhost.com/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: { 'username': username, 'password': password }
    })};

    const response = loginResource();
    const status = response.json();
    
    if ((status.loggedIn) && (status.status_code == 202)) {
      this.setState({ renderVerifyCredentials: false });
      this.setSessionAttributes();
      
    } else if (status.status_code == 400) {
      <Redirect to = { {pathname: '/home', state : { from : props.location } }} /> 
      
    } else {
      this.setState({ renderVerifyCredentials: true });
    }
  }

  logout = ( username ) => {
  
    const logoutResource = async () => {
      const checkLogin = await fetch('https://localhost.com/logout', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: { 'username': username }
    })};

    const response = logoutResource();
    const status = response.json();

    if (status.status_code == 200) {
      this.setSessionAttributes();
    } else {
      alert('Not able to log you out');
    }
// implement else 

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