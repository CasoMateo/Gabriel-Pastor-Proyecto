import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Users from './components/Users';
import Medicine from './components/Medicine';
import Error404 from './errors/error404'
import AuthContextProvider, { AuthContext } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoutes';
import UnprotectedRoute from './routes/UnprotectedRoutes';

function App() {
  // const { token, renderModifyUsers } = useContext(TokenContext);
  
  const { token, renderModifyUsers, username, renderVerifyCredentials, login, logout } = useContext(AuthContext); 
  
  if (!token) {
    
    return <UnprotectedRoute renderVerifyCredentials = { renderVerifyCredentials } login = { login }/>
  } else {
   
    return <ProtectedRoute token = { token } user_level = { renderModifyUsers } username = { username } logout = { logout }/>
  }
  
  
}

export default App
