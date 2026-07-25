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
                        {navigationLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link 
                                    key={link.label}
                                    href={link.href}
                                    className={`px-4 py-2 text-sm font-semibold tracking-wide rounded-[50px] transition-all ${
                                        active 
                                            ? 'bg-[#e0dbce] text-[#2c2e2a]' 
                                            : 'text-[#2c2e2a] hover:bg-[#f5f1e4]'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        
                        {!isLoggedIn ? (
                            <div className="hidden md:flex items-center gap-3">
                                <Link 
                                    href="/login" 
                                    className="px-4 py-2 text-sm font-bold text-[#2c2e2a] hover:bg-[#f5f1e4] rounded-[50px] transition-colors"
                                >
                                    Login
                                </Link>
                                
                                {/* Pill button with circular icon dot affordance at right edge */}
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
                                    <span className="text-xs font-bold text-[#2c2e2a] max-w-[80px] truncate">{user?.username || 'User'}</span>
                                    <div className="w-7 h-7 rounded-full overflow-hidden border border-[#2c2e2a] bg-[#8ed462]">
                                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#2c2e2a]">
                                            {user?.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    </div>
                                </button>

                                {/* Dropdown Menu (White Card, Hairline Border) */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white border-2 border-[#2c2e2a] shadow-md rounded-[20px] py-2 z-50">
                                        <div className="px-4 py-3 border-b border-[#2c2e2a]/10 bg-[#f5f1e4]/50">
                                            <p className="text-xs font-bold text-[#2c2e2a] truncate">{user?.username || 'Alex Rivera'}</p>
                                            <p className="text-[11px] text-[#80827f] truncate">{user?.email || 'alex@aiinterviewer.com'}</p>
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
                                                    logout();
                                                    setIsProfileOpen(false);
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

                        {/* Mobile Menu Toggle Button (Fresh Grass filled circle, 40px diameter) */}
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

            {/* Mobile Drawer (Rounded Top Card sliding in) */}
            <div 
                className={`fixed inset-x-0 bottom-4 mx-auto w-[92%] max-w-[500px] bg-white border-2 border-[#2c2e2a] rounded-[30px] p-6 shadow-2xl z-[60] transform transition-transform duration-300 ease-out md:hidden ${
                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'
                }`}
            >
                <div className="flex flex-col gap-4">
                    {/* Header */}
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

                    {/* Navigation list */}
                    <nav className="flex flex-col gap-1.5">
                        {navigationLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link 
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-2.5 rounded-[12px] text-sm font-bold transition-all ${
                                        active 
                                            ? 'bg-[#e0dbce] text-[#2c2e2a]' 
                                            : 'text-[#2c2e2a] hover:bg-[#f5f1e4]'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="pt-4 border-t border-[#2c2e2a]/10 flex flex-col gap-2.5">
                        {!isLoggedIn ? (
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

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/25 backdrop-blur-sm z-[55] md:hidden"
                />
            )}
        </>
    );
};

export default Navbar;