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

dotenv.config();

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
app.use("/api/profiles", profilesRouter);

export default app;
