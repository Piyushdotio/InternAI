"use client"

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InterviewHeader } from '@/components/interview/InterviewHeader';
import { ChatMessage, Message } from '@/components/interview/ChatMessage';
import { InterviewInput } from '@/components/interview/InterviewInput';
import { InterviewCompletion } from '@/components/interview/InterviewCompletion';
import { DOMAINS } from '@/lib/domains';
import axiosInstance from '@/lib/axios';

const InterviewSessionContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const domainKey = searchParams.get('domain') || 'javascript-node';
    const domain = DOMAINS[domainKey] || DOMAINS['javascript-node'];

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [timerSeconds, setTimerSeconds] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [finalEvaluation, setFinalEvaluation] = useState({
        score: 75,
        technicalAccuracy: 75,
        communicationClarity: 75,
        problemSolving: 75,
    });

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Initialize session with start API or static domain questions
    useEffect(() => {
        let isMounted = true;
        const initInterview = async () => {
            setIsLoading(true);
            try {
                const res = await axiosInstance.post('/api/interview/start', { domain: domain.title });
                if (isMounted && res.data?.success && res.data?.sessionId) {
                    setSessionId(res.data.sessionId);
                    setMessages([{
                        id: 'q-0',
                        type: 'question',
                        text: res.data.question || domain.questions[0],
                        timestamp: new Date().toLocaleTimeString()
                    }]);
                    setIsLoading(false);
                    return;
                }
            } catch (err) {
                console.warn("Backend start API error, fallback to static question:", err);
            }
            if (isMounted) {
                setMessages([{
                    id: 'q-0',
                    type: 'question',
                    text: domain.questions[0],
                    timestamp: new Date().toLocaleTimeString()
                }]);
                setIsLoading(false);
            }
        };

        initInterview();
        return () => { isMounted = false; };
    }, [domainKey, domain.title]);

    // Live Session Timer
    useEffect(() => {
        if (isCompleted) return;
        const interval = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [isCompleted]);

    // Auto-scroll chat to bottom
    useEffect(() => {
        const timer = setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 120);
        return () => clearTimeout(timer);
    }, [messages, isLoading]);

    // Persist completed interview to database and local storage
    const saveInterviewToBackend = async (domainTitle: string, durationSecs: number, scoreVal: number, finalMessages: Message[], breakdownObj?: any) => {
        const durationMins = Math.max(1, Math.ceil(durationSecs / 60));
        const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

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

        try {
            await axiosInstance.post('/api/interview/save', {
                topic: domainTitle,
                domain: domainTitle,
                score: scoreVal,
                breakdown: breakdownObj,
                duration: durationMins,
                questionAnswered: 3,
                messages: finalMessages
            });
        } catch (err) {
            console.warn("Backend save failed, using local storage fallback:", err);
        }
    };

    // Candidate Answer Submission Logic
    const handleAnswerSubmit = async (answerText: string) => {
        const userMsg: Message = {
            id: `a-${currentQuestionIndex}`,
            type: 'answer',
            text: answerText,
            timestamp: new Date().toLocaleTimeString()
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setIsLoading(true);

        if (sessionId) {
            try {
                const res = await axiosInstance.post('/api/interview/submit', {
                    sessionId,
                    answer: answerText,
                    domain: domain.title,
                    questionsAnswered: currentQuestionIndex
                });

                if (res.data?.success) {
                    const feedbackMsg: Message = {
                        id: `f-${currentQuestionIndex}`,
                        type: 'feedback',
                        text: res.data.feedback || "Good effort!",
                        timestamp: new Date().toLocaleTimeString()
                    };

                    if (res.data.iscomplete) {
                        const finalMsgs = [...updatedMessages, feedbackMsg];
                        setMessages(finalMsgs);
                        setCurrentQuestionIndex(3);
                        setIsCompleted(true);
                        const finalScore = Number(res.data.score) || 75;
                        const breakdown = res.data.breakdown || {
                            technicalAccuracy: finalScore,
                            communicationClarity: finalScore,
                            problemSolving: finalScore
                        };
                        setFinalEvaluation({
                            score: finalScore,
                            technicalAccuracy: Number(breakdown.technicalAccuracy) || finalScore,
                            communicationClarity: Number(breakdown.communicationClarity) || finalScore,
                            problemSolving: Number(breakdown.problemSolving) || finalScore
                        });
                        saveInterviewToBackend(domain.title, timerSeconds, finalScore, finalMsgs, breakdown);
                    } else {
                        const nextQMsg: Message = {
                            id: `q-${currentQuestionIndex + 1}`,
                            type: 'question',
                            text: res.data.question || domain.questions[currentQuestionIndex + 1],
                            timestamp: new Date().toLocaleTimeString()
                        };
                        setMessages((prev) => [...prev, feedbackMsg, nextQMsg]);
                        setCurrentQuestionIndex((prev) => prev + 1);
                    }
                    setIsLoading(false);
                    return;
                }
            } catch (err) {
                console.warn("Backend submit error, using fallback logic:", err);
            }
        }

        // Offline / Fallback handling
        setTimeout(() => {
            const feedbackMsg: Message = {
                id: `f-${currentQuestionIndex}`,
                type: 'feedback',
                text: "Good effort! Your response demonstrates understanding of key technical concepts. Work on incorporating practical trade-offs for deeper impact.",
                timestamp: new Date().toLocaleTimeString()
            };

            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < domain.questions.length) {
                const nextQMsg: Message = {
                    id: `q-${nextIndex}`,
                    type: 'question',
                    text: domain.questions[nextIndex],
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages((prev) => [...prev, feedbackMsg, nextQMsg]);
                setCurrentQuestionIndex(nextIndex);
            } else {
                const finalMsgs = [...updatedMessages, feedbackMsg];
                setMessages(finalMsgs);
                setCurrentQuestionIndex(3);
                setIsCompleted(true);

                const userAnswersText = finalMsgs.filter(m => m.type === 'answer').map(m => m.text).join(' ');
                const wordsCount = userAnswersText.trim().split(/\s+/).length;
                let fallbackScore = wordsCount < 15 ? 40 : wordsCount < 40 ? 72 : 88;

                const fallbackBreakdown = {
                    technicalAccuracy: fallbackScore,
                    communicationClarity: Math.min(98, fallbackScore + 5),
                    problemSolving: Math.max(20, fallbackScore - 5)
                };

                setFinalEvaluation({
                    score: fallbackScore,
                    technicalAccuracy: fallbackBreakdown.technicalAccuracy,
                    communicationClarity: fallbackBreakdown.communicationClarity,
                    problemSolving: fallbackBreakdown.problemSolving
                });
                saveInterviewToBackend(domain.title, timerSeconds, fallbackScore, finalMsgs, fallbackBreakdown);
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleExit = () => {
        if (confirm("Are you sure you want to exit the current interview session?")) {
            router.push('/dashboard');
        }
    };

    return (
        <div className="h-screen h-[100dvh] flex flex-col bg-gray-50/50 overflow-hidden">
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

            <main className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto p-4 md:p-6 space-y-4">
                {!isCompleted ? (
                    <>
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}

                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-gray-100 text-gray-500 px-5 py-3 rounded-2xl text-xs font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                                    <span>AI Evaluator is analyzing your answer...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} className="h-4 w-full shrink-0" />
                    </>
                ) : (
                    <InterviewCompletion
                        domainTitle={domain.title}
                        domainIcon={domain.icon}
                        domainIconBg={domain.iconBg}
                        score={finalEvaluation.score}
                        totalQuestions={3}
                        timerSeconds={timerSeconds || 95}
                        technicalAccuracy={finalEvaluation.technicalAccuracy}
                        communicationClarity={finalEvaluation.communicationClarity}
                        problemSolving={finalEvaluation.problemSolving}
                        onGoToDashboard={() => router.push('/dashboard')}
                        onRestart={() => {
                            setCurrentQuestionIndex(0);
                            setTimerSeconds(0);
                            setIsCompleted(false);
                            setMessages([{
                                id: 'q-0',
                                type: 'question',
                                text: domain.questions[0],
                                timestamp: new Date().toLocaleTimeString()
                            }]);
                        }}
                    />
                )}
            </main>

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
                <p className="text-gray-500 text-sm font-medium">Loading interview session...</p>
            </div>
        }>
            <InterviewSessionContent />
        </Suspense>
    );
};

export default Page;
