
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Users from '../components/Users';
import TokenContextProvider from '../contexts/TokenContext';

function UsersRoute(user_status: token, user_level: level) {

  return ( 
    <Route render = { (props) => {
    if ((user_status) && (user_level)) {
      return (<TokenContextProvider> <Users/ > </TokenContextProvider>);
    } else {
      return (<Redirect to = { {pathname: '/login', state: { from: props.location }} } />);
    } 
    
  } }
  />
  );

  
}

export default UsersRoute;