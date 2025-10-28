import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { query } from '../utils/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { SentimentService } from '../services/sentiment.service';
import { LiveSupportRequest } from '../types';

const router = Router();

// Live interaction support
router.post(
  '/support',
  [
    body('session_id').isInt(),
    body('interaction_text').notEmpty().trim(),
    body('current_state').optional().isIn(['calm', 'anxious', 'overwhelmed', 'excited', 'focused', 'distracted']),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const { session_id, interaction_text, current_state } = req.body;

      // Verify session belongs to user and is in progress
      const sessionCheck = await query(
        'SELECT id, status FROM coaching_sessions WHERE id = $1 AND user_id = $2',
        [session_id, req.user!.id]
      );

      if (sessionCheck.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      if (sessionCheck.rows[0].status !== 'in-progress') {
        // Update status to in-progress
        await query(
          'UPDATE coaching_sessions SET status = $1 WHERE id = $2',
          ['in-progress', session_id]
        );
      }

      // Analyze the interaction
      const analysis = SentimentService.analyzeSentiment(interaction_text);
      const detectedState = current_state || SentimentService.detectUserState(interaction_text, analysis);
      const suggestions = SentimentService.generateSuggestions(analysis, detectedState, interaction_text);

      // Save interaction log
      await query(
        `INSERT INTO live_interactions 
        (session_id, interaction_text, sentiment_analysis, suggestions, user_state) 
        VALUES ($1, $2, $3, $4, $5)`,
        [
          session_id,
          interaction_text,
          JSON.stringify(analysis),
          suggestions,
          detectedState
        ]
      );

      // Provide immediate support based on state
      let immediateAction = null;
      if (detectedState === 'overwhelmed') {
        immediateAction = {
          type: 'grounding',
          instruction: 'PAUSE. Take 3 deep breaths with me. In... and out. You\'re safe.',
          follow_up: 'When ready, try the 5-4-3-2-1 technique: Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste.'
        };
      }

      res.json({
        sentiment_analysis: analysis,
        user_state: detectedState,
        suggestions,
        immediate_action: immediateAction,
        encouragement: this.getEncouragement(detectedState, analysis)
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get conversation support with their message
router.post(
  '/conversation-help',
  [
    body('session_id').isInt(),
    body('your_message').notEmpty().trim(),
    body('their_message').notEmpty().trim(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const { session_id, your_message, their_message } = req.body;

      // Verify session
      const sessionCheck = await query(
        'SELECT id FROM coaching_sessions WHERE id = $1 AND user_id = $2',
        [session_id, req.user!.id]
      );

      if (sessionCheck.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      // Get real-time coaching
      const coaching = SentimentService.provideRealTimeCoaching(your_message, their_message);

      // Save interaction
      await query(
        `INSERT INTO live_interactions 
        (session_id, interaction_text, sentiment_analysis, suggestions, user_state) 
        VALUES ($1, $2, $3, $4, $5)`,
        [
          session_id,
          `You: ${your_message}\nThem: ${their_message}`,
          JSON.stringify(coaching.analysis),
          coaching.suggestions,
          coaching.userState
        ]
      );

      res.json({
        ...coaching,
        tips: [
          'Remember: There\'s no perfect response',
          'Take your time - pausing is natural',
          'Trust your instincts',
          'It\'s okay to be yourself'
        ]
      });
    } catch (error) {
      next(error);
    }
  }
);

// Quick grounding exercise
router.get('/grounding/:intensity', async (req: AuthRequest, res, next) => {
  try {
    const { intensity } = req.params;

    const exercises = {
      low: {
        name: 'Quick Centering',
        steps: [
          'Take one deep breath',
          'Feel your feet on the ground',
          'Relax your shoulders',
          'Remind yourself: "I am capable"'
        ],
        duration: '30 seconds'
      },
      medium: {
        name: '5-4-3-2-1 Sensory',
        steps: [
          'Name 5 things you can see',
          'Name 4 things you can touch',
          'Name 3 things you can hear',
          'Name 2 things you can smell',
          'Name 1 thing you can taste'
        ],
        duration: '2-3 minutes'
      },
      high: {
        name: 'Full Reset',
        steps: [
          'Find a quiet space (bathroom is fine)',
          'Do 4-7-8 breathing 3 times (inhale 4, hold 7, exhale 8)',
          'Splash cool water on wrists',
          'Text a supportive friend if needed',
          'Return when ready - no rush'
        ],
        duration: '5-10 minutes'
      }
    };

    const exercise = exercises[intensity as keyof typeof exercises] || exercises.medium;

    res.json({
      exercise,
      reminder: 'You\'re doing great. This feeling will pass.',
      affirmations: [
        'I can handle this',
        'I\'m allowed to take breaks',
        'My needs are valid',
        'I\'m proud of myself for trying'
      ]
    });
  } catch (error) {
    next(error);
  }
});

// Helper function for encouragement
function getEncouragement(state: string, sentiment: any): string {
  const encouragements = {
    overwhelmed: 'It\'s okay to feel this way. You\'re brave for being here. Take it one moment at a time.',
    anxious: 'Your feelings are valid. You\'re doing better than you think. Keep breathing.',
    excited: 'Your enthusiasm is wonderful! Channel that positive energy.',
    distracted: 'It\'s normal to lose focus sometimes. Gently bring yourself back to the present.',
    focused: 'You\'re doing amazingly well! Keep up the great work.',
    calm: 'You\'re in a good space. Trust yourself and enjoy the interaction.'
  };

  return encouragements[state as keyof typeof encouragements] || 'You\'re doing great. Keep going!';
}

export default router;