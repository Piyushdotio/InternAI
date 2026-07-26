"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/Authcontext';
import axiosInstance from '@/lib/axios';
import { ResumeAnalysisSection } from '@/components/resume/ResumeAnalysisSection';

interface interview {
    id: string;
    date: string;
    duration: number;
    score: string | number;
    topic: string;
}

interface ResumeAnalysis {
    summary: string;
    strength: string[];
    recommendation: { label: string; reason: string; confidence: number }[];
    experienceLevel: "junior" | "mid" | "senior";
    skillsDetected: string[];
}

interface DomainOption {
    id: string;
    title: string;
    description: string;
    iconBg: string;
    icon: string;
}

const domainsList: DomainOption[] = [
    {
        id: 'javascript-node',
        title: 'JavaScript/Node.js',
        description: 'ES6+, async, Node runtime',
        iconBg: 'bg-yellow-400 text-black font-extrabold',
        icon: 'JS',
    },
    {
        id: 'react',
        title: 'React',
        description: 'Hooks, state, lifecycle',
        iconBg: 'bg-purple-100 text-purple-600',
        icon: '⚛️',
    },
    {
        id: 'python',
        title: 'Python',
        description: 'OOP, data structures, stdlib',
        iconBg: 'bg-green-100 text-green-700',
        icon: '🐍',
    },
    {
        id: 'data-science',
        title: 'Data Science',
        description: 'ML, pandas, statistics',
        iconBg: 'bg-blue-100 text-blue-600',
        icon: '📊',
    },
    {
        id: 'devops',
        title: 'DevOps',
        description: 'CI/CD, Docker, Kubernetes',
        iconBg: 'bg-gray-100 text-gray-700',
        icon: '⚙️',
    },
    {
        id: 'system-design',
        title: 'System Design',
        description: 'Scalability, architecture',
        iconBg: 'bg-amber-100 text-amber-700',
        icon: '🏗️',
    },
    {
        id: 'database-design',
        title: 'Database Design',
        description: 'SQL, NoSQL, indexing',
        iconBg: 'bg-emerald-100 text-emerald-700',
        icon: '🗄️',
    },
    {
        id: 'general',
        title: 'General',
        description: 'Behavioural & fundamentals',
        iconBg: 'bg-orange-100 text-orange-600',
        icon: '🎯',
    },
];

