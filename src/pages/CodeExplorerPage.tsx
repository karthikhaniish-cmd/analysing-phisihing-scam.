import React, { useState } from 'react';
import { 
  Code2, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  FolderTree, 
  FileText, 
  CheckCircle2, 
  Terminal, 
  Sparkles 
} from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { PROJECT_FILES, ProjectFile } from '../projectFiles';

export const CodeExplorerPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('phishguard_ai');

      // Add project files
      for (const file of PROJECT_FILES) {
        rootFolder?.file(file.path, file.content);
      }

      // Add data/emails.csv
      const emailsCsvSample = `email_text,label
"URGENT: Your PayPal account has been suspended due to suspicious activity. Click here http://paypaI-verify-sec.com/login to verify your identity immediately or your account will be permanently closed within 24 hours.",phishing
"Dear Student, the campus library hours have been extended for the upcoming final exam week. Quiet study floors will remain open until 2 AM starting Monday. Best regards, University Library Services.",legitimate
"Action Required: We detected an unauthorized login to your Microsoft Office 365 account from IP 192.168.1.105. Please reset your password immediately at http://micro-soft-sec-auth.xyz/reset to prevent lock out.",phishing
"Hi team, attached is the revised agenda for tomorrow's engineering sync at 10:00 AM PST. Please review the quarterly milestone slides before the call. Thanks, Sarah.",legitimate
"Your Amazon order #402-9817291-88123 has been delayed due to severe weather conditions. Expected delivery is now Thursday, Oct 24. Track your package anytime in your Amazon mobile app.",legitimate
"FINAL NOTICE: Internal Revenue Service IRS has filed a lawsuit against your SSN. Call 1-800-555-0199 or submit your bank routing number and tax PIN at http://irs-tax-settlement-gov.top/claim immediately.",phishing
"SECURITY ALERT: Unrecognized device logged into your Wells Fargo Online Banking. If this was not you, confirm your account number, debit card CVV, and PIN code at http://wellsfargo-auth-portal.cc.",phishing
"Reminder: Your annual dental checkup is scheduled for Friday, November 3 at 11:30 AM at Metro Dental Care. Please arrive 10 minutes early to complete standard medical history forms.",legitimate`;

      rootFolder?.file('data/emails.csv', emailsCsvSample);
      rootFolder?.file('models/.gitkeep', '# Models directory marker\n');

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'phishguard_ai_college_project.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-1.5">
            <Code2 className="w-3.5 h-3.5" />
            <span>Academic Source Code & Distribution</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Python Project Explorer
          </h1>
          <p className="text-xs text-slate-400">
            Inspect the complete Flask backend, ML pipeline, test suite, and download the full runnable project bundle.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isZipping ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Packaging ZIP...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download VS Code Project (.ZIP)</span>
            </>
          )}
        </button>
      </div>

      {/* IDE Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Sidebar File Tree */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0b1329] border border-slate-800 p-4 shadow-xl space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold text-white">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <span>phishguard_ai/</span>
          </div>

          <div className="space-y-1">
            {PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase">{file.language}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ready for Submission</span>
            </div>
            <p className="leading-relaxed">
              Contains the complete Python source code ready to be opened in VS Code on Windows, Mac, or Linux.
            </p>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0b1329] border border-slate-800 shadow-xl overflow-hidden">
          
          {/* File Tab Bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs text-white">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">{selectedFile.path}</span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* File Description */}
          <div className="px-5 py-2.5 bg-slate-900/40 border-b border-slate-800 text-xs text-slate-400">
            {selectedFile.description}
          </div>

          {/* Editor Body */}
          <div className="p-5 overflow-x-auto bg-[#070d19] max-h-[550px] font-mono text-xs text-slate-200 leading-relaxed">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
