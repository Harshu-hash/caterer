import 'dotenv/config';

import { env, assertRequiredEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';

async function start() {
  assertRequiredEnv();
  await connectDB();

  app.listen(env.port, () => {
    console.log(`API server listening on port ${env.port} [${env.nodeEnv}]`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
