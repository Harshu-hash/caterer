import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';
import path from 'node:path';

import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

import publicRoutes from './routes/publicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminContentRoutes from './routes/adminContentRoutes.js';
import adminInquiryRoutes from './routes/adminInquiryRoutes.js';
import adminSettingsRoutes from './routes/adminSettingsRoutes.js';
import adminMediaRoutes from './routes/adminMediaRoutes.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.use('/uploads', express.static(path.resolve('uploads'), { maxAge: '30d' }));

app.use('/api/v1', apiLimiter, publicRoutes);
app.use('/api/v1/admin/auth', authRoutes);
app.use('/api/v1/admin', adminContentRoutes);
app.use('/api/v1/admin/inquiries', adminInquiryRoutes);
app.use('/api/v1/admin/settings', adminSettingsRoutes);
app.use('/api/v1/admin/media', adminMediaRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
