
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Home from '../components/Home';
import TokenContextProvider from '../contexts/TokenContext';

function HomeRoute(user_status: token) {

  return ( 
    <Route render = { (props) => {
    if (user_status) {
      return (<TokenContextProvider> <Home/ > </TokenContextProvider>);
    } else {
      return (<Redirect to = { {pathname: '/login', state: { from: props.location }} } />);
    } 
    
  } }
  />
  );

  
}

export default HomeRoute;
