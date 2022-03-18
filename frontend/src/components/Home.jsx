import React, { useState, useRef, Component } from 'react';
import ReactDOM from 'react-dom'; 
import { Navigate } from 'react-router-dom';
import '../index.css';
import TokenContext from '../contexts/TokenContext';
import Users from './Users';
import Medicine from './Medicine';
import Login from './Login';
function Home() { 
  // check reset alerts logic 
  // update alerts on logout
  // check action after submitting form (closing it)
  // check add medicine form, alerts iteration 

  // replantear lógica

  // const { token, renderModifyUsers, logout, username } = useContext(TokenContext);

  const token = true; 
  const renderModifyUsers = true; 
  const username = 'Mateo'; 

  const logout = () => {
    alert('Logout');
  }


  if (!token) {
    return (
      <Navigate to = {{ pathname: '/login', state: { from: props.location }} } />
    );
  }
  
  const [moreOptions, setMoreOptions] = useState(false);
  const [addToMedicineForm, setAddToMedicineForm] = useState(false);
  const [subsToMedicineForm, setSubsToMedicineForm] = useState(false);
  const [addMedicineForm, setAddMedicineForm] = useState(false);
  const [verifyRef, setVerifyRef] = useState(false);
   
  const getMedicinesResource = async () => {
    const getMedicines = await fetch('https://localhost.com/get-medicines', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
  })};

  const response = getMedicinesResource();
  const status = response.json();

  if (status.status_code != 200) {
    alert('Failed to retrieve medicines');
    return;
  }

  const medicines = status.medicines;

  const [ addMedicineAttributes,setAddMedicineAttributes ] = useState({ name: '', quantity: '', expiry: '' });

  const [ addToMedicineAttributes, setAddToMedicineAttributes ] = useState({ _id : '', quantity: '', expiry: '' });

  const [ subsToMedicineAttributes, setSubsToMedicineAttributes ] = useState({ _id : '', quantity: '', expiry: '' }); 

  const dateInPast = function (firstDate) {
    secondDate = new Date();
    if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
      return true;
    }

    return false;
  };

  function dateDiffInDays(b) {
    // Discard the time and time-zone information.
    const a = new Date();
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY) <= 21;
  }

  const reSetMedicines = () => {
    setAddMedicineForm(false);
    const getMedicinesResource = async () => {
      const getMedicines = await fetch('https://localhost.com/get-medicines', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    })};

    const modified = getMedicinesResource();
    medicines = modified.json();
  }

  const handleAddMedicine = () => {

    if (!token) {
      return (
      <Navigate to = {{ pathname: '/login', state: { from: props.location }} } />
    );
    }
    
    if ((addMedicineAttributes.quantity < 0) || (!addMedicineAttributes.expiry) || (dateInPast(addMedicineAttributes.expiry))) {
      alert('Not valid data');
      return;
    }

    const addMedicineResource = async () => {
      const addMedicine = await fetch('https://localhost.com/add-medicine', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addMedicineAttributes)
    })};

    const response = addMedicineResource();
    const status = response.json();
    
    if ((!status.added) || (status.status_code != 201)) {
      alert('Not properly added');
      return;
    } 

    reSetMedicines();
     
  }

  const handleAddtoMedicine = () => {
    if (!token) {
      return (
      <Navigate to = {{ pathname: '/login', state: { from: props.location }} } />
      );
    }
    
    if ((addToMedicineAttributes.quantity < 0) || (!addToMedicineAttributes.expiry) || (dateInPast(addToMedicineAttributes.expiry))) {
      alert('Not valid data');
      return;
    }

    const addToMedicineResource = async () => {
      const addToMedicine = await fetch('https://localhost.com/add-to-medicine', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addToMedicineAttributes)
    })};

    const response = addToMedicineResource();
    const status = response.json();

    if ((!status.addedTo) || (status.status_code != 200)) {
      alert('Not properly modified');
      return;
    }

    reSetMedicines();
  
  }

  const handleSubstoMedicine = () => {
    if (!token) {
      return (
      <Navigate to = {{ pathname: '/login', state: { from: props.location }} } />
    );
    }
    
    if ((subsToMedicineAttributes.quantity < 0) || (!subsToMedicineAttributes.expiry) || (dateInPast(subsToMedicineAttributes.expiry))) {
      alert('Not valid data');
      return;
    }

    const subsToMedicineResource = async () => {
      const subsToMedicine = await fetch('https://localhost.com/subs-to-medicine', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subsToMedicineAttributes)
    })};

    const response = subsToMedicineResource();
    const status = response.json();
    // make put request to API
    if ((!status.subsTo) || (status.status_code != 200)) {
      alert('Not properly modified');
      return;
    }

    reSetMedicines();
  }


  displayAddToMedicine = (clickedId) => {

    setAddToMedicinForm(true);
    
    setAddMedicineAttributes(prevState => ({ ...prevState, _id : clickedId }));


   
  }

  displaySubsToMedicine = (clickedId) => {

    setSubsToMedicinForm(true);
    
    setSubsMedicineAttributes(prevState => ({ ...prevState, _id : clickedId }));
   

  }


  modifyUsers = () => {
    return (
    <Navigate to = { { pathname: '/users', state : { from : props.location } } } />
    );
  }

  NavigateMedicine = (id) => {
    const path = '/medicine/';
    path += id; 
    
    return ( 
      <Navigate to = { { pathname: path, state : { from : props.location} }} />
    );
  }

  closeFormTrigger = () => {
    setAddMedicineForm(false);
    setAddToMedicineForm(false);
    setSubsMedicineForm(false);
    setVerifyRef(false);
  
  }

  focusMedicines = () => {
    medicinesRef.current.style.scrollIntoView({ behavior: 'smooth' });
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
              <img className = 'nav-option' id = 'home-button' src = './public/images (1).png'> </img>
            
              <img className = 'nav-option' id = 'profile-button' src = './public/41-410093_circled-user-icon-user-profile-icon-png.png' onHover = { setMoreOptions(true) } onMouseOut = { setMoreOptions(false) }> </img> 

              <div onMouseOver = { setMoreOptions(true) } onMouseOut = { setMoreOptions(false) } className = { moreOptions ? 'hover-profile' : 'hover-profile-false' }> 
                <p className = 'profile-user-credentials'> { username } </p>
                <button ref = { logoutRef } className = 'logout' onClick = { () =>  { setVerifyRef(true) } } > Logout </button>
              </div> 

              
              <h5 onClick = { focusMedicines() } className = 'medicines-alerts-1'> 
                Medicines
              </h5> 

              
              <h5 className = { renderModifyUsers ? 'add-remove-user' : 'add-remove-user-false' } onClick = { modifyUsers() }> 
                Add/Remove User
              </h5>
              
            </div>

          </div>

        </div>

      </div> 

      <div className = 'main-page'>
        <div className = 'page-title' id = 'medicines-part' ref = { medicinesRef }>
          <p className = 'cur-title'> Inventory </p>


          <div className = 'add-medicine'>
            <p> ADD MED. </p>
            <img src = './public/Screenshot 2021-12-01 7.30.03 PM.png' className = 'part-title-option' id = 'add-medicine-button' onClick = { setAddMedicineForm(true) }> </img> 
          </div>
        </div>

        
        <div className = 'medicine-list-root'> 
          { medicines.length == 0 
            ?   
              <div class = 'message-no-data'> 
                No medicines available
              </div>
            :
            
            medicines.map(medicine => {
              const curState = 'medicine';
  
              medicine.badges.forEach(badge => {
                if (dateDiffInDays(badge.date)) {
                  curState += '-alert';
  
                } else if (dateInPast(badge.date)) {
                  curState += '-expired';
                  return;
                }
              });
                
              <div className = { curState }>
                <p className = 'medicine-name' onClick = { NavigateMedicine(medicine.id) }> 
                  { medicine.name }
                </p>
  
                <p>
                  { medicine.badges.reduce((accumulator, badge) => { 
                    return accumator + badge.quantity;
                  }, 0) }  
                </p>
  
                <img className = 'element-image' src = '/../..' onClick = { displayAddToMedicineForm(medicine.id) }> </img>
  
                <img className = 'element-image' src = '' onClick = { displaySubsToMedicineForm(medicine.id) }> </img>
                  
              </div>
            })};

        </div>
      </div>

      <div className ={ addMedicineForm ? 'add-medicine-form' : 'add-medicine-form-false' }>
        <div className = 'title-close-form'>
          <h5 className = 'form-title'> 
            Add Medicine 
          </h5>
          <img id = 'medicine-close-add' onClick = { closeFormTrigger() } className = 'close-pop-up-form' src = 'public/Screenshot 2021-12-09 7.24.30 PM.png'>
          </img>
        </div>
        
        <form  onSubmit = { handleAddMedicine() }>
          <label for="fname">Medicine Name:</label>
          <br/>
          <input className = 'add-medicine-name' type="text" placeholder = 'Answer the input field' required onChange = { e => setAddMedicineAttributes(prevState => ({ ...prevState, name : e.target.value })) }  > </input>
          <br/>
          <label for="lname">Initial Quantity</label>
          <br/>
          <input className = 'add-medicine-initial-quantity' type="text" placeholder = 'Answer the input field' required onChange = { e => setAddMedicineAttributes(prevState => ({ ...prevState, quantity : e.target.value })) }> </input>
          <br/>
          <label for="lname"> Date of Expiry</label>
          <br/>
          <input className = 'add-medicine-date-expiry' type="date" placeholder = 'Answer the input field' required onChange = { e => setAddMedicineAttributes(prevState => ({ ...prevState, expiry : e.target.value }) ) } > </input>

          <button type = 'submit' className = 'submit-form'> SUBMIT </button>
        </form> 
        
     
      
      </div>

      <div className = { addToMedicineForm ? 'add-to-medicine-form' : 'add-to-medicine-form-false' }>
        <div className = 'title-close-form'>
          <h5 className = 'form-title'> Add to Medicine </h5>
          <img id = 'medicine-close-add-to' className = 'close-pop-up-form' src = 'public/Screenshot 2021-12-09 7.24.30 PM.png' onClick = { closeFormTrigger() }>
          </img>
        </div>
        
        <form onSubmit = { handleAddToMedicine }>
          <label for="fname">Quantity to Add</label>
          <br/>
          <input className = 'input-field-add' type="text" id="fname" name="fname" placeholder = 'Answer the input field' required onChange = { e => setAddToMedicineAttributes(prevState => ({ ...prevState, quantity : e.target.value })) } > </input>
          <br/>
          <label for="lname">Date of Expiracy</label>
          <br/>
          <input className = 'input-field-add' type="date" id="fname" name="fname" placeholder = 'Answer the input field' required onChange = { e => setAddToMedicineAttributes(prevState => ({ ...prevState, expiry : e.target.value })) } > </input>
          <br/>
          <button type = 'submit' className = 'submit-form'> SUBMIT </button>
        
        </form>
        
    
      </div>

      <div className = { subsToMedicineForm ? 'subs-to-medicine-form' : 'subs-to-medicine-form-false' }>
        <div className = 'title-close-form'>
          <h5 className = 'form-title'> Consume Medicine </h5>
          <img id = 'medicine-close-subs-to' className = 'close-pop-up-form' src = 'public/Screenshot 2021-12-09 7.24.30 PM.png' onClick = { closeFormTrigger() }>
          </img>
        </div>
        
        <form onSubmit = { handleSubstoMedicine }>
          <label for="fname">Quantity to Consume</label>
          <br/>
          <input className = 'input-field-add' type="text" id="fname" name="fname" placeholder = 'Answer the input field' required onChange = { e => setSubsToMedicineAttributes(prevState => ({ ...prevState, quantity : e.target.value })) }> </input>
          <br/>
          <label for="fname">Package expiry</label>
          <br/>
          <input className = 'input-field-add' type="text" id="fname" name="fname" placeholder = 'Answer the input field' required onChange = { e => setSubsToMedicineAttributes(prevState => ({ ...prevState, expiry : e.target.value })) }> </input>

          <button type = 'submit' className = 'submit-form'> SUBMIT </button>
        </form>
        
        <button className = 'submit-form'> SUBMIT </button>
      </div>

      <div className = { verifyRef ? 'verify-button' : 'verify-button-false' } >
        <h5> Are you sure you want to do this? <br/ >You can't undo this action </h5> 

        <div className = 'verifying-buttons'>
          <button className = 'submit-form' id = 'verify-yes' onClick = { logout }>
            YES 
          </button>

          <button className = 'submit-form' id = 'verify-no' onClick = { closeFormTrigger() }>
            CANCEL 
          </button>
    
        </div>
      </div>

    </div> 
    

  );

  
}

export default Home;

