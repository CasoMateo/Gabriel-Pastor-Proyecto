import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import AuthContextProvider from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function UnprotectedRoute(props) {
  // const { token, renderModifyUsers } = useContext(TokenContext);


  return (

    <Router> 
      <Routes>
        <Route path = '/login' element = { <Login renderVerifyCredentials = { props.renderVerifyCredentials } login = { props.login }/> }  /> 
            
        <Route path = '*' element = { <Navigate to = '/login' /> } />
      </Routes>
        
  
    
    </Router>
  );
  
}

export default UnprotectedRoute;
