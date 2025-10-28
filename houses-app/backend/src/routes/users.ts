import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', async (req, res) => {
  res.json({ message: 'User profile endpoint - to be implemented' });
});

// Update user profile
router.put('/profile', async (req, res) => {
  res.json({ message: 'Update profile endpoint - to be implemented' });
});

export default router;