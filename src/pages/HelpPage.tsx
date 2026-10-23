import React from 'react';
import { 
  HelpCircle, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  FileCode2, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const windowsCmds = `python -m venv venv
venv\\Scripts\\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python train_model.py
python app.py`;

  const powershellCmds = `python -m venv venv
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
venv\\Scripts\\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python train_model.py
python app.py`;

  const testCmds = `python -m pytest -q
# or
python tests/test_app.py`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Documentation & Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Help & Windows Setup Guide
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Step-by-step instructions for running PhishGuard AI locally in Visual Studio Code on Windows, interpreting threat classifications, and resolving common errors.
        </p>
      </div>

      {/* Grid: Scanner FAQs & Windows Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Operating Guide */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0b1329] border border-slate-800 p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            Operating the Email Scanner
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-200 block">1. What inputs are required?</span>
              <p className="text-slate-400 leading-relaxed">
                Either an <strong>Email Subject</strong> or <strong>Email Body Copy</strong> is required. Supplying the <strong>Sender Email</strong> and any embedded <strong>Hyperlinks</strong> improves detection accuracy by allowing domain mismatch and typosquatting inspection.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-200 block">2. How are Risk Levels defined?</span>
              <ul className="text-slate-400 space-y-1 list-disc list-inside">
                <li><strong className="text-red-400">High Risk:</strong> Classifier predicts Phishing with confidence &ge; 70% OR severe heuristic flags (credential solicitation, domain typosquatting).</li>
                <li><strong className="text-amber-400">Medium Risk:</strong> Borderline Bayes probability OR legitimate model prediction coupled with 2+ warning indicators.</li>
                <li><strong className="text-emerald-400">Low Risk:</strong> Classifier predicts Legitimate with few or zero suspicious indicators.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-200 block">3. Does PhishGuard AI click submitted links?</span>
              <p className="text-slate-400 leading-relaxed">
                <strong>No, never.</strong> PhishGuard AI parses hyperlinks purely at the syntactic and lexical level (checking for unencrypted HTTP, suspicious TLDs, IP addresses, and brand impersonation tokens). Our server never makes an outbound HTTP connection to submitted URLs.
              </p>
            </div>
          </div>
        </div>

        {/* Windows VS Code Setup */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0b1329] border border-slate-800 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              Windows VS Code Execution Commands
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              cmd.exe
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Prerequisites: Python 3.10+ installed with <em>"Add python.exe to PATH"</em> checked during installation.
          </p>

          {/* Code Block */}
          <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-cyan-300 space-y-1">
            <button
              onClick={() => copyToClipboard(windowsCmds, 1)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Copy Commands"
            >
              {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <div className="text-slate-500">// 1. Create Python virtual environment:</div>
            <div>python -m venv venv</div>
            <div className="text-slate-500 pt-1">// 2. Activate virtual environment:</div>
            <div>venv\Scripts\activate</div>
            <div className="text-slate-500 pt-1">// 3. Upgrade pip and install dependencies:</div>
            <div>python -m pip install --upgrade pip</div>
            <div>pip install -r requirements.txt</div>
            <div className="text-slate-500 pt-1">// 4. Train the ML model pipeline:</div>
            <div>python train_model.py</div>
            <div className="text-slate-500 pt-1">// 5. Run the Flask web server:</div>
            <div>python app.py</div>
            <div className="text-emerald-400 pt-1">// 6. Open in browser: http://127.0.0.1:5000</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex justify-between items-center text-slate-300 font-bold">
              <span>Run Automated Unit Tests:</span>
              <button
                onClick={() => copyToClipboard(testCmds, 2)}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedIndex === 2 ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <code className="text-cyan-400 font-mono block bg-slate-900 p-2 rounded">
              python -m pytest -q
            </code>
          </div>
        </div>

      </div>

      {/* Troubleshooting Table */}
      <div className="rounded-2xl bg-[#0b1329] border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-400" />
          Troubleshooting Common Errors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-red-400 block">Missing Model File</span>
            <p className="text-slate-400 leading-relaxed">
              If the server reports <em>"Machine learning model is missing"</em>, execute:
            </p>
            <code className="text-cyan-300 bg-slate-900 p-1.5 rounded block font-mono text-[11px]">
              python train_model.py
            </code>
            <p className="text-[11px] text-slate-500">
              This fits the pipeline on <code className="text-slate-400">data/emails.csv</code> and saves <code className="text-slate-400">models/phishing_model.joblib</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 block">Port 5000 Already in Use</span>
            <p className="text-slate-400 leading-relaxed">
              If macOS AirPlay or another application occupies port 5000, change the port in <code className="text-slate-300">app.py</code>:
            </p>
            <code className="text-cyan-300 bg-slate-900 p-1.5 rounded block font-mono text-[11px]">
              app.run(port=5001)
            </code>
            <p className="text-[11px] text-slate-500">
              Then navigate to <code className="text-slate-400">http://127.0.0.1:5001</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-sky-400 block">PowerShell Execution Policy</span>
            <p className="text-slate-400 leading-relaxed">
              If PowerShell outputs <em>"running scripts is disabled on this system"</em>:
            </p>
            <code className="text-cyan-300 bg-slate-900 p-1.5 rounded block font-mono text-[10px]">
              Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
            </code>
            <p className="text-[11px] text-slate-500">
              Or use standard Command Prompt (cmd.exe) and run <code className="text-slate-400">venv\Scripts\activate.bat</code>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
