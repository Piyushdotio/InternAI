import Groq from "groq-sdk";
import InterviewModel from "../models/interview.model";

const groq = new Groq(
    {
        apiKey: process.env.GROQ_API_KEY
    });

const systemPrompt = (domain) =>
    `
You are a senior technical interviewer conducting a mock interview for a ${domain} developer role.
Ask one clear, specific technical question at a time.
After the candidate answers, provide feedback and the next question.

Return ONLY the question, nothing else.
`.trim();

const startInterview = async (req, res) => {
    try {
        const { domain } = req.body
        if (!domain) {
            return res.status(400).json({ success: false, message: "domain is required" })
        }

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: systemPrompt(domain)
                },
                {
                    role: "user",
                    content: `start the interview .Ask me the first  ${domain} techical  question.only ask the question ,no preamble.`
                }

            ],
            temperature: 0.7,
        })

        const question = completion.choices[0].message.content.trim() || "Tell me about yourself and expirence with" + domain + "."

        const interview = new InterviewModel({
            userId: req.userId,
            domain,
            messages: [{ role: "ai", content: question }],
        })
        await interview.save();
        res.status(201).json({
            sessionId: interview._id,
            success: true,
            question: question
        })
    }
    catch (err) {
        console.error("Error starting interview:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}
const submitAnswer = async (req, res) => {
    try {
        const {
            sessionId,
            answer,
            domain = "General",
            questionsAnswered = 0,
        } = req.body
        if (!sessionId || !answer) {
            return res.status(201).json({
                message: "session Id and answer are Required"
            })
        }
        const interview = await InterviewModel.findOne({ _id: sessionId, userId: req.userId });
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" })
        }
        const feedbackResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: `You are an expert ${domain} interview evaluator.

        Provide constructive feedback on this interview answer in 2-3 sentences.

        Focus on:
        - Clarity and structure of the response
        - Technical accuracy and depth
        - Communication skills
        - Areas for improvement

        Answer: "${answer}"

        Return ONLY the feedback, no additional text.`,
                },
            ],
            temperature: 0.7,
            max_tokens: 200,
        });

        const feedback=feedbackResponse.choices[0].message.content.trim();
        const iscomplete=questionsAnswered>=2
        interview.messages.push({role:"user",content:answer,timestamp:Date.now()});
        interview.messages.push({role:"ai",content:feedback,timestamp:Date.now()});
        interview.questionsanswered=questionsAnswered+1
        if(iscomplete){
            const scoreResponse= await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: `You are an expert ${domain} interview evaluator.

        Provide constructive feedback on this interview answer in 2-3 sentences.

        Focus on:
        - Clarity and structure of the response
        - Technical accuracy and depth
        - Communication skills
        - Areas for improvement

        Answer: "${answer}"

        Return ONLY the feedback, no additional text.`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 200,
            });

            const scoreRaw=scoreResponse.choices[0].message.content.trim();
            const score=Math.max(10,Math.min(100,parseInt(scoreRaw) || 75));
            interview.score=score;
            interview.iscomplete=true;
            interview.feedback=feedback;
            interview.duration=Math.max(1,Math.round((Date.now()-interview.createdAt.getTime())/60000))
            await interview.save();
            res.json({
                feedback,
                score,
                iscomplete:true,
                message:"Interview Completed.final feedback and score provided"
            })
            
        }
        const nextQuestion=nextQuestionResponse.choices[0].message.content.trim();
        interview.messages.push({role:"user",content:nextQuestion,timestamp:Date.now()});
        await interview.save();
        return res.json({
            feedback,
            question:nextQuestion,
            iscomplete:false,
            message:"question asked"
        })
    }
    catch (err) {
        console.error("Error submitting answer:", err);
        res.status(500).json({ success: false, message: "Internal server error" });

    }
}


const getInterviews = async(req,res)=>{
    try{

    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}