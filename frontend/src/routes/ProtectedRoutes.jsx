import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Home from '../components/Home';
import Users from '../components/Users';
import Medicine from '../components/Medicine';

function ProtectedRoute(user_level) {
  // const { token, renderModifyUsers } = useContext(TokenContext);

  return (

    <Router> 
      <Routes>
        
        <Route path = '/home' element = {<Home />}  /> 
        <Route path = '/medicine/:cur_medicine' element = {<Medicine />}  /> 

        
        { user_level && <Route exact path="/users" element = { <Users /> } /> }
        
        <Route path = '*' element = { <Navigate to = '/home' /> }/>
      </Routes>
        
  
    
    </Router>
  );
  
}

export default ProtectedRoute;
