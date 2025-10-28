import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { query } from '../services/database';
import { AppError } from '../middleware/error';
import { logger } from '../utils/logger';

interface UserRecord {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  house_type: string;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, password, houseType } = req.body;
    
    // Check if user already exists
    const existingUsers = await query<UserRecord>(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    
    if (existingUsers.length > 0) {
      throw new AppError('User with this email or username already exists', 409);
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const [newUser] = await query<UserRecord>(
      `INSERT INTO users (id, email, username, password_hash, house_type, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) 
       RETURNING id, email, username, house_type`,
      [uuidv4(), email, username, passwordHash, houseType]
    );
    
    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    
    logger.info('New user registered', { userId: newUser.id, houseType });
    
    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        houseType: newUser.house_type,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const [user] = await query<UserRecord>(
      'SELECT id, email, username, password_hash, house_type FROM users WHERE email = $1',
      [email]
    );
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Update last active
    await query(
      'UPDATE users SET last_active = NOW() WHERE id = $1',
      [user.id]
    );
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    logger.info('User logged in', { userId: user.id });
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        houseType: user.house_type,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.secret) as any;
    
    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid refresh token', 401);
    }
    
    // Get user
    const [user] = await query<UserRecord>(
      'SELECT id, email, username, house_type FROM users WHERE id = $1',
      [decoded.id]
    );
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Generate new access token
    const accessToken = generateAccessToken(user);
    
    res.json({ accessToken });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid refresh token', 401));
    } else {
      next(error);
    }
  }
};

export const logout = async (
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  // In a real implementation, you might want to blacklist the token
  res.json({ message: 'Logged out successfully' });
};

// Helper functions
function generateAccessToken(user: any): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      houseType: user.house_type || user.houseType,
      type: 'access',
    },
    config.jwt.secret,
    { expiresIn: '1h' }
  );
}

function generateRefreshToken(user: any): string {
  return jwt.sign(
    {
      id: user.id,
      type: 'refresh',
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiry }
  );
}