import { Router } from 'express';
import { body, param, query as queryParam, validationResult } from 'express-validator';
import { query } from '../utils/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { PracticeService } from '../services/practice.service';
import { EventType } from '../types';

const router = Router();

// Get practice scenarios
router.get(
  '/scenarios',
  [
    queryParam('event_type').optional().isIn(['date', 'interview', 'networking', 'casual', 'other']),
    queryParam('difficulty').optional().isInt({ min: 1, max: 3 }),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const { event_type, difficulty } = req.query;
      
      const scenarios = PracticeService.getScenarios(
        event_type as EventType || 'casual',
        difficulty ? parseInt(difficulty as string) : undefined
      );

      res.json({ 
        scenarios,
        tips: [
          'Start with easier scenarios to build confidence',
          'There\'s no "perfect" response - authenticity matters most',
          'Practice out loud if possible',
          'It\'s okay to take breaks between scenarios'
        ]
      });
    } catch (error) {
      next(error);
    }
  }
);

// Submit practice response
router.post(
  '/respond',
  [
    body('session_id').optional().isInt(),
    body('scenario_id').isInt(),
    body('response').notEmpty().trim(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const { session_id, scenario_id, response } = req.body;

      // Get user profile for personalized feedback
      const profileResult = await query(
        'SELECT neurodivergent_types FROM user_profiles WHERE user_id = $1',
        [req.user!.id]
      );

      const profile = profileResult.rows[0];

      // Get scenario (in real app, this would come from DB)
      const scenarios = PracticeService.getScenarios('casual');
      const scenario = scenarios.find(s => s.id === scenario_id);

      if (!scenario) {
        throw new AppError('Scenario not found', 404);
      }

      // Get feedback
      const feedback = PracticeService.provideFeedback(response, scenario, profile);

      // Save practice session if linked to coaching session
      if (session_id) {
        await query(
          `INSERT INTO user_practice_sessions 
          (user_id, session_id, scenario_id, user_responses, completion_rate, notes) 
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            req.user!.id,
            session_id,
            scenario_id,
            JSON.stringify([{ timestamp: new Date(), response, feedback }]),
            feedback.score || 0,
            feedback.encouragement
          ]
        );
      }

      res.json({
        feedback,
        scenario,
        next_steps: [
          'Try another scenario',
          'Practice this one again with variations',
          'Move to a higher difficulty level',
          'Take a break and reflect on your progress'
        ]
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create custom scenario
router.post(
  '/custom-scenario',
  [
    body('event_type').isIn(['date', 'interview', 'networking', 'casual', 'other']),
    body('situation').notEmpty().trim(),
    body('concerns').isArray(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const { event_type, situation, concerns } = req.body;

      const customScenario = PracticeService.createCustomScenario(
        event_type,
        situation,
        concerns
      );

      res.json({
        scenario: customScenario,
        message: 'Custom scenario created. Practice as many times as you need!'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;