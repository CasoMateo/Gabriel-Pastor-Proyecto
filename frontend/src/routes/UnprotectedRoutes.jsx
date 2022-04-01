import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Login from '../components/Login';

function UnprotectedRoute() {
  // const { token, renderModifyUsers } = useContext(TokenContext);

  return (

    <Router> 
      <Routes>
        <Route path = '/login' element = {<Login />}  /> 
            
        <Route path = '*' element = { <Navigate to = '/login' /> } />
      </Routes>
        
  
    
    </Router>
  );
  
}

export default UnprotectedRoute;
