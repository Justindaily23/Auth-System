import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import http from 'http';
import connectToDb from '../database/db.js';
import authRoutes from '../routes/auth.routes.js';
import { errorHandler } from '../middleware/errorHandler.js';
import session from 'express-session';
import passport from '../middleware/passport.js';
import { getEnvironmentalVariable } from '../config/envConfig.js';

const app = express();
const server = http.createServer(app);
connectToDb();
// Middlewares
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: getEnvironmentalVariable('SESSION_SECRET'),
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/api/auth/user', authRoutes);
app.use('/api/auth', authRoutes); // google auth routes 
app.use(errorHandler);

export { app, server };
