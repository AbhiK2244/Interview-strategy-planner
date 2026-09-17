import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import interviewRouter from "./routes/interviewReport.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://interview-strategy-planner.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;