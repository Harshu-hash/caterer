// Serverless entrypoint for Vercel. Every request (see rewrites in
// vercel.json) is routed here; we lazily ensure a DB connection and hand
// off to the Express app, instead of calling app.listen() as server.js
// does for local/traditional hosting.
import 'dotenv/config';

import { assertRequiredEnv } from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import app from '../src/app.js';

assertRequiredEnv();

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
