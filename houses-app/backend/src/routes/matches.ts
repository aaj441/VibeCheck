import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// All match routes require authentication
router.use(authenticate);

// Get potential matches
router.get('/potential', async (req, res) => {
  res.json({ message: 'Potential matches endpoint - to be implemented' });
});

// Get matched users
router.get('/matched', async (req, res) => {
  res.json({ message: 'Matched users endpoint - to be implemented' });
});

export default router;