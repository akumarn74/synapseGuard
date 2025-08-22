// Common types and interfaces for SynapseGuard

export interface Patient {
  patient_id: string;
  name: string;
  age: number;
  condition: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  last_assessment: string;
  family_contact?: string;
}

export interface CognitiveMetrics {
  response_time: 'fast' | 'normal' | 'slow' | 'very_slow';
  recall_accuracy: 'excellent' | 'good' | 'fair' | 'poor' | 'very_poor';
  orientation_score: number;
  confusion_episodes: number;
}

export interface PhysicalMetrics {
  movement_variability: 'stable' | 'increased' | 'decreased';
  sleep_score: 'excellent' | 'good' | 'fair' | 'poor';
  activity_level: 'very_low' | 'low' | 'normal' | 'high' | 'very_high';
}

export interface SocialMetrics {
  interaction_frequency: 'high' | 'normal' | 'reduced' | 'minimal';
  engagement_quality: 'excellent' | 'good' | 'fair' | 'poor';
  communication_clarity: number;
}

export interface EmotionalState {
  mood: 'happy' | 'content' | 'neutral' | 'sad' | 'anxious' | 'agitated';
  anxiety_level: 'low' | 'moderate' | 'high' | 'severe';
  stress_indicators: string[];
}

export interface DailyRoutine {
  wake_time: number;
  completion_rate: number;
  activity_level: string;
  deviations: string[];
}

export interface BehavioralPattern {
  pattern_id: string;
  patient_id: string;
  timestamp: string;
  pattern_type: 'routine' | 'cognitive' | 'physical' | 'social';
  deviation_score: number;
  raw_data: {
    daily_routine?: DailyRoutine;
    cognitive_metrics?: CognitiveMetrics;
    physical_metrics?: PhysicalMetrics;
    social_metrics?: SocialMetrics;
    emotional_state?: EmotionalState;
  };
}

export interface Intervention {
  intervention_id: string;
  patient_id: string;
  intervention_type: string;
  agent_type: string;
  description: string;
  effectiveness_score?: number;
  timestamp: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Alert {
  alert_id: string;
  patient_id: string;
  alert_type: 'behavior_change' | 'safety_concern' | 'medical_emergency' | 'medication_reminder';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
}

export interface FamilyMember {
  family_id: string;
  patient_id: string;
  name: string;
  relationship: string;
  contact_info: string;
  is_primary_contact: boolean;
  notification_preferences: {
    alerts: boolean;
    daily_reports: boolean;
    emergency_only: boolean;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardMetrics {
  total_patients: number;
  active_alerts: number;
  interventions_today: number;
  avg_response_time: number;
  system_status: 'operational' | 'degraded' | 'maintenance';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  timestamp?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  category?: string;
}