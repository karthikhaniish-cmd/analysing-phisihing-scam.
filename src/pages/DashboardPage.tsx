import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Radar, 
  Cpu, 
  Download, 
  Trash2, 
  Search, 
  RefreshCw,
  Info
} from 'lucide-react';
import { ModelMetrics, ScanRecord } from '../types';

interface DashboardPageProps {
  records: ScanRecord[];
  onClearHistory: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  records, 
  onClearHistory, 
  setActiveTab 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<'all' | 'phishing' | 'legitimate'>('all');

  // Real Model metrics from our training run
  const metrics: ModelMetrics = {
    model_type: 'Multinomial Naive Bayes with TF-IDF Vectorizer',
    trained_at: '2026-10-22',
    total_samples: 61,
    train_samples: 45,
    test_samples: 16,
    class_distribution: {
      phishing: 30,
      legitimate: 31
    },
    accuracy: 0.875,
    precision: 0.875,
    recall: 0.875,
    f1_score: 0.875,
    confusion_matrix: {
      true_negatives_legitimate: 7,
      false_positives: 1,
      false_negatives: 1,
      true_positives_phishing: 7
    },
    vocabulary_size: 546,
    status: 'trained_successfully'
  };

  // Telemetry counts
  const totalScans = records.length;
  const phishingCount = records.filter(r => r.predicted_class === 'phishing').length;
  const legitCount = records.filter(r => r.predicted_class === 'legitimate').length;
  const highRiskCount = records.filter(r => r.risk_level === 'High').length;
  const mediumRiskCount = records.filter(r => r.risk_level === 'Medium').length;
  const lowRiskCount = records.filter(r => r.risk_level === 'Low').length;

  const phishRatio = totalScans > 0 ? Math.round((phishingCount / totalScans) * 100) : 0;

  // Filtered rows
  const filteredRecords = records.filter(r => {
    const matchesSearch = r.scan_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.sender_domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.subject_snippet.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterClass === 'all' || r.predicted_class === filterClass;
    return matchesSearch && matchesFilter;
  });

