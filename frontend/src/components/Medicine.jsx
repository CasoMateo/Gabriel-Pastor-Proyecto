

import React, { useState } from 'react';
import { Chart, Tooltip, Title, ArcElement, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ReactDOM from 'react-dom'; 
import { useNavigate, useParams } from 'react-router-dom';
import '../index.css';
import Home from './Home';
import Login from './Login';
import { AuthContext } from '../contexts/AuthContext';

Chart.register(
  Tooltip, Title, ArcElement, Legend
);

function Medicine(props) { 
  // check medicine, alerts, dates, and quantities from api 
  const navigate = useNavigate();
  const params = useParams();
  // const { token, logout, username } = useContext(AuthContext);

  const [medicine, setMedicine] = useState({'name': '', 'badges': [] });
  const [retrievedMedicine, setRetrievedMedicine] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [curView, setCurView] = useState(false);
  

  if (!props.token) {
    navigate('/login');
  }

  const getMedicineResource = async () => {
    
    const url = 'http://127.0.0.1:8000/get-medicine/'.concat(params.cur_medicine);
    const promise = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cookies': document.cookie
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

 

  const handleConfirmVerify = () => {
    
    
    if (verifyLogout) {
    
      setVerifyLogout(false);
      return props.logout(props.username);
    } else if (verifyDelete) {
        setVerifyDelete(false);

        if (!props.token) {
          navigate('/login');
        }
      
        const deleteMedicineResource = async () => {
          const url = 'http://127.0.0.1:8000/delete-medicine/'.concat(params.cur_medicine);
          const promise = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Cookies': document.cookie
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
    
    if (!props.token) {
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
          'Content-Type': 'application/json',
          'Cookies': document.cookie
        },
        body: JSON.stringify({'medicine_id': params.cur_medicine, 'last': date, 'new': editDate})
        
      }); 

      const response = await promise.json(); 

      if ((promise.status != 200) || (!response.changedDate)){
        alert('Not properly changed');
        
      } else {
        const copy = JSON.parse(JSON.stringify(medicine));
        copy.badges.forEach(badge => {
          if (badge.date == date) {
            badge.date = editDate;
          }
        }); 
        
        setMedicine(copy);
      }
      
    };

    editDateResource();
    setEditDate();
    
  }


  const handleEditName = () => {
    
    if (!props.token) {
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
          'Content-Type': 'application/json', 
          'Cookies': document.cookie
        },
        body: JSON.stringify({'medicine_id': params.cur_medicine, 'new': editName})
        
      }); 
      const response = await promise.json(); 
      
      if ((promise.status != 200) || (!response.changedName)) {
        alert('Not properly changed');
        
      } else {
        const copy = JSON.parse(JSON.stringify(medicine)); 
        copy.name = editName; 
        setMedicine(copy);
      }
    };

    editNameResource();
    setEditName();

  }

  const handleRemoveExpiredBadges = (event) => {
   event.preventDefault();
    

    if (!props.token) {
      navigate('/login');
    }
    
    
    const removeExpiredResource = async () => {
      
      const url = 'http://127.0.0.1:8000/remove-expired-badges/'.concat(params.cur_medicine);
      const promise = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', 
          'Cookies': document.cookie
        }
        
      }); 

      const response = await promise.json(); 
      console.log(response);
      if ((promise.status != 200) || (!response.removedExpired)) {
        alert('Not properly changed');
      } else {
        setRetrievedMedicine(false);
      }
    };

    removeExpiredResource();

  } 

  const closeForms = () => {
    setVerifyLogout(false);
    setVerifyDelete(false);
  }
    
  
  return (
 
    <div>
      <div className = 'navbar-test'>
  
        <div className = 'general-information-container'>
          <img src = '/gabriel_pastor_logo.png' className = 'logo-image' />

          <div className = 'name-slogan'>
            <h5 className = 'el-name-slogan'>
              Gabriel Pastor 
              <br />
              Foundation
            </h5>
          </div> 
        </div>

        <div>
          <div>
            <div className = 'home-profile'>
              <img className = {props.renderModifyUsers ? 'nav-option'  : 'home-button-false' } src = '/home_button.png' onClick = { () => navigate('/home') }/> 
          
              
              <h5 className = { props.renderModifyUsers ? 'add-remove-user' : 'add-remove-user-false' } onClick = { () => navigate('/users') }> 
                Add/Remove User
              </h5>

              
              
            </div>

          </div>
          <div className = 'switch-page-medicine'>
            <p className = 'switch-page-value' onClick = { () => setCurView(false) } id = { !curView && 'selected-page-option'}> Attributes </p> 
            <p className = 'switch-page-value' onClick = { () => setCurView(true) } id = { curView && 'selected-page-option'}> Statistics </p> 

            <p className = 'switch-page-value' id = { !showMenu && 'selected-page-option' }onClick = { () => setShowMenu(!showMenu) }> { showMenu ? 'Hide' : 'Show' } menu </p>
          </div>

          <div className = 'navbar-options'>   

            <img className = { !props.renderModifyUsers ? 'home-button' : 'home-button-false'} src = '/home_button.png' onClick = { () => navigate('/home') } /> 
            <h5 className = 'username-attribute'> 
              { props.username }
            </h5>

            <button className = 'logout' onClick = { () =>  { setVerifyRef(true) } } > Logout </button>
          </div> 
        </div>
          

        

        

      </div> 

      <div className = 'main-page' id = 'medicine-body'>
        <div className = { !curView ? 'medicine-info' : 'page-not-exist' } >
          <div className = 'medicine-attributes'>
            <div className = 'med-attribute'> 
              <div>
                <input type = 'text' placeholder = { medicine.name } onChange = { e => setEditName(e.target.value) } className = 'attribute-name' required /> 
                <input type = 'submit' className = 'submit-form' onClick = { () => handleEditName() } value = 'Edit name' />
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

                <div key = { badge.date } className = 'med-attribute'>
                  <p className = 'attribute-previous-date'> <i>{ badge.date } </i> </p>
                  <div>
                    <input type = 'date' className = 'attribute-name' required onChange = { e => setEditDate(e.target.value) } /> 
                    <input type = 'submit' className = 'submit-form' onClick = { () => handleEditDate(badge.date) } value = 'Replace'/>
                  </div>
                </div>
                
              )

            }
            
                 
            
            

          </div>
          
          

        
        </div>

        <div className = { curView ? 'statistics' : 'page-not-exist' }> 
          { 
          (dates.length == 0) ?
          <div className = 'message-no-data'> No units for this medicine </div> : 
          <Pie data = { pie_chart_data } onMouseOver = { () => setShowMenu(false) } onMouseOut = { () => setShowMenu(true) }/>
          }

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

      <div className = { showMenu ? 'inventory-options' : 'inventory-options-false' }>
        <div onClick = { () => setVerifyDelete(true) } className = 'inventory-option' id = 'remove-medicine-part'>
          <p> REMOVE MED. </p>
          <img src = '/trash_button.png' className = 'part-title-option'/> 
        </div>

        <div onClick = { () => handleRemoveExpiredBadges(event) } className = 'inventory-option'>
          <p> REMOVE EXPIRED </p>
          <img src = 'http://simpleicon.com/wp-content/uploads/refresh.png' className = 'part-title-option' />
        </div>
      </div> 
      
    </div>

    
    
  );

}

export default Medicine;