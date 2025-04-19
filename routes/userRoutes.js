const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile ,getAllUsers , getUserById ,updateUserById , deleteUserById } = require('../controllers/userController');
const authMiddleware = require('../middleware/authentication');
const authorizeRoles = require('../middleware/authorization');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/users/profile', authMiddleware, getUserProfile);
router.put('/users/profile', authMiddleware, updateUserProfile);
router.get(
    '/users',
    authMiddleware,
    authorizeRoles('admin'),
    getAllUsers
  );
  router.get(
    '/users/:id',
    authMiddleware,
    authorizeRoles('admin'),
    getUserById
  );
  router.put(
    '/users/:id',
    authMiddleware,
    authorizeRoles('admin'),
    updateUserById
  );
  router.delete(
    '/users/:id',
    authMiddleware,
    authorizeRoles('admin'),
    deleteUserById
  );
  
module.exports = router;
