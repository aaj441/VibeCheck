import { Application } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import matchRoutes from './matches';
import questRoutes from './quests';
import conversationRoutes from './conversations';
import musicRoutes from './music';

export function setupRoutes(app: Application): void {
  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/matches', matchRoutes);
  app.use('/api/quests', questRoutes);
  app.use('/api/conversations', conversationRoutes);
  app.use('/api/music', musicRoutes);
  
  // API documentation endpoint
  app.get('/api/docs', (_req, res) => {
    res.json({
      version: '1.0.0',
      endpoints: {
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          refresh: 'POST /api/auth/refresh',
          logout: 'POST /api/auth/logout',
        },
        users: {
          profile: 'GET /api/users/profile',
          updateProfile: 'PUT /api/users/profile',
          uploadAvatar: 'POST /api/users/avatar',
          preferences: 'GET /api/users/preferences',
          updatePreferences: 'PUT /api/users/preferences',
        },
        matches: {
          potential: 'GET /api/matches/potential',
          like: 'POST /api/matches/:matchId/like',
          reject: 'POST /api/matches/:matchId/reject',
          matched: 'GET /api/matches/matched',
        },
        quests: {
          generate: 'POST /api/quests/generate',
          active: 'GET /api/quests/active',
          complete: 'POST /api/quests/:questId/complete',
        },
        conversations: {
          list: 'GET /api/conversations',
          messages: 'GET /api/conversations/:conversationId/messages',
          send: 'POST /api/conversations/:conversationId/messages',
        },
        music: {
          connect: 'POST /api/music/connect/:service',
          disconnect: 'POST /api/music/disconnect/:service',
          sync: 'POST /api/music/sync',
          topTracks: 'GET /api/music/top-tracks',
        },
      },
    });
  });
}