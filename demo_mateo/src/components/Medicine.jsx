
import React, { useState, useRef, Component } from 'react';
import { Pie } from 'react-chartjs-2';
import ReactDOM from 'react-dom'; 
import './index.css';
import TokenContext from './contexts/TokenContext';
import Home from './components/Home';
import Login from './login';
import Error404 from './errors/error404';

function Medicine( { ID }) { 
  // check medicine, alerts, dates, and quantities from api 
  
  const { token, logout, username } = useContext(TokenContext);

  if (!token) {
    return <Login/>;
  }
  
  const getMedicineResource = async () => {
      const getMedicine = await fetch('https://localhost.com/get-medicine/{ID}', () => {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
  })}};

  const response = getMedicineResource();
  const status = response.json();

  if (!status.medicine) || (status.status_code != 200) {
    alert('Error retrieving medicine');
    return <Home/>;
  }

  const medicine = status.medicine;
  
  const dates = [];
  const quantities = [];

  medicine.badges.map(badge => {
    dates.push(badge.date);
    quantities.push(badge.quantity);
  });

  var data = {
    labels: dates,
    datasets: [
      {
        label: "Distribution",
        data: quantities,
        backgroundColor: [
          "#FAEBD7",
          "#DCDCDC",
          "#E9967A",
          "#F5DEB3",
          "#9ACD32"
        ],
        borderColor: [
          "#E9DAC6",
          "#CBCBCB",
          "#D88569",
          "#E4CDA2",
          "#89BC21"
        ],
        borderWidth: [1, 1, 1, 1, 1]
      }
    ]
  };
  var options = {
    responsive: true,
    title: {
      display: true,
      position: "top",
      text: "Pie Chart",
      fontSize: 18,
      fontColor: "#111"
    },
    legend: {
      display: true,
      position: "bottom",
      labels: {
        fontColor: "#333",
        fontSize: 16
      }
    }
  };

  const [editName, setEditName] = useState();
  const [verifyLogout, setVerifyLogout] = useState(false);
  const [verifyDelete, setVerifyDelete] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);

  const mainPageRef = useRef();

  const reSetMedicine = () => {
    const getMedicineResource = async () => {
      const getMedicine = await fetch('https://localhost.com/get-medicine/{ID}', () => {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    })}};

    const response = getMedicineResource();
    const status = response.json();

    medicine = status.medicine;
    
  }

  handleConfirmVerify = () => {
    setVerifyRef(false);
    
    if (verifyLogout) {
      setVerifyLogout(false);
      return logout;
    } else if (verifyDelete) {
        setVerifyDelete(false);

        if (!token) {
          alert('Not valid credentials');
          return; 
        }
      
        const deleteMedicineResource = async () => {
          const deleteMedicine = await fetch('https://localhost.com/delete-medicine/{ID}', () => {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
  
        })}};

        const response = deleteMedicineResource(); 
        const status = response.json();

        if (!status.deleted) || (status.status_code != 200) {
          alert('Error deleting medicine');
          return;
        }
        
        else {
          return <Home> </Home>;
        }
        
    }

  }
  
  focusMain = () => {
    mainPageRef.current.scrollIntoView();
  }

  const dateInPast = function (firstDate) {
    const secondDate = new Date();
    if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
      return true;
    }

    return false;
  };


  handleEditDate = (date, newDate) => {

    if (!token) {
      return <Login/>;
    }
    
    if (dateInPast(newDate)) {
      alert('Not valid credentials');
      return;
    }

    // make api call to change curdate to date
    const editDateResource = async () => {
      const editDate = await fetch('https://localhost.com/change-attribute/date/{ID}', () => {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: {
          JSON.strigify({'_type': 'date', 'last': date, 'new': newDate});
        }
    })}};

    const response = editDateResource();
    const status = response.json();

    if (!status.changedAttribute) || (!status.status_code != 200) {
      alert('Not properly changed');
      return; 
    }

    reSetMedicine();
    
  }


  handleEditName = () => {
    if (!token) {
      return <Login/>;
    }
    
    if (!editName) {
      alert('Not valid credentials');
      return;
    }

    const editNameResource = async () => {
      const editName = await fetch('https://localhost.com/change-attribute/name/{ID}', () => {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: {
          JSON.strigify({'_type': 'name', 'new': editName});
        }
    })}};

    const response = editDateResource();
    const status = response.json();

    if (!status.changedAttribute) || (!status.status_code != 200) {
      alert('Not properly changed');
      return; 
    }

    reSetMedicine();

  }

  function dateDiffInDays(b) {
    // Discard the time and time-zone information.
    const a = new Date();
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    
    return Math.floor((utc2 - utc1) / _MS_PER_DAY) <= 21;
  }

  const closeForms = () => {
    setVerifyLogout(false);
    setVerifyDelete(false);
  }
                           
  
  return (
 
    <div>
      <div className = 'navbar'>
  
        <div className = 'general-information-container'>
          <img src = './public/download (14) (1).png' className = 'logo-image'></img>

          <div className = 'name-slogan'>
            <h5 className = 'el-name-slogan'>
              Nursing Home Name 
              <br/ > 
              This is their slogan
            </h5>
          </div> 
        </div>

        <div className = 'navbar-buttons'>
          <div className = 'action-navbar'>
            <div className = 'home-profile'>
              <img className = 'nav-option' id = 'home-button' onclick = 'redirectHome()' src = './public/images (1).png'> </img>
              
              <img className = 'nav-option' id = 'profile-button' src = './public/41-410093_circled-user-icon-user-profile-icon-png.png' onHover = { setMoreOptions(true) } onMouseOut = { setMoreOptions(false) }> </img> 

              <div onMouseOver = { setMoreOptions(true) } onMouseOut = { setMoreOptions(false) } className = { moreOptions ? 'hover-profile' : 'hover-profile-false' } className = 'hover-profile'> 
                <p className = 'profile-user-credentials'> { username } </p>
                <button onClick = { setVerifyLogout(true) } className = 'logout-medicine'> Logout </button>
              </div> 

              <h5 onClick = { setScrollMedicines(true) } className = 'statistics-expiracy-1'> 
                Statistics
              </h5> 

  
            </div>
          </div>

        </div>

      </div> 

      <div className = 'main-page'>

        <div className = 'page-title' ref = { mainPageRef}>
          <p className = 'cur-title'> Medicine </p>


          <div className = 'options-medicine'>
            <p> REMOVE MED. </p>
            <img onClick = { setVerifyDelete(true) } src = './public/1054391-200.png' className = 'part-title-option' id = 'remove-medicine'> </img>

           
          </div>
        </div>

        
        <div className = 'medicine-info'>
          <div className = 'medicine-attributes'>
            <div class = 'med-attribute'> 
              <p> Name </p>
              <input type = 'text' placeholder = { medicine.name } onChange = { e => setEditName(e.target.value) } class = 'attribute-name' required>
              <input type = 'submit' class = 'submit-form' onClick = { handleChangeName() )> </input> 
            </div>

            <div class = 'med-attribute'> 
              <p> Quantity </p>
              <p> { medicine.quantity } </p> 
            </div>
            
            { 
              medicies.badges.map(badge => {
                <div class = 'med-attribute'> 
                  <p> Expiry Date </p>
                  <input type = 'text' placeholder = { badge.date } class = 'attribute-name' required onfocus="(this.type='date')" onChange = { e => handleEditDate(badge.date, e.target.value) } > </input>
                 
                </div>
              }) 
            
                 
            }

          </div>

          <div className = 'statistics'> 
            
            <Pie data = { data } options = { options } > 
            </Pie>

        
          </div>
      </div>

      <div className = { (verifyLogout || verifyDelete ) ? 'verify-button' : 'verify-button-false' }>
        <h5> Are you sure you want to do this? <br/ > You can't undo this action </h5> 

        <div className = 'verifying-buttons'>
          <button className = 'submit-form' id = 'verify-yes' onClick = { handleConfirmVerify() }>
            YES 
          </button>

          <button onClick = { closeForms() } className = 'submit-form' id = 'verify-no'>
            CANCEL 
          </button>
        </div>
      </div>

    <div class = 'page-title' id = 'alerts-part'>
      <p class = 'cur-title'> Alerts </p>


    </div>

    <div className = 'medicine-alert-division'>
      <p>
        Date
      </p>

      <p>
        Quantity
      </p>

      <p>
        Status
      </p>
      
    </div>

    <div className = 'alert-distributions'>
      
      medicine.badges.map(badge => {
        const cur = '';
        if (badge.diffInDays(badge.date)) {
          cur = 'date-Expired';
        } else if (badge.dateInPast(badge.date)) {
          cur = 'date-Alert';
        }
        
        if (cur == 'date-Expired') || (cur == 'date-Alert') {
        
          <div className = { cur }>
            <p>
              { badge.date }
            </p>
    
            <p>
              { badge.quantity }
            </p>
    
            <p>
              { cur[5: ] }
            </p>
            
          </div>
        }
      })
        

    </div>
      

    </div>

  )

  
}

export default Medicine;