import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { coachingRoutes } from './routes/coaching';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/coaching', coachingRoutes);

// Basic healthcheck endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});