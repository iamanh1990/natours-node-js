const express = require('express');
const router = express.Router();

const { isLoggedIn, protect } = require('../controllers/authController');
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
} = require('../controllers/viewsController');
//check whether user log in
router.use(isLoggedIn);
//all tours page
router.get('/', getOverview);
//tour page
router.get('/tours/:slug', getTour);
//login page
router.get('/login', getLoginForm);
//user account page
router.get('/me', protect, getAccount);

module.exports = router;
