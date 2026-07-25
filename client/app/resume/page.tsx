"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/Authcontext';
import { ResumeAnalysisSection } from '@/components/resume/ResumeAnalysisSection';

export default function ResumePage() {
    const router = useRouter();
    const { isLoggedIn, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoading, isLoggedIn, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-sm font-medium text-gray-500">Loading auth state...</p>
            </div>
        );
    }

    if (!isLoggedIn) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#2c2e2a]">Resume Intelligence</h2>
                        <p className="text-xs text-gray-400">AI-powered skill extraction and domain mapping</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-full transition-all shadow-xs active:scale-95"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <ResumeAnalysisSection />
            </div>
        </div>
    );
}
