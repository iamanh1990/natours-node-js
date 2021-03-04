const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('./../controllers/userController');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require('./../controllers/authController');

const router = express.Router();

//signup routes
router.post('/signup', signup);
//login route
router.post('/login', login);

//logout route
router.get('/logout', logout);

//forgot password
router.post('/forgotPassword', forgotPassword);

//reset password
router.patch('/resetPassword/:token', resetPassword);

//Protect all routes after this middleware
router.use(protect);

//update password
router.patch('/updateMyPassword', protect, updatePassword);

//update current user data
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);

//delete current user
router.delete('/deleteMe', deleteMe);

//get current user data
router.get('/me', getMe, getUser);

//restric all routes to only admin after this middleware
router.use(restrictTo('admin'));

router
  .route('/') //
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id') //
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
