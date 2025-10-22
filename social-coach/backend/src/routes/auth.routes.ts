import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../utils/database';
import { AppError } from '../middleware/error.middleware';

const router = Router();

// Validation middleware
const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register endpoint
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('username').isLength({ min: 3 }).trim(),
    body('password').isLength({ min: 6 }),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { email, username, password } = req.body;

      // Check if user exists
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        throw new AppError('User already exists', 409);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const result = await query(
        'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username',
        [email, username, hashedPassword]
      );

      const user = result.rows[0];

      // Create default profile
      await query(
        'INSERT INTO user_profiles (user_id, neurodivergent_types, sensory_preferences, communication_preferences, triggers, comfort_strategies) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          user.id,
          '{}',
          JSON.stringify({
            noise_sensitivity: 5,
            light_sensitivity: 5,
            touch_sensitivity: 5,
            smell_sensitivity: 5,
            crowd_tolerance: 5,
            preferred_environments: []
          }),
          JSON.stringify({
            prefers_written: false,
            needs_processing_time: false,
            prefers_direct_communication: false,
            struggles_with_eye_contact: false,
            prefers_structured_conversations: false,
            needs_clear_expectations: false
          }),
          '{}',
          '{}'
        ]
      );

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user,
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login endpoint
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Get user
      const result = await query(
        'SELECT id, email, username, password_hash FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw new AppError('Invalid credentials', 401);
      }

      const user = result.rows[0];

      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;