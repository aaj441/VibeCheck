import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// All conversation routes require authentication
router.use(authenticate);

// Get conversations
router.get('/', async (req, res) => {
  res.json({ message: 'Conversations list endpoint - to be implemented' });
});

// Get messages in a conversation
router.get('/:conversationId/messages', async (req, res) => {
  res.json({ message: 'Conversation messages endpoint - to be implemented' });
});

export default router;