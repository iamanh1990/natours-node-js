import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

//DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

//delegation
if (mapBox) {
  console.log(mapBox);
  const locations = JSON.parse(mapBox.dataset.locations);
  console.log(locations);
  displayMap(locations);
}

//login
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Element values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

//logout
if (logoutBtn) logoutBtn.addEventListener('click', logout);

//update user
if (updateForm) {
  updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // //Element Values
    // const name = document.querySelector('.form-user-data #name').value;
    // const email = document.querySelector('.form-user-data #email').value;
    //put data into form in order to update photo as well
    const form = new FormData();
    form.append('name', document.querySelector('.form-user-data #name').value);
    form.append(
      'email',
      document.querySelector('.form-user-data #email').value
    );
    form.append(
      'photo',
      document.querySelector('.form-user-data #photo').files[0]
    );

    await updateSettings(form, 'data');
    //reload the page after finishing update
    location.reload();
  });
}

//Update password
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-pasword').textContent = 'Updating...';

    //Element Values
    const passwordCurrent = document.querySelector(
      '.form-user-password #password-current'
    ).value;
    const password = document.querySelector('.form-user-password #password')
      .value;
    const passwordConfirm = document.querySelector(
      '.form-user-password #password-confirm'
    ).value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-pasword').textContent = 'Save password';
    document.querySelector('.form-user-password #password-current').value = '';
    document.querySelector('.form-user-password #password').value = '';
    document.querySelector('.form-user-password #password-confirm').value = '';
  });
}
