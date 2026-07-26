"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/Authcontext';
import axiosInstance from '@/lib/axios';
import { ResumeAnalysisSection } from '@/components/resume/ResumeAnalysisSection';


interface Interview {
    id: string;
    date: string;
    duration: number;
    score: string | number;
    topic: string;
}

interface DomainOption {
    id: string;
    title: string;
    description: string;
    iconBg: string;
    icon: string;
}

const domainsList: DomainOption[] = [
    { id: 'javascript-node', title: 'JavaScript/Node.js', description: 'ES6+, async, Node runtime', iconBg: 'bg-yellow-400 text-black font-extrabold', icon: 'JS' },
    { id: 'react', title: 'React', description: 'Hooks, state, lifecycle', iconBg: 'bg-purple-100 text-purple-600', icon: '⚛️' },
    { id: 'python', title: 'Python', description: 'OOP, data structures, stdlib', iconBg: 'bg-green-100 text-green-700', icon: '🐍' },
    { id: 'data-science', title: 'Data Science', description: 'ML, pandas, statistics', iconBg: 'bg-blue-100 text-blue-600', icon: '📊' },
    { id: 'devops', title: 'DevOps', description: 'CI/CD, Docker, Kubernetes', iconBg: 'bg-gray-100 text-gray-700', icon: '⚙️' },
    { id: 'system-design', title: 'System Design', description: 'Scalability, architecture', iconBg: 'bg-amber-100 text-amber-700', icon: '🏗️' },
    { id: 'database-design', title: 'Database Design', description: 'SQL, NoSQL, indexing', iconBg: 'bg-emerald-100 text-emerald-700', icon: '🗄️' },
    { id: 'general', title: 'General', description: 'Behavioural & fundamentals', iconBg: 'bg-orange-100 text-orange-600', icon: '🎯' },
];

