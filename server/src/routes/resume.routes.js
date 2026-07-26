import express from "express"
import { analyzeResume } from "../controller/resume.controller.js"
import { authUser } from "../middleware/auth.middleware.js"
import multer from "multer";


const ResumeRouter = express.Router();
const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5*1024*1024
    },
    fileFilter:(req,file,cb)=>{
        if(file.mimetype.startsWith("application/pdf")){
            cb(null,true)
        }
        else{
            cb(new Error("Invalid file type"),false)
        }
    }
})

/**
 * @route   POST /api/resume/analyze
 * @desc    Upload and analyze resume (PDF) using AI to extract skills, strengths & recommended interview domains
 * @access  Private (Requires Token)
 * @file    resume - PDF Document (multipart/form-data, max 5MB)
 */
ResumeRouter.post("/analyze", authUser, upload.single("resume"), analyzeResume);

export default ResumeRouter;
