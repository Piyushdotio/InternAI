import express from "express"
import morgan from "morgan"
import cors from 'cors'
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import interviewRouter from "./routes/interview.routes.js";
import ResumeRouter from "./routes/resume.routes.js";
const app = express()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())




app.use("/api/auth",authRouter);

app.use("/api/interview",interviewRouter);

app.use("/api/resume",ResumeRouter);

export default app
