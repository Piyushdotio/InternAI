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

// Apply auth middleware to all interview routes
interviewRouter.use(authUser);

/**
 * @route   POST /api/interview/start
 * @desc    Start a new mock interview session for a specified domain
 * @access  Private (Requires Token)
 * @body    { domain: string }
 */
interviewRouter.post("/start", startInterview);

/**
 * @route   POST /api/interview/submit
 * @desc    Submit answer for an interview question, receive feedback & next question or final evaluation score
 * @access  Private (Requires Token)
 * @body    { sessionId: string, answer: string, domain?: string, questionsAnswered?: number }
 */
interviewRouter.post("/submit", submitAnswer);

/**
 * @route   POST /api/interview/save
 * @desc    Save a completed interview session directly to database
 * @access  Private (Requires Token)
 * @body    { topic?: string, domain?: string, score?: number, duration?: number, questionAnswered?: number, messages?: Array }
 */
interviewRouter.post("/save", saveCompletedInterview);

/**
 * @route   GET /api/interview/
 * @desc    Get all completed interview sessions for logged-in user
 * @access  Private (Requires Token)
 */
interviewRouter.get("/", getInterviews);

/**
 * @route   GET /api/interview/:id
 * @desc    Get details & transcript of a specific interview session by ID
 * @access  Private (Requires Token)
 * @param   id - Interview Session ID
 */
interviewRouter.get("/:id", getInterview);

export default interviewRouter;