"""
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

# -------------------------------------------------------------
# Database Management (SQLite)
# -------------------------------------------------------------
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the SQLite database with scan history table."""
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
        # Seed 3 realistic demo records if table is brand new to showcase dashboard
        cur = conn.execute("SELECT COUNT(*) as cnt FROM scan_history")
        count = cur.fetchone()["cnt"]
        if count == 0:
            seed_records = [
                ("PG-101", datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "paypal-sec-auth.com", "Urgent: Account Access Suspended", "phishing", "High", 0.94, 4),
                ("PG-102", datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "university.edu", "Campus Library Hours Extended", "legitimate", "Low", 0.91, 0),
                ("PG-103", datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "micro-soft-sec.xyz", "Action Required: Reset Password", "phishing", "High", 0.96, 3),
            ]
            conn.executemany("""
                INSERT INTO scan_history (scan_id, timestamp, sender_domain, subject_snippet, predicted_class, risk_level, confidence, indicator_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, seed_records)
    conn.close()

# -------------------------------------------------------------
# ML Inference Engine
# -------------------------------------------------------------
_CACHED_SKLEARN_PIPELINE = None
_CACHED_PY_MODEL = None

def load_model():
    """Loads either sklearn pipeline or serialized weights."""
    global _CACHED_SKLEARN_PIPELINE, _CACHED_PY_MODEL

    if _CACHED_SKLEARN_PIPELINE is not None or _CACHED_PY_MODEL is not None:
        return _CACHED_SKLEARN_PIPELINE or _CACHED_PY_MODEL

    # Try sklearn pipeline
    if os.path.exists(MODEL_PATH):
        try:
            import joblib
            _CACHED_SKLEARN_PIPELINE = joblib.load(MODEL_PATH)
            return _CACHED_SKLEARN_PIPELINE
        except Exception:
            pass

    # Try pure python weights
    if os.path.exists(MODEL_WEIGHTS_PATH):
        with open(MODEL_WEIGHTS_PATH, "r", encoding="utf-8") as f:
            _CACHED_PY_MODEL = json.load(f)
            return _CACHED_PY_MODEL

    return None

def predict_email(full_text):
    """
    Predicts email class and confidence score.
    Returns: (predicted_class, confidence_score)
    """
    model = load_model()
    if model is None:
        raise FileNotFoundError(
            "Machine learning model is missing. Please run 'python train_model.py' to train and save the model."
        )

    # If it's a scikit-learn pipeline
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba([full_text])[0]
        classes = list(model.classes_)
        phish_idx = classes.index("phishing") if "phishing" in classes else 1
        phish_prob = float(probs[phish_idx])
        pred_class = "phishing" if phish_prob >= 0.5 else "legitimate"
        conf = phish_prob if pred_class == "phishing" else (1.0 - phish_prob)
        return pred_class, round(conf, 4)

    # Pure Python TF-IDF Naive Bayes calculation
    if isinstance(model, dict) and "class_word_counts" in model:
        words = re.findall(r"\b[a-zA-Z]{2,}\b", full_text.lower())
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

        # Softmax / normalized confidence
        max_log = max(log_probs["phishing"], log_probs["legitimate"])
        exp_phish = math.exp(log_probs["phishing"] - max_log)
        exp_legit = math.exp(log_probs["legitimate"] - max_log)
        total_exp = exp_phish + exp_legit
        phish_conf = exp_phish / total_exp

        pred_class = "phishing" if phish_conf >= 0.50 else "legitimate"
        conf = phish_conf if pred_class == "phishing" else (1.0 - phish_conf)
        return pred_class, round(conf, 4)

    raise ValueError("Invalid model format.")

# -------------------------------------------------------------
# Heuristic Indicators & Security Risk Scoring
# -------------------------------------------------------------
def analyze_suspicious_indicators(sender, subject, body, url):
    """
    Inspects transparent heuristic warning signs in the email content.
    Never visits submitted URLs or executes code.
    """
    indicators = []
    combined = f"{sender} {subject} {body} {url}".lower()

    # 1. Urgent / Coercive Language
    urgency_patterns = [
        (r"\b(urgent|immediately|immediate action|within 24 hours|account suspended|final notice|critical warning|action required)\b",
         "High-urgency deadline or coercive pressure detected")
    ]
    for pattern, desc in urgency_patterns:
        if re.search(pattern, combined):
            indicators.append({"type": "Urgency & Coercion", "description": desc, "severity": "high"})
            break

    # 2. Credential or Identity Requests
    cred_patterns = [
        (r"\b(password|pin code|ssn|social security|routing number|cvv|seed phrase|credit card details|direct deposit)\b",
         "Explicit request for sensitive authentication credentials or financial identifiers")
    ]
    for pattern, desc in cred_patterns:
        if re.search(pattern, combined):
            indicators.append({"type": "Sensitive Data Harvesting", "description": desc, "severity": "high"})
            break

    # 3. Suspicious or Deceptive URL Patterns
    if url:
        u_lower = url.lower()
        if re.search(r"http://", u_lower) and not re.search(r"https://", u_lower):
            indicators.append({"type": "Insecure Link", "description": "Submitted URL uses unencrypted HTTP instead of HTTPS", "severity": "medium"})
        if re.search(r"\b(\.xyz|\.top|\.cc|\.info|\.biz|\.online|\.vip|\.link|\.us\.to)\b", u_lower):
            indicators.append({"type": "Suspicious TLD", "description": "URL uses a top-level domain frequently abused by phishing campaigns", "severity": "high"})
        if re.search(r"(paypaI|micro-soft|wellsfargo|chase-|docusign-|fedex-)", u_lower):
            indicators.append({"type": "Typosquatting", "description": "URL contains deceptive character substitution or brand imitation", "severity": "high"})
        if re.search(r"(@|\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)", u_lower):
            indicators.append({"type": "Obfuscated Address", "description": "URL targets a raw IP address or embeds misleading credentials", "severity": "high"})

    # 4. Misleading / Free Email Domain for Corporate/Banking Claims
    if sender:
        s_lower = sender.lower()
        claimed_institutions = ["paypal", "bank of america", "chase", "irs", "wells fargo", "microsoft", "google", "netflix", "apple"]
        free_providers = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
        
        has_institution_claim = any(inst in combined for inst in claimed_institutions)
        is_free_provider = any(free in s_lower for free in free_providers)
        if has_institution_claim and is_free_provider:
            indicators.append({
                "type": "Sender Domain Mismatch",
                "description": f"Email claims institutional authority but is sent from a public mailbox ({sender})",
                "severity": "high"
            })

    # 5. Financial Wire / Cryptocurrency Requests
    if re.search(r"\b(bitcoin|btc|wallet|wire transfer|\$\d+,\d{3}|lottery|grand prize)\b", combined):
        indicators.append({
            "type": "Unsolicited Financial Transaction",
            "description": "Unprompted wire transfer, crypto payment, or lottery winnings claimed",
            "severity": "medium"
        })

    return indicators

def compute_risk_level(pred_class, confidence, indicators):
    """
    Combines ML prediction and detected indicators into an actionable risk level.
    Never presents uncalibrated probability as guaranteed safety.
    """
    high_count = sum(1 for ind in indicators if ind.get("severity") == "high")
    total_indicators = len(indicators)

    if pred_class == "phishing":
        if confidence >= 0.70 or high_count >= 1:
            return "High"
        return "Medium"
    else:  # legitimate
        if high_count >= 2:
            return "Medium"  # Discrepancy: model said legit but serious indicators found
        elif total_indicators >= 2:
            return "Medium"
        return "Low"

def generate_recommendations(pred_class, risk_level, indicators):
    """Generates concise, practical security recommendations."""
    recs = []
    if risk_level == "High":
        recs.append("DO NOT click any links, download attachments, or reply to this message.")
        recs.append("DO NOT provide passwords, verification codes, or personal banking info.")
        recs.append("Report this email to your organization's IT security team or mark it as Phishing.")
        recs.append("If this email claims to be from your bank or an employer, contact them directly through official verified channels.")
    elif risk_level == "Medium":
        recs.append("Exercise extreme caution. Suspicious indicators were detected despite mixed signals.")
        recs.append("Verify the sender address carefully and inspect link destinations before clicking.")
        recs.append("Contact the sender via an independent channel (e.g. phone or official portal) to verify authenticity.")
    else:
        recs.append("This message exhibits patterns typical of legitimate communication.")
        recs.append("Important: No automated model guarantees 100% safety. Always practice vigilance with unexpected attachments or requests.")
    return recs

# -------------------------------------------------------------
# Website Routes
# -------------------------------------------------------------
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

# -------------------------------------------------------------
# REST API Endpoints
# -------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def api_health():
    model_loaded = load_model() is not None
    return jsonify({
        "status": "healthy",
        "service": "PhishGuard AI Detection API",
        "model_loaded": model_loaded,
        "database_connected": os.path.exists(DB_PATH)
    }), 200

@app.route("/api/predict", methods=["POST"])
def api_predict():
    """
    Predicts email classification.
    Expects JSON: { sender, subject, body, url (optional) }
    """
    if not request.is_json:
        return jsonify({"error": "Invalid request: Content-Type must be application/json"}), 400

    data = request.get_json()
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Request body must be a valid JSON object"}), 400

    sender = str(data.get("sender", "")).strip()
    subject = str(data.get("subject", "")).strip()
    body = str(data.get("body", "")).strip()
    url = str(data.get("url", "")).strip()

    # Validation
    if not subject and not body:
        return jsonify({"error": "Validation failed: Email Subject or Body is required."}), 400

    if len(body) > 50000 or len(subject) > 500 or len(sender) > 255:
        return jsonify({"error": "Input length exceeds allowed character limits."}), 400

    # Combine text representation for ML pipeline
    full_text = f"Sender: {sender}\nSubject: {subject}\nBody: {body}"
    if url:
        full_text += f"\nURL: {url}"

    # Prediction
    try:
        pred_class, confidence = predict_email(full_text)
    except FileNotFoundError as fnf:
        return jsonify({"error": str(fnf)}), 503
    except Exception as e:
        return jsonify({"error": f"Prediction engine error: {str(e)}"}), 500

    # Indicators & Risk Level
    indicators = analyze_suspicious_indicators(sender, subject, body, url)
    risk_level = compute_risk_level(pred_class, confidence, indicators)
    recommendations = generate_recommendations(pred_class, risk_level, indicators)

    # Save to SQLite scan history (store only minimal telemetry for privacy)
    scan_id = f"PG-{datetime.now().strftime('%Y%m%d%H%M%S%f')[:17]}"
    sender_domain = sender.split("@")[-1] if "@" in sender else sender[:50]
    subject_snippet = (subject[:60] + "...") if len(subject) > 60 else (subject or "No Subject")

    try:
        conn = get_db()
        with conn:
            conn.execute("""
                INSERT INTO scan_history (scan_id, timestamp, sender_domain, subject_snippet, predicted_class, risk_level, confidence, indicator_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                scan_id,
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                sender_domain,
                subject_snippet,
                pred_class,
                risk_level,
                confidence,
                len(indicators)
            ))
        conn.close()
    except Exception as db_err:
        app.logger.warning(f"Could not record scan history in SQLite: {db_err}")

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
        "recommendations": recommendations,
        "timestamp": datetime.now().isoformat()
    }), 200

