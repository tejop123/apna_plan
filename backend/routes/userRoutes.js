const express = require('express');
const { body, param } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { getProfile, updateProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { handleValidationErrors } = require('../utils/validation');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('username').trim().notEmpty().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').notEmpty().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional({ checkFalsy: true }).matches(/^[0-9]{10}$/).withMessage('Enter a valid 10-digit phone number')
  ],
  handleValidationErrors,
  register
);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty().withMessage('Password is required')],
  handleValidationErrors,
  login
);

router.get(
  '/profile/:id',
  [param('id').isMongoId().withMessage('Invalid user id')],
  handleValidationErrors,
  authenticate,
  getProfile
);

router.put(
  '/profile/:id',
  [
    param('id').isMongoId().withMessage('Invalid user id'),
    body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('phone').optional({ checkFalsy: true }).matches(/^[0-9]{10}$/).withMessage('Enter a valid 10-digit phone number')
  ],
  handleValidationErrors,
  authenticate,
  updateProfile
);

module.exports = router;
