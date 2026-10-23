/**
 * PhishGuard AI — Application Root
 * Intelligent Email Security Powered by Machine Learning
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ScannerPage } from './pages/ScannerPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { HelpPage } from './pages/HelpPage';
import { CodeExplorerPage } from './pages/CodeExplorerPage';
import { TestRunnerPage } from './pages/TestRunnerPage';
import { ScanRecord } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Initial demonstration telemetry records (representing SQLite database state)
  const [records, setRecords] = useState<ScanRecord[]>([
    {
      id: 1,
      scan_id: 'PG-10192',
      timestamp: '10:14:22 AM',
      sender_domain: 'paypaI-sec-auth.com',
      subject_snippet: 'URGENT: Your Account Has Been Temporarily Suspended',
      predicted_class: 'phishing',
      risk_level: 'High',
      confidence: 0.964,
      indicator_count: 4
    },
    {
      id: 2,
      scan_id: 'PG-10193',
      timestamp: '10:28:05 AM',
      sender_domain: 'university.edu',
      subject_snippet: 'Notice: Spring Semester Research Grants & Lab Access',
      predicted_class: 'legitimate',
      risk_level: 'Low',
      confidence: 0.912,
      indicator_count: 0
    },
    {
      id: 3,
      scan_id: 'PG-10194',
      timestamp: '10:45:19 AM',
      sender_domain: 'micro-soft-sec-auth.xyz',
      subject_snippet: 'Action Required: Your Microsoft 365 Password Expires',
      predicted_class: 'phishing',
      risk_level: 'High',
      confidence: 0.958,
      indicator_count: 3
    }
  ]);

  const handleScanCompleted = (newRecord: ScanRecord) => {
    setRecords(prev => [newRecord, ...prev]);
  };

  const handleClearHistory = () => {
    setRecords([]);
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 flex flex-column flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Cybersecurity Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'scanner' && (
          <ScannerPage 
            onScanCompleted={handleScanCompleted} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage 
            records={records} 
            onClearHistory={handleClearHistory} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}

        {activeTab === 'help' && (
          <HelpPage />
        )}

        {activeTab === 'code' && (
          <CodeExplorerPage />
        )}

        {activeTab === 'tests' && (
          <TestRunnerPage />
        )}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
