import { Router } from 'express';
import { query as queryParam, validationResult } from 'express-validator';
import { query } from '../utils/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const router = Router();

// Get user progress overview
router.get('/overview', async (req: AuthRequest, res, next) => {
  try {
    // Get all progress metrics
    const metricsResult = await query(
      `SELECT metric_type, AVG(metric_value) as avg_value, COUNT(*) as count, 
        MAX(recorded_at) as last_recorded
      FROM user_progress 
      WHERE user_id = $1 
      GROUP BY metric_type`,
      [req.user!.id]
    );

    // Get session statistics
    const sessionsResult = await query(
      `SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
        AVG(CASE WHEN sr.overall_rating IS NOT NULL THEN sr.overall_rating END) as avg_rating
      FROM coaching_sessions cs
      LEFT JOIN session_reflections sr ON sr.session_id = cs.id
      WHERE cs.user_id = $1`,
      [req.user!.id]
    );

    // Get recent wins
    const winsResult = await query(
      `SELECT sr.what_worked, cs.event_type, sr.created_at
      FROM session_reflections sr
      JOIN coaching_sessions cs ON cs.id = sr.session_id
      WHERE cs.user_id = $1 AND sr.overall_rating >= 7
      ORDER BY sr.created_at DESC
      LIMIT 5`,
      [req.user!.id]
    );

    // Calculate progress trends
    const trends = calculateTrends(metricsResult.rows);

    res.json({
      metrics: metricsResult.rows,
      statistics: sessionsResult.rows[0],
      recent_wins: winsResult.rows,
      trends,
      encouragement: generateProgressEncouragement(sessionsResult.rows[0], trends)
    });
  } catch (error) {
    next(error);
  }
});

