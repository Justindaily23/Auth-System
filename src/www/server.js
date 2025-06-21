import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import http from 'http';
import connectToDb from '../database/db.js';
import authRoutes from '../routes/auth.routes.js';
import { errorHandler } from '../middleware/errorHandler.js';

const app = express();
const server = http.createServer(app);
connectToDb();
// Middlewares
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth/user', authRoutes);
app.use(errorHandler);

export { app, server };
