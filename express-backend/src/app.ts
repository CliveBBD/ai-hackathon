import 'dotenv/config';
import express from "express";
import promptsRouter from "./routes/prompts";
import passport from "passport";
import './config/passport';
import session from "express-session";
import MongoStore from 'connect-mongo';
import authRouter from "./routes/auth";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
import cvRouter from "./routes/cv";

const app = express();
app.use(express.json());

const allowedOrigins: string[] = [ process.env.FRONTEND! ]
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.set("trust proxy", true);

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/",
    touchAfter: 24 * 3600,
    ttl: 14 * 24 * 60 * 60
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use("/prompts", promptsRouter);
app.use("/auth", authRouter);
app.use("/cv", cvRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
  console.log(`Backend listening on port ${PORT}`);
});
export default app;
