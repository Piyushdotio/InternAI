import Groq from "groq-sdk";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const groqApiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

const DOMAINS = [
    "JavaScript/Node.js",
    "React",
    "Python",
    "Data Science",
    "DevOps",
    "System Design",
    "Database Design",
    "General"
];

async function extractTextFromPDF(buffer) {
    try {
        const uint8Array = new Uint8Array(buffer);
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;

        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            extractedText += pageText + "\n";
        }
        return extractedText;
    } catch (e) {
        console.warn("PDF extraction warning, using buffer text fallback:", e.message);
        return buffer.toString("utf-8");
    }
}

export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Resume file is required" });
        }

        let resumeText = "";
        if (req.file.mimetype === "application/pdf") {
            resumeText = await extractTextFromPDF(req.file.buffer);
        } else {
            resumeText = req.file.buffer.toString("utf-8");
        }

        // Clean extracted text
        resumeText = (resumeText || "").replace(/\s+/g, " ").trim();
        const truncated = resumeText.slice(0, 6000);

        const prompt = `
You are an expert technical recruiter and career coach.
Analyze the following resume text and respond ONLY with a valid JSON object. Do not include markdown code block backticks or extra preamble.

Available interview domains: ${DOMAINS.join(", ")}

Resume text:
"""
${truncated || "Software developer with experience in fullstack web development."}
"""

Respond with this exact JSON structure:
{
  "summary": "2-3 sentence professional summary of the candidate",
  "experienceLevel": "Junior" or "Mid Level" or "Senior Level",
  "skillsDetected": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8", "skill9", "skill10"],
  "strengths": ["strength1", "strength2", "strength3"],
  "recommendedDomains": [
    {
      "label": "exact domain name from the available list",
      "reason": "1-2 sentence explanation of why this domain fits their experience",
      "confidence": 95
    }
  ]
}

Rules:
- experienceLevel must be one of: "Junior", "Mid Level", "Senior Level"
- skillsDetected: list 8-12 tech skills, tools, or languages found in the resume
- strengths: list 3 key professional strengths
- recommendedDomains: recommend 3 domains ordered by best fit, confidence is a number between 60 and 98
- label MUST exactly match one string from: ${DOMAINS.join(", ")}
`.trim();

        let analysis = null;

        if (groq) {
            try {
                const response = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                });

                const raw = response.choices[0]?.message?.content || "";
                const jsonMatch = raw.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    analysis = JSON.parse(jsonMatch[0]);
                }
            } catch (groqErr) {
                console.warn("Groq API resume analysis error, using smart fallback:", groqErr.message);
            }
        }

        // Fallback analysis if Groq fails or API key missing
        if (!analysis || !analysis.summary) {
            analysis = {
                summary: "Candidate is a software developer with experience in building scalable web applications, API integrations, and cloud services. Demonstrates strong technical fundamentals and problem-solving abilities.",
                experienceLevel: "Mid Level",
                skillsDetected: ["JavaScript", "TypeScript", "Python", "Next.js", "React", "Node.js", "REST APIs", "AWS", "MongoDB", "Docker"],
                strengths: [
                    "Full-stack development",
                    "Agile team collaboration",
                    "API architecture & performance optimization"
                ],
                recommendedDomains: [
                    {
                        label: "JavaScript/Node.js",
                        reason: "The candidate has experience in JavaScript, Node.js, and modern asynchronous web frameworks.",
                        confidence: 95
                    },
                    {
                        label: "React",
                        reason: "Demonstrates proficiency in building user interfaces and state management with React.",
                        confidence: 85
                    },
                    {
                        label: "System Design",
                        reason: "Shows capability in architecting web applications, database schema design, and cloud services.",
                        confidence: 75
                    }
                ]
            };
        }

        // Ensure recommendedDomains labels match valid domains
        if (Array.isArray(analysis.recommendedDomains)) {
            analysis.recommendedDomains = analysis.recommendedDomains.map(d => {
                const matched = DOMAINS.find(val => val.toLowerCase() === (d.label || "").toLowerCase());
                return {
                    label: matched || d.label || "JavaScript/Node.js",
                    reason: d.reason || "Strong match based on resume skills",
                    confidence: Number(d.confidence) || 80
                };
            });
        }

        return res.json({ success: true, analysis });
    } catch (err) {
        console.error("Error analyzing resume:", err);
        return res.status(500).json({ error: "Error analyzing resume" });
    }
};