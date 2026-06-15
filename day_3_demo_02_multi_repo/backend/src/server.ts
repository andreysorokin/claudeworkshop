import express, { type Express } from 'express';
import { healthRouter } from './routes/health.ts';

const SERVICE_NAME = 'backend';

/** Build the Express app. Kept separate from the listener so tests can import it. */
export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api', healthRouter(SERVICE_NAME));
  return app;
}
