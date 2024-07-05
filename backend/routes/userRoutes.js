// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  generateResetToken,
  resetPassword
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/').get(protect, getUsers);
router.route('/:id').get(protect, getUserById);
router.route('/generateResetToken').post(generateResetToken);
router.route('/resetPassword/:token').post(resetPassword);

module.exports = router;
