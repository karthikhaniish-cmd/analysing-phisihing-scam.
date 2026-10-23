import React from 'react';
import { 
  ShieldCheck, 
  Radar, 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  Code2, 
  CheckCircle2 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#070d19]/90 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.25)] group-hover:border-cyan-400 transition-all">
              <ShieldCheck className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white font-mono">
                  PhishGuard<span className="text-cyan-400">.AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ML
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Intelligent Email Security</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'scanner'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Radar className="w-3.5 h-3.5" />
              Email Scanner
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'about'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              About Project
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'help'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Help
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Python Project (.zip)
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'tests'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Test Suite
            </button>
          </nav>

          {/* Quick CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('scanner')}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center gap-1.5"
            >
              <Radar className="w-3.5 h-3.5" />
              <span>Scan Email</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-3 border-t border-slate-800 bg-[#070d19] overflow-x-auto text-[11px]">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`px-2 py-1 rounded ${activeTab === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveTab('scanner')} 
          className={`px-2 py-1 rounded ${activeTab === 'scanner' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Scanner
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`px-2 py-1 rounded ${activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('about')} 
          className={`px-2 py-1 rounded ${activeTab === 'about' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          About
        </button>
        <button 
          onClick={() => setActiveTab('code')} 
          className={`px-2 py-1 rounded ${activeTab === 'code' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Python Code
        </button>
      </div>
    </header>
  );
};
