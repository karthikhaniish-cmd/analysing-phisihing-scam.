/**
 * PhishGuard AI — Scanner Frontend Client
 * Handles form validation, benchmark loading, and asynchronous prediction requests.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const form = document.getElementById('scannerForm');
    const senderInput = document.getElementById('senderInput');
    const subjectInput = document.getElementById('subjectInput');
    const bodyInput = document.getElementById('bodyInput');
    const urlInput = document.getElementById('urlInput');
    const charCount = document.getElementById('charCount');

    // Buttons
    const btnSubmit = document.getElementById('btnSubmit');
    const btnSubmitText = document.getElementById('btnSubmitText');
    const btnSubmitIcon = document.getElementById('btnSubmitIcon');
    const btnSubmitSpinner = document.getElementById('btnSubmitSpinner');
    const btnClear = document.getElementById('btnClear');
    const btnLoadPhish = document.getElementById('btnLoadPhish');
    const btnLoadLegit = document.getElementById('btnLoadLegit');

    // Alerts & Cards
    const validationAlert = document.getElementById('validationAlert');
    const validationMessage = document.getElementById('validationMessage');
    const resultsPlaceholder = document.getElementById('resultsPlaceholder');
    const resultsLoading = document.getElementById('resultsLoading');
    const resultsCard = document.getElementById('resultsCard');

    // Result Display Elements
    const resultClassText = document.getElementById('resultClassText');
    const resultRiskBadge = document.getElementById('resultRiskBadge');
    const resultConfidenceText = document.getElementById('resultConfidenceText');
    const resultProgressBar = document.getElementById('resultProgressBar');
    const resultScanId = document.getElementById('resultScanId');
    const resultSenderText = document.getElementById('resultSenderText');
    const resultSubjectText = document.getElementById('resultSubjectText');
    const resultIndicatorCount = document.getElementById('resultIndicatorCount');
    const resultIndicatorsList = document.getElementById('resultIndicatorsList');
    const resultRecList = document.getElementById('resultRecList');

    // Benchmark Pre-sets
    const benchmarkSamples = {
        phishing: {
            sender: "security-support@paypaI-sec-auth.com",
            subject: "URGENT: Your Account Has Been Temporarily Suspended",
            body: "Dear Customer,\n\nWe detected unauthorized access to your account from an unrecognized IP address. To prevent permanent termination within 24 hours, you must verify your identity immediately.\n\nPlease confirm your account password, Social Security Number, and debit card PIN using the secure link below to restore full access.\n\nRegards,\nSecurity Operations Team",
            url: "http://paypaI-verify-sec.com/login-portal"
        },
        legitimate: {
            sender: "dean-academic@university.edu",
            subject: "Notice: Spring Semester Research Grants & Lab Access",
            body: "Dear Students and Research Assistants,\n\nThe application portal for Spring Semester Undergraduate Research Grants is now officially open. Proposals must be submitted via the university academic portal by Friday, November 14 at 5:00 PM EST.\n\nLab equipment maintenance will occur this Sunday morning between 8 AM and 11 AM. Please save your work accordingly.\n\nBest regards,\nOffice of Academic Affairs",
            url: "https://university.edu/research/grants-2027"
        }
    };

    // Update body char count
    bodyInput.addEventListener('input', () => {
        charCount.textContent = bodyInput.value.length;
    });

    // Load benchmark samples
    btnLoadPhish.addEventListener('click', () => {
        senderInput.value = benchmarkSamples.phishing.sender;
        subjectInput.value = benchmarkSamples.phishing.subject;
        bodyInput.value = benchmarkSamples.phishing.body;
        urlInput.value = benchmarkSamples.phishing.url;
        charCount.textContent = bodyInput.value.length;
        hideAlert();
    });

    btnLoadLegit.addEventListener('click', () => {
        senderInput.value = benchmarkSamples.legitimate.sender;
        subjectInput.value = benchmarkSamples.legitimate.subject;
        bodyInput.value = benchmarkSamples.legitimate.body;
        urlInput.value = benchmarkSamples.legitimate.url;
        charCount.textContent = bodyInput.value.length;
        hideAlert();
    });

    // Clear form
    btnClear.addEventListener('click', () => {
        form.reset();
        charCount.textContent = "0";
        hideAlert();
        showPlaceholder();
    });

    function showAlert(msg) {
        validationMessage.textContent = msg;
        validationAlert.classList.remove('d-none');
    }

    function hideAlert() {
        validationAlert.classList.add('d-none');
    }

    function showPlaceholder() {
        resultsPlaceholder.classList.remove('d-none');
        resultsLoading.classList.add('d-none');
        resultsCard.classList.add('d-none');
    }

    function showLoading() {
        resultsPlaceholder.classList.add('d-none');
        resultsLoading.classList.remove('d-none');
        resultsCard.classList.add('d-none');

        btnSubmit.disabled = true;
        btnSubmitSpinner.classList.remove('d-none');
        btnSubmitIcon.classList.add('d-none');
        btnSubmitText.textContent = "Analyzing...";
    }

    function hideLoading() {
        btnSubmit.disabled = false;
        btnSubmitSpinner.classList.add('d-none');
        btnSubmitIcon.classList.remove('d-none');
        btnSubmitText.textContent = "Analyze Email";
        resultsLoading.classList.add('d-none');
    }

    // Submit handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();

        const sender = senderInput.value.trim();
        const subject = subjectInput.value.trim();
        const body = bodyInput.value.trim();
        const url = urlInput.value.trim();

        if (!subject && !body) {
            showAlert("Validation Error: Please provide an Email Subject or Email Body Content.");
            return;
        }

        showLoading();

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sender, subject, body, url })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Server returned error status ${response.status}`);
            }

            renderResults(data);
        } catch (err) {
            console.error("Scan error:", err);
            showAlert(`Analysis Error: ${err.message}`);
            showPlaceholder();
        } finally {
            hideLoading();
        }
    });

    function renderResults(data) {
        resultsPlaceholder.classList.add('d-none');
        resultsLoading.classList.add('d-none');
        resultsCard.classList.remove('d-none');

        const isPhish = data.prediction === 'phishing';
        const risk = data.risk_level;

        // Styling based on classification & risk
        resultClassText.textContent = isPhish ? 'Phishing Threat' : 'Legitimate Email';
        resultClassText.className = isPhish ? 'fw-extrabold mb-0 text-danger' : 'fw-extrabold mb-0 text-success';

        // Risk badge
        resultRiskBadge.textContent = `${risk} Risk`;
        if (risk === 'High') {
            resultRiskBadge.className = 'badge px-3 py-2 fw-bold fs-6 bg-danger border border-danger text-white';
            resultsCard.style.borderColor = 'rgba(239, 68, 68, 0.6)';
            resultProgressBar.className = 'progress-bar bg-danger';
        } else if (risk === 'Medium') {
            resultRiskBadge.className = 'badge px-3 py-2 fw-bold fs-6 bg-warning text-dark border border-warning';
            resultsCard.style.borderColor = 'rgba(245, 158, 11, 0.6)';
            resultProgressBar.className = 'progress-bar bg-warning';
        } else {
            resultRiskBadge.className = 'badge px-3 py-2 fw-bold fs-6 bg-success border border-success text-white';
            resultsCard.style.borderColor = 'rgba(16, 185, 129, 0.6)';
            resultProgressBar.className = 'progress-bar bg-success';
        }

        // Confidence
        resultConfidenceText.textContent = `${data.confidence_percentage}%`;
        resultProgressBar.style.width = `${data.confidence_percentage}%`;
        resultScanId.textContent = `ID: ${data.scan_id}`;

        // Header context
        resultSenderText.textContent = data.sender || '(None provided)';
        resultSubjectText.textContent = data.subject || '(None provided)';

        // Indicators
        const indicators = data.indicators || [];
        resultIndicatorCount.textContent = `${indicators.length} Sign${indicators.length === 1 ? '' : 's'}`;
        resultIndicatorsList.innerHTML = '';

        if (indicators.length === 0) {
            const noInd = document.createElement('div');
            noInd.className = 'p-2 rounded bg-dark border border-dark extra-small text-secondary';
            noInd.innerHTML = '<i class="bi bi-shield-check text-success me-1"></i> No suspicious heuristics triggered.';
            resultIndicatorsList.appendChild(noInd);
        } else {
            indicators.forEach(ind => {
                const item = document.createElement('div');
                item.className = 'p-2 rounded bg-black border border-dark extra-small';
                const badgeColor = ind.severity === 'high' ? 'text-danger bg-danger-subtle' : 'text-warning bg-warning-subtle';
                
                const headerDiv = document.createElement('div');
                headerDiv.className = 'd-flex justify-content-between align-items-center mb-1';
                headerDiv.innerHTML = `<strong class="text-light">${escapeHTML(ind.type)}</strong>
                                       <span class="badge ${badgeColor} extra-small">${escapeHTML(ind.severity.toUpperCase())}</span>`;
                
                const descP = document.createElement('div');
                descP.className = 'text-secondary';
                descP.textContent = ind.description;

                item.appendChild(headerDiv);
                item.appendChild(descP);
                resultIndicatorsList.appendChild(item);
            });
        }

        // Recommendations
        resultRecList.innerHTML = '';
        (data.recommendations || []).forEach(rec => {
            const li = document.createElement('li');
            li.className = 'd-flex align-items-start gap-2';
            li.innerHTML = `<i class="bi bi-arrow-right-short text-cyan fs-6 flex-shrink-0"></i><span>${escapeHTML(rec)}</span>`;
            resultRecList.appendChild(li);
        });
    }

    function escapeHTML(str) {
        if (!str) return '';
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }
});
