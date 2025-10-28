import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import Redis from 'redis';

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialize Redis client
const redis = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', (err) => console.log('Redis Client Error', err));
redis.connect();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'your-supabase-url',
  process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key'
);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({ 
    message: 'Vibe Check API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Social interaction coaching endpoints
app.post('/api/coaching/session', async (req: Request, res: Response) => {
  try {
    const { eventType, feelings, setting, participants, goals } = req.body;
    
    // Store session data in Redis
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await redis.setEx(sessionId, 3600, JSON.stringify({
      eventType,
      feelings,
      setting,
      participants,
      goals,
      createdAt: new Date().toISOString()
    }));

    res.json({ 
      sessionId,
      message: 'Session created successfully',
      nextStep: 'emotional_calibration'
    });
  } catch (error) {
    console.error('Error creating coaching session:', error);
    res.status(500).json({ error: 'Failed to create coaching session' });
  }
});

app.post('/api/coaching/calibration', async (req: Request, res: Response) => {
  try {
    const { sessionId, anxiety, excitement, energy, focus, triggers } = req.body;
    
    // Update session with calibration data
    const sessionData = await redis.get(sessionId);
    if (!sessionData) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = JSON.parse(sessionData);
    session.calibration = { anxiety, excitement, energy, focus, triggers };
    session.updatedAt = new Date().toISOString();

    await redis.setEx(sessionId, 3600, JSON.stringify(session));

    res.json({ 
      message: 'Calibration data saved',
      nextStep: 'checklist_generation'
    });
  } catch (error) {
    console.error('Error saving calibration data:', error);
    res.status(500).json({ error: 'Failed to save calibration data' });
  }
});

app.get('/api/coaching/checklist/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const sessionData = await redis.get(sessionId);
    
    if (!sessionData) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = JSON.parse(sessionData);
    
    // Generate personalized checklist based on session data
    const checklist = generatePersonalizedChecklist(session);
    
    res.json({ checklist });
  } catch (error) {
    console.error('Error generating checklist:', error);
    res.status(500).json({ error: 'Failed to generate checklist' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`User ${socket.id} joined session ${sessionId}`);
  });

  socket.on('live-support', (data) => {
    const { sessionId, message, sentiment } = data;
    // Broadcast to other clients in the same session
    socket.to(sessionId).emit('live-support-update', {
      message,
      sentiment,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Helper function to generate personalized checklist
function generatePersonalizedChecklist(session: any) {
  const { eventType, calibration } = session;
  
  const baseChecklist = {
    preEvent: [],
    duringEvent: [],
    postEvent: [],
    comfortItems: [],
    affirmations: []
  };

  // Add event-specific items
  switch (eventType) {
    case 'date':
      baseChecklist.preEvent = [
        'Personal hygiene routine',
        'Choose comfortable outfit',
        'Plan conversation starters',
        'Set personal boundaries',
        'Prepare "safe out" phrases'
      ];
      baseChecklist.duringEvent = [
        'Take deep breaths',
        'Use conversation starters',
        'Listen actively',
        'Take breaks if needed',
        'Stay true to yourself'
      ];
      break;
    case 'interview':
      baseChecklist.preEvent = [
        'Research company and role',
        'Prepare STAR method examples',
        'Plan questions to ask',
        'Test technology (if virtual)',
        'Prepare closing statement'
      ];
      baseChecklist.duringEvent = [
        'Maintain eye contact',
        'Ask clarifying questions',
        'Take notes if helpful',
        'Use prepared examples',
        'Express genuine interest'
      ];
      break;
    case 'networking':
      baseChecklist.preEvent = [
        'Prepare elevator pitch',
        'Research attendees',
        'Plan conversation topics',
        'Bring business cards',
        'Set networking goals'
      ];
      baseChecklist.duringEvent = [
        'Introduce yourself confidently',
        'Ask open-ended questions',
        'Exchange contact information',
        'Follow up on conversations',
        'Take breaks as needed'
      ];
      break;
  }

  // Add calibration-based adjustments
  if (calibration) {
    if (calibration.anxiety > 7) {
      baseChecklist.comfortItems.push('Stress ball', 'Water bottle', 'Breathing app');
      baseChecklist.affirmations.push('I am prepared and capable', 'It\'s okay to feel nervous');
    }
    
    if (calibration.energy < 4) {
      baseChecklist.preEvent.push('Get adequate rest', 'Eat energizing foods', 'Do light exercise');
    }
    
    if (calibration.focus < 5) {
      baseChecklist.duringEvent.push('Use fidget tools', 'Take regular breaks', 'Ask for clarification when needed');
    }
  }

  return baseChecklist;
}

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Vibe Check Backend server listening on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.IO server ready for real-time connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});