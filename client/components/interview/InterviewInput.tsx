"use client"

import React, { useState } from 'react';

interface InterviewInputProps {
    onSubmit: (answer: string) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export const InterviewInput: React.FC<InterviewInputProps> = ({
    onSubmit,
    isLoading,
    disabled = false,
}) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || disabled) return;
        onSubmit(input.trim());
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-30 shadow-lg">
            <div className="max-w-4xl mx-auto space-y-2">
                {/* Tip Line */}
                <div className="text-center text-xs text-gray-500 font-medium flex items-center justify-center gap-1.5">
                    <span>💡</span>
                    <span>Tip: Be specific and use examples from your experience for stronger answers</span>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your answer here..."
                            disabled={isLoading || disabled}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 pr-12"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading || disabled}
                        className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white flex items-center justify-center transition-all shadow-sm shrink-0 active:scale-95"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <span className="text-base font-bold">➔</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
