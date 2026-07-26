"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

export interface ResumeAnalysisData {
    summary: string;
    experienceLevel: string;
    skillsDetected: string[];
    strengths: string[];
    recommendedDomains: {
        label: string;
        reason: string;
        confidence: number;
    }[];
}

export const ResumeAnalysisSection: React.FC = () => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [analysis, setAnalysis] = useState<ResumeAnalysisData | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');

    // Load persisted analysis on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('ai_resume_analysis');
            if (saved) {
                setAnalysis(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Error reading saved analysis:", e);
        }
    }, []);

    // Simulated progress bar animation while analyzing
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAnalyzing) {
            setProgress(5);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 92) return 92;
                    return prev + Math.floor(Math.random() * 8) + 3;
                });
            }, 400);
        } else {
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [isAnalyzing]);

    // Handle file selection and immediate Groq analysis
    const handleFileSelect = async (selectedFile: File) => {
        if (!selectedFile) return;

        if (selectedFile.size > 5 * 1024 * 1024) {
            setErrorMsg("File size exceeds 5MB limit.");
            return;
        }

        setErrorMsg('');
        setFile(selectedFile);
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('resume', selectedFile);

        try {
            const res = await axiosInstance.post('/api/resume/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data && res.data.analysis) {
                setProgress(100);
                setTimeout(() => {
                    setAnalysis(res.data.analysis);
                    localStorage.setItem('ai_resume_analysis', JSON.stringify(res.data.analysis));
                    setIsAnalyzing(false);
                }, 400);
            } else {
                throw new Error("Analysis failed");
            }
        } catch (err: any) {
            console.error("Backend resume analysis failed:", err);
            setErrorMsg(err.response?.data?.error || err.message || "Failed to analyze resume. Please ensure you upload a valid PDF or TXT file.");
            setIsAnalyzing(false);
            setProgress(0);
        }
    };


    const triggerFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const getDomainKey = (label: string): string => {
        const l = label.toLowerCase();
        if (l.includes('react')) return 'react';
        if (l.includes('javascript') || l.includes('node')) return 'javascript-node';
        if (l.includes('python')) return 'python';
        if (l.includes('data science')) return 'data-science';
        if (l.includes('devops')) return 'devops';
        if (l.includes('system design')) return 'system-design';
        if (l.includes('database')) return 'database-design';
        return 'general';
    };

    const getDomainIcon = (label: string): { icon: string; bg: string } => {
        const l = label.toLowerCase();
        if (l.includes('react')) return { icon: '⚛️', bg: 'bg-purple-100 text-purple-600' };
        if (l.includes('javascript') || l.includes('node')) return { icon: '🟨', bg: 'bg-yellow-400 text-black font-bold' };
        if (l.includes('python')) return { icon: '🐍', bg: 'bg-green-100 text-green-700' };
        if (l.includes('data science')) return { icon: '📊', bg: 'bg-blue-100 text-blue-600' };
        if (l.includes('devops')) return { icon: '⚙️', bg: 'bg-gray-100 text-gray-700' };
        if (l.includes('system design')) return { icon: '🏗️', bg: 'bg-amber-100 text-amber-700' };
        if (l.includes('database')) return { icon: '🗄️', bg: 'bg-emerald-100 text-emerald-700' };
        return { icon: '🎯', bg: 'bg-orange-100 text-orange-600' };
    };

    return (
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            {/* Top Card Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg text-blue-600 shadow-xs">
                        📄
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-[#2c2e2a]">AI Resume Analysis</h3>
                        <p className="text-xs text-gray-400 font-medium">Upload your resume - Get domain recommendations</p>
                    </div>
                </div>

                {/* Upload New Button when result is displayed */}
                {analysis && !isAnalyzing && (
                    <button
                        onClick={triggerFilePicker}
                        className="text-xs font-bold text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                    >
                        <span>Upload new</span>
                        <span>↑</span>
                    </button>
                )}
            </div>

            {/* Hidden Native File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                    }
                }}
            />

            {/* ------------------------------------------------------------- */}
            {/* STATE 1: LOADING SCREEN (Matching Screenshot 1)               */}
            {/* ------------------------------------------------------------- */}
            {isAnalyzing && (
                <div className="py-16 flex flex-col items-center justify-center space-y-5 text-center animate-in fade-in duration-300">
                    {/* Animated Spinner with Groq Logo */}
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-xs border border-gray-100">
                            🤖
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-lg font-bold text-[#2c2e2a]">Groq AI is reading your resume...</h4>
                        <p className="text-xs text-gray-400 font-medium">Detecting skills & technologies...</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-72 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="text-[11px] text-gray-400 font-medium">This usually takes 5 - 10 seconds</p>
                </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STATE 2: EMPTY / UPLOAD PROMPT                                */}
            {/* ------------------------------------------------------------- */}
            {!isAnalyzing && !analysis && (
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={triggerFilePicker}
                    className="border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/20 hover:bg-blue-50/40 rounded-3xl p-10 md:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 group"
                >
                    <div className="w-16 h-16 bg-blue-100/80 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center text-3xl transition-all shadow-sm">
                        📄
                    </div>
                    <div className="space-y-1 max-w-sm">
                        <h4 className="text-lg font-bold text-[#2c2e2a] group-hover:text-blue-600 transition-colors">
                            Upload your Resume
                        </h4>
                        <p className="text-xs text-gray-500">
                            Drag and drop your PDF or TXT resume here, or click to browse files
                        </p>
                    </div>

                    {errorMsg && (
                        <p className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                            {errorMsg}
                        </p>
                    )}

                    <button
                        type="button"
                        className="bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-sm transition-all active:scale-95"
                    >
                        Browse Resume File
                    </button>
                    <p className="text-[11px] text-gray-400">Supports PDF or TXT up to 5MB</p>
                </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STATE 3: ANALYSIS RESULT VIEW (Matching Screenshot 2)         */}
            {/* ------------------------------------------------------------- */}
            {!isAnalyzing && analysis && (
                <div className="space-y-6 animate-in fade-in duration-300">

                    {/* Section 1: AI Summary Card */}
                    <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-5 md:p-6 space-y-2 relative">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-[#2c2e2a] flex items-center gap-2">
                                <span>🧠</span>
                                <span>AI Summary</span>
                            </h4>
                            <span className="bg-blue-100/80 text-blue-700 border border-blue-200/60 text-xs font-bold px-3 py-0.5 rounded-full">
                                {analysis.experienceLevel || "Mid Level"}
                            </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-normal">
                            {analysis.summary}
                        </p>
                    </div>

                    {/* Section 2: Skills Detected */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#2c2e2a] flex items-center gap-2">
                            <span>🛠</span>
                            <span>Skills Detected</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.skillsDetected?.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="bg-blue-50/90 text-blue-700 border border-blue-200/50 text-xs font-semibold px-3 py-1 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Recommended Interview Domains */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#2c2e2a] flex items-center gap-2">
                            <span>🎯</span>
                            <span>Recommended Interview Domains</span>
                        </h4>

                        <div className="space-y-3">
                            {analysis.recommendedDomains?.map((domain, idx) => {
                                const { icon, bg } = getDomainIcon(domain.label);
                                const isTopPick = idx === 0;

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => router.push(`/interview?domain=${getDomainKey(domain.label)}`)}
                                        className="bg-white border border-gray-200/80 hover:border-blue-400 hover:bg-blue-50/20 p-4 md:p-5 rounded-2xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-xs"
                                    >
                                        <div className="flex items-start gap-3.5 flex-1">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base shadow-xs shrink-0 mt-0.5 ${bg}`}>
                                                {icon}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {isTopPick && (
                                                        <span className="bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                                                            TOP PICK
                                                        </span>
                                                    )}
                                                    <h5 className="font-bold text-[#2c2e2a] text-sm group-hover:text-blue-600 transition-colors">
                                                        {domain.label}
                                                    </h5>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-normal">
                                                    {domain.reason}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Score Bar & Percentage */}
                                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                            <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-blue-600 h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${domain.confidence}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-blue-600 min-w-[32px] text-right">
                                                {domain.confidence}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 4: Your Strengths */}
                    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
                        <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                            <span>✅</span>
                            <span>Your Strengths</span>
                        </h4>
                        <ul className="space-y-1.5">
                            {analysis.strengths?.map((str, idx) => (
                                <li key={idx} className="text-xs font-semibold text-emerald-900 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                    <span>{str}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer text */}
                    <p className="text-center text-xs text-gray-400 font-medium pt-2">
                        Click any domain above to start a tailored interview session
                    </p>

                </div>
            )}
        </div>
    );
};
