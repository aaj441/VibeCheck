import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// All quest routes require authentication
router.use(authenticate);

// Generate a new quest
router.post('/generate', async (req, res) => {
  res.json({ message: 'Generate quest endpoint - to be implemented' });
});

// Get active quests
router.get('/active', async (req, res) => {
  res.json({ message: 'Active quests endpoint - to be implemented' });
});

export default router;