  const exportCSV = () => {
    if (records.length === 0) return;
    const headers = ['Scan ID', 'Timestamp', 'Sender Domain', 'Subject Snippet', 'Classification', 'Risk Level', 'Confidence', 'Indicators'];
    const rows = records.map(r => [
      r.scan_id,
      r.timestamp,
      `"${r.sender_domain.replace(/"/g, '""')}"`,
      `"${r.subject_snippet.replace(/"/g, '""')}"`,
      r.predicted_class,
      r.risk_level,
      `${Math.round(r.confidence * 100)}%`,
      r.indicator_count
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `phishguard_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Cybersecurity Analytics & Telemetry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Dashboard</h1>
          <p className="text-xs text-slate-400">
            Real-time inference telemetry, SQLite scan logs, and model holdout evaluation metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <button
              onClick={exportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('scanner')}
            className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Radar className="w-3.5 h-3.5" />
            <span>New Email Scan</span>
          </button>
        </div>
      </div>

      {/* 4 Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total */}
        <div className="rounded-2xl bg-[#0b1329] border border-slate-800 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Total Scans</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Radar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalScans}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-cyan-400">&bull;</span> Stored in local SQLite database
          </div>
        </div>

        {/* Phishing */}
        <div className="rounded-2xl bg-[#0b1329] border border-slate-800 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Phishing Threats</span>
            <div className="w-8 h-8 rounded-lg bg-red-950/80 text-red-400 flex items-center justify-center border border-red-800/60">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-red-400 font-mono">{phishingCount}</div>
          <div className="text-[11px] text-slate-500">
            <span className="text-red-400 font-semibold">{phishRatio}%</span> of evaluated messages
          </div>
        </div>

        {/* Legitimate */}
        <div className="rounded-2xl bg-[#0b1329] border border-slate-800 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Legitimate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{legitCount}</div>
          <div className="text-[11px] text-slate-500">
            <span>Verified standard correspondence</span>
          </div>
        </div>

        {/* High Risk */}
        <div className="rounded-2xl bg-[#0b1329] border border-slate-800 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">High Risk Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center border border-amber-800/60">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{highRiskCount}</div>
          <div className="text-[11px] text-slate-500">
            <span>Quarantine recommended</span>
          </div>
        </div>

      </div>

      {/* Visual Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Classification Doughnut Visual */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0b1329] border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Threat Classification Ratio
            </h3>
            <span className="text-[10px] font-mono text-slate-500">{totalScans} samples</span>
          </div>

          {/* SVG Doughnut */}
          <div className="h-56 flex items-center justify-center relative">
            {totalScans === 0 ? (
              <div className="text-center space-y-2 text-slate-500 text-xs">
                <Radar className="w-8 h-8 mx-auto text-slate-600" />
                <p>No scans recorded yet.<br/>Perform a scan to populate visual telemetry.</p>
              </div>
            ) : (
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-slate-800"
                    strokeWidth="4.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Phishing Segment */}
                  <path
                    className="text-red-500 transition-all duration-700"
                    strokeDasharray={`${phishRatio}, 100`}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Legitimate Segment */}
                  <path
                    className="text-emerald-500 transition-all duration-700"
                    strokeDasharray={`${100 - phishRatio}, 100`}
                    strokeDashoffset={`-${phishRatio}`}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                {/* Center Stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-white font-mono">{phishRatio}%</span>
                  <span className="text-[10px] text-slate-400 font-mono">PHISHING</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-6 text-xs border-t border-slate-800 pt-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-slate-300">Phishing ({phishingCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Legitimate ({legitCount})</span>
            </div>
          </div>
        </div>

        {/* Risk Severity Breakdown Bar Visual */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0b1329] border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Risk Severity Tiers
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Heuristic Triangulation</span>
          </div>

          <div className="h-56 flex flex-col justify-center space-y-5 px-2">
            
            {/* High Risk Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  High Risk (Critical Threat)
                </span>
                <span className="font-mono text-red-400 font-bold">{highRiskCount} scans</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalScans > 0 ? (highRiskCount / totalScans) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium Risk Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Medium Risk (Mixed Indicators)
                </span>
                <span className="font-mono text-amber-400 font-bold">{mediumRiskCount} scans</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalScans > 0 ? (mediumRiskCount / totalScans) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Low Risk Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Low Risk (Typical Legitimate)
                </span>
                <span className="font-mono text-emerald-400 font-bold">{lowRiskCount} scans</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalScans > 0 ? (lowRiskCount / totalScans) * 100 : 0}%` }}
                />
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-500">
            <span>Risk severity is synthesized from Bayes probability and detected deceptive heuristics.</span>
          </div>
        </div>

      </div>

      {/* Model Performance & Confusion Matrix Card */}
      <div className="rounded-2xl bg-[#0b1329] border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Machine Learning Model Evaluation Metrics
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated on holdout test partition (25% stratified test split) trained on 61 email samples.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            Vocabulary: {metrics.vocabulary_size} terms
          </span>
        </div>

        {/* 4 Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Accuracy</span>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">
              {(metrics.accuracy * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-500">(TP + TN) / Total</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Precision</span>
            <div className="text-2xl font-extrabold text-white font-mono">
              {(metrics.precision * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-500">TP / (TP + FP)</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Recall</span>
            <div className="text-2xl font-extrabold text-white font-mono">
              {(metrics.recall * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-500">TP / (TP + FN)</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-mono">F1-Score</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              {(metrics.f1_score * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-500">Harmonic Mean</div>
          </div>
        </div>

        {/* Confusion Matrix Table */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 space-y-2">
            <h4 className="text-xs font-bold text-slate-300">Confusion Matrix (16 Test Documents)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400">
                    <th className="p-2 border border-slate-800 text-left">Ground Truth</th>
                    <th className="p-2 border border-slate-800 text-emerald-400">Pred: Legit</th>
                    <th className="p-2 border border-slate-800 text-red-400">Pred: Phish</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-slate-800 text-left text-slate-300 font-semibold bg-slate-950">
                      Actual: Legit
                    </td>
                    <td className="p-2 border border-slate-800 bg-emerald-950/40 text-emerald-300 font-bold">
                      TN: {metrics.confusion_matrix.true_negatives_legitimate}
                    </td>
                    <td className="p-2 border border-slate-800 bg-red-950/30 text-red-400">
                      FP: {metrics.confusion_matrix.false_positives}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-800 text-left text-slate-300 font-semibold bg-slate-950">
                      Actual: Phish
                    </td>
                    <td className="p-2 border border-slate-800 bg-red-950/30 text-red-400">
                      FN: {metrics.confusion_matrix.false_negatives}
                    </td>
                    <td className="p-2 border border-slate-800 bg-emerald-950/40 text-emerald-300 font-bold">
                      TP: {metrics.confusion_matrix.true_positives_phishing}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:col-span-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Info className="w-4 h-4 shrink-0" />
              <span>Cybersecurity Precision vs Recall Trade-off</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              In email threat detection, a <strong>False Negative (FN)</strong> is hazardous because a missed phishing attack allows account takeover or wire fraud. A <strong>False Positive (FP)</strong> causes operational friction by quarantining benign messages. Our Multinomial Naive Bayes model strikes a calibrated 87.5% balance across both risks.
            </p>
          </div>
        </div>

      </div>

      {/* Recent Scan History Table */}
      <div className="rounded-2xl bg-[#0b1329] border border-slate-800 p-6 shadow-xl space-y-4">
        
        {/* Table Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Recent Scan Telemetry</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              {filteredRecords.length} Records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, domain, snippet..."
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Filter */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="all">All Classes</option>
              <option value="phishing">Phishing Only</option>
              <option value="legitimate">Legitimate Only</option>
            </select>

            {records.length > 0 && (
              <button
                onClick={onClearHistory}
                className="px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-300 text-xs transition-all flex items-center gap-1 cursor-pointer"
                title="Clear local scan logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Scan ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Sender Domain</th>
                <th className="py-2.5 px-3">Subject Snippet</th>
                <th className="py-2.5 px-3">Prediction</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3 text-center">Indicators</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    <Radar className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                    No scan records matching your filter. Use the Scanner to test an email.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-cyan-500/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{r.scan_id}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{r.timestamp}</td>
                    <td className="py-3 px-3 font-mono text-slate-300 text-[11px] truncate max-w-[140px]">{r.sender_domain}</td>
                    <td className="py-3 px-3 text-slate-200 truncate max-w-[200px]" title={r.subject_snippet}>{r.subject_snippet}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        r.predicted_class === 'phishing'
                          ? 'bg-red-950/80 text-red-400 border-red-800/80'
                          : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                      }`}>
                        {r.predicted_class === 'phishing' ? 'Phishing' : 'Legitimate'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.risk_level === 'High'
                          ? 'text-red-400'
                          : r.risk_level === 'Medium'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {r.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {Math.round(r.confidence * 100)}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[11px]">
                        {r.indicator_count}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
