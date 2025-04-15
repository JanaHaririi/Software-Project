const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile ,getAllUsers , getUserById ,updateUserById , deleteUserById } = require('../controllers/userController');
const authMiddleware = require('../middleware/authentication');
const authorizeRoles = require('../middleware/authorization');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    getAllUsers
  );
  router.get(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    getUserById
  );
  router.put(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    updateUserById
  );
  router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    deleteUserById
  );
  
module.exports = router;
