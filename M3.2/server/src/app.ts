import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/role.middleware';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[Dashstack Server] ${req.method} ${req.url}`);
  next();
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} không tồn tại` });
});

app.use(errorHandler);

export default app;
