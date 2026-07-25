'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/Authcontext';
import { Play, Sparkles, Brain, Cpu, BarChart3, X, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'questions' | 'reports'>('analysis');

  // Simulator states for live demo card
  const [simStep, setSimStep] = useState(0);
  const simSteps = [
    {
      question: "AI: How do you handle conflict within a development team?",
      answer: "Candidate: I focus on active listening first, ensuring each side feels heard...",
      sentiment: "Positive / Collaboration Focus",
      progress: 35,
      confidence: "96%"
    },
    {
      question: "AI: Can you describe your experience with Next.js and Tailwind?",
      answer: "Candidate: I build responsive web apps using modern frameworks, prioritizing performance...",
      sentiment: "Confident / Technical Expertise",
      progress: 70,
      confidence: "98%"
    },
    {
      question: "AI: What is your approach to learning new technologies?",
      answer: "Candidate: I build small experimental projects and dive deep into standard specifications...",
      sentiment: "Curious / Structured Learner",
      progress: 100,
      confidence: "95%"
    }
  ];

  // Rotate simulator steps
  useEffect(() => {
    const timer = setInterval(() => {
      setSimStep((prev) => (prev + 1) % simSteps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#f5f1e4] text-[#2c2e2a] font-sans overflow-x-hidden relative min-h-screen flex flex-col justify-between pt-24 md:pt-32">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-5 md:px-8 space-y-24 pb-20">
        
        {/* HERO SECTION */}
        <section className="relative pt-8 pb-4 flex flex-col items-center text-center">
          <div className="max-w-4xl z-10">
            {/* Tag / Micro-label */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-[#2c2e2a] rounded-[50px] text-xs font-bold text-[#2c2e2a] mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#2ba0ff]" />
              <span>Next-Gen Candidate Screening Platform</span>
            </div>

            {/* Giant display title */}
            <h1 className="text-[56px] md:text-[110px] lg:text-[132px] font-extrabold tracking-[-0.05em] leading-[0.95] text-[#2c2e2a] mb-6">
              Ready when <br /> you are!
            </h1>

            <p className="text-md md:text-xl text-[#80827f] mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              The most advanced interview platform designed to identify top talent using real-time behavioral analysis, automated transcripts, and predictive skill mapping.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none mb-12">
              <Link 
                href={isLoggedIn ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-8 py-4 rounded-[50px] font-bold bg-[#8ed462] hover:bg-[#8ed462]/90 text-[#2c2e2a] border-2 border-[#2c2e2a] transition-all active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                <span className="w-2.5 h-2.5 bg-[#2ba0ff] rounded-full border border-[#2c2e2a]"></span>
              </Link>
              
              <button 
                onClick={() => setShowDemoModal(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-[50px] font-bold bg-white text-[#2c2e2a] border-2 border-[#2c2e2a] hover:bg-[#f5f1e4] transition-all active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-[#2c2e2a]" />
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* HERO ILLUSTRATION PANEL (Paper-cut style landscape illustration) */}
        <section className="w-full overflow-hidden rounded-[50px] border-2 border-[#2c2e2a] bg-white relative aspect-[21/9] min-h-[250px] max-h-[480px]">
          {/* Custom SVG Papercut Art */}
          <svg className="w-full h-full object-cover" viewBox="0 0 1200 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sky Background */}
            <rect width="1200" height="500" fill="#f5f1e4"/>
            
            {/* Rolling Hills (Fresh Grass `#8ed462`) */}
            <path d="M-50 420C200 420 350 330 600 360C850 390 1000 300 1250 320V520H-50V420Z" fill="#8ed462" stroke="#2c2e2a" strokeWidth="4"/>
            <path d="M-50 460C150 480 300 390 550 420C800 450 950 370 1250 400V520H-50V460Z" fill="#7bc452" stroke="#2c2e2a" strokeWidth="4"/>

            {/* Stylized Flowers (Sunshine & Coral pops) */}
            {/* Flower 1 */}
            <circle cx="150" cy="350" r="24" fill="#ff705d" stroke="#2c2e2a" strokeWidth="3"/>
            <circle cx="150" cy="350" r="10" fill="#f5e211" stroke="#2c2e2a" strokeWidth="3"/>
            <line x1="150" y1="374" x2="150" y2="430" stroke="#2c2e2a" strokeWidth="3"/>
            
            {/* Flower 2 */}
            <circle cx="1050" cy="310" r="20" fill="#2ba0ff" stroke="#2c2e2a" strokeWidth="3"/>
            <circle cx="1050" cy="310" r="8" fill="#ffffff" stroke="#2c2e2a" strokeWidth="3"/>
            <line x1="1050" y1="330" x2="1050" y2="390" stroke="#2c2e2a" strokeWidth="3"/>

            {/* Stylized Candidate & Interviewer Characters (Flat Papercut Style) */}
            {/* Candidate (Left side, sitting on the hill with a laptop) */}
            <g transform="translate(280, 200)">
              {/* Sitting Person Shapes */}
              {/* Leg / Pants (Sky Blue Pop) */}
              <path d="M 20 180 L 100 180 L 90 200 L 10 200 Z" fill="#2ba0ff" stroke="#2c2e2a" strokeWidth="3"/>
              {/* Shoes */}
              <rect x="95" y="175" width="20" height="10" rx="5" fill="#f5e211" stroke="#2c2e2a" strokeWidth="3"/>
              {/* Torso (Coral Pop) */}
              <path d="M 10 110 L 45 110 L 35 180 L 5 180 Z" fill="#ff705d" stroke="#2c2e2a" strokeWidth="3"/>
              {/* Head */}
              <circle cx="25" cy="80" r="18" fill="#ffffff" stroke="#2c2e2a" strokeWidth="3"/>
              {/* Hair (Ink Black) */}
              <path d="M 12 75 C 12 60, 38 60, 38 75 C 38 65, 12 65, 12 75" fill="#2c2e2a" stroke="#2c2e2a" strokeWidth="2"/>
              {/* Headphones */}
              <path d="M 12 80 A 15 15 0 0 1 38 80" fill="none" stroke="#2c2e2a" strokeWidth="4"/>
              <rect x="7" y="76" width="6" height="10" rx="2" fill="#2c2e2a"/>
              <rect x="37" y="76" width="6" height="10" rx="2" fill="#2c2e2a"/>
              {/* Laptop (Pure White/Ink Black) */}
              <path d="M 60 160 L 100 160 L 95 165 L 55 165 Z" fill="#ffffff" stroke="#2c2e2a" strokeWidth="3"/>
              <path d="M 65 130 L 60 160 L 100 160" stroke="#2c2e2a" strokeWidth="3"/>
            </g>

            {/* AI Assistant Hologram / Cloud (Right side) */}
            <g transform="translate(750, 140)">
              {/* Cloud/Floating Brain structure */}
              <path d="M 20 80 Q 0 50 30 40 Q 50 10 80 30 Q 110 15 130 45 Q 160 55 140 85 Q 120 115 80 110 Q 40 115 20 80 Z" fill="#ffffff" stroke="#2c2e2a" strokeWidth="3.5"/>
              {/* AI Glow sparks (Yellow / Blue) */}
              <path d="M 40 55 C 50 55, 55 50, 55 40 C 55 50, 60 55, 70 55 C 60 55, 55 60, 55 70 C 55 60, 50 55, 40 55 Z" fill="#f5e211" stroke="#2c2e2a" strokeWidth="1.5"/>
              {/* Speech bubble vector path */}
              <path d="M-100 90 L-40 90 L-50 110 L-65 90 Z" fill="#ffffff" stroke="#2c2e2a" strokeWidth="2.5"/>
              <text x="-90" y="80" fill="#2c2e2a" fontFamily="Inter" fontSize="12" fontWeight="bold">Processing Speech...</text>
              {/* Inner graphic lines */}
              <circle cx="80" cy="65" r="22" fill="#8ed462" stroke="#2c2e2a" strokeWidth="3"/>
              <path d="M 72 65 H 88" stroke="#2c2e2a" strokeWidth="3" strokeLinecap="round"/>
              <path d="M 80 57 V 73" stroke="#2c2e2a" strokeWidth="3" strokeLinecap="round"/>
            </g>

            {/* Small decorative butterfly */}
            <path d="M 520 220 Q 500 200 520 190 Q 530 205 520 220 Z" fill="#ff705d" stroke="#2c2e2a" strokeWidth="2"/>
            <path d="M 520 220 Q 540 200 520 190 Q 510 205 520 220 Z" fill="#ff705d" stroke="#2c2e2a" strokeWidth="2"/>
          </svg>
        </section>

        {/* FEATURES SECTION */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-[36px] md:text-[53px] font-extrabold tracking-tight text-[#2c2e2a] leading-none">
              Advanced Intelligence Core
            </h2>
            <p className="text-[#80827f] text-sm md:text-base font-semibold">
              Powerful tools seamlessly integrated to evaluate candidates objectively and efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="bg-white border-2 border-[#2c2e2a] rounded-[50px] p-8 flex flex-col justify-between hover:bg-[#f5f1e4]/20 transition-all duration-300 min-h-[300px]">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-[12px] bg-[#8ed462] border-2 border-[#2c2e2a] flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#2c2e2a]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[20px] font-bold text-[#2c2e2a]">Real-time Sentiment Analysis</h3>
                  <p className="text-[#80827f] text-sm leading-relaxed">
                    Detects emotional cues, facial expressions, and engagement levels during live interviews to provide deeper candidate understanding.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-[#2c2e2a]/10 flex items-center gap-1 text-xs font-bold text-[#2c2e2a]">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white border-2 border-[#2c2e2a] rounded-[50px] p-8 flex flex-col justify-between hover:bg-[#f5f1e4]/20 transition-all duration-300 min-h-[300px]">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-[12px] bg-[#2ba0ff] border-2 border-[#2c2e2a] flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-[#2c2e2a]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[20px] font-bold text-[#2c2e2a]">Automated Question Gen</h3>
                  <p className="text-[#80827f] text-sm leading-relaxed">
                    Dynamic, role-specific questions intelligently tailored to adapt to candidate responses and resume data in real-time.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-[#2c2e2a]/10 flex items-center gap-1 text-xs font-bold text-[#2c2e2a]">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white border-2 border-[#2c2e2a] rounded-[50px] p-8 flex flex-col justify-between hover:bg-[#f5f1e4]/20 transition-all duration-300 min-h-[300px]">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-[12px] bg-[#ff705d] border-2 border-[#2c2e2a] flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-[#2c2e2a]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[20px] font-bold text-[#2c2e2a]">Detailed Candidate Reports</h3>
                  <p className="text-[#80827f] text-sm leading-relaxed">
                    Comprehensive insights, transcript analysis, and structured scorecards delivered instantly after every interview.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-[#2c2e2a]/10 flex items-center gap-1 text-xs font-bold text-[#2c2e2a]">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE PRACTICE SIMULATOR CARD */}
        <section className="bg-white border-2 border-[#2c2e2a] rounded-[50px] p-6 md:p-10 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#ff705d]/10 text-[#ff705d] border border-[#ff705d]/20 rounded-full text-xs font-bold uppercase tracking-wider">
                Live Simulator
              </span>
              <h2 className="text-[28px] md:text-[42px] font-extrabold tracking-tight text-[#2c2e2a] leading-tight">
                Experience the Interview
              </h2>
              <p className="text-[#80827f] text-sm leading-relaxed">
                Watch how the AI processes speech dynamically in real-time. It analyzes sentiment, categorizes technical topics, and logs transcripts instantly for recruiter scorecards.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8ed462]" />
                  <span className="text-sm font-semibold">Instant scorecards after submission</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8ed462]" />
                  <span className="text-sm font-semibold">Video/Audio recording analysis</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[50px] border-2 border-[#2c2e2a] bg-[#8ed462] hover:bg-[#8ed462]/90 text-[#2c2e2a] font-bold text-sm"
                >
                  <span>Start Free Practice Now</span>
                  <span className="w-2 h-2 bg-[#2ba0ff] rounded-full"></span>
                </Link>
              </div>
            </div>

            {/* Right: Simulator Window */}
            <div className="lg:col-span-7 border-2 border-[#2c2e2a] rounded-[24px] bg-[#f5f1e4] overflow-hidden flex flex-col justify-between min-h-[300px]">
              {/* Sim Header */}
              <div className="px-5 py-3 border-b-2 border-[#2c2e2a] bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#ff705d] rounded-full border border-[#2c2e2a] animate-ping"></span>
                  <span className="text-xs font-bold text-[#2c2e2a]">AI Interview Simulator</span>
                </div>
                <div className="bg-[#2ba0ff]/15 text-[#2ba0ff] px-2 py-0.5 rounded text-[10px] font-bold border border-[#2ba0ff]/20">
                  Confidence: {simSteps[simStep].confidence}
                </div>
              </div>

              {/* Sim body */}
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-center">
                <div className="p-4 bg-white border border-[#2c2e2a] rounded-[15px] space-y-2">
                  <p className="text-xs font-bold text-[#2c2e2a]">{simSteps[simStep].question}</p>
                </div>
                
                <div className="p-4 bg-white/70 border border-[#2c2e2a]/50 rounded-[15px] space-y-2">
                  <p className="text-xs text-[#80827f] italic">{simSteps[simStep].answer}</p>
                </div>
              </div>

              {/* Sim footer */}
              <div className="px-5 py-4 border-t-2 border-[#2c2e2a] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2c2e2a]">Analysis:</span>
                  <span className="text-xs font-semibold text-[#8ed462] bg-[#8ed462]/10 border border-[#8ed462]/20 px-2.5 py-0.5 rounded-full">
                    {simSteps[simStep].sentiment}
                  </span>
                </div>
                {/* Simulated waveform */}
                <div className="flex items-center gap-1">
                  {[...Array(8)].map((_, i) => (
                    <span 
                      key={i} 
                      className="w-1.5 bg-[#2ba0ff] border border-[#2c2e2a] rounded-full transition-all duration-300"
                      style={{ 
                        height: `${Math.max(10, Math.sin(simStep * 2 + i) * 25 + 20)}px` 
                      }}
                    ></span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* FOOTER ACCENT BLOCK (Solid Sunshine Pop Yellow canvas) */}
      <footer className="w-full bg-[#f5e211] border-t-4 border-[#2c2e2a] py-12 relative z-10">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[#2c2e2a]">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-md font-extrabold tracking-tight">AI Interviewer</span>
            <span className="text-xs font-bold text-[#2c2e2a]/70">
              © 2026 AI Interviewer. Built with premium storybook assets.
            </span>
          </div>
          
          <ul className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-wider">
            <li>
              <a href="#" className="hover:underline">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Contact Support</a>
            </li>
          </ul>
        </div>
      </footer>

      {/* Demo Modal (Warm Card Popup) */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <div 
            onClick={() => setShowDemoModal(false)}
            className="absolute inset-0 bg-[#2c2e2a]/40 backdrop-blur-sm"
          ></div>
          
          {/* Modal Container */}
          <div className="bg-white border-4 border-[#2c2e2a] rounded-[30px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b-2 border-[#2c2e2a] bg-[#f5f1e4]">
              <h3 className="font-extrabold text-[#2c2e2a] flex items-center gap-2 text-md">
                <Sparkles className="w-5 h-5 text-[#2ba0ff]" />
                Interactive Session Demo
              </h3>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="p-1 rounded-full border-2 border-[#2c2e2a] bg-white text-[#2c2e2a] hover:bg-stone-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <h4 className="text-xl font-extrabold text-[#2c2e2a]">How AI Interviewer Works</h4>
              <p className="text-sm text-[#80827f] leading-relaxed">
                The platform automates candidate screening by conducting structured conversations. Candidates answer generated questions, and the engine logs sentiment analysis, vocabulary richness, speech pacing, and skill match indices instantly.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-[20px] bg-[#f5f1e4] border-2 border-[#2c2e2a] text-center">
                  <span className="text-3xl font-extrabold text-[#2ba0ff]">98.7%</span>
                  <p className="text-xs font-bold text-[#2c2e2a] mt-1">Sentiment Accuracy</p>
                </div>
                <div className="p-4 rounded-[20px] bg-[#f5f1e4] border-2 border-[#2c2e2a] text-center">
                  <span className="text-3xl font-extrabold text-[#ff705d]">3x</span>
                  <p className="text-xs font-bold text-[#2c2e2a] mt-1">Faster Screening</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-[#f5f1e4] border-t-2 border-[#2c2e2a] flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowDemoModal(false)}
                className="px-5 py-2.5 rounded-[50px] border-2 border-[#2c2e2a] bg-white hover:bg-stone-50 text-xs font-bold text-[#2c2e2a]"
              >
                Close
              </button>
              <Link
                href="/register"
                onClick={() => setShowDemoModal(false)}
                className="px-5 py-2.5 rounded-[50px] border-2 border-[#2c2e2a] bg-[#8ed462] text-xs font-bold text-[#2c2e2a] flex items-center gap-1.5"
              >
                <span>Get Started Now</span>
                <span className="w-1.5 h-1.5 bg-[#2ba0ff] rounded-full"></span>
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
