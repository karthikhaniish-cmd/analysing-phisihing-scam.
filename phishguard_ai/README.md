# PhishGuard AI — Phishing Email Detection System Using Machine Learning

> **Academic Capstone Project in Cybersecurity & Machine Learning**  
> **Tagline:** Intelligent Email Security Powered by Machine Learning

---

## 1. Project Overview

**PhishGuard AI** is a complete, full-stack cybersecurity web application designed to detect, classify, and analyze phishing emails in real time. It utilizes Natural Language Processing (NLP) with **TF-IDF (Term Frequency-Inverse Document Frequency)** feature vectorization and a trained **Multinomial Naive Bayes** classifier, paired with a transparent heuristic risk scoring engine.

### Key Capabilities:
- **Real-Time Threat Detection:** Analyzes email headers, subjects, bodies, and embedded links.
- **Multinomial Naive Bayes:** Probabilistic text classification trained on curated phishing and legitimate corpuses.
- **Explainable Indicators:** Flags urgent language, sensitive credential harvesting, typosquatting domains, and insecure protocols.
- **Interactive Cybersecurity Dashboard:** Live telemetry powered by Chart.js, evaluation metrics (Accuracy, Precision, Recall, F1), confusion matrix, and SQLite scan history.
- **Academic Rigor:** Stratified train/test holdout validation with strictly no data leakage.

---

## 2. Technology Stack

- **Backend:** Python 3.10+, Flask
- **Machine Learning:** Scikit-learn (TF-IDF Vectorizer, Multinomial Naive Bayes), Pandas, Joblib
- **Database:** SQLite 3 (telemetry and scan logs without storing raw sensitive bodies)
- **Frontend:** HTML5, CSS3, Bootstrap 5, Vanilla JavaScript, Jinja2 Templates
- **Data Visualization:** Chart.js

---

## 3. Windows & VS Code Installation Guide

### Prerequisites
1. **Python 3.10+**: Download and install from [python.org](https://www.python.org/downloads/).  
   *Ensure you check the box: "Add python.exe to PATH" during installation.*
2. **Visual Studio Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/).

---

### Step-by-Step Setup Commands (Windows Command Prompt)

Open **Command Prompt (cmd.exe)** or the terminal in VS Code inside the `phishguard_ai` project directory:

```cmd
:: 1. Create a Python virtual environment
python -m venv venv

:: 2. Activate the virtual environment
venv\Scripts\activate

:: 3. Upgrade pip to the latest version
python -m pip install --upgrade pip

:: 4. Install all dependencies from requirements.txt
pip install -r requirements.txt

:: 5. Train the Machine Learning Model
python train_model.py

:: 6. Launch the Flask Web Server
python app.py
```

### PowerShell Alternative
If you are using **Windows PowerShell**:
```powershell
# 1. Create virtual environment
python -m venv venv

# 2. If PowerShell blocks script execution, run once as Administrator:
# Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
venv\Scripts\Activate.ps1

# 3. Install requirements
python -m pip install --upgrade pip
pip install -r requirements.txt

# 4. Train model & run
python train_model.py
python app.py
```

---

## 4. Accessing the Application

Once `python app.py` starts, open your web browser and navigate to:
```
http://127.0.0.1:5000
```

### Available Pages:
- **Home:** `http://127.0.0.1:5000/` — Project overview and workflow.
- **Email Scanner:** `http://127.0.0.1:5000/scanner` — Real-time email testing interface.
- **Dashboard:** `http://127.0.0.1:5000/dashboard` — Telemetry, charts, and model scores.
- **About:** `http://127.0.0.1:5000/about` — Methodology, mathematics, and threat matrix.
- **Help:** `http://127.0.0.1:5000/help` — Guide and FAQ.

---

## 5. Running Automated Tests

Run the comprehensive test suite verifying all routes, API endpoints, validations, and model metrics:

Using Pytest:
```cmd
python -m pytest -q
```

Or using Python's built-in Unittest runner:
```cmd
python tests/test_app.py
```

---

## 6. Project File Structure

```text
phishguard_ai/
    app.py                   # Main Flask application and REST API endpoints
    train_model.py           # ML training pipeline (TF-IDF + Naive Bayes)
    requirements.txt         # Project dependencies
    README.md                # Documentation and Windows setup guide
    phishguard.db            # Auto-initialized SQLite database
    data/
        emails.csv           # Labeled email training dataset
    models/
        .gitkeep             # Models directory marker
        phishing_model.joblib# Trained fitted Scikit-learn pipeline
        model_metrics.json   # Actual evaluation metrics & confusion matrix
    templates/
        base.html            # Common navigation and layout template
        index.html           # Landing page with workflow & features
        scanner.html         # Interactive email scanning form & results card
        dashboard.html       # Visual analytics, charts, & history
        about.html           # Mathematical formulas & threat taxonomy
        help.html            # Setup documentation & troubleshooting
        404.html             # Custom HTTP 404 page
        500.html             # Custom HTTP 500 page
    static/
        css/
            style.css        # Cybersecurity dark navy styling
        js/
            scanner.js       # Asynchronous scanning client
            dashboard.js     # Chart.js visualization engine
    tests/
        test_app.py          # Automated unit & integration test suite
```

---

## 7. Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"Machine learning model is missing"** | Model file not trained yet | Run `python train_model.py` to generate `models/phishing_model.joblib`. |
| **Port 5000 Already in Use** | Another application is bound to 5000 | In `app.py`, change `app.run(port=5000)` to `app.run(port=5001)`. |
| **PowerShell script execution disabled** | Windows security policy | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` in PowerShell. |
| **ModuleNotFoundError** | Dependencies not installed in active venv | Ensure `venv\Scripts\activate` was run, then `pip install -r requirements.txt`. |
| **CSV missing columns** | Dataset format mismatch | Ensure `data/emails.csv` has headers `email_text` and `label`. |

---

## 8. Security & Ethical Disclaimer

PhishGuard AI is an academic demonstration system. It evaluates text strictly in memory and parses URLs syntactically without network execution. In real-world enterprise environments, machine learning should be paired with technical email authentication standards (SPF, DKIM, DMARC) and continuous user awareness training.