const Page = () => {
    const router = useRouter();
    const { isLoggedIn, isLoading: authLoading, user } = useAuth();
    const [interviews, setInterviews] = useState<interview[]>([]);
    const [filterDomain, setFilterDomain] = useState<string>("All");
    const [activeTab, setActiveTab] = useState<'history' | 'resume'>('history');
    const [isDomainModalOpen, setIsDomainModalOpen] = useState<boolean>(false);

    useEffect(() => {
        // Redirect if auth check is done and user is not logged in
        if (!authLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [authLoading, isLoggedIn, router]);

    // Fetch interviews from backend API & localStorage fallback
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axiosInstance.get('/api/interview');
                const data = res.data;
                if (data.success && Array.isArray(data.interviews) && data.interviews.length > 0) {
                    setInterviews(data.interviews);
                    localStorage.setItem('ai_interview_history', JSON.stringify(data.interviews));
                    return;
                }
            } catch (e) {
                console.warn("Backend fetch failed, using local storage fallback:", e);
            }

            // Fallback to localStorage if backend returns empty or offline
            try {
                const stored = localStorage.getItem('ai_interview_history');
                if (stored) {
                    setInterviews(JSON.parse(stored));
                } else {
                    const initialSession: interview[] = [
                        {
                            id: 'session-default-1',
                            topic: 'JavaScript/Node.js',
                            date: '31 May 2026',
                            duration: 2,
                            score: 85,
                        }
                    ];
                    setInterviews(initialSession);
                    localStorage.setItem('ai_interview_history', JSON.stringify(initialSession));

                }
            } catch (err) {
                console.error("Local storage error:", err);
            }
        };

        if (isLoggedIn) {
            fetchHistory();
        }
    }, [isLoggedIn]);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-medium text-gray-600">Loading auth state...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    const totalSessions = interviews.length;

    const avgScore = interviews.length
        ? Math.round(
            interviews.reduce((s, i) => s + Number(i.score || 0), 0) / interviews.length,
        )
        : 0;

    const totalMinutes = interviews.reduce((s, i) => s + (Number(i.duration) || 0), 0);

    const bestScore = interviews.length
        ? Math.max(...interviews.map((i) => Number(i.score || 0)))
        : 0;

    const uniqueDomains = [
        "All",
        ...Array.from(new Set(interviews.map((i) => i.topic)))
    ];

    const filtered = filterDomain === "All"
        ? interviews
        : interviews.filter((i) => i.topic === filterDomain);

    const firstName = user?.username ? user.username.split(' ')[0] : 'Girish';

    // Helper to get domain icon
    const getDomainIcon = (topic: string) => {
        const found = domainsList.find(d => topic.toLowerCase().includes(d.title.toLowerCase()) || d.title.toLowerCase().includes(topic.toLowerCase()));
        return found ? found.icon : '🟨';
    };

    // Helper to get domain key for router retake
    const getDomainKey = (topic: string) => {
        const found = domainsList.find(d => topic.toLowerCase().includes(d.title.toLowerCase()) || d.title.toLowerCase().includes(topic.toLowerCase()));
        return found ? found.id : 'javascript-node';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 relative">
            {/* Top Navigation & Header Section */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-6">
                <div className="space-y-3">
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-bold rounded-full transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                        <span>←</span>
                        <span>Back to Home</span>
                    </button>
                    <div>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                            <span>👏</span> Welcome back, {firstName}
                        </p>
                        <h2 className="text-3xl font-extrabold text-[#2c2e2a] tracking-tight">Your Dashboard</h2>
                    </div>
                </div>
                <button
                    onClick={() => setIsDomainModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium shadow-sm transition-all active:scale-95 self-start md:self-auto cursor-pointer"
                >
                    <span>⚡</span>
                    <span>New Interview</span>
                </button>
            </section>

            {/* Overview Cards Matching Reference Image Design */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Total Sessions */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                        <span>Total Sessions</span>
                        <span className="text-base">📋</span>
                    </div>
                    <div>
                        <p className="text-3xl font-extrabold text-[#2c2e2a]">{totalSessions}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">
                            {totalSessions} {totalSessions === 1 ? 'session' : 'sessions'}
                        </p>
                    </div>
                </div>

                {/* Card 2: Average Score */}
                <div className="bg-blue-50/40 p-6 rounded-2xl border border-blue-100 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                        <span>Average Score</span>
                        <span className="text-base">📊</span>
                    </div>
                    <div>
                        <p className="text-3xl font-extrabold text-blue-600">{avgScore}%</p>
                        <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
                            Keep going 🦾
                        </p>
                    </div>
                </div>

                {/* Card 3: Best Score */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                        <span>Best Score</span>
                        <span className="text-base">🏆</span>
                    </div>
                    <div>
                        <p className="text-3xl font-extrabold text-[#2c2e2a]">{bestScore}%</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">Personal best</p>
                    </div>
                </div>

                {/* Card 4: Practice Time */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                        <span>Practice Time</span>
                        <span className="text-base">⏱</span>
                    </div>
                    <div>
                        <p className="text-3xl font-extrabold text-[#2c2e2a]">{totalMinutes}m</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">Total invested</p>
                    </div>
                </div>
            </section>

            {/* Tabs & History Section */}
            <section className="space-y-6">
                {/* Tabs Header */}
                <div className="border-b border-gray-200 flex gap-8">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors relative ${
                            activeTab === 'history'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        <span>📋</span> Interview History
                    </button>
                    <button
                        onClick={() => setActiveTab('resume')}
                        className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors relative ${
                            activeTab === 'resume'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        <span>📄</span> Resume Analysis
                    </button>
                </div>

                {/* Filter & Subtitle Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        {activeTab === 'history'
                            ? 'Your recent practice sessions'
                            : 'Your uploaded resume analysis & insights'}
                    </p>

                    {/* Domain Filter Pills */}
                    {activeTab === 'history' && uniqueDomains.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {uniqueDomains.map((domain) => {
                                const isSelected = filterDomain === domain;
                                return (
                                    <button
                                        key={domain}
                                        onClick={() => setFilterDomain(domain)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                            isSelected
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
                                        }`}
                                    >
                                        {domain}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Tab Content: Interview History List */}
                {activeTab === 'history' && (
                    <div className="space-y-3">
                        {filtered.length === 0 ? (
                            /* Empty State */
                            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center bg-gray-50/30 flex flex-col items-center justify-center space-y-4">
                                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-amber-100">
                                    📝
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-bold text-[#2c2e2a]">No sessions yet</h4>
                                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                                        Start a practice interview or upload your resume for personalised domain suggestions.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                    <button
                                        onClick={() => setIsDomainModalOpen(true)}
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-full shadow-sm text-sm transition-all active:scale-95"
                                    >
                                        <span>⚡</span> Start Interview
                                    </button>
                                    <button
                                        onClick={() => router.push('/resume')}
                                        className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-full border border-gray-300 shadow-sm text-sm transition-all active:scale-95"
                                    >
                                        <span>📄</span> Analyse Resume
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* History List Item Cards */
                            <div className="space-y-3">
                                {filtered.map((item) => {
                                    const itemScore = Number(item.score || 10);
                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                        >
                                            {/* Left Info */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                                                    {getDomainIcon(item.topic)}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2.5">
                                                        <h4 className="font-bold text-[#2c2e2a] text-base">{item.topic}</h4>
                                                        <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                                            {itemScore}%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                                        <span>📅 {item.date}</span>
                                                        <span>•</span>
                                                        <span>⏱ {item.duration} min</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Action & Score Bar */}
                                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                                                <div className="flex flex-col items-end gap-1 min-w-[100px]">
                                                    <span className="text-[11px] font-semibold text-gray-400">Score</span>
                                                    <div className="flex items-center gap-2 w-full">
                                                        <div className="w-20 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                            <div
                                                                className="bg-blue-600 h-full rounded-full"
                                                                style={{ width: `${itemScore <= 10 ? itemScore * 10 : Math.min(100, Math.max(0, itemScore))}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-[#2c2e2a]">{itemScore <= 10 ? itemScore * 10 : itemScore}%</span>

                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => alert(`Details for ${item.topic}: Score ${itemScore}%, Duration ${item.duration} mins.`)}
                                                        className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-colors shadow-xs"
                                                    >
                                                        Details
                                                    </button>
                                                    <button
                                                        onClick={() => router.push(`/interview?domain=${getDomainKey(item.topic)}`)}
                                                        className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all shadow-sm active:scale-95"
                                                    >
                                                        Retake
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Content: Resume Analysis */}
                {activeTab === 'resume' && (
                    <ResumeAnalysisSection />
                )}
            </section>

            {/* Modal: Pick a Domain (Matching Reference Image) */}
            {isDomainModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative border border-gray-100 animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Pick a Domain</h3>
                                <p className="text-sm text-gray-500 mt-1">Choose what you want to practice today</p>
                            </div>
                            <button
                                onClick={() => setIsDomainModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Domains Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {domainsList.map((domain) => (
                                <div
                                    key={domain.id}
                                    onClick={() => {
                                        setIsDomainModalOpen(false);
                                        router.push(`/interview?domain=${encodeURIComponent(domain.id)}`);
                                    }}
                                    className="group border border-gray-200 hover:border-blue-400 hover:bg-blue-50/20 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm shrink-0 ${domain.iconBg}`}>
                                            {domain.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                                                {domain.title}
                                            </h4>
                                            <p className="text-xs text-gray-400 mt-0.5">{domain.description}</p>
                                        </div>
                                    </div>
                                    <span className="text-gray-300 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 text-sm">
                                        →
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="text-center pt-2">
                            <button
                                onClick={() => setIsDomainModalOpen(false)}
                                className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;