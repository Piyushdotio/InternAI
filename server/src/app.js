import express from "express"
import morgan from "morgan"
import cors from 'cors'
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import interviewRouter from "./routes/interview.routes.js";
import ResumeRouter from "./routes/resume.routes.js";
const app = express()

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://localhost:5173"
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
            callback(null, true);
        } else {
            callback(null, true); // Allow origin in production web deployment
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())




app.use("/api/auth",authRouter);

app.use("/api/interview",interviewRouter);

app.use("/api/resume",ResumeRouter);

export default app
