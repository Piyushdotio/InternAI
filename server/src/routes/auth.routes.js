import { Router } from "express";
import {register,login,getMe} from "../controller/auth.controller.js";
import {authUser} from "../middleware/auth.middleware.js";

const authRouter=Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register",register);


/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 * @body { email, password }
 */

authRouter.post("/login",login);


/**
 * @route GET /api/auth/getMe
 * @desc Get current user
 * @access Private
 * @headers { Authorization: Bearer <token> }
 */

authRouter.get("/getMe",authUser,getMe);



export default authRouter;