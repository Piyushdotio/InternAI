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

ResumeRouter.post("/analyze", authUser,upload.single("resume"), analyzeResume)

export default ResumeRouter
