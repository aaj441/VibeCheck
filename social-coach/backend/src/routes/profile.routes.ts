import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../utils/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const router = Router();

// Get user profile
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Profile not found', 404);
    }

    res.json({ profile: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put(
  '/',
  [
    body('neurodivergent_types').optional().isArray(),
    body('sensory_preferences').optional().isObject(),
    body('communication_preferences').optional().isObject(),
    body('triggers').optional().isArray(),
    body('comfort_strategies').optional().isArray(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const updates = req.body;
      const updateFields = [];
      const values = [];
      let paramCount = 1;

      // Build dynamic update query
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = $${paramCount}`);
          values.push(typeof value === 'object' ? JSON.stringify(value) : value);
          paramCount++;
        }
      });

      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(req.user!.id);

      const result = await query(
        `UPDATE user_profiles SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = $${paramCount} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        throw new AppError('Profile not found', 404);
      }

      res.json({ 
        profile: result.rows[0],
        message: 'Profile updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;