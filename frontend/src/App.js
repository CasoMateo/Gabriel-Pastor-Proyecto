import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import TokenContext from './contexts/TokenContext';
import TokenContextProvider from './contexts/TokenContext';
import ProtectedRoute from './routes/ProtectedRoute';
import UnprotectedRoute from './routes/UnprotectedRoute';

function App() {
  // const { token, renderModifyUsers } = useContext(TokenContext);

  return (

    <Router> 
      <Routes>
        <Route path = '/login' element = {<Login />}  /> 
            
        <Route path = '/home' element = { <Home /> }/>
            
            

      </Routes>
        
  
    
    </Router>
  );
  
}

export default App;
