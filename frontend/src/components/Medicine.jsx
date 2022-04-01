

import React, { useState } from 'react';
import { Chart, Tooltip, Title, ArcElement, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ReactDOM from 'react-dom'; 
import { useNavigate, useParams } from 'react-router-dom';
import '../index.css';
import TokenContext from '../contexts/TokenContext';
import Home from './Home';
import Login from './Login';

Chart.register(
  Tooltip, Title, ArcElement, Legend
);

function Medicine(props) { 
  // check medicine, alerts, dates, and quantities from api 
  const navigate = useNavigate();
  const params = useParams();
  // const { token, logout, username } = useContext(TokenContext);
  const [medicine, setMedicine] = useState({'name': 'peptobismol', 'badges': [{'quantity': 10, 'date': '2022-03-30'}, {'quantity': 10, 'date': '2021-05-17'}] });
  const [retrievedMedicine, setRetrievedMedicine] = useState(false);
  const token = true; 
  const username = 'Mateo'; 

  const logout = () => {
    alert('Logout');
  }

  if (!token) {
    navigate('/login');
  }

  const getMedicineResource = async () => {
    
    const url = 'http://127.0.0.1:8000/get-medicine/'.concat(params.cur_medicine);
    const promise = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }); 
    
    const response = await promise.json();
    

    if ((!response.medicine) || (promise.status != 200)) {
      alert('Error retrieving medicine');
      
    }  
    
    setMedicine(response.medicine);
  
  };

  if (!retrievedMedicine) {
    getMedicineResource(); 
    setRetrievedMedicine(true);
  }

  function dateDiffInDays(givenDate) {
    // Discard the time and time-zone information.
    const date1 = new Date();
    const date2 = new Date(givenDate);
    const diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10); 
    return diffDays <= 21;
  }

  const dateInPast = function (givenDate) {
    const given = new Date(givenDate);
    const diff = new Date().getTime() - given.getTime();
    if (diff > 0) {
       return true;
     }
    return false;
  };


  
  const dates = [];
  const quantities = [];
  const colors = [];

  medicine.badges.map(badge => {
    dates.push(badge.date);
    quantities.push(badge.quantity);

    if (dateInPast(badge.date)) {
      colors.push('#d1837b');
    } else if (dateDiffInDays(badge.date)) {
      colors.push('#ecf09c');
    } else {
      colors.push('#bef5b0');
    }
    
  });

  const pie_chart_data = {
    datasets: [{
        data: quantities, 
        backgroundColor: colors
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: dates, 
    
};

  
  const [editName, setEditName] = useState();
  const [editDate, setEditDate] = useState();
  const [verifyLogout, setVerifyLogout] = useState(false);
  const [verifyDelete, setVerifyDelete] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);

  const reSetMedicine = () => {
    const getMedicineResource = async () => {
      const url = 'https://localhost.com/get-medicine/'.concat(props.match.params.cur_medicine);
      const promise = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }); 

      const response = promise.json(); 
      return response;
    };

    const status = getMedicineResource();
    setMedicine(status.medicine);
   
    
  }

  const handleConfirmVerify = () => {
    
    
    if (verifyLogout) {
    
      setVerifyLogout(false);
      return logout;
    } else if (verifyDelete) {
        setVerifyDelete(false);

        if (!token) {
          navigate('/login');
        }
      
        const deleteMedicineResource = async () => {
          const url = 'http://127.0.0.1:8000/delete-medicine/'.concat(params.cur_medicine);
          const promise = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
  
          });  
          
          const response = await promise.json(); 
          
          if ((promise.status != 200) || (!response.deleted)){
            alert('Error deleting medicine');
            return;
          } 
          navigate('/home');
        };

        deleteMedicineResource(); 

        
        
    }

  }
 
 
  const handleEditDate = (date) => {
    alert(date); 
    alert(editDate); 
    if (!token) {
      navigate('/login');
    }
    
    if (dateInPast(editDate)) {
      alert('Not valid credentials');
      return;
    } 

    // make api call to change curdate to date
    const editDateResource = async () => {
      const url = 'http://127.0.0.1:8000/change-date';
      const promise = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'medicine_id': params.cur_medicine, 'last': date, 'new': editDate})
        
      }); 

      const response = await promise.json(); 

      if ((promise.status != 200) || (!response.changedDate)){
        alert('Not properly changed');
        return; 
      }
      
    };

    editDateResource();

    setRetrievedMedicine(false);
    
  }


  const handleEditName = () => {
    
    alert(editName); 

    if (!token) {
      navigate('/login');
    }
    
    if (!editName) {
      alert('Not valid data');
      return;
    }



    const editNameResource = async () => {
      const url = 'http://127.0.0.1:8000/change-name';
      const promise = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'medicine_id': params.cur_medicine, 'new': editName})
        
      }); 
      const response = await promise.json(); 
      if ((promise.status != 200) || (response.changedName)) {
        alert('Not properly changed');
        return; 
      }
    };

    editNameResource();

    setRetrievedMedicine(false);

  }


  const closeForms = () => {
    setVerifyLogout(false);
    setVerifyDelete(false);
  }
    
  
  return (
 
    <div>
      <div className = 'navbar'>
  
        <div className = 'general-information-container'>
          <img src = '/logo192.png' className = 'logo-image' />

          <div className = 'name-slogan'>
            <h5 className = 'el-name-slogan'>
              Nursing Home Name 
              <br /> 
              This is their slogan
            </h5>
          </div> 
        </div>

        <div className = 'navbar-buttons'>
          <div className = 'action-navbar'>
            <div className = 'home-profile'>
              <img className = 'nav-option' id = 'home-button' src = '/home_button.png' onClick = { () => navigate('/home') } />
              
              <img className = 'nav-option' id = 'profile-button' src = '/profile_button.png' onMouseOver = { () => setMoreOptions(true) } /> 

              <div onMouseOver = { () => setMoreOptions(true) } onMouseOut = { () => setMoreOptions(false) } className = { moreOptions ? 'hover-profile' : 'hover-profile-false' }> 
                <p className = 'profile-user-credentials'> { username } </p>
                <button onClick = { () => setVerifyLogout(true) } className = 'logout-medicine'> Logout </button>
              </div> 

  
            </div>
          </div>

        </div>

      </div> 

      <div className = 'main-page'>

        <div className = 'medicine-options' >
          <p className = 'cur-title'> Medicine </p>


          <div className = 'options-medicine'>
            <p> REMOVE MED. </p>
            <img onClick = { () => setVerifyDelete(true) } src = '/trash_button.png' className = 'part-title-option' id = 'remove-medicine' /> 

           
          </div>

          <div className = 'options-medicine'>
            <p> REMOVE EXPIRED BADGES </p>
            <img onClick = { () => handleRemoveExpiredBadges() } src = 'http://simpleicon.com/wp-content/uploads/refresh.png' className = 'part-title-option' id = 'remove-medicine' /> 

           
          </div>
        </div>

        
        <div className = 'medicine-info'>
          <div className = 'medicine-attributes'>
            <div className = 'med-attribute'> 
              <p className = 'attribute-name-medicine'> Name </p>
              <div>
                <input type = 'text' placeholder = { medicine.name } onChange = { e => setEditName(e.target.value) } className = 'attribute-name' required /> 
                <input type = 'submit' className = 'submit-form' onClick = { () => handleEditName() } /> 
              </div>            
            </div>

            <div className = 'med-attribute'> 
              <p className = 'attribute-name-medicine'> Quantity </p>
              <p className = 'attribute-quantity'> 
                { medicine.badges.reduce((accumulator, badge) => { 
                    return accumulator + badge.quantity;
                  }, 0) } 
              </p> 
            </div>

            
            { 
              medicine.badges.map(badge => 

                <div className = 'med-attribute'>
                  <p className = 'attribute-name-medicine'> Expiry Date </p>
                  <p className = 'attribute-previous-date'> <i>{ badge.date } </i> </p>
                  <div>
                    <input type = 'date' className = 'attribute-name' required onChange = { e => setEditDate(e.target.value) } /> 
                    <input type = 'submit' className = 'submit-form' onClick = { () => handleEditDate(badge.date) }></input>
                  </div>
                </div>
                
              )

            }
            
                 
            
            

          </div>
          
          

        
        </div>
        
        <div className = 'statistics'> 
            
          <Pie data = { pie_chart_data }/> 

        
        </div>
        
      </div>

      <div className = { (verifyLogout || verifyDelete ) ? 'verify-button' : 'verify-button-false' }>
        <h5> 
          Are you sure you want to do this? 
          <br /> 
          You can't undo this action 
        </h5> 

        <div className = 'verifying-buttons'>
          <button className = 'submit-form' id = 'verify-yes' onClick = { () => handleConfirmVerify() }>
            YES 
          </button>

          <button onClick = { () => closeForms() } className = 'submit-form' id = 'verify-no'>
            CANCEL 
          </button>
        </div>
      </div>

    </div>
    
  );

}

export default Medicine;