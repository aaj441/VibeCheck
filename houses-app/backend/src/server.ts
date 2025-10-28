import express, { Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';

import { config, validateConfig } from './config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/error';
import { setupRoutes } from './routes';
import { initializeDatabase } from './services/database';
import { initializeRedis } from './services/redis';
import { initializeSocketIO } from './services/socket';

class App {
  private app: Application;
  private server: any;
  private io: Server | null = null;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
  }

  private async initialize(): Promise<void> {
    try {
      // Validate configuration
      validateConfig();
      
      // Initialize Sentry for production
      if (config.env === 'production' && config.monitoring.sentryDsn) {
        Sentry.init({
          dsn: config.monitoring.sentryDsn,
          environment: config.env,
          integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Sentry.Integrations.Express({ app: this.app }),
          ],
          tracesSampleRate: 0.1,
        });
        
        // Sentry request handler must be the first middleware
        this.app.use(Sentry.Handlers.requestHandler());
      }
      
      // Security middleware
      this.app.use(helmet({
        contentSecurityPolicy: config.env === 'production',
      }));
      
      // CORS configuration
      this.app.use(cors({
        origin: config.socketIo.corsOrigin,
        credentials: true,
      }));
      
      // Compression middleware
      this.app.use(compression());
      
      // Body parsing middleware
      this.app.use(express.json({ limit: '10mb' }));
      this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
      
      // Rate limiting
      const limiter = rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.maxRequests,
        message: 'Too many requests from this IP, please try again later.',
      });
      this.app.use('/api/', limiter);
      
      // Request logging
      this.app.use((req, _res, next) => {
        logger.info(`${req.method} ${req.path}`, {
          method: req.method,
          path: req.path,
          ip: req.ip,
          userAgent: req.get('user-agent'),
        });
        next();
      });
      
      // Initialize services
      await this.initializeServices();
      
      // Setup routes
      setupRoutes(this.app);
      
      // Health check endpoint
      this.app.get('/health', (_req, res) => {
        res.json({
          status: 'ok',
          timestamp: new Date().toISOString(),
          environment: config.env,
          version: process.env.npm_package_version || '0.0.1',
        });
      });
      
      // Sentry error handler (must be before other error middleware)
      if (config.env === 'production' && config.monitoring.sentryDsn) {
        this.app.use(Sentry.Handlers.errorHandler());
      }
      
      // Error handling middleware (must be last)
      this.app.use(notFoundHandler);
      this.app.use(errorHandler);
      
    } catch (error) {
      logger.error('Failed to initialize application:', error);
      throw error;
    }
  }
  
  private async initializeServices(): Promise<void> {
    // Initialize database connection
    await initializeDatabase();
    logger.info('Database connected successfully');
    
    // Initialize Redis connection
    await initializeRedis();
    logger.info('Redis connected successfully');
    
    // Initialize Socket.IO
    this.io = initializeSocketIO(this.server);
    logger.info('Socket.IO initialized successfully');
  }
  
  public async start(): Promise<void> {
    try {
      await this.initialize();
      
      this.server.listen(config.port, () => {
        logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      });
      
      // Graceful shutdown
      process.on('SIGTERM', () => this.shutdown());
      process.on('SIGINT', () => this.shutdown());
      
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
  
  private async shutdown(): Promise<void> {
    logger.info('Shutting down gracefully...');
    
    // Close server
    this.server.close(() => {
      logger.info('HTTP server closed');
    });
    
    // Close Socket.IO connections
    if (this.io) {
      this.io.close(() => {
        logger.info('Socket.IO connections closed');
      });
    }
    
    // Add cleanup for database and Redis connections here
    
    process.exit(0);
  }
}

// Start the application
const app = new App();
app.start().catch((error) => {
  logger.error('Unhandled error during startup:', error);
  process.exit(1);
});