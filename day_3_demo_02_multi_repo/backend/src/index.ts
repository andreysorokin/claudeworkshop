import { createApp } from './server.ts';

const PORT = Number(process.env.PORT ?? 3001);

const app = createApp();
app.listen(PORT, () => {
  console.log(`backend listening on http://localhost:${PORT}`);
});
