import Groq from "groq-sdk";
import InterviewModel from "../models/interview.model.js";

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const systemPrompt = (domain) =>
    `
You are a senior technical interviewer conducting a mock interview for a ${domain} developer role.
Ask one clear, specific technical question at a time.
After the candidate answers, provide feedback and the next question.

Return ONLY the question, nothing else.
`.trim();

// Start a new interview session
const startInterview = async (req, res) => {
    try {
        const { domain } = req.body;
        if (!domain) {
            return res.status(400).json({ success: false, message: "domain is required" });
        }

        let question = `Tell me about your experience with ${domain} and core fundamentals.`;

        if (groq) {
            try {
                const completion = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt(domain)
                        },
                        {
                            role: "user",
                            content: `start the interview .Ask me the first ${domain} technical question.only ask the question, no preamble.`
                        }
                    ],
                    temperature: 0.7,
                });
                question = completion.choices[0]?.message?.content?.trim() || question;
            } catch (groqErr) {
                console.warn("Groq API warning, using default prompt:", groqErr.message);
            }
        }

        const interview = new InterviewModel({
            userId: req.userId,
            domain,
            duration: 0,
            questionAnswered: 0,
            messages: [{ role: "ai", content: question }],
        });

        await interview.save();

        res.status(201).json({
            success: true,
            sessionId: interview._id,
            question: question
        });
    }
    catch (err) {
        console.error("Error starting interview:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Submit answer for a question round
const submitAnswer = async (req, res) => {
    try {
        const {
            sessionId,
            answer,
            domain = "General",
            questionsAnswered = 0,
        } = req.body;

        if (!sessionId || !answer) {
            return res.status(400).json({
                success: false,
                message: "sessionId and answer are required"
            });
        }

        const interview = await InterviewModel.findOne({ _id: sessionId, userId: req.userId });
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }

        let feedback = "Good effort! The answer demonstrates understanding of core principles.";
        let nextQuestion = "How would you handle optimization and scalability for this in production?";

        if (groq) {
            try {
                const feedbackResponse = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "user",
                            content: `You are an expert ${domain} interview evaluator. Provide constructive feedback in 2-3 sentences. Focus on clarity, technical accuracy, and improvement areas. Answer: "${answer}". Return ONLY feedback.`,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 200,
                });
                feedback = feedbackResponse.choices[0]?.message?.content?.trim() || feedback;

                const qResponse = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt(domain)
                        },
                        {
                            role: "user",
                            content: `Ask the next ${domain} technical interview question.`
                        }
                    ],
                    temperature: 0.7,
                });
                nextQuestion = qResponse.choices[0]?.message?.content?.trim() || nextQuestion;
            } catch (groqErr) {
                console.warn("Groq API fallback:", groqErr.message);
            }
        }

        const iscomplete = questionsAnswered >= 2;
        interview.messages.push({ role: "user", content: answer, timestamp: Date.now() });
        interview.messages.push({ role: "ai", content: feedback, timestamp: Date.now() });
        interview.questionAnswered = questionsAnswered + 1;

        if (iscomplete) {
            const score = 75;
            interview.score = score;
            interview.iscomplete = true;
            interview.feedback = feedback;
            interview.duration = Math.max(1, Math.round((Date.now() - new Date(interview.createdAt).getTime()) / 60000));
            await interview.save();

            return res.json({
                success: true,
                feedback,
                score,
                iscomplete: true,
                message: "Interview Completed. Final feedback and score provided"
            });
        }

        interview.messages.push({ role: "ai", content: nextQuestion, timestamp: Date.now() });
        await interview.save();

        return res.json({
            success: true,
            feedback,
            question: nextQuestion,
            iscomplete: false,
            message: "Question asked"
        });
    }
    catch (err) {
        console.error("Error submitting answer:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Save a completed interview directly into MongoDB
const saveCompletedInterview = async (req, res) => {
    try {
        const { topic, domain, score, duration, questionAnswered = 3, messages = [] } = req.body;
        const targetDomain = domain || topic || "JavaScript/Node.js";

        const formattedMessages = (Array.isArray(messages) ? messages : [])
            .map(m => ({
                role: (m.role === 'user' || m.type === 'answer') ? 'user' : 'ai',
                content: m.content || m.text || '',
                timestamp: m.timestamp || Date.now()
            }))
            .filter(m => typeof m.content === 'string' && m.content.trim().length > 0);

        const newInterview = new InterviewModel({
            userId: req.userId,
            domain: targetDomain,
            score: typeof score !== 'undefined' && score !== null ? Number(score) : 75,
            duration: Number(duration) || 2,
            questionAnswered: Number(questionAnswered) || 3,
            iscomplete: true,
            messages: formattedMessages
        });

        await newInterview.save();

        res.status(201).json({
            success: true,
            message: "Interview saved successfully to database",
            interview: {
                id: newInterview._id,
                topic: newInterview.domain,
                score: newInterview.score,
                duration: newInterview.duration,
                date: new Date(newInterview.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            }
        });
    } catch (err) {
        console.error("Error saving completed interview:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get all completed interviews for logged-in user
const getInterviews = async (req, res) => {
    try {
        const interviews = await InterviewModel.find({ userId: req.userId, iscomplete: true })
            .select("domain score duration questionAnswered createdAt")
            .sort({ createdAt: -1 });

        const mapped = interviews.map((i) => ({
            id: i._id.toString(),
            topic: i.domain,
            score: i.score,
            duration: i.duration,
            questionAnswered: i.questionAnswered,
            date: new Date(i.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            createdAt: i.createdAt,
        }));

        return res.json({
            success: true,
            interviews: mapped
        });
    }
    catch (err) {
        console.error("Error getting interviews:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get single interview by ID
const getInterview = async (req, res) => {
    try {
        const interview = await InterviewModel.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }

        return res.json({
            success: true,
            interview
        });
    }
    catch (err) {
        console.error("Error getting interview details:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export {
    startInterview,
    submitAnswer,
    saveCompletedInterview,
    getInterviews,
    getInterview
};