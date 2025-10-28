import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import * as authController from '../controllers/auth';

const router = Router();

// Register new user
router.post(
  '/register',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('username').isLength({ min: 3, max: 50 }).trim(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('houseType').isIn(['logic', 'creation', 'chaos', 'observation']),
  ]),
  authController.register
);

// Login
router.post(
  '/login',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ]),
  authController.login
);

// Refresh token
router.post(
  '/refresh',
  validate([
    body('refreshToken').notEmpty(),
  ]),
  authController.refreshToken
);

// Logout
router.post('/logout', authController.logout);

export default router;