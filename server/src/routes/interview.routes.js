import {
    startInterview,
    submitAnswer,
    saveCompletedInterview,
    getInterview,
    getInterviews
} from "../controller/interview.controller.js";
import express from "express";
import { authUser } from "../middleware/auth.middleware.js";

const interviewRouter = express.Router();
interviewRouter.use(authUser);
interviewRouter.post("/start", startInterview);
interviewRouter.post("/submit", submitAnswer);
interviewRouter.post("/save", saveCompletedInterview);
interviewRouter.get("/", getInterviews);
interviewRouter.get("/:id", getInterview);

export default interviewRouter;