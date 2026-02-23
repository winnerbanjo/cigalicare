import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware';
import { apiRouter } from './routes';

export const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://cigalicare-frontend.vercel.app',
    'https://cigalicare.vercel.app'
  ],
  credentials: true
}));
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
