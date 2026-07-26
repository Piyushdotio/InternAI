import { Router } from "express";
import { register, login, getMe } from "../controller/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 * @body    { username, email, password }
 */
authRouter.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 * @body    { email, password }
 */
authRouter.post("/login", login);

/**
 * @route   GET /api/auth/getMe
 * @desc    Get currently logged-in user profile
 * @access  Private (Requires Token)
 * @headers { Authorization: Bearer <token> } or Cookie { token }
 */
authRouter.get("/getMe", authUser, getMe);

export default authRouter;