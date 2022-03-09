
import React, { useContext } from 'react';
import { Route, Redirect, useParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Medicine from '../components/Medicine';
import TokenContextProvider from '../contexts/TokenContext';

function MedicineRoute(user_status: token, user_level: level) {

  const { cur_medicine } = useParams();
  
  return ( 
    <Route render = { (props) => {
    if (user_status) {
      return (<TokenContextProvider> <Medicine ID = { cur_medicine } /> </TokenContextProvider>);
    } else {
      return (<Redirect to = { {pathname: '/login', state: { from: props.location }} } />);
    } 
    
  } }
  />
  );

  
}

export default MedicineRoute;