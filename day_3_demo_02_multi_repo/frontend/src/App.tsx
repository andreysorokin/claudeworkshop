import { useEffect, useState } from 'react';
import type { HealthResponse } from './api.ts';
import { fetchHealth, healthLabel } from './api.ts';

export function App(): JSX.Element {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'unknown error'));
  }, []);

  return (
    <main>
      <h1>Frontend</h1>
      <p>Backend status: {error ? `error: ${error}` : healthLabel(health)}</p>
    </main>
  );
}
