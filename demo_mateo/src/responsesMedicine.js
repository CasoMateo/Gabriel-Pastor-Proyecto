const profile = document.getElementById('profile-button');const more_options = document.querySelector('.hover-profile'); 
const logout = document.querySelector('.logout');
const remove_medicine = document.querySelector('#remove-medicine');
const reset_medicine = document.querySelector('#reset-medicine');
const set_reset_medicine = document.querySelector('#set-reset-medicine');
const verify = document.querySelector('.verify-button');
const yes_verify = document.querySelector('#verify-yes');
const no_verify = document.querySelector('#verify-no');
const set_reset_schedule_form = document.querySelector('.set-reset-schedule-form');
const close_set_reset_schedule_form = document.querySelector('#close-set-reset-schedule');
const statistics_scroll = document.querySelector('.statistics-expiracy-1');
const expiracy_scroll = document.querySelector('.statistics-expiracy-2');
const logout_medicine = document.querySelector('.logout-medicine');

logout_medicine.addEventListener('click', function() {
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

statistics_scroll.addEventListener('click', function() {
  document.querySelector('.medicine-info').scrollIntoView();
});

expiracy_scroll.addEventListener('click', function() {
  document.querySelector('.medicine-notifications').scrollIntoView();
});

function editAttribute(event, attribute_name) {
  const image = event.target;
  const label = document.querySelector(attribute_name);
  const form = document.createElement('input');
  form.type = 'text';
  form.classList.add('attribute-change');
  form.placeholder = 'Change attribute';
  const temp = document.createElement('img');
  temp.src = 'public/497-4974609_png-file-svg-send-symbol-png.png';
  temp.classList.add('edit-attribute');
  image.replaceWith(temp);
  label.replaceWith(form);

  temp.addEventListener('click', function() {
    temp.replaceWith(image);
    form.replaceWith(label);
  });
  
}

set_reset_medicine.addEventListener('click', function() {
  set_reset_schedule_form.style.display = 'flex';
  set_reset_schedule_form.style.flexDirection = 'column';
  set_reset_schedule_form.style.alignItems = 'center';

  close_set_reset_schedule_form.addEventListener('click', function() {
    set_reset_schedule_form.style.display = 'none';
  });
});

remove_medicine.addEventListener('click', function() {
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

reset_medicine.addEventListener('click', function() {
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

set_reset_medicine.addEventListener('click', function() {
  
})


profile.addEventListener('mouseover', function() {          more_options.style.display = 'grid';

  more_options.addEventListener('mouseover', function() {
    more_options.style.display = 'grid';

  });

  more_options.addEventListener('mouseout', function()  {   more_options.style.display = 'none'; 
  }); 
});


