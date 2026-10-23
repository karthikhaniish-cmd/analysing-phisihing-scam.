"""
PhishGuard AI — Model Training Script
Trains a TF-IDF + Multinomial Naive Bayes Pipeline on data/emails.csv
Saves model pipeline to models/phishing_model.joblib and metrics to models/model_metrics.json
"""

import os
import sys
import json
import math
import re
from datetime import datetime

# Path definitions
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "emails.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "phishing_model.joblib")
METRICS_PATH = os.path.join(MODELS_DIR, "model_metrics.json")

def ensure_directories():
    """Ensure required output directories exist."""
    os.makedirs(MODELS_DIR, exist_ok=True)

def load_and_validate_dataset(csv_path):
    """
    Loads dataset, checks required columns, strips whitespace,
    and removes invalid rows.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at: {csv_path}")

    # Read CSV
    records = []
    import csv
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            raise ValueError("CSV file is empty or headers are missing.")
        
        required_cols = {"email_text", "label"}
        missing_cols = required_cols - set(reader.fieldnames)
        if missing_cols:
            raise ValueError(f"Dataset missing required column(s): {missing_cols}")

        for row in reader:
            text = (row.get("email_text") or "").strip()
            label = (row.get("label") or "").strip().lower()

            if not text:
                continue
            if label not in ("phishing", "legitimate"):
                continue

            records.append({"email_text": text, "label": label})

    if len(records) < 10:
        raise ValueError(f"Dataset must contain at least 10 valid records, found: {len(records)}")

    # Check for both classes
    labels = [r["label"] for r in records]
    phishing_count = labels.count("phishing")
    legitimate_count = labels.count("legitimate")

    if phishing_count == 0 or legitimate_count == 0:
        raise ValueError("Dataset must contain both 'phishing' and 'legitimate' records.")

    print(f"[+] Loaded {len(records)} valid records ({phishing_count} phishing, {legitimate_count} legitimate).")
    return records

def train_with_sklearn(records):
    """
    Standard production pipeline using scikit-learn, pandas, and joblib.
    """
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

    # Stratified split to preserve class ratios (75% train, 25% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    # Scikit-learn pipeline: TF-IDF -> MultinomialNB
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words="english",
            max_features=2500,
            sublinear_tf=True
        )),
        ("classifier", MultinomialNB(alpha=0.1))
    ])

    print("[*] Fitting TF-IDF Vectorizer and Multinomial Naive Bayes classifier...")
    pipeline.fit(X_train, y_train)

    # Evaluation on holdout test set
    y_pred = pipeline.predict(X_test)
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, pos_label="phishing", zero_division=0))
    rec = float(recall_score(y_test, y_pred, pos_label="phishing", zero_division=0))
    f1 = float(f1_score(y_test, y_pred, pos_label="phishing", zero_division=0))
    cm = confusion_matrix(y_test, y_pred, labels=["legitimate", "phishing"]).tolist()

    # Save fitted pipeline
    joblib.dump(pipeline, MODEL_PATH)
    print(f"[+] Fitted model pipeline saved to: {MODEL_PATH}")

    metrics = {
        "model_type": "Multinomial Naive Bayes with TF-IDF Vectorizer",
        "trained_at": datetime.now().isoformat(),
        "total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "class_distribution": {
            "phishing": int((y == "phishing").sum()),
            "legitimate": int((y == "legitimate").sum())
        },
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": {
            "true_negatives_legitimate": cm[0][0],
            "false_positives": cm[0][1],
            "false_negatives": cm[1][0],
            "true_positives_phishing": cm[1][1]
        },
        "vocabulary_size": len(pipeline.named_steps["tfidf"].vocabulary_),
        "status": "trained_successfully"
    }

    with open(METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    print(f"[+] Model evaluation metrics saved to: {METRICS_PATH}")
    return metrics

def train_with_pure_python(records):
    """
    Full TF-IDF + Multinomial Naive Bayes algorithm in pure Python
    Used when scikit-learn is not installed in the execution environment.
    Generates exact vocabulary weights, priors, likelihoods, and metrics.
    """
    import random
    random.seed(42)

    # Tokenizer & Stopwords
    stop_words = set([
        "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
        "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
        "can", "did", "do", "does", "doing", "don", "down", "during", "each", "few", "for", "from",
        "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", "himself",
        "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me", "more", "most",
        "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once", "only", "or", "other",
        "our", "ours", "ourselves", "out", "over", "own", "s", "same", "she", "should", "so", "some",
        "such", "t", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there",
        "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
        "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with",
        "you", "your", "yours", "yourself", "yourselves"
    ])

    def tokenize(text):
        words = re.findall(r"\b[a-zA-Z]{2,}\b", text.lower())
        return [w for w in words if w not in stop_words]

    # Stratified split 75% train / 25% test
    phish = [r for r in records if r["label"] == "phishing"]
    legit = [r for r in records if r["label"] == "legitimate"]
    random.shuffle(phish)
    random.shuffle(legit)

    n_phish_train = int(len(phish) * 0.75)
    n_legit_train = int(len(legit) * 0.75)

    train_set = phish[:n_phish_train] + legit[:n_legit_train]
    test_set = phish[n_phish_train:] + legit[n_legit_train:]
    random.shuffle(train_set)

    # Document frequency calculation
    doc_freq = {}
    total_docs = len(train_set)
    for doc in train_set:
        unique_tokens = set(tokenize(doc["email_text"]))
        for token in unique_tokens:
            doc_freq[token] = doc_freq.get(token, 0) + 1

    # Inverse Document Frequency (smooth idf)
    idf = {term: math.log((1 + total_docs) / (1 + freq)) + 1 for term, freq in doc_freq.items()}

    # Class term counts with Laplace smoothing (alpha=0.1)
    alpha = 0.1
    class_word_counts = {"phishing": {}, "legitimate": {}}
    class_total_words = {"phishing": 0, "legitimate": 0}
    class_doc_counts = {"phishing": 0, "legitimate": 0}

    for doc in train_set:
        c = doc["label"]
        class_doc_counts[c] += 1
        tokens = tokenize(doc["email_text"])
        for token in tokens:
            class_word_counts[c][token] = class_word_counts[c].get(token, 0) + 1
            class_total_words[c] += 1

    vocab = set(doc_freq.keys())
    vocab_size = len(vocab)

    priors = {
        "phishing": class_doc_counts["phishing"] / total_docs,
        "legitimate": class_doc_counts["legitimate"] / total_docs
    }

    # Evaluate on test set
    y_true = []
    y_pred = []

    for doc in test_set:
        actual = doc["label"]
        tokens = tokenize(doc["email_text"])

        # Compute log posterior: log(P(c)) + sum(log(P(w|c)))
        log_prob = {}
        for c in ("phishing", "legitimate"):
            log_prob[c] = math.log(priors[c])
            denom = class_total_words[c] + alpha * vocab_size
            for token in tokens:
                count = class_word_counts[c].get(token, 0)
                word_prob = (count + alpha) / denom
                # Weight by TF-IDF if in vocab
                weight = idf.get(token, 1.0)
                log_prob[c] += weight * math.log(word_prob)

        predicted = "phishing" if log_prob["phishing"] > log_prob["legitimate"] else "legitimate"
        y_true.append(actual)
        y_pred.append(predicted)

    tp = sum(1 for t, p in zip(y_true, y_pred) if t == "phishing" and p == "phishing")
    fp = sum(1 for t, p in zip(y_true, y_pred) if t == "legitimate" and p == "phishing")
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == "phishing" and p == "legitimate")
    tn = sum(1 for t, p in zip(y_true, y_pred) if t == "legitimate" and p == "legitimate")

    total_test = len(test_set)
    acc = (tp + tn) / total_test if total_test > 0 else 0
    prec = tp / (tp + fp) if (tp + fp) > 0 else 0
    rec = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0

    # Save model metadata in JSON & joblib mock
    model_data = {
        "vocab": list(vocab),
        "idf": idf,
        "class_word_counts": class_word_counts,
        "class_total_words": class_total_words,
        "priors": priors,
        "alpha": alpha,
        "vocab_size": vocab_size
    }
    with open(os.path.join(MODELS_DIR, "model_weights.json"), "w", encoding="utf-8") as f:
        json.dump(model_data, f)

    # Touch joblib file with serialized state
    import pickle
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model_data, f)

    metrics = {
        "model_type": "Multinomial Naive Bayes with TF-IDF Vectorizer",
        "trained_at": datetime.now().isoformat(),
        "total_samples": len(records),
        "train_samples": len(train_set),
        "test_samples": len(test_set),
        "class_distribution": {
            "phishing": len(phish),
            "legitimate": len(legit)
        },
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": {
            "true_negatives_legitimate": tn,
            "false_positives": fp,
            "false_negatives": fn,
            "true_positives_phishing": tp
        },
        "vocabulary_size": vocab_size,
        "status": "trained_successfully"
    }

    with open(METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print(f"[+] Model evaluation metrics saved to: {METRICS_PATH}")
    return metrics

def main():
    print("================================================================")
    print("  PhishGuard AI — Machine Learning Model Training Engine")
    print("================================================================")
    ensure_directories()

    try:
        records = load_and_validate_dataset(DATA_PATH)
    except Exception as e:
        print(f"[!] Error loading dataset: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        import sklearn
        print(f"[i] Scikit-learn {sklearn.__version__} detected. Using standard Scikit-learn Pipeline.")
        metrics = train_with_sklearn(records)
    except ImportError:
        print("[i] scikit-learn not yet installed in active environment. Using mathematical TF-IDF + Multinomial Naive Bayes engine.")
        metrics = train_with_pure_python(records)

    print("\n---------------- Training Summary ----------------")
    print(f"Model Type:      {metrics['model_type']}")
    print(f"Total Samples:   {metrics['total_samples']} (Train: {metrics['train_samples']}, Test: {metrics['test_samples']})")
    print(f"Accuracy:        {metrics['accuracy'] * 100:.2f}%")
    print(f"Precision:       {metrics['precision'] * 100:.2f}%")
    print(f"Recall:          {metrics['recall'] * 100:.2f}%")
    print(f"F1-Score:        {metrics['f1_score'] * 100:.2f}%")
    print(f"Confusion Matrix: TN={metrics['confusion_matrix']['true_negatives_legitimate']}, "
          f"FP={metrics['confusion_matrix']['false_positives']}, "
          f"FN={metrics['confusion_matrix']['false_negatives']}, "
          f"TP={metrics['confusion_matrix']['true_positives_phishing']}")
    print(f"Vocabulary Size: {metrics['vocabulary_size']} terms")
    print("================================================================\n")

if __name__ == "__main__":
    main()
