import { Server } from 'socket.io';
import { config } from '../config';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';

export function initializeSocketIO(httpServer: any): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: config.socketIo.corsOrigin,
      credentials: true,
    },
  });
  
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      socket.data.user = {
        id: decoded.id,
        username: decoded.username,
        houseType: decoded.houseType,
      };
      
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    const user = socket.data.user;
    logger.info('User connected via WebSocket', { userId: user.id });
    
    // Join user's personal room
    socket.join(`user:${user.id}`);
    
    // Handle joining conversation rooms
    socket.on('join:conversation', async (conversationId: string) => {
      // TODO: Verify user has access to this conversation
      socket.join(`conversation:${conversationId}`);
      logger.debug('User joined conversation', { userId: user.id, conversationId });
    });
    
    // Handle leaving conversation rooms
    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      logger.debug('User left conversation', { userId: user.id, conversationId });
    });
    
    // Handle sending messages
    socket.on('message:send', async (data: any) => {
      try {
        // TODO: Validate and save message to database
        
        // Emit to conversation room
        io.to(`conversation:${data.conversationId}`).emit('message:new', {
          id: data.id,
          conversationId: data.conversationId,
          senderId: user.id,
          content: data.content,
          createdAt: new Date().toISOString(),
        });
        
      } catch (error) {
        logger.error('Error sending message', { error, userId: user.id });
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // Handle typing indicators
    socket.on('typing:start', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('typing:user', {
        userId: user.id,
        username: user.username,
      });
    });
    
    socket.on('typing:stop', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stopped', {
        userId: user.id,
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info('User disconnected from WebSocket', { userId: user.id });
    });
  });
  
  return io;
}