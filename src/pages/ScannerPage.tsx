import React, { useState } from 'react';
import { 
  Radar, 
  Trash2, 
  Bug, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Link2, 
  AtSign, 
  Type, 
  FileText, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { evaluateEmail, BENCHMARK_SAMPLES } from '../mlEngine';
import { ScanRecord, ScanResult } from '../types';

interface ScannerPageProps {
  onScanCompleted: (record: ScanRecord) => void;
  setActiveTab: (tab: string) => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({ onScanCompleted, setActiveTab }) => {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  // Load benchmark
  const handleLoadSample = (sampleId: string) => {
    const s = BENCHMARK_SAMPLES.find(item => item.id === sampleId);
    if (!s) return;
    setSender(s.sender);
    setSubject(s.subject);
    setBody(s.body);
    setUrl(s.url);
    setValidationError(null);
  };

  const handleClear = () => {
    setSender('');
    setSubject('');
    setBody('');
    setUrl('');
    setValidationError(null);
    setResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!subject.trim() && !body.trim()) {
      setValidationError('Validation Error: Please provide an Email Subject or Email Body Content.');
      return;
    }

    setIsAnalyzing(true);

    // Simulate realistic async pipeline execution
    setTimeout(() => {
      try {
        const scanRes = evaluateEmail(sender.trim(), subject.trim(), body.trim(), url.trim());
        setResult(scanRes);

        // Record into history
        const record: ScanRecord = {
          id: Date.now(),
          scan_id: scanRes.scan_id,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          sender_domain: sender.includes('@') ? sender.split('@')[1] : (sender.slice(0, 30) || 'None'),
          subject_snippet: subject.length > 40 ? subject.slice(0, 40) + '...' : (subject || 'No Subject'),
          predicted_class: scanRes.prediction,
          risk_level: scanRes.risk_level,
          confidence: scanRes.confidence,
          indicator_count: scanRes.indicator_count
        };
        onScanCompleted(record);
      } catch (err: any) {
        setValidationError(`Analysis Error: ${err.message || 'Failed to process email'}`);
      } finally {
        setIsAnalyzing(false);
      }
    }, 450);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono">
          <Radar className="w-3.5 h-3.5" />
          <span>Real-Time Model Inference</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Phishing Email Scanner
        </h1>
        <p className="text-sm text-slate-400">
          Submit email headers, body copy, and URLs to evaluate threat probability using the 
          trained <strong className="text-slate-200">Multinomial Naive Bayes</strong> classifier and heuristic indicators.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#0b1329] border border-slate-800 p-6 shadow-xl space-y-5">
            
            {/* Header + Sample Loaders */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Email Parameters</h3>
              </div>

              {/* Benchmark Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample('paypal-phish')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-950/60 text-red-300 border border-red-800/80 hover:bg-red-900/60 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Bug className="w-3.5 h-3.5" />
                  Load Phishing
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('univ-dean-legit')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/60 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Load Legitimate
                </button>
              </div>
            </div>

            {/* Quick Benchmark Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 shrink-0 font-mono text-[11px]">Or select scenario:</span>
              <select
                onChange={(e) => handleLoadSample(e.target.value)}
                defaultValue=""
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="" disabled>-- Select a Preset Benchmark Scenario --</option>
                {BENCHMARK_SAMPLES.map(sample => (
                  <option key={sample.id} value={sample.id}>
                    {sample.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Validation Alert */}
            {validationError && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-700/80 text-xs text-red-200 flex items-center gap-2.5 animate-shake">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Sender */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-cyan-400" />
                    Sender Email Address
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="e.g. security-alert@paypaI-sec-auth.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-cyan-400" />
                    Email Subject Line <span className="text-red-400">*</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">Required</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. URGENT: Your Account Has Been Suspended in 24 Hours"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    Email Body Copy <span className="text-red-400">*</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {body.length} characters
                  </span>
                </label>
                <textarea
                  rows={7}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Paste the full body of the email message here..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono leading-relaxed resize-y"
                />
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Sublinear TF-IDF vectorizer extracts unigrams and bigrams from raw text.</span>
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    Embedded Hyperlink / URL
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. http://paypaI-security-verify.xyz/login"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                />
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-cyan-400" />
                  <span>URLs are parsed purely syntactically for deception and never visited by our server.</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Form</span>
                </button>

                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Evaluating Threat...</span>
                    </>
                  ) : (
                    <>
                      <Radar className="w-3.5 h-3.5" />
                      <span>Analyze Email</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>

        {/* Prediction Results Column */}
        <div className="lg:col-span-5">
          
          {/* Awaiting input state */}
          {!result && !isAnalyzing && (
            <div className="rounded-2xl bg-[#0b1329] border border-slate-800/80 p-8 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                <Radar className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Scanner Engine Ready</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Fill out the email parameters or click one of the benchmark preset buttons to test the trained machine learning pipeline.
              </p>
              <div className="inline-block px-3 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                STATUS: AWAITING_INPUT
              </div>
            </div>
          )}

          {/* Loading state */}
          {isAnalyzing && (
            <div className="rounded-2xl bg-[#0b1329] border border-cyan-500/30 p-10 text-center space-y-4 shadow-xl animate-pulse">
              <div className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-white">Evaluating Email Threat</h3>
              <p className="text-xs text-slate-400">
                Tokenizing vocabulary & calculating Bayes log probabilities...
              </p>
            </div>
          )}

          {/* Result Card */}
          {result && !isAnalyzing && (
            <div className={`rounded-2xl bg-[#0b1329] border p-6 shadow-2xl space-y-5 transition-all ${
              result.risk_level === 'High' 
                ? 'border-red-600/70 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                : result.risk_level === 'Medium'
                ? 'border-amber-500/70 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                : 'border-emerald-500/70 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
            }`}>
              
              {/* Classification & Risk Badge */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Classification</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {result.prediction === 'phishing' ? (
                      <ShieldAlert className="w-6 h-6 text-red-400" />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    )}
                    <h2 className={`text-2xl font-extrabold tracking-tight ${
                      result.prediction === 'phishing' ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {result.prediction === 'phishing' ? 'Phishing Threat' : 'Legitimate Email'}
                    </h2>
                  </div>
                </div>

                <div className="text-end">
                  <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Risk Level</span>
                  <div className="mt-0.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      result.risk_level === 'High'
                        ? 'bg-red-950 text-red-300 border-red-700'
                        : result.risk_level === 'Medium'
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    }`}>
                      {result.risk_level} Risk
                    </span>
                  </div>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Radar className="w-3.5 h-3.5 text-cyan-400" />
                    Model Confidence
                  </span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    {result.confidence_percentage}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.risk_level === 'High'
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : result.risk_level === 'Medium'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${result.confidence_percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Multinomial Naive Bayes Posterior</span>
                  <span>ID: {result.scan_id}</span>
                </div>
              </div>

              {/* Highlighted Key Tokens */}
              {result.tokens_detected && result.tokens_detected.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">Discriminative Keywords Triggered:</span>
                  <div className="flex flex-wrap gap-1">
                    {result.tokens_detected.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-mono text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suspicious Indicators */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Detected Warning Signs
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                    {result.indicator_count} Flagged
                  </span>
                </div>

                <div className="space-y-2">
                  {result.indicators.length === 0 ? (
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>No explicit heuristic red flags triggered.</span>
                    </div>
                  ) : (
                    result.indicators.map((ind, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{ind.type}</span>
                          <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded ${
                            ind.severity === 'high' ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'
                          }`}>
                            {ind.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">{ind.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Security Guidance
                </h4>
                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dashboard Jump */}
              <div className="text-center pt-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Aggregated Analytics on Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
