import mongoose from "mongoose"
const MessageSchema=new mongoose.Schema({
    role:{
        type:String,
        enum:['user','ai'],
        required:true
    },
    content:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})

const interviewScehma = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    domain: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        required: true,
    },
    questionsanswered: {
        type: Number,
        required: true,
    },
    messages:[MessageSchema],
    feedback: {
        type:String,
        default:""
    },
    iscomplete: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type:Date,
        default:Date.now
    }



}, {
    timestamps: true
})

const InterviewModel = mongoose.model("interview", interviewScehma);

export default InterviewModel;