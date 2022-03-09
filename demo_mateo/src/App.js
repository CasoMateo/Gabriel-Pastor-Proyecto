import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import './App.css';
import Users from './components/Users';
import TokenContext from './contexts/TokenContext';
import TokenContextProvider from './contexts/TokenContext';
import HomeRoute from './routes/HomeRoute';
import UsersRoute from './routes/UsersRoute';
import MedicineRoute from './routes/MedicineRoute';

function App() {
  const { token, renderModifyUsers } = useContext(TokenContext);

  return (
    <Router> 
      <Route path = '/login' exact> 
        <TokenContextProvider>
          <Login/ >
        </TokenContextProvider>
      </Route>

      <HomeRoute path = '/home' user_state = {token} exact /> 
      <MedicineRoute path = '/medicine/:cur_medicine' user_state = {token} exact /> 
      <UsersRoute path = '/users' user_state = { token } user_level = { renderModifyUsers } exact /> 
    
    </Router>
  );
  
}

export default App;
