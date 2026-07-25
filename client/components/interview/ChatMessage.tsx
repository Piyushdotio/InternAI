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
                        ? 'bg-gray-100/90 text-gray-800 border border-gray-200/60 rounded-bl-none font-sans'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none font-sans font-normal'
                }`}
            >
                {message.text}
            </div>
        </div>
    );
};
