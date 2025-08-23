import 'dotenv/config';
import express from "express";
import promptsRouter from "./routes/prompts";
import passport from 'passport';
import './config/passport';
import session from "express-session";
import MongoStore from 'connect-mongo';
import authRouter from "./routes/auth";

const app = express();
app.use(express.json());

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

app.use("/prompts", promptsRouter);
app.use("/auth", authRouter);

export default app;
