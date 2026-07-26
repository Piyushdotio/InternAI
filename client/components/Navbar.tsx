'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/Authcontext';

const Navbar = () => {
    const { user, isLoggedIn, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const pathname = usePathname();
    const profileRef = useRef<HTMLDivElement>(null);

    const navigationLinks = [
        { label: "Home", href: "/" },
        { label: "Interview", href: "/dashboard" }, // Point to dashboard/interview
        { label: "About", href: "#" },
    ];

    const [isAboutOpen, setIsAboutOpen] = useState(false);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (href: string) => pathname === href;

    return (
        <>
            <header className="fixed top-4 inset-x-0 z-50 w-[92%] max-w-[1200px] mx-auto">
                {/* Floating White Nav Pill */}
                <div className="bg-white rounded-[50px] border-2 border-[#2c2e2a] px-5 py-3 flex items-center justify-between transition-all duration-300">
                    
                    {/* Logo / Brand */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {/* Rounded square container */}
                        <div className="w-10 h-10 bg-[#8ed462] border-2 border-[#2c2e2a] rounded-[12px] flex items-center justify-center shrink-0">
                            {/* SVG Logo - papercut leaf/AI brain icon */}
                            <svg className="w-6 h-6 text-[#2c2e2a]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12M12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                                <path d="M12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12" fill="currentColor"/>
                            </svg>
                        </div>
                        <span className="font-sans font-extrabold text-lg tracking-tight text-[#2c2e2a]">
                            AI <span className="text-[#8ed462] filter brightness-90">Interviewer</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Link 
                            href="/"
                            className={`px-4 py-2 text-sm font-semibold tracking-wide rounded-[50px] transition-all ${
                                isActive('/') 
                                    ? 'bg-[#e0dbce] text-[#2c2e2a]' 
                                    : 'text-[#2c2e2a] hover:bg-[#f5f1e4]'
                            }`}
                        >
                            Home
                        </Link>
                        <Link 
                            href={isLoggedIn ? "/dashboard" : "/login"}
                            className={`px-4 py-2 text-sm font-semibold tracking-wide rounded-[50px] transition-all ${
                                isActive('/dashboard') || isActive('/interview')
                                    ? 'bg-[#e0dbce] text-[#2c2e2a]' 
                                    : 'text-[#2c2e2a] hover:bg-[#f5f1e4]'
                            }`}
                        >
                            Interview
                        </Link>

                        <button
                            onClick={() => setIsAboutOpen(true)}
                            className="px-4 py-2 text-sm font-semibold tracking-wide text-[#2c2e2a] hover:bg-[#f5f1e4] rounded-[50px] transition-all cursor-pointer"
                        >
                            About
                        </button>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        
                        {(!isLoggedIn || !user) ? (
                            <div className="hidden md:flex items-center gap-3">
                                <Link 
                                    href="/login" 
                                    className="px-4 py-2 text-sm font-bold text-[#2c2e2a] hover:bg-[#f5f1e4] rounded-[50px] transition-colors"
                                >
                                    Login
                                </Link>
                                
                                <Link 
                                    href="/register" 
                                    className="px-5 py-2 text-sm font-bold text-[#2c2e2a] border-2 border-[#2c2e2a] rounded-[50px] hover:bg-[#f5f1e4] transition-all flex items-center gap-2"
                                >
                                    <span>Register</span>
                                    <span className="w-2.5 h-2.5 bg-[#2ba0ff] rounded-full border border-[#2c2e2a]"></span>
                                </Link>
                            </div>
                        ) : (
                            /* Logged In Profile Dropdown */
                            <div className="relative hidden md:block" ref={profileRef}>
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-[50px] border-2 border-[#2c2e2a] hover:bg-[#f5f1e4] transition-all cursor-pointer"
                                >
                                    <span className="text-xs font-bold text-[#2c2e2a] max-w-[80px] truncate">{user.username}</span>
                                    <div className="w-7 h-7 rounded-full overflow-hidden border border-[#2c2e2a] bg-[#8ed462]">
                                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#2c2e2a]">
                                            {user.username[0]?.toUpperCase()}
                                        </div>
                                    </div>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white border-2 border-[#2c2e2a] shadow-md rounded-[20px] py-2 z-50">
                                        <div className="px-4 py-3 border-b border-[#2c2e2a]/10 bg-[#f5f1e4]/50">
                                            <p className="text-xs font-bold text-[#2c2e2a] truncate">{user.username}</p>
                                            <p className="text-[11px] text-[#80827f] truncate">{user.email}</p>
                                        </div>
                                        <div className="p-1.5 space-y-1">
                                            <Link 
                                                href="/dashboard" 
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#2c2e2a] hover:bg-[#f5f1e4] rounded-[10px] transition-colors"
                                            >
                                                <span className="w-2 h-2 bg-[#8ed462] rounded-full"></span>
                                                Dashboard
                                            </Link>
                                            <button 
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-[10px] transition-colors text-left cursor-pointer"
                                            >
                                                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                        {/* Mobile Menu Toggle Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="w-10 h-10 bg-[#8ed462] border-2 border-[#2c2e2a] rounded-full flex items-center justify-center text-[#2c2e2a] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                )}
                            </svg>
                        </button>

                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <div 
                className={`fixed inset-x-0 bottom-4 mx-auto w-[92%] max-w-[500px] bg-white border-2 border-[#2c2e2a] rounded-[30px] p-6 shadow-2xl z-[60] transform transition-transform duration-300 ease-out md:hidden ${
                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'
                }`}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center pb-2 border-b border-[#2c2e2a]/10">
                        <span className="font-extrabold text-md text-[#2c2e2a] flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-[#8ed462] rounded-full border border-[#2c2e2a]"></span>
                            Menu Navigation
                        </span>
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-1 rounded-full text-[#80827f] hover:text-[#2c2e2a] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="flex flex-col gap-1.5">
                        <Link 
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-4 py-2.5 rounded-[12px] text-sm font-bold text-[#2c2e2a] hover:bg-[#f5f1e4]"
                        >
                            Home
                        </Link>
                        <Link 
                            href={isLoggedIn ? "/dashboard" : "/login"}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-4 py-2.5 rounded-[12px] text-sm font-bold text-[#2c2e2a] hover:bg-[#f5f1e4]"
                        >
                            Interview
                        </Link>

                        <button 
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsAboutOpen(true);
                            }}
                            className="px-4 py-2.5 rounded-[12px] text-sm font-bold text-[#2c2e2a] hover:bg-[#f5f1e4] text-left cursor-pointer"
                        >
                            About
                        </button>
                    </nav>

                    <div className="pt-4 border-t border-[#2c2e2a]/10 flex flex-col gap-2.5">
                        {!isLoggedIn || !user ? (
                            <>


                                <Link 
                                    href="/login" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-2.5 text-center text-sm font-bold text-[#2c2e2a] hover:bg-[#f5f1e4] rounded-[50px] transition-all"
                                >
                                    Login
                                </Link>
                                <Link 
                                    href="/register" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-2.5 text-center text-sm font-bold text-[#2c2e2a] border-2 border-[#2c2e2a] bg-[#8ed462] hover:opacity-95 rounded-[50px] transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Register</span>
                                    <span className="w-2.5 h-2.5 bg-[#2ba0ff] rounded-full border border-[#2c2e2a]"></span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="px-4 py-2 bg-[#f5f1e4] rounded-[15px] mb-1">
                                    <p className="text-[10px] font-bold text-[#80827f]">Logged in as</p>
                                    <p className="text-xs font-bold text-[#2c2e2a] truncate">{user?.username}</p>
                                    <p className="text-[10px] text-[#80827f] truncate">{user?.email}</p>
                                </div>
                                <Link 
                                    href="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-2.5 text-center text-sm font-bold text-[#2c2e2a] border-2 border-[#2c2e2a] rounded-[50px] transition-all"
                                >
                                    Go to Dashboard
                                </Link>
                                <button 
                                    onClick={() => {
                                        logout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full py-2.5 text-center text-sm font-bold text-red-500 bg-red-50 rounded-[50px] transition-all cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/25 backdrop-blur-sm z-[55] md:hidden"
                />
            )}

            {/* Humanized About Modal (Matching Cream Paper & Storybook Theme) */}
            {isAboutOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div 
                        onClick={() => setIsAboutOpen(false)} 
                        className="absolute inset-0 bg-[#2c2e2a]/50 backdrop-blur-sm"
                    />
                    <div className="bg-[#f5f1e4] border-4 border-[#2c2e2a] rounded-[36px] w-full max-w-xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b-2 border-[#2c2e2a] bg-white">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#8ed462] border-2 border-[#2c2e2a] flex items-center justify-center text-xs font-black">
                                    🤖
                                </div>
                                <h3 className="font-extrabold text-[#2c2e2a] text-base">About AI Interviewer</h3>
                            </div>
                            <button 
                                onClick={() => setIsAboutOpen(false)}
                                className="w-8 h-8 rounded-full border-2 border-[#2c2e2a] bg-white text-[#2c2e2a] hover:bg-[#f5f1e4] font-bold text-sm flex items-center justify-center cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="space-y-2">
                                <span className="inline-block px-3 py-1 bg-[#8ed462]/30 border border-[#8ed462] rounded-full text-xs font-bold text-[#2c2e2a]">
                                    Personal Technical Coach 🌿
                                </span>
                                <h4 className="text-2xl font-black text-[#2c2e2a] tracking-tight">
                                    Building Confidence Through Intelligent Practice
                                </h4>
                                <p className="text-sm text-[#80827f] leading-relaxed font-medium">
                                    <strong>AI Interviewer</strong> was created to transform the way developers prepare for tech roles. Instead of static question lists, our platform uses <strong>Groq AI (Llama 3.3)</strong> to conduct live, adaptive mock interviews with real-time feedback, domain analytics, and resume skill mapping.
                                </p>
                            </div>

                            {/* Core Pillars Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                <div className="p-4 bg-white rounded-[20px] border-2 border-[#2c2e2a] space-y-1">
                                    <span className="text-xl">⚡</span>
                                    <p className="text-xs font-bold text-[#2c2e2a]">Groq AI Engine</p>
                                    <p className="text-[11px] text-[#80827f]">Real-time question & feedback generation</p>
                                </div>
                                <div className="p-4 bg-white rounded-[20px] border-2 border-[#2c2e2a] space-y-1">
                                    <span className="text-xl">📄</span>
                                    <p className="text-xs font-bold text-[#2c2e2a]">Resume Parser</p>
                                    <p className="text-[11px] text-[#80827f]">PDF skill extraction & domain recommendations</p>
                                </div>
                                <div className="p-4 bg-white rounded-[20px] border-2 border-[#2c2e2a] space-y-1">
                                    <span className="text-xl">📊</span>
                                    <p className="text-xs font-bold text-[#2c2e2a]">Score Analytics</p>
                                    <p className="text-[11px] text-[#80827f]">Technical accuracy & clarity breakdown</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-white border-t-2 border-[#2c2e2a] flex items-center justify-between">
                            <span className="text-xs font-bold text-[#80827f]">Designed for modern engineers</span>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsAboutOpen(false)}
                                    className="px-4 py-2 rounded-[50px] border-2 border-[#2c2e2a] bg-white hover:bg-[#f5f1e4] text-xs font-bold text-[#2c2e2a] cursor-pointer"
                                >
                                    Close
                                </button>
                                <Link
                                    href={isLoggedIn ? "/dashboard" : "/login"}
                                    onClick={() => setIsAboutOpen(false)}
                                    className="px-5 py-2 rounded-[50px] border-2 border-[#2c2e2a] bg-[#8ed462] hover:bg-[#8ed462]/90 text-xs font-bold text-[#2c2e2a] flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Try Interview Now</span>
                                    <span className="w-1.5 h-1.5 bg-[#2ba0ff] rounded-full"></span>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;