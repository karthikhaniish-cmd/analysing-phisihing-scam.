import React from 'react';
import { ShieldCheck, AlertTriangle, Terminal, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030712] border-t border-slate-900 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-800/80 pb-6 mb-6">
          
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span className="font-extrabold text-white tracking-tight font-mono">PhishGuard AI</span>
              <span className="text-[10px] bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono">v1.0-academic</span>
            </div>
            <p className="text-xs text-slate-400">
              Intelligent Email Security Powered by Machine Learning — Academic Capstone Project.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono justify-start md:justify-center">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> TF-IDF + Naive Bayes
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" /> Python 3 / Flask
            </span>
          </div>

          <div className="text-start md:text-end text-xs text-slate-500">
            <p className="mb-0.5">Scikit-learn &bull; Chart.js &bull; SQLite 3</p>
            <p className="text-[11px] text-slate-600">Built for student demonstration, research defense & testing.</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-slate-300">Academic & Ethical Disclaimer:</strong> PhishGuard AI is an educational machine learning demonstrator designed to evaluate natural language text patterns and syntactic hyperlinks. It analyzes input strictly in memory, never performs outbound network requests to submitted URLs, and executes no executable macros. Production email security requires SPF/DKIM/DMARC protocols and multi-factor authentication.
          </div>
        </div>
      </div>
    </footer>
  );
};
