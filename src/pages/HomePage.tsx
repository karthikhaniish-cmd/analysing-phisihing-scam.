import React from 'react';
import { 
  Radar, 
  LayoutDashboard, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Database, 
  PieChart, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-900 bg-gradient-to-b from-[#070d19] via-[#0b1329] to-[#070d19]">
        {/* Subtle Cyber Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 75% 20%, rgba(0, 240, 255, 0.15) 0%, transparent 45%),
                              radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.15) 0%, transparent 45%),
                              linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Next-Gen Email Defense &bull; Academic Capstone Project</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                Intelligent Email Security <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                  Powered by Machine Learning
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Protect your organization against spear phishing, spoofed credential harvesting, and social engineering attacks using automated 
                <strong className="text-cyan-300 font-semibold"> TF-IDF text vectorization</strong> and a trained 
                <strong className="text-cyan-300 font-semibold"> Multinomial Naive Bayes</strong> classifier with heuristic indicators.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <Radar className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  <span>Start Email Scan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                  <span>View Live Dashboard</span>
                </button>
              </div>

              {/* Metric stats pill */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg">
                <div>
                  <div className="text-2xl font-extrabold text-cyan-400 font-mono">87.5%</div>
                  <div className="text-xs text-slate-400">Model Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white font-mono">&lt; 50ms</div>
                  <div className="text-xs text-slate-400">Inference Speed</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">Dual-Layer</div>
                  <div className="text-xs text-slate-400">ML + Heuristics</div>
                </div>
              </div>

            </div>

            {/* Right Interactive Threat Card Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#0b1329] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.12)] p-5 relative overflow-hidden group">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                    <Terminal className="w-4 h-4" />
                    <span>threat_evaluator.py</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-red-950/80 text-red-400 border border-red-700/60 animate-pulse">
                    HIGH RISK DETECTED
                  </span>
                </div>

                {/* Email Mock */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 font-semibold">Sender:</span>
                      <span className="text-amber-300 truncate">security-alert@paypaI-sec-notice.com</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 font-semibold">Subject:</span>
                      <span className="text-slate-200">URGENT: Your account access has been suspended</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 font-semibold">URL:</span>
                      <span className="text-red-400 truncate">http://paypaI-security-verify.xyz/login</span>
                    </div>
                  </div>

                  {/* Feature Breakdown */}
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] space-y-2">
                    <div className="text-slate-400">// NLP Extracted Discriminative Tokens:</div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">urgent</span>
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">suspended</span>
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">password</span>
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">ssn</span>
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">paypaI</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <div className="flex justify-between text-slate-300 text-xs">
                        <span>Multinomial Naive Bayes Posterior:</span>
                        <span className="font-bold text-red-400">96.4% Phishing</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full w-[96.4%]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      3 Heuristic Indicators Triggered
                    </span>
                    <button 
                      onClick={() => setActiveTab('scanner')} 
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-sans font-semibold cursor-pointer"
                    >
                      Test with your email &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What is Phishing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>Cybersecurity Essentials</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              What are Phishing Emails?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Phishing is an adversarial social engineering attack where bad actors impersonate trusted entities—such as banking institutions, cloud providers, university deans, or executive leadership—to manipulate recipients into surrendering confidential credentials or making unauthorized financial transfers.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800/80 flex items-center justify-center shrink-0 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">Psychological Coercion & Urgency</h4>
                  <p className="text-xs text-slate-400">Attackers employ strict artificial deadlines (e.g. "Account closed within 24 hours") to short-circuit critical evaluation.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/80 flex items-center justify-center shrink-0 text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">Domain Homoglyphs & Typosquatting</h4>
                  <p className="text-xs text-slate-400">Attackers mimic authentic domains using subtle character substitutions (e.g. uppercase 'I' for 'l' in paypaI) or untrusted TLDs.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center shrink-0 text-cyan-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">Credential Harvesting Portals</h4>
                  <p className="text-xs text-slate-400">Recipients are directed to visually convincing replicas of login pages created to siphon passwords and 2FA tokens.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Machine Learning Comparison Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-gradient-to-br from-[#0b1329] to-[#0f1a36] border border-cyan-500/20 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Machine Learning vs. Static Regex Filters</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Traditional email firewalls rely on static blocklists and exact-match keyword filters that attackers easily evade with typos, obfuscated HTML tags, or zero-width unicode characters. PhishGuard AI leverages probabilistic Machine Learning:
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">1. TF-IDF Token Vectorization:</span>
                  <span className="text-slate-400">Calculates mathematical term rarity across the entire document corpus. Discriminative words gain high weight while common filler words are naturally dampened.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">2. Multinomial Naive Bayes Modeling:</span>
                  <span className="text-slate-400">Evaluates joint conditional probabilities under Bayes theorem with Laplace smoothing, maintaining high resilience against unseen vocabulary at runtime.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">3. Rule Triangulation:</span>
                  <span className="text-slate-400">Synthesizes Bayes posterior with explainable heuristic indicators to deliver an actionable, calibrated risk grade (High, Medium, Low).</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workflow Pipeline</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">How It Works in 3 Steps</h2>
          <p className="text-slate-400 text-sm mt-2">From raw email headers and text copy to comprehensive threat assessment in milliseconds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="relative rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition-all p-6 space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              01
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              Enter Email Details
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit the sender address, subject line, email body text, and optional embedded hyperlinks or choose from one of 6 ready benchmark scenarios.
            </p>
          </div>

          <div className="relative rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition-all p-6 space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              02
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              Machine Learning Analysis
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The engine tokenizes the text, calculates sublinear TF-IDF weights, evaluates posterior probability with Multinomial Naive Bayes, and audits heuristic indicators.
            </p>
          </div>

          <div className="relative rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition-all p-6 space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              03
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              View Risk & Advice
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Obtain an instantaneous prediction (Phishing vs Legitimate), confidence score, detected warning signs, and concrete security guidance.
            </p>
          </div>

        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setActiveTab('scanner')}
            className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Radar className="w-4 h-4" />
            <span>Launch Live Email Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Academic Technology Stack */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#0b1329]/60 border border-slate-800/90 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white">Academic Project Technology Stack</h3>
            <p className="text-xs text-slate-400 mt-1">Engineered with standard scientific libraries for reproducibility and college defense.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center space-y-2">
              <Terminal className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="text-xs font-bold text-white">Python 3 & Flask</div>
              <div className="text-[11px] text-slate-400">Server routing, REST API, JSON endpoints</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center space-y-2">
              <Cpu className="w-6 h-6 text-cyan-400 mx-auto" />
              <div className="text-xs font-bold text-white">Scikit-learn & TF-IDF</div>
              <div className="text-[11px] text-slate-400">NLP vectorization & Bayes pipeline</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center space-y-2">
              <Database className="w-6 h-6 text-sky-400 mx-auto" />
              <div className="text-xs font-bold text-white">SQLite 3</div>
              <div className="text-[11px] text-slate-400">Telemetry logs & scan history</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center space-y-2">
              <PieChart className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="text-xs font-bold text-white">Chart.js</div>
              <div className="text-[11px] text-slate-400">Telemetry visualizations & graphs</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
