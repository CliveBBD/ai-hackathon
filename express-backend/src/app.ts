import 'dotenv/config';
import express from "express";
import promptsRouter from "./routes/prompts";
import passport from "passport";
import './config/passport';
import session from "express-session";
import MongoStore from 'connect-mongo';
import authRouter from "./routes/auth";
import profilesRouter from "./routes/profiles";
import dotenv from "dotenv";
import cors from "cors";
import projectRoutes from './routes/projects';
import applicationRoutes from './routes/applications';
import coachingRoutes from './routes/coaching';
import notificationRoutes from './routes/notifications';

dotenv.config();
import cvRouter from "./routes/cv";

const app = express();
app.use(express.json());

const allowedOrigins: string[] = [ process.env.FRONTEND! ]
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI!,
    touchAfter: 24 * 3600,
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use("/prompts", promptsRouter);

// Routes
app.use('/auth', authRouter);
app.use("/cv", cvRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/coaching', coachingRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