@app.route("/api/stats", methods=["GET"])
def api_stats():
    """Returns aggregated scan statistics from SQLite database."""
    try:
        conn = get_db()
        cur = conn.cursor()

        cur.execute("SELECT COUNT(*) FROM scan_history")
        total = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM scan_history WHERE predicted_class = 'phishing'")
        phishing = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM scan_history WHERE predicted_class = 'legitimate'")
        legitimate = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM scan_history WHERE risk_level = 'High'")
        high_risk = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM scan_history WHERE risk_level = 'Medium'")
        medium_risk = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM scan_history WHERE risk_level = 'Low'")
        low_risk = cur.fetchone()[0]

        conn.close()

        return jsonify({
            "total_scans": total,
            "phishing_count": phishing,
            "legitimate_count": legitimate,
            "high_risk_count": high_risk,
            "medium_risk_count": medium_risk,
            "low_risk_count": low_risk,
            "phishing_ratio": round((phishing / total) * 100, 1) if total > 0 else 0.0
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve stats: {str(e)}"}), 500

@app.route("/api/model-metrics", methods=["GET"])
def api_model_metrics():
    """Returns saved model training evaluation metrics."""
    if not os.path.exists(METRICS_PATH):
        return jsonify({
            "error": "Model metrics not found. Train the model using 'python train_model.py'."
        }), 404

    try:
        with open(METRICS_PATH, "r", encoding="utf-8") as f:
            metrics = json.load(f)
        return jsonify(metrics), 200
    except Exception as e:
        return jsonify({"error": f"Error loading metrics: {str(e)}"}), 500

@app.route("/api/history", methods=["GET"])
def api_history():
    """Returns recent scan history records from SQLite."""
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            SELECT scan_id, timestamp, sender_domain, subject_snippet, predicted_class, risk_level, confidence, indicator_count
            FROM scan_history
            ORDER BY id DESC
            LIMIT 50
        """)
        rows = [dict(row) for row in cur.fetchall()]
        conn.close()
        return jsonify({"history": rows, "count": len(rows)}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to load history: {str(e)}"}), 500

# -------------------------------------------------------------
# Error Handlers
# -------------------------------------------------------------
@app.errorhandler(404)
def page_not_found(e):
    if request.path.startswith("/api/"):
        return jsonify({"error": "Endpoint not found", "path": request.path}), 404
    return render_template("404.html"), 404

@app.errorhandler(500)
def server_error(e):
    if request.path.startswith("/api/"):
        return jsonify({"error": "Internal server error"}), 500
    return render_template("500.html"), 500

# -------------------------------------------------------------
# Application Startup
# -------------------------------------------------------------
init_db()

if __name__ == "__main__":
    print("\n[+] PhishGuard AI starting up...")
    print("[+] Model Status: Checking models/phishing_model.joblib")
    if load_model() is not None:
        print("[+] Machine learning model successfully loaded.")
    else:
        print("[!] Warning: Machine learning model not found. Run python train_model.py")
    print("[+] Running on http://127.0.0.1:5000\n")
    app.run(host="127.0.0.1", port=5000, debug=True)
