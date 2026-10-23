import React from 'react';
import { 
  BookOpen, 
  Cpu, 
  Calculator, 
  ShieldCheck, 
  ShieldAlert, 
  Terminal, 
  Layers, 
  CheckCircle2,
  Lock,
  FileCode2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Methodology & Theory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About PhishGuard AI
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          An engineering capstone project investigating Natural Language Processing (NLP) feature vectorization and supervised probabilistic threat classification.
        </p>
      </div>

      {/* Abstract Card */}
      <div className="rounded-3xl bg-[#0b1329] border border-slate-800 p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-xl font-bold text-white">Project Abstract & Motivation</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Email phishing constitutes the primary attack vector for enterprise breaches, credential leakage, and business email compromise (BEC). Attackers continually manipulate human urgency, impersonate authoritative figures, and deploy homoglyph spoofing to bypass legacy keyword blacklists.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>PhishGuard AI</strong> demonstrates an end-to-end detection pipeline that extracts sublinear TF-IDF features from raw email text and evaluates posterior probabilities using a trained Multinomial Naive Bayes model. By pairing statistical text classification with explainable heuristic indicators, the system delivers high accuracy without executing untrusted code or initiating outbound HTTP requests.
            </p>
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-cyan-400 font-bold flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Data Pipeline Stages</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div>1. Raw Header & Body Normalization</div>
              <div>2. Regular Expression Tokenization</div>
              <div>3. Stop-Word Removal (English 120-token set)</div>
              <div>4. Sublinear TF-IDF Frequency Matrix</div>
              <div>5. Multinomial Naive Bayes MAP Estimation</div>
              <div>6. Heuristic Deception & Typosquatting Audit</div>
              <div className="text-emerald-400 pt-1 border-t border-slate-800 font-bold">
                &rarr; Risk Level & Security Recommendations
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Formulations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* TF-IDF Formula */}
        <div className="rounded-2xl bg-[#0b1329] border border-slate-800 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Calculator className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">1. TF-IDF Feature Extraction</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Term Frequency-Inverse Document Frequency maps unstructured textual tokens into a numerical vector space by balancing local frequency against global corpus rarity:
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-cyan-300 text-xs sm:text-sm py-5">
            TF-IDF(t, d, D) = TF(t, d) &times; [ log( (1 + |D|) / (1 + DF(t, D)) ) + 1 ]
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <div>
              <strong className="text-slate-200">Term Frequency (TF):</strong> Evaluates term recurrence inside an email body with sublinear logarithmic smoothing to prevent term flooding.
            </div>
            <div>
              <strong className="text-slate-200">Inverse Document Frequency (IDF):</strong> Penalizes non-discriminative ubiquitous words while rewarding specialized tokens like <em>ssn</em>, <em>paypaI</em>, or <em>suspended</em>.
            </div>
          </div>
        </div>

        {/* Multinomial Naive Bayes Formula */}
        <div className="rounded-2xl bg-[#0b1329] border border-slate-800 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Cpu className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">2. Multinomial Naive Bayes</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Computes the maximum a posteriori (MAP) class assignment given the bag-of-words vector under the conditional independence assumption:
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-cyan-300 text-xs sm:text-sm py-5">
            P(c | d) &prop; P(c) &times; &prod; [ P(w_i | c) ]^(TF-IDF(w_i, d))
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <div>
              <strong className="text-slate-200">Class Prior P(c):</strong> Empirical probability distribution of phishing vs legitimate emails observed in training data.
            </div>
            <div>
              <strong className="text-slate-200">Laplace Smoothing (&alpha; = 0.1):</strong> Eliminates zero-probability calculation collapse when encountering novel terms at inference time.
            </div>
          </div>
        </div>

      </div>

      {/* Threat Taxonomy Matrix */}
      <div className="rounded-2xl bg-[#0b1329] border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <h3 className="text-base font-bold text-white">Heuristic Threat Taxonomy Matrix</h3>
        </div>
        <p className="text-xs text-slate-400">
          In addition to statistical learning, PhishGuard AI evaluates six transparent, explainable heuristic patterns:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950">
                <th className="p-3">Threat Vector</th>
                <th className="p-3">Observed Pattern</th>
                <th className="p-3">Attacker Objective</th>
                <th className="p-3 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              <tr>
                <td className="p-3 font-semibold text-slate-200">Urgency Coercion</td>
                <td className="p-3 text-slate-400 font-mono text-[11px]">"Account suspended in 24 hours", "Immediate action"</td>
                <td className="p-3 text-slate-400">Trigger impulsive panic to bypass critical reasoning</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-bold">HIGH</span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Credential Harvesting</td>
                <td className="p-3 text-slate-400 font-mono text-[11px]">Direct requests for PIN, password, SSN, 2FA code</td>
                <td className="p-3 text-slate-400">Direct account takeover & identity impersonation</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-bold">HIGH</span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Homoglyph Typosquatting</td>
                <td className="p-3 text-slate-400 font-mono text-[11px]">paypaI.com (capital i), micro-soft.xyz</td>
                <td className="p-3 text-slate-400">Masquerade as official enterprise login endpoints</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-bold">HIGH</span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Insecure Protocol</td>
                <td className="p-3 text-slate-400 font-mono text-[11px]">Unencrypted HTTP link instead of HTTPS</td>
                <td className="p-3 text-slate-400">Man-in-the-middle transmission interception</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold">MEDIUM</span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">Domain Mismatch</td>
                <td className="p-3 text-slate-400 font-mono text-[11px]">Bank or payroll claims sent from @gmail/@yahoo mailbox</td>
                <td className="p-3 text-slate-400">Avoid commercial domain registration and SPF records</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-bold">HIGH</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
