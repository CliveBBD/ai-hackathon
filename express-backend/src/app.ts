import 'dotenv/config';
import express from "express";
import promptsRouter from "./routes/prompts";

const app = express();
app.use(express.json());

app.use("/prompts", promptsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
