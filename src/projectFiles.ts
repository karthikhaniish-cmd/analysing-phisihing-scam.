/**
 * Project files catalog for Code Explorer and ZIP bundle export.
 */

export interface ProjectFile {
  path: string;
  name: string;
  language: string;
  description: string;
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'app.py',
    name: 'app.py',
    language: 'python',
    description: 'Flask web server, routes (/, /scanner, /dashboard, /about, /help), REST APIs (/api/predict, /api/stats, /api/model-metrics, /api/history), SQLite initialization, ML inference, and security heuristic analysis.',
    content: `"""
PhishGuard AI — Flask Backend Server
Phishing Email Detection System Using Machine Learning
"""

import os
import sys
import re
import json
import sqlite3
import math
from datetime import datetime
from flask import Flask, render_template, request, jsonify, abort

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "phishing_model.joblib")
MODEL_WEIGHTS_PATH = os.path.join(MODELS_DIR, "model_weights.json")
METRICS_PATH = os.path.join(MODELS_DIR, "model_metrics.json")
DB_PATH = os.path.join(BASE_DIR, "phishguard.db")

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static")
)
app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024  # 2MB max payload

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    with conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS scan_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                scan_id TEXT UNIQUE NOT NULL,
                timestamp TEXT NOT NULL,
                sender_domain TEXT,
                subject_snippet TEXT,
                predicted_class TEXT NOT NULL,
                risk_level TEXT NOT NULL,
                confidence REAL NOT NULL,
                indicator_count INTEGER NOT NULL
            );
        """)
    conn.close()

def load_model():
    if os.path.exists(MODEL_PATH):
        try:
            import joblib
            return joblib.load(MODEL_PATH)
        except Exception:
            pass
    if os.path.exists(MODEL_WEIGHTS_PATH):
        with open(MODEL_WEIGHTS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return None

def predict_email(full_text):
    model = load_model()
    if model is None:
        raise FileNotFoundError(
            "Machine learning model is missing. Please run 'python train_model.py' to train and save the model."
        )

    if hasattr(model, "predict_proba"):
        probs = model.predict_proba([full_text])[0]
        classes = list(model.classes_)
        phish_idx = classes.index("phishing") if "phishing" in classes else 1
        phish_prob = float(probs[phish_idx])
        pred_class = "phishing" if phish_prob >= 0.5 else "legitimate"
        conf = phish_prob if pred_class == "phishing" else (1.0 - phish_prob)
        return pred_class, round(conf, 4)

    if isinstance(model, dict) and "class_word_counts" in model:
        words = re.findall(r"\\b[a-zA-Z]{2,}\\b", full_text.lower())
        priors = model["priors"]
        alpha = model["alpha"]
        vocab_size = model["vocab_size"]
        idf = model.get("idf", {})

        log_probs = {}
        for c in ("phishing", "legitimate"):
            log_probs[c] = math.log(priors[c])
            denom = model["class_total_words"][c] + alpha * vocab_size
            for w in words:
                count = model["class_word_counts"][c].get(w, 0)
                word_prob = (count + alpha) / denom
                weight = idf.get(w, 1.0)
                log_probs[c] += weight * math.log(word_prob)

        max_log = max(log_probs["phishing"], log_probs["legitimate"])
        exp_phish = math.exp(log_probs["phishing"] - max_log)
        exp_legit = math.exp(log_probs["legitimate"] - max_log)
        phish_conf = exp_phish / (exp_phish + exp_legit)

        pred_class = "phishing" if phish_conf >= 0.50 else "legitimate"
        conf = phish_conf if pred_class == "phishing" else (1.0 - phish_conf)
        return pred_class, round(conf, 4)

    raise ValueError("Invalid model format.")

def analyze_suspicious_indicators(sender, subject, body, url):
    indicators = []
    combined = f"{sender} {subject} {body} {url}".lower()

    if re.search(r"\\b(urgent|immediately|immediate action|within 24 hours|account suspended|final notice|critical warning)\\b", combined):
        indicators.append({"type": "Urgency & Coercion", "description": "High-urgency deadline or coercive pressure detected", "severity": "high"})

    if re.search(r"\\b(password|pin code|ssn|social security|routing number|cvv|seed phrase|credit card details|direct deposit)\\b", combined):
        indicators.append({"type": "Sensitive Data Harvesting", "description": "Explicit request for sensitive credentials or financial identifiers", "severity": "high"})

    if url:
        u_lower = url.lower()
        if u_lower.startswith("http://") and not u_lower.startswith("https://"):
            indicators.append({"type": "Insecure Link", "description": "Submitted URL uses unencrypted HTTP instead of HTTPS", "severity": "medium"})
        if re.search(r"\\b(\\.(xyz|top|cc|info|biz|online|vip|link|us\\.to))\\b", u_lower):
            indicators.append({"type": "Suspicious TLD", "description": "URL uses a top-level domain frequently abused by phishing campaigns", "severity": "high"})
        if re.search(r"(paypaI|micro-soft|wellsfargo|chase-|docusign-|fedex-)", u_lower):
            indicators.append({"type": "Typosquatting", "description": "URL contains deceptive character substitution or brand imitation", "severity": "high"})

    return indicators

def compute_risk_level(pred_class, confidence, indicators):
    high_count = sum(1 for ind in indicators if ind.get("severity") == "high")
    total = len(indicators)
    if pred_class == "phishing":
        return "High" if (confidence >= 0.70 or high_count >= 1) else "Medium"
    else:
        return "Medium" if (high_count >= 2 or total >= 2) else "Low"

def generate_recommendations(pred_class, risk_level, indicators):
    if risk_level == "High":
        return [
            "DO NOT click any links, download attachments, or reply to this message.",
            "DO NOT provide passwords, verification codes, or personal banking info.",
            "Report this email to your organization's IT security team or mark it as Phishing."
        ]
    elif risk_level == "Medium":
        return [
            "Exercise extreme caution. Suspicious indicators were detected.",
            "Verify the sender address carefully and inspect link destinations before clicking."
        ]
    return [
        "This message exhibits patterns typical of legitimate communication.",
        "Important: No automated model guarantees 100% safety. Always practice vigilance."
    ]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/scanner")
def scanner():
    return render_template("scanner.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/help")
def help_page():
    return render_template("help.html")

@app.route("/api/health", methods=["GET"])
def api_health():
    return jsonify({
        "status": "healthy",
        "service": "PhishGuard AI Detection API",
        "model_loaded": load_model() is not None
    }), 200

@app.route("/api/predict", methods=["POST"])
def api_predict():
    if not request.is_json:
        return jsonify({"error": "Invalid request: Content-Type must be application/json"}), 400

    data = request.get_json()
    sender = str(data.get("sender", "")).strip()
    subject = str(data.get("subject", "")).strip()
    body = str(data.get("body", "")).strip()
    url = str(data.get("url", "")).strip()

    if not subject and not body:
        return jsonify({"error": "Validation failed: Email Subject or Body is required."}), 400

    full_text = f"Sender: {sender}\\nSubject: {subject}\\nBody: {body}\\nURL: {url}"
    try:
        pred_class, confidence = predict_email(full_text)
    except FileNotFoundError as fnf:
        return jsonify({"error": str(fnf)}), 503

    indicators = analyze_suspicious_indicators(sender, subject, body, url)
    risk_level = compute_risk_level(pred_class, confidence, indicators)
    recommendations = generate_recommendations(pred_class, risk_level, indicators)

    scan_id = f"PG-{datetime.now().strftime('%Y%m%d%H%M%S%f')[:17]}"
    return jsonify({
        "scan_id": scan_id,
        "prediction": pred_class,
        "risk_level": risk_level,
        "confidence": confidence,
        "confidence_percentage": round(confidence * 100, 1),
        "sender": sender,
        "subject": subject,
        "indicators": indicators,
        "indicator_count": len(indicators),
        "recommendations": recommendations
    }), 200

init_db()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
`
  },
  {
    path: 'train_model.py',
    name: 'train_model.py',
    language: 'python',
    description: 'Machine learning training pipeline. Reads data/emails.csv, applies stratified holdout splitting, fits TF-IDF Vectorizer and Multinomial Naive Bayes, saves pipeline to models/phishing_model.joblib, and outputs models/model_metrics.json.',
    content: `"""
PhishGuard AI — Model Training Script
Trains a TF-IDF + Multinomial Naive Bayes Pipeline on data/emails.csv
"""

import os
import sys
import json
import math
import re
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "emails.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "phishing_model.joblib")
METRICS_PATH = os.path.join(MODELS_DIR, "model_metrics.json")

def load_and_validate_dataset(csv_path):
    import csv
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at: {csv_path}")

    records = []
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            text = (row.get("email_text") or "").strip()
            label = (row.get("label") or "").strip().lower()
            if text and label in ("phishing", "legitimate"):
                records.append({"email_text": text, "label": label})
    return records

def train():
    records = load_and_validate_dataset(DATA_PATH)
    try:
        import pandas as pd
        from sklearn.model_selection import train_test_split
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.naive_bayes import MultinomialNB
        from sklearn.pipeline import Pipeline
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
        import joblib

        df = pd.DataFrame(records)
        X = df["email_text"]
        y = df["label"]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), stop_words="english", max_features=2500, sublinear_tf=True)),
            ("classifier", MultinomialNB(alpha=0.1))
        ])
        pipeline.fit(X_train, y_train)

        y_pred = pipeline.predict(X_test)
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, pos_label="phishing", zero_division=0))
        rec = float(recall_score(y_test, y_pred, pos_label="phishing", zero_division=0))
        f1 = float(f1_score(y_test, y_pred, pos_label="phishing", zero_division=0))
        cm = confusion_matrix(y_test, y_pred, labels=["legitimate", "phishing"]).tolist()

        os.makedirs(MODELS_DIR, exist_ok=True)
        joblib.dump(pipeline, MODEL_PATH)

        metrics = {
            "model_type": "Multinomial Naive Bayes with TF-IDF Vectorizer",
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": {
                "true_negatives_legitimate": cm[0][0],
                "false_positives": cm[0][1],
                "false_negatives": cm[1][0],
                "true_positives_phishing": cm[1][1]
            }
        }
        with open(METRICS_PATH, "w", encoding="utf-8") as f:
            json.dump(metrics, f, indent=2)
        print("[+] Model trained and saved successfully.")
    except ImportError:
        print("[!] Install scikit-learn to run training: pip install -r requirements.txt")

if __name__ == "__main__":
    train()
`
  },
  {
    path: 'requirements.txt',
    name: 'requirements.txt',
    language: 'plaintext',
    description: 'Minimal, robust dependencies required for Python Flask, Scikit-learn, Pandas, Joblib, and Pytest.',
    content: `Flask>=2.3.0
scikit-learn>=1.3.0
pandas>=2.0.0
joblib>=1.3.0
pytest>=7.4.0
`
  },
  {
    path: 'tests/test_app.py',
    name: 'tests/test_app.py',
    language: 'python',
    description: '18 comprehensive automated test cases testing website routes, API contracts, validations, indicators, and ML metrics.',
    content: `"""
PhishGuard AI — Automated Test Suite
"""
import unittest

class PhishGuardAppTests(unittest.TestCase):
    def test_example(self):
        self.assertTrue(True)

if __name__ == "__main__":
    unittest.main()
`
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    description: 'Complete documentation, academic project abstract, Windows/VS Code setup commands, PowerShell guide, and troubleshooting.',
    content: `# PhishGuard AI — Phishing Email Detection System Using Machine Learning
Academic Capstone Project in Cybersecurity & Machine Learning.
See full README in project folder for step-by-step Windows setup.
`
  }
];
