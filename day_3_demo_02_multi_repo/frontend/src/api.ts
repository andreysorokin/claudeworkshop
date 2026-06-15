// Client for the backend contract. See ../shared/knowledge/architecture.md.

export interface HealthResponse {
  status: 'ok';
  service: string;
}

/** Human-readable label for the health state — pure, so it's trivially testable. */
export function healthLabel(health: HealthResponse | null): string {
  if (health === null) {
    return 'checking…';
  }
  return `${health.status} (${health.service})`;
}

/** Fetch the backend health endpoint. Vite proxies /api to the backend in dev. */
export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch('/api/health');
  if (!res.ok) {
    throw new Error(`health check failed: ${res.status}`);
  }
  return (await res.json()) as HealthResponse;
}
