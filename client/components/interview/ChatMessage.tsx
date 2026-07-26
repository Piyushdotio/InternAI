"use client"

import React from 'react';

export interface Message {
    id: string;
    type: 'question' | 'answer' | 'feedback';
    text: string;
    timestamp?: string;
}

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUserAnswer = message.type === 'answer';

    return (
        <div
            className={`flex w-full ${
                isUserAnswer ? 'justify-end' : 'justify-start'
            } mb-4 animate-fade-in`}
        >
            <div
                className={`max-w-2xl px-5 py-4 rounded-2xl text-sm leading-relaxed ${
                    isUserAnswer
                        ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                        : message.type === 'feedback'
                        ? 'bg-amber-50/60 text-gray-800 border border-amber-200/60 rounded-bl-none'
                        : 'bg-white text-gray-900 border border-blue-100 shadow-sm rounded-bl-none font-medium'
                }`}
            >
                {message.type === 'question' && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 mb-1.5">
                        <span>🤖 Question</span>
                    </div>
                )}
                {message.type === 'feedback' && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-1.5">
                        <span>💡 Feedback</span>
                    </div>
                )}
                {message.text}
            </div>
        </div>
    );
};

