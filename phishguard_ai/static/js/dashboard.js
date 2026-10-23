/**
 * PhishGuard AI — Dashboard Frontend Client
 * Renders Chart.js threat distributions, evaluation metrics, and SQLite history.
 */

let classificationChartInstance = null;
let riskDistributionChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    const btnRefresh = document.getElementById('btnRefreshDashboard');
    const dashboardAlert = document.getElementById('dashboardAlert');
    const dashboardAlertMsg = document.getElementById('dashboardAlertMsg');

    function showError(msg) {
        dashboardAlertMsg.textContent = msg;
        dashboardAlert.classList.remove('d-none');
    }

    function hideError() {
        dashboardAlert.classList.add('d-none');
    }

    async function loadDashboard() {
        hideError();
        await Promise.all([
            fetchStats(),
            fetchModelMetrics(),
            fetchHistory()
        ]);
    }

    async function fetchStats() {
        try {
            const res = await fetch('/api/stats');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            // Stats numbers
            document.getElementById('statTotalScans').textContent = data.total_scans ?? 0;
            document.getElementById('statPhishingScans').textContent = data.phishing_count ?? 0;
            document.getElementById('statLegitScans').textContent = data.legitimate_count ?? 0;
            document.getElementById('statHighRiskScans').textContent = data.high_risk_count ?? 0;
            document.getElementById('statPhishRatio').textContent = `${data.phishing_ratio ?? 0}%`;

            renderCharts(data);
        } catch (err) {
            console.error("Stats load error:", err);
            showError("Unable to load scan statistics. Ensure server is running.");
        }
    }

    async function fetchModelMetrics() {
        try {
            const res = await fetch('/api/model-metrics');
            if (!res.ok) {
                document.getElementById('modelStatusBadge').textContent = 'Metrics Unavailable';
                return;
            }
            const data = await res.json();

            document.getElementById('metricAccuracy').textContent = `${(data.accuracy * 100).toFixed(1)}%`;
            document.getElementById('metricPrecision').textContent = `${(data.precision * 100).toFixed(1)}%`;
            document.getElementById('metricRecall').textContent = `${(data.recall * 100).toFixed(1)}%`;
            document.getElementById('metricF1').textContent = `${(data.f1_score * 100).toFixed(1)}%`;

            if (data.confusion_matrix) {
                document.getElementById('cmTN').textContent = `TN: ${data.confusion_matrix.true_negatives_legitimate}`;
                document.getElementById('cmFP').textContent = `FP: ${data.confusion_matrix.false_positives}`;
                document.getElementById('cmFN').textContent = `FN: ${data.confusion_matrix.false_negatives}`;
                document.getElementById('cmTP').textContent = `TP: ${data.confusion_matrix.true_positives_phishing}`;
            }

            if (data.trained_at) {
                const dt = new Date(data.trained_at).toLocaleString();
                document.getElementById('modelTrainedTimestamp').textContent = `Model trained on ${dt} (${data.vocabulary_size} vocabulary terms)`;
            }
        } catch (err) {
            console.error("Metrics load error:", err);
        }
    }

    async function fetchHistory() {
        const tbody = document.getElementById('historyTableBody');
        const countBadge = document.getElementById('historyCountBadge');

        try {
            const res = await fetch('/api/history');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const rows = data.history || [];

            countBadge.textContent = `${rows.length} Record${rows.length === 1 ? '' : 's'}`;

            if (rows.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-secondary">
                    <i class="bi bi-inbox fs-4 d-block mb-1"></i>
                    No scans recorded yet. Use the Scanner page to analyze an email.
                </td></tr>`;
                return;
            }

            tbody.innerHTML = '';
            rows.forEach(r => {
                const tr = document.createElement('tr');
                const isPhish = r.predicted_class === 'phishing';
                const classBadge = isPhish ? '<span class="badge bg-danger-subtle text-danger border border-danger">Phishing</span>'
                                           : '<span class="badge bg-success-subtle text-success border border-success">Legitimate</span>';
                
                let riskBadge = '<span class="badge bg-success-subtle text-success">Low</span>';
                if (r.risk_level === 'High') {
                    riskBadge = '<span class="badge bg-danger-subtle text-danger">High</span>';
                } else if (r.risk_level === 'Medium') {
                    riskBadge = '<span class="badge bg-warning-subtle text-warning">Medium</span>';
                }

                tr.innerHTML = `
                    <td class="font-mono text-cyan">${escapeHTML(r.scan_id)}</td>
                    <td class="extra-small text-secondary">${escapeHTML(r.timestamp)}</td>
                    <td class="extra-small text-light font-mono">${escapeHTML(r.sender_domain || 'N/A')}</td>
                    <td class="text-truncate" style="max-width: 220px;" title="${escapeHTML(r.subject_snippet)}">${escapeHTML(r.subject_snippet)}</td>
                    <td>${classBadge}</td>
                    <td>${riskBadge}</td>
                    <td class="font-mono text-cyan">${Math.round(r.confidence * 100)}%</td>
                    <td><span class="badge bg-dark text-secondary">${r.indicator_count}</span></td>
                `;
                tbody.appendChild(tr);
            });
        } catch (err) {
            console.error("History load error:", err);
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-danger">
                Error loading history: ${escapeHTML(err.message)}
            </td></tr>`;
        }
    }

    function renderCharts(stats) {
        if (typeof Chart === 'undefined') return;

        // Classification Donut Chart
        const ctxPie = document.getElementById('classificationChart');
        if (ctxPie) {
            if (classificationChartInstance) {
                classificationChartInstance.destroy();
            }

            const phish = stats.phishing_count || 0;
            const legit = stats.legitimate_count || 0;
            const emptyData = (phish === 0 && legit === 0);

            classificationChartInstance = new Chart(ctxPie, {
                type: 'doughnut',
                data: {
                    labels: emptyData ? ['No Data'] : ['Phishing', 'Legitimate'],
                    datasets: [{
                        data: emptyData ? [1] : [phish, legit],
                        backgroundColor: emptyData ? ['#334155'] : ['#ef4444', '#10b981'],
                        borderColor: '#0b1329',
                        borderWidth: 3,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    cutout: '70%'
                }
            });
        }

        // Risk Bar Chart
        const ctxBar = document.getElementById('riskDistributionChart');
        if (ctxBar) {
            if (riskDistributionChartInstance) {
                riskDistributionChartInstance.destroy();
            }

            riskDistributionChartInstance = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
                    datasets: [{
                        label: 'Evaluations',
                        data: [stats.high_risk_count || 0, stats.medium_risk_count || 0, stats.low_risk_count || 0],
                        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#94a3b8' },
                            grid: { display: false }
                        },
                        y: {
                            ticks: { color: '#94a3b8', stepSize: 1 },
                            grid: { color: 'rgba(255, 255, 255, 0.05)' }
                        }
                    }
                }
            });
        }
    }

    function escapeHTML(str) {
        if (!str) return '';
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }

    btnRefresh.addEventListener('click', loadDashboard);
    loadDashboard();
});
