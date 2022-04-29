import React, { useState, useEffect, useRef, useContext, Component } from 'react';
import ReactDOM from 'react-dom'; 
import { useNavigate } from 'react-router-dom';
import '../index.css';
import TokenContext from '../contexts/TokenContext';
import Users from './Users';
import Medicine from './Medicine';
import Login from './Login';
import Cookies from 'js-cookie';
import { AuthContext } from '../contexts/AuthContext';


function Home(props) { 
  // check reset alerts logic 
  // update alerts on logout
  // check action after submitting form (closing it)
  // check add medicine form, alerts iteration 
 
  // replantear lógica
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return false;
  } 
  // const { token, renderModifyUsers, logout, username } = useContext(AuthContext);
  setTimeout(2000);
 
  const navigate = useNavigate(); 
  
  const loggedInResource = async () => {
    const promise = await fetch('http://127.0.0.1:8000/is-logged-in', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
        'mode': 'cors',
        'Cookies': document.cookie
      }
    }); 
    alert(promise.status);
    return (promise.status == 200);
  };

  if (!props.token) {
    navigate('/login');
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

  const [addToMedicineForm, setAddToMedicineForm] = useState(false);
  const [subsToMedicineForm, setSubsToMedicineForm] = useState(false);
  const [addMedicineForm, setAddMedicineForm] = useState(false);
  const [verifyRef, setVerifyRef] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [retrievedMedicines, setRetrievedMedicines] = useState(false);
  const [sortedMedicines, setSortedMedicines] = useState(true);

  const getMedicinesResource = async () => {
  
    if (retrievedMedicines) {  
      return;
    }

    const promise = await fetch('http://127.0.0.1:8000/get-medicines', { 
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cookies': document.cookie
  
      }
    }); 
    
    if (promise.status != 200) {
      alert('Failed to retrieve medicines');
    } 

    const response = await promise.json();
  
    
    setMedicines(response.medicines);
     
    return response.medicines; 
  };  
 
  if (!retrievedMedicines) {
    getMedicinesResource();
    setRetrievedMedicines(true);
  }

  const medicines_status = {}; 
  
 
  medicines.forEach(medicine => {

    let cur_status = 'medicine';
    
    medicine.badges.forEach(badge => {
      if (dateInPast(badge.date)) {
        cur_status = 'medicine-expired';
        
       
      } else if (dateDiffInDays(badge.date)) {
        if (cur_status != 'medicine-expired') {
          cur_status = 'medicine-alert';
        }
      } 
    })
    
    medicines_status[medicine._id.$oid] = cur_status;
  }); 

  const handleSortMedicines = () => {
    console.log(sortedMedicines);
    if (sortedMedicines) {
      const sorted_medicines = []; 
    
      medicines.forEach(medicine => {
        if (medicines_status[medicine._id.$oid] == 'medicine-expired') {
          sorted_medicines.push(medicine);

        }
      });

      medicines.forEach(medicine => {
        if (medicines_status[medicine._id.$oid] == 'medicine-alert') {
          sorted_medicines.push(medicine);

        }
      });

      medicines.forEach(medicine => {
        if (medicines_status[medicine._id.$oid] == 'medicine') {
          sorted_medicines.push(medicine);

        }
      });

      setMedicines(sorted_medicines);

    } else {
      setRetrievedMedicines(false);
    }
  }
  

  const [ addMedicineAttributes,setAddMedicineAttributes ] = useState({ name: '', quantity: '', expiry: '' });

  const [ addToMedicineAttributes, setAddToMedicineAttributes ] = useState({ medicine_id : '', quantity: '', expiry: '' });

  const [ subsToMedicineAttributes, setSubsToMedicineAttributes ] = useState({ medicine_id : '', quantity: '', expiry: '' }); 


  const handleAddMedicine = () => {
    
    setAddMedicineForm(false);
    alert(addMedicineAttributes.quantity);
    alert(addMedicineAttributes.expiry); 
    alert(addMedicineAttributes.name);
    if (!props.token) {
      navigate('/login');
    }
    
    if ((addMedicineAttributes.quantity < 0) || (!addMedicineAttributes.expiry) || (dateInPast(addMedicineAttributes.expiry))) {
      alert('Not valid data');
      return;
    }
 
    const addMedicineResource = async () => {
      const promise = await fetch('http://127.0.0.1:8000/add-medicine', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cookies': document.cookie
        },
        body: JSON.stringify(addMedicineAttributes)
      });

      
      const response = await promise.json(); 

      if ((promise.status != 200) || (!response.added)) {
        alert('Not properly added');
        return;
      }
      

    };

    addMedicineResource();
    
    setAddMedicineAttributes();
    
    setRetrievedMedicines(false);
     
  } 

  const handleAddtoMedicine = () => {
   
    setAddToMedicineForm(false);
    
    if (!props.token) {
      navigate('/login');
    }
    
    if ((addToMedicineAttributes.quantity < 0) || (!addToMedicineAttributes.expiry) || (dateInPast(addToMedicineAttributes.expiry))) {
      alert('Not valid data');
      return;
    }

    const addToMedicineResource = async () => {
      const promise = await fetch('http://127.0.0.1:8000/add-to-medicine', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cookies': document.cookie
        },
        body: JSON.stringify(addToMedicineAttributes)
      }); 
  
      const response = await promise.json(); 
      console.log(response);
      if ((promise.status != 200) || (!response.addedTo)) {
        alert('Not properly modified');
        return;
      }
      
    }; 

    addToMedicineResource();
    setAddToMedicineAttributes();
    setRetrievedMedicines(false);
  
  }

  const handleSubstoMedicine = () => {
    
    setSubsToMedicineForm(false);
    alert(subsToMedicineAttributes.quantity);
    alert(subsToMedicineAttributes.medicine_id); 
    alert(subsToMedicineAttributes.expiry);
    if (!props.token) {
      navigate('/login');
    }
    
    if ((subsToMedicineAttributes.quantity < 0) || (!subsToMedicineAttributes.expiry) || (dateInPast(subsToMedicineAttributes.expiry))) {
      alert('Not valid data');
      return;
    }

    const subsToMedicineResource = async () => {
      const promise = await fetch('http://127.0.0.1:8000/subs-to-medicine', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cookies': document.cookie
        },
        body: JSON.stringify(subsToMedicineAttributes)
      });
      
      const response = await promise.json();
      console.log(response);
      if ((promise.status != 200) || (!response.subsTo)) {
        alert('Not properly modified');
        return;
      }

    };

    subsToMedicineResource();
    setSubsToMedicineAttributes();
    
     

    setRetrievedMedicines(false);
  }


  const displayAddToMedicine = (clickedId) => {

    setAddToMedicineForm(true);
    
    setAddToMedicineAttributes(prevState => ({ ...prevState, medicine_id : clickedId }));


   
  } 

  const displaySubsToMedicine = (clickedId) => {

    setSubsToMedicineForm(true);
    
    setSubsToMedicineAttributes(prevState => ({ ...prevState, medicine_id : clickedId }));
   

  }


  const modifyUsers = () => {
    navigate('/users');
  }

  const NavigateMedicine = (id) => {
    const path = '/medicine/'.concat(id);
    
    navigate(path);
  }

  const closeFormTrigger = () => {
    setAddMedicineForm(false);
    setAddToMedicineForm(false);
    setSubsToMedicineForm(false);
    setVerifyRef(false);
  
  }
    

  return (
    <div>
      <div className = 'navbar'>
  
        <div className = 'general-information-container'>
          <img src = 'gabriel_pastor_logo.png' className = 'logo-image' />

          <div className = 'name-slogan'>
            <h5 className = 'el-name-slogan'>
              Nursing Home Name 
              <br />
              This is their slogan
            </h5>
          </div> 
        </div>

        <div className = 'navbar-buttons'>
          <div >
            <div className = 'home-profile'>
              <img className = {props.renderModifyUsers && 'nav-option' } id = { !props.renderModifyUsers && 'home-button'} src = '/home_button.png' /> 
            
              

              
              <h5 className = { props.renderModifyUsers ? 'add-remove-user' : 'add-remove-user-false' } onClick = { () => modifyUsers() }> 
                Add/Remove User
              </h5>

              <h5 className = 'username-attribute'> 
                { props.username }
              </h5>

              <button className = 'logout' onClick = { () =>  { setVerifyRef(true) } } > Logout </button>
              
            </div>

          </div>

        </div>

      </div> 

      <div className = 'main-page'>
        <div className = 'page-title' id = 'medicines-part' >
          <p className = 'cur-title'> Inventory </p>


          <div className = 'inventory-option'>
            <p> ADD MED. </p>
            <img src = '/create_button.png' className = 'part-title-option' id = 'add-medicine-button' onClick = { () => setAddMedicineForm(true) } />
          </div>

          <div className = 'inventory-option'>
            <p> { !sortedMedicines && 'UN' }SORT BY EXPIRY </p>
            <img src = '/sort_button.png' className = 'part-title-option' onClick = { () => { handleSortMedicines(); setSortedMedicines(prevState => !prevState) } }/>
          </div>
        </div>

        
        <div className = 'medicine-list-root'> 
          { medicines.length == 0 
            ?   
            <div className = 'message-no-data'> 
              No medicines available
            </div>
            :
            
            medicines.map(medicine => 
              
                
              <div className = { medicines_status[medicine._id.$oid]}>
                <p className = 'medicine-name' onClick = { () => NavigateMedicine(medicine._id.$oid) }> 
                  { medicine.name }
                </p>
  
                <p>
                  { medicine.badges.reduce((accumulator, badge) => { 
                    return accumulator + badge.quantity;
                  }, 0) }  
                </p>
  
                <img className = 'element-image' src = '/add_button.png' onClick = { () => displayAddToMedicine(medicine._id.$oid) } /> 
  
                <img className = 'element-image' src = '/subs_button.png' onClick = { () => displaySubsToMedicine(medicine._id.$oid) } /> 
                  
              </div>
            )}

        </div>
      </div>

      <div className ={ addMedicineForm ? 'add-medicine-form' : 'add-medicine-form-false' }>
        <div className = 'title-close-form'>
          <h5 className = 'form-title'> 
            Add Medicine 
          </h5>
          <img id = 'medicine-close-add' onClick = { () => closeFormTrigger() } className = 'close-pop-up-form' src = '/close_button.png' />
          
        </div>
        
        <form onSubmit = { () => handleAddMedicine() } >
          <label >Medicine Name:</label>
          <br/>
          <input className = 'add-medicine-name' type="text" placeholder = 'Answer the input field' required onChange = { e => setAddMedicineAttributes(prevState => ({ ...prevState, name : e.target.value })) }  /> 
          <br/>
          <label >Initial Quantity</label>
          <br/>
          <input className = 'add-medicine-initial-quantity' type="text" placeholder = 'Answer the input field' required onChange = { e => setAddMedicineAttributes(prevState => ({ ...prevState, quantity : e.target.value })) } /> 
          <br/>
          <label > Date of Expiry</label>
          <br/>
          <input className = 'add-medicine-date-expiry' type="date" placeholder = 'Answer the input field' required onChange = { e => setAddMedicineAttributes(prevState => ({ ...prevState, expiry : e.target.value }) ) } /> 
          <div>
            <button className = 'submit-form'> SUBMIT </button>
          </div>
        </form> 
        
     
      
      </div>

      <div className = { addToMedicineForm ? 'add-to-medicine-form' : 'add-to-medicine-form-false' }>
        <div className = 'title-close-form'>
          <h5 className = 'form-title'> Add to Medicine </h5>
          <img id = 'medicine-close-add-to' className = 'close-pop-up-form' src = '/close_button.png' onClick = { () => closeFormTrigger() } />
          
        </div>
        
        <form onSubmit = { () => handleAddtoMedicine() }>
          <label >Quantity to Add</label>
          <br/>
          <input className = 'input-field-add' type="text" placeholder = 'Answer the input field' required onChange = { e => setAddToMedicineAttributes(prevState => ({ ...prevState, quantity : e.target.value })) } /> 
          <br/>
          <label>Date of Expiracy</label>
          <br/>
          <input className = 'input-field-add' type="date" placeholder = 'Answer the input field' required onChange = { e => setAddToMedicineAttributes(prevState => ({ ...prevState, expiry : e.target.value })) } /> 
          <br/>
          <button type = 'submit' className = 'submit-form'> SUBMIT </button>
        
        </form>
        
    
      </div>

      <div className = { subsToMedicineForm ? 'subs-to-medicine-form' : 'subs-to-medicine-form-false' }>
        <div className = 'title-close-form'>
          <h5 className = 'form-title'> Consume Medicine </h5>
          <img id = 'medicine-close-subs-to' className = 'close-pop-up-form' src = '/close_button.png' onClick = { () => closeFormTrigger() } />
          
        </div>
        
        <form onSubmit = { () => handleSubstoMedicine() }>
          <label >Quantity to Consume</label>
          <br/>
          <input className = 'input-field-add' type="text" placeholder = 'Answer the input field' required onChange = { e => setSubsToMedicineAttributes(prevState => ({ ...prevState, quantity : e.target.value })) } /> 
          <br/>
          <label >Package expiry</label>
          <br/>
          <input className = 'input-field-add' type="date" placeholder = 'Answer the input field' required onChange = { e => setSubsToMedicineAttributes(prevState => ({ ...prevState, expiry : e.target.value })) } />
          
          <div>
            <button type = 'submit' className = 'submit-form'> SUBMIT </button>
          </div>
        </form>
        
        
      </div>
      
      <div className = { verifyRef ? 'verify-button' : 'verify-button-false' } >
        <h5> Are you sure you want to do this? <br />You can't undo this action </h5> 

        <div className = 'verifying-buttons'>
          <button className = 'submit-form' id = 'verify-yes' onClick = { () => props.logout(props.username) }>
            YES 
          </button>

          <button className = 'submit-form' id = 'verify-no' onClick = { () => setVerifyRef(false) }>
            CANCEL 
          </button>
    
        </div>
      </div>

      

      


      
    </div> 
    

  );

  
}

export default Home;

