import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { query } from '../utils/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { 
  ContextCheckInRequest, 
  EmotionalCalibrationRequest,
  EventType,
  Setting
} from '../types';

const router = Router();

// Validation middleware
const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create new coaching session (Step 1: Context Check-In)
router.post(
  '/create',
  [
    body('event_type').isIn(['date', 'interview', 'networking', 'casual', 'other']),
    body('feelings').notEmpty().trim(),
    body('setting').isIn(['in-person', 'online', 'group', 'one-on-one']),
    body('participants').notEmpty().trim(),
    body('goal').notEmpty().trim(),
    body('event_date').optional().isISO8601(),
  ],
  handleValidationErrors,
  async (req: AuthRequest, res, next) => {
    try {
      const { event_type, feelings, setting, participants, goal, event_date } = req.body;

      // Create session
      const result = await query(
        `INSERT INTO coaching_sessions 
        (user_id, event_type, event_date, setting, participants, goal, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
        [
          req.user!.id,
          event_type,
          event_date || null,
          setting,
          participants,
          goal,
          'planning'
        ]
      );

      const session = result.rows[0];

      res.status(201).json({
        session,
        next_step: 'emotional_calibration',
        message: 'Session created successfully. Now let\'s check in with how you\'re feeling.'
      });
    } catch (error) {
      next(error);
    }
  }
);

// Emotional calibration (Step 2)
router.post(
  '/:sessionId/emotional-state',
  [
    param('sessionId').isInt(),
    body('anxiety_level').isInt({ min: 1, max: 10 }),
    body('excitement_level').isInt({ min: 1, max: 10 }),
    body('energy_level').isInt({ min: 1, max: 10 }),
    body('focus_level').isInt({ min: 1, max: 10 }),
    body('specific_worries').isArray(),
  ],
  handleValidationErrors,
  async (req: AuthRequest, res, next) => {
    try {
      const { sessionId } = req.params;
      const { anxiety_level, excitement_level, energy_level, focus_level, specific_worries } = req.body;

      // Verify session belongs to user
      const sessionCheck = await query(
        'SELECT id FROM coaching_sessions WHERE id = $1 AND user_id = $2',
        [sessionId, req.user!.id]
      );

      if (sessionCheck.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      // Record emotional state
      const result = await query(
        `INSERT INTO emotional_states 
        (session_id, anxiety_level, excitement_level, energy_level, focus_level, specific_worries) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [sessionId, anxiety_level, excitement_level, energy_level, focus_level, specific_worries]
      );

      const emotionalState = result.rows[0];

      // Provide immediate support based on levels
      const supportMessages = [];
      if (anxiety_level >= 8) {
        supportMessages.push('I notice your anxiety is high. We\'ll build in extra grounding techniques and exit strategies.');
      }
      if (energy_level <= 3) {
        supportMessages.push('Your energy seems low. We\'ll keep preparations simple and focus on essentials.');
      }
      if (focus_level <= 3) {
        supportMessages.push('Focus is challenging right now. We\'ll create clear, written guides you can reference.');
      }

      res.json({
        emotional_state: emotionalState,
        support_messages: supportMessages,
        next_step: 'generate_checklist',
        message: 'Thank you for sharing. I\'ll customize your support based on these feelings.'
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all sessions for user
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `SELECT cs.*, 
        es.anxiety_level, es.excitement_level, es.energy_level, es.focus_level,
        es.specific_worries, es.recorded_at as emotional_state_recorded_at
      FROM coaching_sessions cs
      LEFT JOIN emotional_states es ON es.session_id = cs.id
      WHERE cs.user_id = $1
      ORDER BY cs.created_at DESC`,
      [req.user!.id]
    );

    res.json({ sessions: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get specific session
router.get('/:sessionId', async (req: AuthRequest, res, next) => {
  try {
    const { sessionId } = req.params;

    const result = await query(
      `SELECT cs.*, 
        es.anxiety_level, es.excitement_level, es.energy_level, es.focus_level,
        es.specific_worries, es.recorded_at as emotional_state_recorded_at,
        c.checklist_items,
        sr.what_worked, sr.what_was_tough, sr.overall_rating, sr.progress_notes
      FROM coaching_sessions cs
      LEFT JOIN emotional_states es ON es.session_id = cs.id
      LEFT JOIN checklists c ON c.session_id = cs.id
      LEFT JOIN session_reflections sr ON sr.session_id = cs.id
      WHERE cs.id = $1 AND cs.user_id = $2`,
      [sessionId, req.user!.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Session not found', 404);
    }

    res.json({ session: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Update session status
router.patch(
  '/:sessionId/status',
  [
    param('sessionId').isInt(),
    body('status').isIn(['planning', 'in-progress', 'completed']),
  ],
  handleValidationErrors,
  async (req: AuthRequest, res, next) => {
    try {
      const { sessionId } = req.params;
      const { status } = req.body;

      const result = await query(
        'UPDATE coaching_sessions SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
        [status, sessionId, req.user!.id]
      );

      if (result.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      res.json({ session: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }
);

export default router;