import { Router } from 'express';

export interface HealthResponse {
  status: 'ok';
  service: string;
}

/** Routes are thin: shape the response and return. See /org-standards:code-style. */
export function healthRouter(serviceName: string): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    const body: HealthResponse = { status: 'ok', service: serviceName };
    res.status(200).json(body);
  });

  return router;
}
