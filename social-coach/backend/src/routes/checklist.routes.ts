import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { query } from '../utils/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { ChecklistService } from '../services/checklist.service';
import { CoachingSession, UserProfile, EmotionalState, ChecklistItem } from '../types';

const router = Router();

// Generate personalized checklist
router.post(
  '/:sessionId/generate',
  async (req: AuthRequest, res, next) => {
    try {
      const { sessionId } = req.params;

      // Get session details
      const sessionResult = await query(
        'SELECT * FROM coaching_sessions WHERE id = $1 AND user_id = $2',
        [sessionId, req.user!.id]
      );

      if (sessionResult.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      const session: CoachingSession = sessionResult.rows[0];

      // Get user profile
      const profileResult = await query(
        'SELECT * FROM user_profiles WHERE user_id = $1',
        [req.user!.id]
      );

      const profile: UserProfile = profileResult.rows[0];

      // Get latest emotional state
      const emotionalResult = await query(
        'SELECT * FROM emotional_states WHERE session_id = $1 ORDER BY recorded_at DESC LIMIT 1',
        [sessionId]
      );

      if (emotionalResult.rows.length === 0) {
        throw new AppError('Please complete emotional calibration first', 400);
      }

      const emotionalState: EmotionalState = emotionalResult.rows[0];

      // Generate personalized checklist
      const checklistItems = await ChecklistService.generateChecklist(
        session,
        profile,
        emotionalState
      );

      // Save checklist
      const checklistResult = await query(
        'INSERT INTO checklists (session_id, checklist_items) VALUES ($1, $2) ON CONFLICT (session_id) DO UPDATE SET checklist_items = $2, updated_at = CURRENT_TIMESTAMP RETURNING *',
        [sessionId, JSON.stringify(checklistItems)]
      );

      res.json({
        checklist: checklistResult.rows[0],
        message: 'Personalized checklist generated successfully',
        tips: [
          'Take your time with each item',
          'It\'s okay to skip items that don\'t apply',
          'Add your own items if something is missing',
          'Check items off as you complete them for a sense of progress'
        ]
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get checklist for session
router.get(
  '/:sessionId',
  async (req: AuthRequest, res, next) => {
    try {
      const { sessionId } = req.params;

      const result = await query(
        `SELECT c.*, cs.event_type, cs.event_date 
        FROM checklists c
        JOIN coaching_sessions cs ON cs.id = c.session_id
        WHERE c.session_id = $1 AND cs.user_id = $2`,
        [sessionId, req.user!.id]
      );

      if (result.rows.length === 0) {
        throw new AppError('Checklist not found', 404);
      }

      res.json({ checklist: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }
);

// Update checklist items
router.patch(
  '/:sessionId/items',
  [
    body('checklist_items').isArray(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const { sessionId } = req.params;
      const { checklist_items } = req.body;

      // Verify session belongs to user
      const sessionCheck = await query(
        'SELECT id FROM coaching_sessions WHERE id = $1 AND user_id = $2',
        [sessionId, req.user!.id]
      );

      if (sessionCheck.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      // Update checklist
      const result = await query(
        'UPDATE checklists SET checklist_items = $1, updated_at = CURRENT_TIMESTAMP WHERE session_id = $2 RETURNING *',
        [JSON.stringify(checklist_items), sessionId]
      );

      if (result.rows.length === 0) {
        throw new AppError('Checklist not found', 404);
      }

      // Calculate completion percentage
      const items: ChecklistItem[] = checklist_items;
      const completed = items.filter(item => item.completed).length;
      const total = items.length;
      const completionPercentage = total > 0 ? (completed / total) * 100 : 0;

      res.json({
        checklist: result.rows[0],
        completion_percentage: completionPercentage,
        message: completionPercentage === 100 
          ? 'Great job completing your checklist! You\'re well prepared.' 
          : `${completed} of ${total} items completed`
      });
    } catch (error) {
      next(error);
    }
  }
);

// Add custom item to checklist
router.post(
  '/:sessionId/custom-item',
  [
    body('text').notEmpty().trim(),
    body('category').isIn(['preparation', 'hygiene', 'outfit', 'materials', 'conversation', 'boundaries', 'comfort', 'exit_strategies', 'grounding']),
    body('priority').isIn(['high', 'medium', 'low']),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const { sessionId } = req.params;
      const { text, category, priority, tips } = req.body;

      // Get current checklist
      const result = await query(
        `SELECT c.checklist_items 
        FROM checklists c
        JOIN coaching_sessions cs ON cs.id = c.session_id
        WHERE c.session_id = $1 AND cs.user_id = $2`,
        [sessionId, req.user!.id]
      );

      if (result.rows.length === 0) {
        throw new AppError('Checklist not found', 404);
      }

      const currentItems: ChecklistItem[] = result.rows[0].checklist_items;
      
      // Add new item
      const newItem: ChecklistItem = {
        id: `custom_${Date.now()}`,
        text,
        category,
        completed: false,
        priority,
        tips
      };

      const updatedItems = [...currentItems, newItem];

      // Save updated checklist
      const updateResult = await query(
        'UPDATE checklists SET checklist_items = $1, updated_at = CURRENT_TIMESTAMP WHERE session_id = $2 RETURNING *',
        [JSON.stringify(updatedItems), sessionId]
      );

      res.json({
        checklist: updateResult.rows[0],
        message: 'Custom item added successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;