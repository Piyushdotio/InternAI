"use client"

import React from 'react';

interface InterviewCompletionProps {
    domainTitle: string;
    domainIcon?: string;
    domainIconBg?: string;
    score: number;
    totalQuestions?: number;
    timerSeconds: number;
    technicalAccuracy?: number;
    communicationClarity?: number;
    problemSolving?: number;
    onGoToDashboard: () => void;
    onRestart: () => void;
}

export const InterviewCompletion: React.FC<InterviewCompletionProps> = ({
    domainTitle,
    domainIcon = '🟨',
    score = 10,
    totalQuestions = 3,
    timerSeconds = 95,
    technicalAccuracy = 15,
    communicationClarity = 2,
    problemSolving = 12,
    onGoToDashboard,
    onRestart,
}) => {
    // Format duration MM:SS
    const formatDuration = (totalSecs: number) => {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate SVG circle progress stroke
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    // Map score safely to 0-100 percentage
    const displayScorePercentage = score <= 10 ? score * 10 : Math.min(100, Math.max(0, score));
    const strokeDashoffset = circumference - (displayScorePercentage / 100) * circumference;

    const shortDomainName = domainTitle.split('/')[0].split(' ')[0];


    return (
        <div className="max-w-md mx-auto my-6 space-y-4 animate-fade-in pb-12">
            {/* Top Main Score Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200/80 text-center space-y-6 relative overflow-hidden">
                <div className="space-y-1">
                    <div className="text-3xl mb-1">🎉</div>
                    <h2 className="text-2xl font-extrabold text-[#2c2e2a]">Interview Complete!</h2>
                    <p className="text-xs text-gray-400 font-medium">Here's how you performed</p>
                </div>

                {/* Circular Score Gauge */}
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        {/* Background track */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            className="text-gray-100"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                        />
                        {/* Progress arc */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            className="text-orange-500 transition-all duration-1000 ease-out"
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                        />
                    </svg>

                    {/* Score Text in Center */}
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-[#2c2e2a] leading-none">{displayScorePercentage}%</span>
                        <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mt-1">SCORE</span>
                    </div>

                </div>


                {/* Encouraging Footer Text */}
                <p className="text-xs font-semibold text-amber-600 bg-amber-50/70 py-2.5 px-4 rounded-full inline-block border border-amber-100">
                    Keep practicing! Every session makes you stronger 🧩
                </p>
            </div>

            {/* Middle 3 Metric Cards Grid */}
            <div className="grid grid-cols-3 gap-3">
                {/* Card 1: Questions */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 text-center shadow-xs flex flex-col items-center justify-center space-y-1">
                    <span className="text-red-500 font-bold text-lg">❓</span>
                    <span className="text-base font-bold text-[#2c2e2a]">{totalQuestions}</span>
                    <span className="text-[11px] font-medium text-gray-400">Questions</span>
                </div>

                {/* Card 2: Domain */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 text-center shadow-xs flex flex-col items-center justify-center space-y-1">
                    <span className="text-lg">{domainIcon}</span>
                    <span className="text-base font-bold text-[#2c2e2a] truncate max-w-full px-1">{shortDomainName}</span>
                    <span className="text-[11px] font-medium text-gray-400">Domain</span>
                </div>

                {/* Card 3: Duration */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 text-center shadow-xs flex flex-col items-center justify-center space-y-1">
                    <span className="text-gray-400 font-bold text-base">⏱</span>
                    <span className="text-base font-bold text-[#2c2e2a]">{formatDuration(timerSeconds)}</span>
                    <span className="text-[11px] font-medium text-gray-400">Duration</span>
                </div>
            </div>

            {/* Performance Breakdown Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#2c2e2a]">Performance Breakdown</h3>

                <div className="space-y-3.5">
                    {/* Competency 1 */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-500">Technical Accuracy</span>
                            <span className="font-bold text-[#2c2e2a]">{technicalAccuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-700"
                                style={{ width: `${technicalAccuracy}%` }}
                            />
                        </div>
                    </div>

                    {/* Competency 2 */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-500">Communication Clarity</span>
                            <span className="font-bold text-[#2c2e2a]">{communicationClarity}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-700"
                                style={{ width: `${communicationClarity}%` }}
                            />
                        </div>
                    </div>

                    {/* Competency 3 */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-500">Problem-Solving Approach</span>
                            <span className="font-bold text-[#2c2e2a]">{problemSolving}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-700"
                                style={{ width: `${problemSolving}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    onClick={onRestart}
                    className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-full text-sm transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
                >
                    <span>🔄</span> Try Again
                </button>
                <button
                    onClick={onGoToDashboard}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-full text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                >
                    Dashboard →
                </button>
            </div>
        </div>
    );
};