const Page = () => {
    const router = useRouter();
    const { isLoggedIn, isLoading: authLoading, user } = useAuth();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [filterDomain, setFilterDomain] = useState<string>("All");
    const [activeTab, setActiveTab] = useState<'history' | 'resume'>('history');
    const [isDomainModalOpen, setIsDomainModalOpen] = useState<boolean>(false);
    const [selectedDetail, setSelectedDetail] = useState<Interview | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axiosInstance.get('/api/interview');
                if (response.data?.success && Array.isArray(response.data.interviews)) {
                    const formatted = response.data.interviews.map((item: any) => ({
                        id: item._id || item.id,
                        topic: item.domain || item.topic || "General",
                        date: new Date(item.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        duration: item.duration || 2,
                        score: typeof item.score !== 'undefined' ? item.score : 75,
                    }));
                    setInterviews(formatted);
                    return;
                }
            } catch (err) {
                console.warn("Backend interview history fetch error, checking local storage:", err);
            }

            try {
                const stored = localStorage.getItem('ai_interview_history');
                if (stored) {
                    setInterviews(JSON.parse(stored));
                } else {
                    setInterviews([]);
                }
            } catch (err) {
                console.error("Local storage error:", err);
                setInterviews([]);
            }
        };


        if (isLoggedIn) {
            fetchHistory();
        }
    }, [isLoggedIn]);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-sm font-medium text-gray-500">Loading profile authentication...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    const uniqueDomains = ["All", ...Array.from(new Set(interviews.map((item) => item.topic)))];

    const filteredInterviews = filterDomain === "All"
        ? interviews
        : interviews.filter((item) => item.topic.toLowerCase().includes(filterDomain.toLowerCase()));

    const totalSessions = interviews.length;

    const averageScore = totalSessions > 0
        ? Math.round(
            interviews.reduce((acc, curr) => {
                const num = Number(curr.score) || 75;
                const normalized = num <= 10 ? num * 10 : num;
                return acc + normalized;
            }, 0) / totalSessions
        )
        : 85;

    const totalMinutes = interviews.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);

    const getDomainKey = (topic: string) => {
        const lower = topic.toLowerCase();
        if (lower.includes('react')) return 'react';
        if (lower.includes('python')) return 'python';
        if (lower.includes('data')) return 'data-science';
        if (lower.includes('devops')) return 'devops';
        if (lower.includes('system')) return 'system-design';
        if (lower.includes('database')) return 'database-design';
        if (lower.includes('general')) return 'general';
        return 'javascript-node';
    };

    return (
        <div className="min-h-screen bg-gray-50/60 pb-16 pt-24 font-sans text-gray-800">
            <main className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
                {/* Back to Home Button */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#2c2e2a] bg-white border-2 border-[#2c2e2a] rounded-[50px] hover:bg-[#f5f1e4] transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                        <span>← Back to Home</span>
                    </Link>
                </div>

                {/* Header Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-200/80 shadow-xs">

                    <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mb-1">
                            Candidate Workspace
                        </span>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#2c2e2a]">
                            Welcome back, {user?.username} 👋
                        </h1>

                        <p className="text-sm text-gray-500 font-medium">
                            Ready to practice tech interviews and level up your engineering skills?
                        </p>
                    </div>

                    <button
                        onClick={() => setIsDomainModalOpen(true)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                    >
                        <span>✨ Start New Interview</span>
                    </button>
                </div>

                {/* Performance Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-400">Total Interviews</span>
                            <h3 className="text-2xl font-black text-[#2c2e2a]">{totalSessions}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                            🎯
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-400">Average Performance</span>
                            <h3 className="text-2xl font-black text-[#2c2e2a]">{averageScore}%</h3>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                            📈
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-400">Practice Time</span>
                            <h3 className="text-2xl font-black text-[#2c2e2a]">{totalMinutes} mins</h3>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                            ⏱
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                            activeTab === 'history'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-400 hover:text-gray-700'
                        }`}
                    >
                        Interview History
                    </button>
                    <button
                        onClick={() => setActiveTab('resume')}
                        className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                            activeTab === 'resume'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-400 hover:text-gray-700'
                        }`}
                    >
                        Resume Analysis 📄
                    </button>
                </div>

                {/* Tab 1: Interview History */}
                {activeTab === 'history' && (
                    <div className="space-y-4">
                        {/* Domain Filter Bar */}
                        <div className="flex flex-wrap items-center gap-2 pb-2">
                            <span className="text-xs font-bold text-gray-400 mr-2">Filter:</span>
                            {uniqueDomains.map((domain) => (
                                <button
                                    key={domain}
                                    onClick={() => setFilterDomain(domain)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                        filterDomain === domain
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {domain}
                                </button>
                            ))}
                        </div>

                        {filteredInterviews.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 space-y-3">
                                <div className="text-4xl">📝</div>
                                <h3 className="text-lg font-bold text-gray-800">No interviews found</h3>
                                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                                    You haven't completed any sessions in this category yet. Start a new mock interview to practice!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredInterviews.map((item) => {
                                    const itemScoreRaw = Number(item.score) || 75;
                                    const itemScore = itemScoreRaw <= 10 ? itemScoreRaw * 10 : Math.min(100, Math.max(0, itemScoreRaw));

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-200 transition-all"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-[#2c2e2a] text-base">{item.topic}</h4>
                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                                        {item.date}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400">Duration: {item.duration} mins • 3 Questions</p>
                                            </div>

                                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                                                <div className="flex flex-col items-end gap-1 min-w-[100px]">
                                                    <span className="text-[11px] font-semibold text-gray-400">Score</span>
                                                    <div className="flex items-center gap-2 w-full">
                                                        <div className="w-20 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                            <div
                                                                className="bg-blue-600 h-full rounded-full"
                                                                style={{ width: `${itemScore}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-[#2c2e2a]">{itemScore}%</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedDetail(item)}
                                                        className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-colors shadow-xs cursor-pointer"
                                                    >
                                                        Details
                                                    </button>
                                                    <button
                                                        onClick={() => router.push(`/interview?domain=${getDomainKey(item.topic)}`)}
                                                        className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
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

                {/* Tab 2: Resume Analysis */}
                {activeTab === 'resume' && <ResumeAnalysisSection />}
            </main>

            {/* Modal: Pick a Domain */}
            {isDomainModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Pick a Domain</h3>
                                <p className="text-sm text-gray-500 mt-1">Choose what you want to practice today</p>
                            </div>
                            <button
                                onClick={() => setIsDomainModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

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
                    </div>
                </div>
            )}

            {/* Modal: Interview Session Detail Modal */}
            {selectedDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 relative border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-lg">Interview Details</h3>
                            <button
                                onClick={() => setSelectedDetail(null)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-1 border-b border-gray-50">
                                <span className="text-gray-500">Domain</span>
                                <span className="font-bold text-gray-800">{selectedDetail.topic}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-50">
                                <span className="text-gray-500">Date Completed</span>
                                <span className="font-bold text-gray-800">{selectedDetail.date}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-50">
                                <span className="text-gray-500">Duration</span>
                                <span className="font-bold text-gray-800">{selectedDetail.duration} minutes</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-500">Overall AI Score</span>
                                <span className="font-bold text-blue-600">{Number(selectedDetail.score) <= 10 ? Number(selectedDetail.score) * 10 : selectedDetail.score}%</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedDetail(null)}
                            className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;