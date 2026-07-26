"use client"

import React from 'react';

interface InterviewHeaderProps {
    domainTitle: string;
    domainIcon: string;
    domainIconBg: string;
    currentQuestion: number;
    totalQuestions: number;
    timerSeconds: number;
    isCompleted?: boolean;
    onExit: () => void;
    onGoToDashboard?: () => void;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({
    domainTitle,
    domainIcon,
    domainIconBg,
    currentQuestion,
    totalQuestions,
    timerSeconds,
    isCompleted = false,
    onExit,
    onGoToDashboard,
}) => {
    // Format seconds into MM:SS
    const formatTime = (totalSecs: number) => {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <header className="bg-white border-b border-gray-100 px-6 py-4 shrink-0 shadow-xs flex flex-wrap items-center justify-between gap-4 z-40">

            {/* Left: Domain Info & Live Badge */}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${domainIconBg}`}>
                    {domainIcon}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold text-gray-900">{domainTitle} Interview</h1>
                        {!isCompleted && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 font-medium">AI Mock Interview Session</p>
                </div>
            </div>

            {/* Center: Question Progress Indicator */}
            {!isCompleted && (
                <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalQuestions }).map((_, index) => {
                            const qNum = index + 1;
                            const isActive = qNum === currentQuestion;
                            const isCompleted = qNum < currentQuestion;

                            return (
                                <div
                                    key={qNum}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        isActive
                                            ? 'w-7 bg-blue-500'
                                            : isCompleted
                                            ? 'w-3 bg-blue-300'
                                            : 'w-3 bg-gray-200'
                                    }`}
                                />
                            );
                        })}
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                        Question {Math.min(currentQuestion, totalQuestions)} of {totalQuestions}
                    </span>
                </div>
            )}

            {/* Right: Timer & Exit/Dashboard Button */}
            <div className="flex items-center gap-3">
                {!isCompleted ? (
                    <>
                        <div className="flex items-center gap-1.5 bg-gray-100/80 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold text-gray-700">
                            <span>⏱</span>
                            <span>{formatTime(timerSeconds)}</span>
                        </div>
                        <button
                            onClick={onExit}
                            className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-full transition-colors"
                        >
                            Exit
                        </button>
                    </>
                ) : (
                    <button
                        onClick={onGoToDashboard || onExit}
                        className="text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
                    >
                        Go to Dashboard
                    </button>
                )}
            </div>
        </header>
    );
};
