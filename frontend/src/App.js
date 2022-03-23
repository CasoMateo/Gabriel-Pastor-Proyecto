import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Users from './components/Users';
import Error404 from './errors/error404'
import TokenContext from './contexts/TokenContext';
import TokenContextProvider from './contexts/TokenContext';
import ProtectedRoute from './routes/ProtectedRoutes';
import UnprotectedRoute from './routes/UnprotectedRoutes';

function App() {
  // const { token, renderModifyUsers } = useContext(TokenContext);

  
  return (

    <Router> 
      <Routes>
        <Route path = '/login' element = {<Login />}  /> 
            
        <Route path = '/home' element = { <Home /> }/>

        <Route path = '/users' element = { <Users /> }/>
            
        <Route path = '*' element = { <Error404 />} />


      </Routes>
        
  
    
    </Router>
  );
  
}

export default App;
