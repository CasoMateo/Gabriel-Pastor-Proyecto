

import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Login from './login';
import Home from './components/Home';
import './App.css';
import TokenContext from './contexts/TokenContext';
import TokenContextProvider from './contexts/TokenContext';


function ProtectedRoute(user_status: token, component: Component) {

  if (user_status) {
    return <Component> </Component>;
  } else {
    <Redirect> </Redirect>
  }
  

  
}

export default App;
