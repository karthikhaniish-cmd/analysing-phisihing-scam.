export type RiskLevel = 'High' | 'Medium' | 'Low';
export type PredictionClass = 'phishing' | 'legitimate';

export interface Indicator {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ScanResult {
  scan_id: string;
  prediction: PredictionClass;
  risk_level: RiskLevel;
  confidence: number;
  confidence_percentage: number;
  sender: string;
  subject: string;
  body: string;
  url?: string;
  indicators: Indicator[];
  indicator_count: number;
  recommendations: string[];
  timestamp: string;
  tokens_detected?: string[];
}

export interface ModelMetrics {
  model_type: string;
  trained_at: string;
  total_samples: number;
  train_samples: number;
  test_samples: number;
  class_distribution: {
    phishing: number;
    legitimate: number;
  };
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: {
    true_negatives_legitimate: number;
    false_positives: number;
    false_negatives: number;
    true_positives_phishing: number;
  };
  vocabulary_size: number;
  status: string;
}

export interface ScanRecord {
  id: number;
  scan_id: string;
  timestamp: string;
  sender_domain: string;
  subject_snippet: string;
  predicted_class: PredictionClass;
  risk_level: RiskLevel;
  confidence: number;
  indicator_count: number;
}
