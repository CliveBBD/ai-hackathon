import express from "express";
import promptsRouter from "./routes/prompts";
import cvRouter from "./routes/cv";

const app = express();
app.use(express.json());

app.use("/prompts", promptsRouter);
app.use("/cv", cvRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
  console.log(`Backend listening on port ${PORT}`);
});
