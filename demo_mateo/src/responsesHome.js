const profile = document.getElementById('profile-button');
const more_options = document.querySelector('.hover-profile'); 
const medicine_list = document.querySelector('.medicine-list-root');
const alerts_list = document.querySelector('.alerts-root');
const add_medicine = document.querySelector('#add-medicine-button');
const reset_alerts = document.querySelector('#reset-alerts-button');
const logout = document.querySelector('.logout');
const add_medicine_form = document.querySelector('.add-medicine-form');
const add_to_medicine_form = document.querySelector('.add-to-medicine-form'); 
const subs_to_medicine_form = document.querySelector('.subs-to-medicine-form');
const close_add_medicine_form = document.querySelector('#medicine-close-add');
const close_add_to_medicine_form = document.querySelector('#medicine-close-add-to');
const close_subs_to_medicine_form = document.querySelector('#medicine-close-subs-to');
const verify = document.querySelector('.verify-button');
const yes_verify = document.querySelector('#verify-yes');
const no_verify = document.querySelector('#verify-no');
const medicines_scroll = document.querySelector('.medicines-alerts-1');
const alerts_scroll = document.querySelector('.medicines-alerts-2');


function checkAlertAttribute() {
  verify.style.display = 'flex';
  verify.style.flexDirection = 'column';
  verify.style.alignItems = 'center';

  yes_verify.addEventListener('click', function() {
    verify.style.display = 'none';
  });

  no_verify.addEventListener('click', function() {
    verify.style.display = 'none';
  });
}

reset_alerts.addEventListener('click', function() {
  verify.style.display = 'flex';
  verify.style.flexDirection = 'column';
  verify.style.alignItems = 'center';

  yes_verify.addEventListener('click', function() {
    verify.style.display = 'none';
  });

  no_verify.addEventListener('click', function() {
    verify.style.display = 'none';
  });
});


logout.addEventListener('click', function() {
  verify.style.display = 'flex';
  verify.style.flexDirection = 'column';
  verify.style.alignItems = 'center';

  yes_verify.addEventListener('click', function() {
    verify.style.display = 'none';
  });

  no_verify.addEventListener('click', function() {
    verify.style.display = 'none';
  });
});

medicines_scroll.addEventListener('click', function() {
  document.querySelector('#medicines-part').scrollIntoView();
});

alerts_scroll.addEventListener('click', function() {
  document.querySelector('#alerts').scrollIntoView();
});


function add_clicked() {
  add_to_medicine_form.style.display = 'flex';
  add_to_medicine_form.style.flexDirection = 'column';
  add_to_medicine_form.style.alignItems = 'center';
  
  close_add_to_medicine_form.addEventListener('click',      function() {
    add_to_medicine_form.style.display = 'none';
  });

}

function subs_clicked() {
  subs_to_medicine_form.style.display = 'flex';
  subs_to_medicine_form.style.flexDirection = 'column';
  subs_to_medicine_form.style.alignItems = 'center';
  
  close_subs_to_medicine_form.addEventListener('click',      function() {
    subs_to_medicine_form.style.display = 'none';
  });
}

add_medicine.addEventListener('click', function() {
  add_medicine_form.style.display = 'flex';
  add_medicine_form.style.flexDirection = 'column';
  add_medicine_form.style.alignItems = 'center';

  close_add_medicine_form.addEventListener('click', function() {
    add_medicine_form.style.display = 'none';
  });

});

profile.addEventListener('mouseover', function() {          

  more_options.style.display = 'grid';
  
  more_options.addEventListener('mouseover', function() {
    more_options.style.display = 'grid';

  });

  more_options.addEventListener('mouseout', function()  {   
    more_options.style.display = 'none'; 
  }); 
});

profile.addEventListener('mouseout', function()  {          
  more_options.style.display = 'none'; 
}); 

var medicines = [
  [1, 'ibuprofeno', 15], [1, 'paracetamol', 15], [1, 'omega', 15], [1, 'dimegan', 15]
];

for (i = 0; i < medicines.length; i++) {
  
  const separate_medicine = document.createElement('div');
  const medicine_name = document.createElement('p');
  medicine_name.innerText = medicines[i][1];

  const medicine_quantity = document.createElement('p');
  medicine_quantity.innerText = medicines[i][2];

  const modify_add = document.createElement('img');
  const modify_subs = document.createElement('img');
  modify_add.src = './public/download (15).png';
  modify_subs.src = './public/download (16).png';
  medicine_name.classList.add('element-name');
  medicine_name.setAttribute('id', 'medicine-name');
  medicine_name.setAttribute('onclick', { routeHome });
  modify_add.classList.add('element-image');
  modify_subs.classList.add('element-image');
  modify_add.setAttribute('onclick', 'add_clicked()');
  modify_subs.setAttribute('onclick', 'subs_clicked()');

  separate_medicine.appendChild(medicine_name);
  separate_medicine.appendChild(medicine_quantity);
  separate_medicine.appendChild(modify_add);
  separate_medicine.appendChild(modify_subs);
  separate_medicine.classList.add('medicine');

  medicine_list.appendChild(separate_medicine);
}

const alerts = [[1, 'ibuprofeno', 'January 6, 2021', 5], [2, 'dimegan', 'January 6, 2021', 8], [1, 'ibuprofeno', 'January 6, 2021', 5], [2, 'dimegan', 'January 6, 2021', 8], [1, 'ibuprofeno', 'January 6, 2021', 5], [2, 'dimegan', 'January 6, 2021', 8], [1, 'ibuprofeno', 'January 6, 2021', 5], [2, 'dimegan', 'January 6, 2021', 8], [1, 'ibuprofeno', 'January 6, 2021', 5], [2, 'dimegan', 'January 6, 2021', 8]]

for (j = 0; j < alerts.length; j++) {
  const separate_alert = document.createElement('div');
  const alert_name = document.createElement('p');
  alert_name.innerText = alerts[j][1];
  alert_name.classList.add('element-name');
  
  const alert_date = document.createElement('p');
  alert_date.innerText = alerts[j][2];
  alert_date.classList.add('alert-date');
  
  const alert_quantity = document.createElement('p');
  alert_quantity.innerText = alerts[j][3];

  const alert_check = document.createElement('img');
  alert_check.src = '/public/images (2).png';
  alert_check.classList.add('element-image');
  alert_check.setAttribute('onclick', 'checkAlertAttribute()');
  separate_alert.appendChild(alert_name);
  separate_alert.appendChild(alert_date);
  separate_alert.appendChild(alert_quantity);
  separate_alert.appendChild(alert_check);
  separate_alert.classList.add('alert');

  alerts_list.appendChild(separate_alert);
}