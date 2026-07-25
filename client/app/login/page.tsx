"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/Authcontext';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, ArrowRight, Lock, Mail } from 'lucide-react';

const Page = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        
        if (!formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f1e4] text-[#2c2e2a] font-sans flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-10 left-10 w-24 h-24 rounded-[30px] border-2 border-[#2c2e2a]/5 bg-white/20 transform rotate-12 pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-2 border-[#2c2e2a]/5 bg-white/20 pointer-events-none"></div>

            {/* Back Home floating button */}
            <Link 
                href="/" 
                className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#2c2e2a] rounded-[50px] text-xs font-bold hover:bg-[#f5f1e4] transition-all"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
            </Link>

            {/* Clean White Card */}
            <div className="w-full max-w-[500px] bg-white border-2 border-[#2c2e2a] rounded-[50px] p-8 md:p-10 shadow-sm relative z-10 space-y-6">
                
                {/* Visual Avatar / Greeting */}
                <div className="flex flex-col items-center text-center space-y-4">
                    {/* SVG Greeting Avatar */}
                    <div className="w-16 h-16 bg-[#8ed462] border-2 border-[#2c2e2a] rounded-full flex items-center justify-center overflow-hidden">
                        <svg className="w-10 h-10 text-[#2c2e2a]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="currentColor"/>
                            <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                        </svg>
                    </div>
                    
                    <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2ba0ff]/10 text-[#2ba0ff] border border-[#2ba0ff]/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Secure Access
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-[#2c2e2a] tracking-tight">Sign In</h2>
                        <p className="text-xs text-[#80827f] font-semibold">Welcome back to AI Interviewer</p>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-4 bg-[#ff705d]/10 border border-[#ff705d]/20 rounded-[15px] text-xs font-bold text-[#ff705d] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#ff705d] rounded-full border border-[#2c2e2a]"></span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Form Controls */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-[#2c2e2a]">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#2c2e2a]">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="name@company.com"
                                value={formData.email} 
                                onChange={handleChange} 
                                disabled={isLoading}
                                className="w-full pl-10 pr-4 py-3 bg-[#e0dbce]/40 border-2 border-transparent focus:border-[#2c2e2a] rounded-[10px] text-sm text-[#2c2e2a] font-semibold placeholder-[#80827f] focus:outline-none transition-all" 
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-[#2c2e2a]">
                                Password
                            </label>
                            <Link href="#" className="text-[10px] font-bold text-[#2ba0ff] hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#2c2e2a]">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="••••••••"
                                value={formData.password} 
                                onChange={handleChange} 
                                disabled={isLoading}
                                className="w-full pl-10 pr-4 py-3 bg-[#e0dbce]/40 border-2 border-transparent focus:border-[#2c2e2a] rounded-[10px] text-sm text-[#2c2e2a] font-semibold placeholder-[#80827f] focus:outline-none transition-all" 
                            />
                        </div>
                    </div>

                    {/* Submit Action */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full mt-4 py-3.5 px-4 bg-[#8ed462] hover:bg-[#8ed462]/90 disabled:opacity-50 text-[#2c2e2a] border-2 border-[#2c2e2a] text-sm font-bold rounded-[50px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-[#2c2e2a]" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Verifying credentials...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <span className="w-2 h-2 bg-[#2ba0ff] rounded-full border border-[#2c2e2a]"></span>
                            </>
                        )}
                    </button>
                </form>

                {/* Redirect Footer */}
                <div className="text-center text-xs font-semibold text-[#80827f] pt-4 border-t border-[#2c2e2a]/10 flex items-center justify-center gap-1.5">
                    <span>New to AI Interviewer?</span>
                    <Link href="/register" className="text-[#2ba0ff] hover:underline font-bold">
                        Create Account
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Page;