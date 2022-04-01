import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Users from './components/Users';
import Medicine from './components/Medicine';
import Error404 from './errors/error404'
import TokenContext from './contexts/TokenContext';
import TokenContextProvider from './contexts/TokenContext';
import ProtectedRoute from './routes/ProtectedRoutes';
import UnprotectedRoute from './routes/UnprotectedRoutes';

function App() {
  // const { token, renderModifyUsers } = useContext(TokenContext);
  const token = true; 
  const renderModifyUsers = true;

  if (!token) {
    return <UnprotectedRoute />
  } else {
    return <ProtectedRoute user_level = { renderModifyUsers } />
  }
  
  
}

export default App;
