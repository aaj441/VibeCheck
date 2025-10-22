import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// All music routes require authentication
router.use(authenticate);

// Connect music service
router.post('/connect/:service', async (req, res) => {
  res.json({ message: 'Connect music service endpoint - to be implemented' });
});

// Sync music data
router.post('/sync', async (req, res) => {
  res.json({ message: 'Sync music data endpoint - to be implemented' });
});

export default router;