// Get detailed progress history
router.get(
  '/history',
  [
    queryParam('metric_type').optional(),
    queryParam('days').optional().isInt({ min: 1, max: 365 }),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const { metric_type, days = 30 } = req.query;

      let queryText = `
        SELECT up.*, cs.event_type, cs.goal
        FROM user_progress up
        LEFT JOIN coaching_sessions cs ON cs.id = (up.context->>'session_id')::int
        WHERE up.user_id = $1 
        AND up.recorded_at >= NOW() - INTERVAL '${days} days'
      `;
      
      const params = [req.user!.id];
      
      if (metric_type) {
        queryText += ' AND up.metric_type = $2';
        params.push(metric_type as string);
      }
      
      queryText += ' ORDER BY up.recorded_at DESC';

      const result = await query(queryText, params);

      res.json({
        history: result.rows,
        period_days: days,
        insights: generateHistoryInsights(result.rows)
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get progress report for specific event type
router.get('/by-event/:eventType', async (req: AuthRequest, res, next) => {
  try {
    const { eventType } = req.params;

    const result = await query(
      `SELECT 
        cs.event_type,
        COUNT(DISTINCT cs.id) as total_events,
        AVG(sr.overall_rating) as avg_rating,
        ARRAY_AGG(DISTINCT UNNEST(sr.what_worked)) as common_successes,
        ARRAY_AGG(DISTINCT UNNEST(sr.what_was_tough)) as common_challenges
      FROM coaching_sessions cs
      LEFT JOIN session_reflections sr ON sr.session_id = cs.id
      WHERE cs.user_id = $1 AND cs.event_type = $2 AND cs.status = 'completed'
      GROUP BY cs.event_type`,
      [req.user!.id, eventType]
    );

    if (result.rows.length === 0) {
      return res.json({
        message: `No completed ${eventType} sessions yet. Start practicing to build your progress!`
      });
    }

    const data = result.rows[0];
    
    res.json({
      event_type: eventType,
      statistics: {
        total_events: data.total_events,
        average_rating: data.avg_rating ? parseFloat(data.avg_rating).toFixed(1) : 'N/A',
      },
      patterns: {
        top_successes: data.common_successes?.slice(0, 5) || [],
        top_challenges: data.common_challenges?.slice(0, 5) || []
      },
      recommendations: generateEventTypeRecommendations(eventType, data)
    });
  } catch (error) {
    next(error);
  }
});

// Get achievement milestones
router.get('/achievements', async (req: AuthRequest, res, next) => {
  try {
    const achievements = await calculateAchievements(req.user!.id);
    
    res.json({
      achievements,
      unlocked: achievements.filter(a => a.unlocked),
      in_progress: achievements.filter(a => !a.unlocked && a.progress > 0),
      motivation: 'Every small step forward is a victory. Celebrate your progress!'
    });
  } catch (error) {
    next(error);
  }
});

// Helper functions
function calculateTrends(metrics: any[]): any {
  const trends: any = {};
  
  metrics.forEach(metric => {
    // In a real app, would calculate actual trends over time
    const trend = metric.avg_value > 5 ? 'improving' : 'stable';
    trends[metric.metric_type] = {
      direction: trend,
      average: parseFloat(metric.avg_value).toFixed(1),
      data_points: metric.count
    };
  });
  
  return trends;
}

function generateProgressEncouragement(stats: any, trends: any): string {
  const { total_sessions, completed_sessions, avg_rating } = stats;
  
  if (total_sessions === 0) {
    return 'Ready to start your journey? Your first session is always the hardest - and you\'re capable of doing it!';
  }
  
  const completionRate = (completed_sessions / total_sessions) * 100;
  
  if (completionRate >= 80 && avg_rating >= 7) {
    return '🌟 You\'re doing amazingly! High completion rate AND high satisfaction. Keep up the fantastic work!';
  } else if (completionRate >= 60) {
    return '💪 Great commitment! You\'re following through on most of your sessions. That takes real strength.';
  } else if (avg_rating >= 7) {
    return '✨ Your sessions are going well! Even if you haven\'t completed all of them, the ones you do are successful.';
  } else {
    return '🌱 You\'re building important skills. Every session, whether easy or challenging, helps you grow.';
  }
}

function generateHistoryInsights(history: any[]): string[] {
  const insights: string[] = [];
  
  if (history.length === 0) {
    insights.push('Start tracking your progress to see patterns over time');
    return insights;
  }
  
  // Check for recent activity
  const lastWeek = history.filter(h => {
    const recordDate = new Date(h.recorded_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recordDate > weekAgo;
  });
  
  if (lastWeek.length >= 3) {
    insights.push('You\'ve been actively practicing recently - great consistency!');
  } else if (lastWeek.length === 0) {
    insights.push('It\'s been a while since your last session. Ready to get back to it?');
  }
  
  // Check for improvement trends
  const ratings = history
    .filter(h => h.metric_type === 'successful_interactions')
    .map(h => h.metric_value);
    
  if (ratings.length >= 3) {
    const recent = ratings.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const older = ratings.slice(-3).reduce((a, b) => a + b, 0) / 3;
    
    if (recent > older) {
      insights.push('Your recent sessions show improvement compared to earlier ones!');
    }
  }
  
  return insights;
}

function generateEventTypeRecommendations(eventType: string, data: any): string[] {
  const recommendations: string[] = [];
  const avgRating = parseFloat(data.avg_rating || '0');
  
  if (avgRating >= 7) {
    recommendations.push(`You're doing great with ${eventType} situations! Consider trying more challenging scenarios.`);
  } else if (avgRating >= 5) {
    recommendations.push(`Solid progress with ${eventType}. Focus on your identified challenge areas in practice sessions.`);
  } else {
    recommendations.push(`${eventType} situations are challenging for you - that's okay! Consider more practice scenarios.`);
  }
  
  if (data.common_challenges?.length > 0) {
    recommendations.push('Create custom practice scenarios addressing your common challenges');
  }
  
  if (data.total_events < 3) {
    recommendations.push('Try a few more sessions to identify patterns and build confidence');
  }
  
  return recommendations;
}

async function calculateAchievements(userId: number): Promise<any[]> {
  const achievements = [
    {
      id: 'first_session',
      name: 'First Steps',
      description: 'Complete your first coaching session',
      icon: '🌟',
      unlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'five_sessions',
      name: 'Committed Learner',
      description: 'Complete 5 coaching sessions',
      icon: '📚',
      unlocked: false,
      progress: 0,
      target: 5
    },
    {
      id: 'high_rating',
      name: 'Success Story',
      description: 'Rate a session 8/10 or higher',
      icon: '🎯',
      unlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'practice_master',
      name: 'Practice Makes Progress',
      description: 'Complete 10 practice scenarios',
      icon: '💪',
      unlocked: false,
      progress: 0,
      target: 10
    },
    {
      id: 'boundary_setter',
      name: 'Boundary Champion',
      description: 'Successfully set boundaries in a real interaction',
      icon: '🛡️',
      unlocked: false,
      progress: 0,
      target: 1
    }
  ];
  
  // Check completed sessions
  const sessionsResult = await query(
    'SELECT COUNT(*) as count FROM coaching_sessions WHERE user_id = $1 AND status = \'completed\'',
    [userId]
  );
  
  const sessionCount = parseInt(sessionsResult.rows[0].count);
  
  if (sessionCount >= 1) {
    achievements[0].unlocked = true;
    achievements[0].progress = 1;
  }
  
  if (sessionCount >= 5) {
    achievements[1].unlocked = true;
    achievements[1].progress = 5;
  } else {
    achievements[1].progress = sessionCount;
  }
  
  // Check high ratings
  const highRatingResult = await query(
    `SELECT COUNT(*) as count 
    FROM session_reflections sr
    JOIN coaching_sessions cs ON cs.id = sr.session_id
    WHERE cs.user_id = $1 AND sr.overall_rating >= 8`,
    [userId]
  );
  
  if (parseInt(highRatingResult.rows[0].count) > 0) {
    achievements[2].unlocked = true;
    achievements[2].progress = 1;
  }
  
  return achievements;
}

export default router;