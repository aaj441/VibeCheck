import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import sessionRoutes from './routes/session.routes';
import checklistRoutes from './routes/checklist.routes';
import practiceRoutes from './routes/practice.routes';
import liveRoutes from './routes/live.routes';
import reflectionRoutes from './routes/reflection.routes';
import progressRoutes from './routes/progress.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Logging middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Social Coach API'
  });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/profile', authMiddleware, profileRoutes);
app.use('/api/sessions', authMiddleware, sessionRoutes);
app.use('/api/checklists', authMiddleware, checklistRoutes);
app.use('/api/practice', authMiddleware, practiceRoutes);
app.use('/api/live', authMiddleware, liveRoutes);
app.use('/api/reflections', authMiddleware, reflectionRoutes);
app.use('/api/progress', authMiddleware, progressRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Social Coach API running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});