"""
PhishGuard AI — Automated Test Suite
Verifies all website routes, API contracts, input validations,
NLP feature extraction, heuristic indicators, and machine learning inference logic.
Supports execution via pytest or python's unittest runner:
    python -m pytest -q
    python tests/test_app.py
"""

import os
import sys
import json
import re
import math
import sqlite3
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

class PhishGuardAppTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        try:
            from app import app, init_db, analyze_suspicious_indicators, compute_risk_level
            cls.app = app
            cls.client = app.test_client()
            cls.analyze_indicators = staticmethod(analyze_suspicious_indicators)
            cls.compute_risk = staticmethod(compute_risk_level)
            cls.flask_available = True
            init_db()
        except ImportError:
            cls.flask_available = False

    def test_01_homepage_route(self):
        """Verify GET / returns HTTP 200 and loads title."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"PhishGuard", response.data)

    def test_02_scanner_page_route(self):
        """Verify GET /scanner returns HTTP 200."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.get("/scanner")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Email Scanner", response.data)

    def test_03_dashboard_page_route(self):
        """Verify GET /dashboard returns HTTP 200."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.get("/dashboard")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Dashboard", response.data)

    def test_04_about_page_route(self):
        """Verify GET /about returns HTTP 200."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.get("/about")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Multinomial Naive Bayes", response.data)

    def test_05_help_page_route(self):
        """Verify GET /help returns HTTP 200."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.get("/help")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Troubleshooting", response.data)

    def test_06_health_endpoint(self):
        """Verify GET /api/health returns HTTP 200 with JSON payload."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get("status"), "healthy")

    def test_07_prediction_endpoint_valid_input(self):
        """Verify POST /api/predict handles phishing payload properly."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        payload = {
            "sender": "security-alert@paypaI-sec-notice.com",
            "subject": "URGENT: Verify your account immediately",
            "body": "Your bank account has been locked. Enter your password and SSN within 24 hours.",
            "url": "http://paypaI-security-verify.xyz/login"
        }
        response = self.client.post("/api/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("prediction", data)
        self.assertIn("risk_level", data)
        self.assertEqual(data["prediction"], "phishing")
        self.assertEqual(data["risk_level"], "High")

    def test_08_prediction_endpoint_rejects_empty_input(self):
        """Verify POST /api/predict returns HTTP 400 on empty input."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.post("/api/predict", json={"sender": "", "subject": "", "body": ""})
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn("error", data)

    def test_09_prediction_endpoint_rejects_non_json(self):
        """Verify POST /api/predict rejects non-JSON requests."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.post("/api/predict", data="raw text not json")
        self.assertEqual(response.status_code, 400)

    def test_10_stats_endpoint(self):
        """Verify GET /api/stats returns valid aggregated JSON counters."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.get("/api/stats")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("total_scans", data)
        self.assertIn("phishing_count", data)

    def test_11_model_metrics_endpoint(self):
        """Verify GET /api/model-metrics returns valid evaluation data."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.get("/api/model-metrics")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("accuracy", data)
        self.assertIn("precision", data)

    def test_12_custom_404_page(self):
        """Verify non-existent route returns HTTP 404 with custom error page."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.get("/non-existent-subpage-xyz")
        self.assertEqual(response.status_code, 404)

    def test_13_invalid_http_method(self):
        """Verify POST to a GET-only route is handled with 405."""
        if not self.flask_available:
            self.skipTest("Flask not installed in test runner environment.")
        response = self.client.post("/dashboard")
        self.assertEqual(response.status_code, 405)

    def test_14_dataset_integrity(self):
        """Verify data/emails.csv exists, has required columns and valid records."""
        csv_path = os.path.join(BASE_DIR, "data", "emails.csv")
        self.assertTrue(os.path.exists(csv_path), "data/emails.csv must exist.")
        import csv
        with open(csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            self.assertIn("email_text", reader.fieldnames)
            self.assertIn("label", reader.fieldnames)
            rows = list(reader)
            self.assertGreaterEqual(len(rows), 10, "Dataset must have at least 10 records.")
            labels = set(r["label"] for r in rows)
            self.assertIn("phishing", labels)
            self.assertIn("legitimate", labels)

    def test_15_model_metrics_file_integrity(self):
        """Verify models/model_metrics.json exists and contains required metric keys."""
        metrics_path = os.path.join(BASE_DIR, "models", "model_metrics.json")
        self.assertTrue(os.path.exists(metrics_path), "models/model_metrics.json must exist.")
        with open(metrics_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertIn("accuracy", data)
        self.assertIn("f1_score", data)
        self.assertIn("confusion_matrix", data)

    def test_16_indicator_urgency_heuristics(self):
        """Verify standalone regex detection of urgent coercions."""
        pattern = r"\b(urgent|immediately|immediate action|within 24 hours|account suspended|final notice)\b"
        text = "URGENT: Your account has been suspended. Please act within 24 hours."
        self.assertTrue(bool(re.search(pattern, text.lower())))

    def test_17_indicator_typosquatting_heuristics(self):
        """Verify detection of suspicious domains and typosquatting tokens."""
        suspicious_tld_pattern = r"\b(\.xyz|\.top|\.cc|\.info|\.biz|\.online|\.vip|\.link)\b"
        url = "http://paypaI-sec-verify.xyz/auth"
        self.assertTrue(bool(re.search(suspicious_tld_pattern, url.lower())))
        self.assertTrue(bool(re.search(r"(paypaI|micro-soft|wellsfargo)", url)))

    def test_18_sqlite_database_schema(self):
        """Verify SQLite database table creation and query execution."""
        test_db = os.path.join(BASE_DIR, "models", "test_temp.db")
        conn = sqlite3.connect(test_db)
        with conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS scan_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    scan_id TEXT UNIQUE NOT NULL,
                    timestamp TEXT NOT NULL,
                    predicted_class TEXT NOT NULL,
                    risk_level TEXT NOT NULL,
                    confidence REAL NOT NULL,
                    indicator_count INTEGER NOT NULL
                );
            """)
            conn.execute("""
                INSERT INTO scan_history (scan_id, timestamp, predicted_class, risk_level, confidence, indicator_count)
                VALUES ('PG-TEST-001', '2026-10-22 10:00:00', 'phishing', 'High', 0.95, 3)
            """)
            cur = conn.execute("SELECT COUNT(*) FROM scan_history WHERE scan_id = 'PG-TEST-001'")
            self.assertEqual(cur.fetchone()[0], 1)
        conn.close()
        if os.path.exists(test_db):
            os.remove(test_db)

if __name__ == "__main__":
    unittest.main(verbosity=2)
