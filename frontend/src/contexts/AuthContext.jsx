import React, { createContext, useState, useEffect } from 'react'; 
import { useNavigate, Navigate } from 'react-router-dom'; 
export const AuthContext = createContext(); 
import { BrowserRouter as Router, Link, Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';

const AuthContextProvider = (props) => {
    function getCookie(cookie_name) {
      let name = cookie_name + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let cookies = decodedCookie.split(';');
      for(let i = 0; i <cookies.length; i++) {
        let cur_cookie = cookies[i];
        while (cur_cookie.charAt(0) == ' ') {
          cur_cookie = cur_cookie.substring(1);
        }
        if (cur_cookie.indexOf(name) == 0) {
          return cur_cookie.substring(name.length, cur_cookie.length);
        }
      }
      return false;
    } 

    let status = getCookie('session_id');
    
    fetch('http://127.0.0.1:8000/is-logged-in', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',  
        'mode': 'cors',
        'Cookies': document.cookie
      }
    }).then(response => status = (response.status == 200)); 

    const [token, setToken] = useState(false);
    const [renderModifyUsers, setRenderModifyUsers] = useState(getCookie('user_chief')); 
    const [renderVerifyCredentials, setRenderVerifyCredentials] = useState(false);
    const [username, setUsername] = useState(getCookie('username'));
    
    
    const login = (username, password) => {
      if ((!username) || (!password)) {
        setRenderVerifyCredentials(true);
        return;
      }
          
      const loginResource = async () => {
        const promise = await fetch('http://127.0.0.1:8000/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            'mode': 'cors',
            'Cookies': document.cookie
          },
          body: JSON.stringify({ 'username': username, 'password': password }) 
        }); 
      
        const response = await promise.json();
            
        if ((response.loggedIn) && (promise.status == 200)) {
          if (!getCookie('session_id') || (!token)) {
            const session_id_cookie = 'session_id='.concat(response.session_id)
            document.cookie = session_id_cookie;
          } 
          
            
          const username_cookie = 'username='.concat(username); 
          document.cookie = username_cookie;
          

          if ((response.level)) { 
            setRenderModifyUsers(true);
            if (!getCookie('user_chief')){
              document.cookie = 'user_chief=True';
            }
          } 
          
          setRenderVerifyCredentials(false);
              
     // add real cookie here
          setToken(response.session_id);

          setUsername(username);
          
          
          return;
              

        } else {
          setRenderVerifyCredentials(true);
        }
      };
      
      loginResource();
    }

    const logout = ( username ) => {
  
      const logoutResource = async () => {
        const promise = await fetch('http://127.0.0.1:8000/logout', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cookies': document.cookie
           },
          body: JSON.stringify({ 'username': username })
        }); 
    
        const response = promise.json();
    
        if ((promise.status == 200) || (response.loggedOut)) {
          setToken(false);
          setRenderModifyUsers(false);
          setUsername();
          
          document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          
          if (getCookie('user_chief')) {
            document.cookie = "user_chief=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }
            
        } else {
          alert('Not able to log you out');
        }
      };
    
      logoutResource();
        
    }

    return (
        <AuthContext.Provider value = {{token, username, renderModifyUsers, renderVerifyCredentials, login, logout}}> 
          { props.children }
        </AuthContext.Provider>
    );
}

export default AuthContextProvider; 