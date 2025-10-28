import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { query } from '../utils/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const router = Router();

// Submit post-interaction reflection
router.post(
  '/:sessionId',
  [
    param('sessionId').isInt(),
    body('what_worked').isArray(),
    body('what_was_tough').isArray(),
    body('overall_rating').isInt({ min: 1, max: 10 }),
    body('additional_notes').optional().trim(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const { sessionId } = req.params;
      const { what_worked, what_was_tough, overall_rating, additional_notes } = req.body;

      // Verify session belongs to user
      const sessionCheck = await query(
        'SELECT id, event_type FROM coaching_sessions WHERE id = $1 AND user_id = $2',
        [sessionId, req.user!.id]
      );

      if (sessionCheck.rows.length === 0) {
        throw new AppError('Session not found', 404);
      }

      // Update session status to completed
      await query(
        'UPDATE coaching_sessions SET status = $1 WHERE id = $2',
        ['completed', sessionId]
      );

      // Generate progress notes and follow-up actions
      const progressNotes = generateProgressNotes(what_worked, what_was_tough, overall_rating);
      const followUpActions = generateFollowUpActions(
        what_worked, 
        what_was_tough, 
        overall_rating,
        sessionCheck.rows[0].event_type
      );

      // Save reflection
      const result = await query(
        `INSERT INTO session_reflections 
        (session_id, what_worked, what_was_tough, overall_rating, progress_notes, follow_up_actions) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [sessionId, what_worked, what_was_tough, overall_rating, progressNotes, followUpActions]
      );

      // Track progress metrics
      await trackProgress(req.user!.id, sessionId, overall_rating, what_worked.length);

      res.json({
        reflection: result.rows[0],
        message: generateEncouragingMessage(overall_rating, what_worked, what_was_tough),
        insights: generateInsights(what_worked, what_was_tough),
        next_steps: followUpActions
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get reflection for a session
router.get('/:sessionId', async (req: AuthRequest, res, next) => {
  try {
    const { sessionId } = req.params;

    const result = await query(
      `SELECT r.*, cs.event_type, cs.goal 
      FROM session_reflections r
      JOIN coaching_sessions cs ON cs.id = r.session_id
      WHERE r.session_id = $1 AND cs.user_id = $2`,
      [sessionId, req.user!.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Reflection not found', 404);
    }

    res.json({ reflection: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Helper functions
function generateProgressNotes(
  whatWorked: string[], 
  whatWasTough: string[], 
  rating: number
): string {
  const strengths = whatWorked.length;
  const challenges = whatWasTough.length;
  
  let notes = `Overall experience rated ${rating}/10. `;
  
  if (rating >= 7) {
    notes += 'This was a positive experience with strong outcomes. ';
  } else if (rating >= 5) {
    notes += 'Mixed experience with both successes and challenges. ';
  } else {
    notes += 'Challenging experience that provided valuable learning opportunities. ';
  }
  
  notes += `Identified ${strengths} things that worked well and ${challenges} areas for growth. `;
  
  if (strengths > challenges) {
    notes += 'More successes than challenges - building momentum!';
  } else if (challenges > strengths) {
    notes += 'Awareness of challenges is the first step to improvement.';
  } else {
    notes += 'Balanced reflection shows good self-awareness.';
  }
  
  return notes;
}

function generateFollowUpActions(
  whatWorked: string[], 
  whatWasTough: string[], 
  rating: number,
  eventType: string
): string[] {
  const actions: string[] = [];
  
  // Universal actions
  actions.push('Schedule self-care time to recover and recharge');
  
  if (rating >= 7) {
    actions.push('Write down what worked to remember for next time');
    actions.push('Celebrate this success - you did great!');
  }
  
  if (whatWasTough.length > 0) {
    actions.push('Practice scenarios related to challenging moments');
    actions.push('Update your comfort strategies based on what you learned');
  }
  
  // Event-specific actions
  if (eventType === 'date' && rating >= 6) {
    actions.push('If interested, send a follow-up message within 24-48 hours');
  } else if (eventType === 'interview') {
    actions.push('Send a thank-you email within 24 hours');
    actions.push('Note any questions you want to prepare better for next time');
  } else if (eventType === 'networking') {
    actions.push('Connect with new contacts on LinkedIn within 48 hours');
    actions.push('Add notes about each person you met while memory is fresh');
  }
  
  return actions;
}

function generateEncouragingMessage(
  rating: number, 
  whatWorked: string[], 
  whatWasTough: string[]
): string {
  if (rating >= 8) {
    return '🌟 Amazing job! You should be really proud of how you handled this. Your preparation and effort truly paid off!';
  } else if (rating >= 6) {
    return '✨ Well done! You navigated this successfully. Every experience helps you grow stronger and more confident.';
  } else if (rating >= 4) {
    return '💪 You showed real courage by following through. Mixed experiences are normal and valuable for learning.';
  } else {
    return '❤️ You did something really brave by trying. Tough experiences teach us the most. Be gentle with yourself.';
  }
}

function generateInsights(whatWorked: string[], whatWasTough: string[]): string[] {
  const insights: string[] = [];
  
  if (whatWorked.length > 0) {
    insights.push(`Your strengths: ${whatWorked.slice(0, 2).join(', ')}. Build on these!`);
  }
  
  if (whatWasTough.length > 0) {
    insights.push(`Growth areas identified. This awareness is valuable for future preparation.`);
  }
  
  const totalItems = whatWorked.length + whatWasTough.length;
  if (totalItems > 5) {
    insights.push('Your detailed reflection shows excellent self-awareness.');
  }
  
  return insights;
}

async function trackProgress(
  userId: number, 
  sessionId: number, 
  rating: number, 
  successCount: number
): Promise<void> {
  // Track overall satisfaction
  await query(
    `INSERT INTO user_progress (user_id, metric_type, metric_value, context) 
    VALUES ($1, $2, $3, $4)`,
    [userId, 'successful_interactions', rating, { session_id: sessionId }]
  );
  
  // Track confidence growth if rating is good
  if (rating >= 6) {
    await query(
      `INSERT INTO user_progress (user_id, metric_type, metric_value, context) 
      VALUES ($1, $2, $3, $4)`,
      [userId, 'comfort_level_increase', successCount, { session_id: sessionId }]
    );
  }
}

export default router;