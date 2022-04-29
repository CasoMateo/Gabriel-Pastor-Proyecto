import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Home from '../components/Home';
import Users from '../components/Users';
import Medicine from '../components/Medicine';
import AuthContextProvider from '../contexts/AuthContext';

function ProtectedRoute(props) {
  // const { token, renderModifyUsers } = useContext(TokenContext);


  return (
    
    <Router> 
      <Routes>
        
        <Route path = '/home' element = { <Home token = { props.token } renderModifyUsers = { props.user_level } username = { props.username} logout = { props.logout }/> } /> 
        <Route path = '/medicine/:cur_medicine' element = { <Medicine token = { props.token } renderModifyUsers = { props.user_chief } username = { props.username} logout = { props.logout }/> }  /> 

        
        { props.user_level && <Route exact path="/users" element = { <Users token = { props.token } renderModifyUsers = { props.user_level } username = { props.username} logout = { props.logout }/>  } /> }
        
        <Route path = '*' element = { <Navigate to = '/home' /> }/>
      </Routes>
        
  
    
    </Router>
  );
  
}

export default ProtectedRoute;
