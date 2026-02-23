import cors, { CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware';
import { apiRouter } from './routes';

export const app = express();

const localDevOriginRegex = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
const allowedOrigins = new Set(['http://localhost:5173', 'http://127.0.0.1:5173']);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin) || localDevOriginRegex.test(origin)) {
      return callback(null, true);
    }

    if (env.nodeEnv !== 'production') {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.status(200).send('CIGALI Backend Running');
});

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'CIGALI API running' });
});

app.use('/api/v1', apiRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
