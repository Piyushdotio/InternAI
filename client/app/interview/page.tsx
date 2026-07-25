"use client"

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InterviewHeader } from '@/components/interview/InterviewHeader';
import { ChatMessage, Message } from '@/components/interview/ChatMessage';
import { InterviewInput } from '@/components/interview/InterviewInput';
import { InterviewCompletion } from '@/components/interview/InterviewCompletion';
import axiosInstance from '@/lib/axios';

interface DomainConfig {
    id: string;
    title: string;
    icon: string;
    iconBg: string;
    questions: string[];
}

const DOMAINS: Record<string, DomainConfig> = {
    'javascript-node': {
        id: 'javascript-node',
        title: 'JavaScript/Node.js',
        icon: '🟨',
        iconBg: 'bg-yellow-400 text-black font-extrabold',
        questions: [
            "What is the difference between var, let, and const in JavaScript, and how do their scopes differ in a Node.js application?",
            "How would you approach implementing a mechanism to enforce immutable data structures in a Node.js application, considering the differences between 'let' and 'const', and what benefits or trade-offs do you think this approach would have in terms of code maintainability and performance?",
            "How would you design a scalable and fault-tolerant Node.js application that leverages clustering and load balancing to distribute incoming requests across multiple worker processes, while also ensuring seamless session management and data consistency across the cluster?"
        ]
    },
    'react': {
        id: 'react',
        title: 'React',
        icon: '⚛️',
        iconBg: 'bg-purple-100 text-purple-600',
        questions: [
            "Explain the concept of Virtual DOM in React and how Reconciliation works under the hood.",
            "How do useEffect and useLayoutEffect differ, and when should you choose one over the other?",
            "How would you optimize performance in a large React application with deep component trees and frequent state updates?"
        ]
    },
    'python': {
        id: 'python',
        title: 'Python',
        icon: '🐍',
        iconBg: 'bg-green-100 text-green-700',
        questions: [
            "What is GIL (Global Interpreter Lock) in Python and how does it impact multi-threaded performance?",
            "Explain the difference between deepcopy and shallow copy in Python with code examples.",
            "How do Python decorators work under the hood, and how would you build a custom rate-limiting decorator?"
        ]
    },
    'data-science': {
        id: 'data-science',
        title: 'Data Science',
        icon: '📊',
        iconBg: 'bg-blue-100 text-blue-600',
        questions: [
            "What is the Bias-Variance tradeoff in Machine Learning and how do you handle overfitting?",
            "Explain the difference between L1 (Lasso) and L2 (Ridge) regularization.",
            "How would you handle highly imbalanced datasets during model training?"
        ]
    },
    'devops': {
        id: 'devops',
        title: 'DevOps',
        icon: '⚙️',
        iconBg: 'bg-gray-100 text-gray-700',
        questions: [
            "What is the difference between Docker Containers and Virtual Machines?",
            "How do Kubernetes Pods, Deployments, and Services interact with each other?",
            "Explain Zero Downtime Deployment strategies like Blue-Green and Canary deployments."
        ]
    },
    'system-design': {
        id: 'system-design',
        title: 'System Design',
        icon: '🏗️',
        iconBg: 'bg-amber-100 text-amber-700',
        questions: [
            "How would you design a scalable URL shortener service like Bitly?",
            "Explain the CAP Theorem and how it influences database selection in distributed systems.",
            "How would you implement caching strategies (Write-Through vs Cache-Aside) for high traffic APIs?"
        ]
    },
    'database-design': {
        id: 'database-design',
        title: 'Database Design',
        icon: '🗄️',
        iconBg: 'bg-emerald-100 text-emerald-700',
        questions: [
            "What are the ACID properties in relational databases and how are they guaranteed?",
            "Explain database indexing (B-Trees vs Hash indexes) and when an index might degrade query performance.",
            "How do SQL and NoSQL databases handle schema evolution and horizontal scaling differently?"
        ]
    },
    'general': {
        id: 'general',
        title: 'General',
        icon: '🎯',
        iconBg: 'bg-orange-100 text-orange-600',
        questions: [
            "Tell me about a challenging technical problem you solved recently and your approach.",
            "How do you prioritize trade-offs between code quality, speed of delivery, and technical debt?",
            "Describe how you resolve technical disagreements within a software engineering team."
        ]
    }
};

const InterviewSessionContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const domainKey = searchParams.get('domain') || 'javascript-node';
    const domain = DOMAINS[domainKey] || DOMAINS['javascript-node'];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [timerSeconds, setTimerSeconds] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Initialize first question on load
    useEffect(() => {
        setMessages([
            {
                id: 'q-0',
                type: 'question',
                text: domain.questions[0],
                timestamp: new Date().toLocaleTimeString()
            }
        ]);
    }, [domainKey]);

    // Live Timer increment
    useEffect(() => {
        if (isCompleted) return;
        const interval = setInterval(() => {
            setTimerSeconds((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isCompleted]);

    // Auto scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Save completed session to Backend Database & localStorage
    const saveInterviewToBackend = async (domainTitle: string, durationSecs: number, scoreVal: number, finalMessages: Message[]) => {
        const durationMins = Math.max(1, Math.ceil(durationSecs / 60));
        const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        // Save locally for instant offline UI update
        try {
            const existing = JSON.parse(localStorage.getItem('ai_interview_history') || '[]');
            const newRecord = {
                id: 'session-' + Date.now(),
                topic: domainTitle,
                date: todayStr,
                duration: durationMins,
                score: scoreVal,
            };
            localStorage.setItem('ai_interview_history', JSON.stringify([newRecord, ...existing]));
        } catch (e) {
            console.error("Local storage error:", e);
        }

        // Save to Express Backend Server (MongoDB) using axiosInstance (handles Authorization token)
        try {
            const response = await axiosInstance.post('/api/interview/save', {
                topic: domainTitle,
                domain: domainTitle,
                score: scoreVal,
                duration: durationMins,
                questionAnswered: 3,
                messages: finalMessages
            });
            console.log("Backend response saved interview:", response.data);
        } catch (err) {
            console.warn("Backend save failed, using local storage fallback:", err);
        }
    };

    // Generate intelligent AI feedback based on user answer
    const generateFeedback = (userAnswer: string, qIndex: number): string => {
        const isShort = userAnswer.split(' ').length < 10;
        if (isShort) {
            return "The response lacks clarity and structure, with a disjointed sentence that fails to effectively convey the core concepts. Technically, the answer is partially correct but lacks depth and accuracy, as it oversimplifies the definitions. To improve, the candidate should work on providing well-organized and detailed explanations, using proper terminology and examples to demonstrate their understanding of the concepts.";
        }
        return "Good effort! The candidate clearly demonstrated a fundamental understanding of the core concept. The explanation covers key points accurately. To make the response even stronger, consider adding concrete code examples or mentioning real-world trade-offs in production systems.";
    };

    // User submits an answer
    const handleAnswerSubmit = (answerText: string) => {
        const userMsg: Message = {
            id: `a-${currentQuestionIndex}`,
            type: 'answer',
            text: answerText,
            timestamp: new Date().toLocaleTimeString()
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setIsLoading(true);

        // Simulate AI Thinking / API response latency
        setTimeout(() => {
            const feedbackText = generateFeedback(answerText, currentQuestionIndex);

            const feedbackMsg: Message = {
                id: `f-${currentQuestionIndex}`,
                type: 'feedback',
                text: feedbackText,
                timestamp: new Date().toLocaleTimeString()
            };

            const nextIndex = currentQuestionIndex + 1;

            if (nextIndex < domain.questions.length) {
                // Next question available
                const nextQMsg: Message = {
                    id: `q-${nextIndex}`,
                    type: 'question',
                    text: domain.questions[nextIndex],
                    timestamp: new Date().toLocaleTimeString()
                };

                setMessages((prev) => [...prev, feedbackMsg, nextQMsg]);
                setCurrentQuestionIndex(nextIndex);
            } else {
                // All 3 questions answered -> Mark complete & Save to Backend DB
                const finalMsgs = [...updatedMessages, feedbackMsg];
                setMessages(finalMsgs);
                setCurrentQuestionIndex(3); // 3 of 3
                setIsCompleted(true);
                saveInterviewToBackend(domain.title, timerSeconds, 10, finalMsgs);
            }

            setIsLoading(false);
        }, 1200);
    };

    const handleExit = () => {
        if (confirm("Are you sure you want to exit the current interview session?")) {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
            {/* Scalable Header */}
            <InterviewHeader
                domainTitle={domain.title}
                domainIcon={domain.icon}
                domainIconBg={domain.iconBg}
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={3}
                timerSeconds={timerSeconds}
                isCompleted={isCompleted}
                onExit={handleExit}
                onGoToDashboard={() => router.push('/dashboard')}
            />

            {/* Content Body */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 pb-32 space-y-4">
                {!isCompleted ? (
                    <>
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}

                        {/* AI Thinking Animation */}
                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-gray-100 text-gray-500 px-5 py-3 rounded-2xl text-xs font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                                    <span>AI Evaluator is evaluating your answer...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </>
                ) : (
                    /* Interview Completion Feedback View (Exact Reference Image match) */
                    <InterviewCompletion
                        domainTitle={domain.title}
                        domainIcon={domain.icon}
                        domainIconBg={domain.iconBg}
                        score={10}
                        totalQuestions={3}
                        timerSeconds={timerSeconds || 95}
                        technicalAccuracy={15}
                        communicationClarity={2}
                        problemSolving={12}
                        onGoToDashboard={() => router.push('/dashboard')}
                        onRestart={() => {
                            setCurrentQuestionIndex(0);
                            setTimerSeconds(0);
                            setIsCompleted(false);
                            setMessages([
                                {
                                    id: 'q-0',
                                    type: 'question',
                                    text: domain.questions[0],
                                    timestamp: new Date().toLocaleTimeString()
                                }
                            ]);
                        }}
                    />
                )}
            </main>

            {/* Scalable Input Bar */}
            {!isCompleted && (
                <InterviewInput
                    onSubmit={handleAnswerSubmit}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

const Page = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 text-sm">Loading interview session...</p>
            </div>
        }>
            <InterviewSessionContent />
        </Suspense>
    );
};

export default Page;
