-- SynapseGuard TiDB Serverless Database Schema (TiDB Compatible)
-- TiDB AgentX Hackathon 2025

-- 1. Patient Profiles Table
CREATE TABLE patients (
    patient_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    diagnosis VARCHAR(100),
    severity_level ENUM('mild', 'moderate', 'severe'),
    baseline_patterns JSON,
    family_contacts JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Behavioral Patterns (with vector support for TiDB)
CREATE TABLE behavioral_patterns (
    pattern_id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50),
    timestamp DATETIME,
    pattern_data TEXT,
    pattern_vector VECTOR(1536),
    raw_data JSON,
    pattern_type ENUM('routine', 'cognitive', 'physical', 'social'),
    deviation_score FLOAT,
    INDEX idx_patient (patient_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- 3. Medical Research Knowledge Base (simplified)
CREATE TABLE medical_knowledge (
    knowledge_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200),
    content TEXT,
    source VARCHAR(100),
    publication_date DATE,
    relevance_score FLOAT,
    keywords TEXT,
    INDEX idx_keywords (keywords(100))
);

-- 4. Intervention History
CREATE TABLE interventions (
    intervention_id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50),
    agent_type VARCHAR(50),
    intervention_type VARCHAR(100),
    description TEXT,
    trigger_pattern_id VARCHAR(50),
    effectiveness_score FLOAT,
    timestamp DATETIME,
    external_actions JSON,
    INDEX idx_patient_time (patient_id, timestamp),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- 5. Family Communication Log
CREATE TABLE family_communications (
    comm_id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50),
    recipient_type ENUM('primary_caregiver', 'family_member', 'healthcare_provider', 'system_log'),
    message_content TEXT,
    communication_type ENUM('alert', 'update', 'recommendation', 'coordination_summary', 'follow_up'),
    sent_at DATETIME,
    read_at DATETIME,
    response TEXT,
    INDEX idx_patient (patient_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- 6. Crisis Prevention Alerts
CREATE TABLE crisis_predictions (
    prediction_id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50),
    risk_score FLOAT,
    predicted_crisis_type VARCHAR(100),
    confidence_level FLOAT,
    contributing_factors JSON,
    recommended_actions JSON,
    prediction_timestamp DATETIME,
    actual_outcome VARCHAR(100),
    prevention_success BOOLEAN,
    INDEX idx_patient_risk (patient_id, risk_score DESC),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Sample Data for Demo

-- Insert demo patient
INSERT INTO patients 
(patient_id, name, age, diagnosis, severity_level, baseline_patterns, family_contacts)
VALUES 
('margaret_wilson', 'Margaret Wilson', 72, 'Early-stage Alzheimers', 'mild',
 JSON_OBJECT(
   'daily_routine', JSON_OBJECT(
     'wake_time', 7.0,
     'completion_rate', 0.95,
     'activity_level', 0.8
   ),
   'cognitive_metrics', JSON_OBJECT(
     'orientation_score', 0.95,
     'response_time', 'normal'
   )
 ),
 JSON_OBJECT(
   'primary_caregiver', JSON_OBJECT(
     'name', 'Sarah Wilson',
     'relationship', 'daughter',
     'phone', '+1-555-0123',
     'email', 'sarah.wilson@email.com',
     'patient_name', 'Margaret Wilson'
   ),
   'family_members', JSON_ARRAY(
     JSON_OBJECT(
       'name', 'Michael Wilson',
       'relationship', 'son',
       'phone', '+1-555-0124',
       'email', 'michael.wilson@email.com'
     ),
     JSON_OBJECT(
       'name', 'Emma Thompson',
       'relationship', 'granddaughter',
       'phone', '+1-555-0125',
       'email', 'emma.thompson@email.com'
     )
   ),
   'healthcare_providers', JSON_ARRAY(
     JSON_OBJECT(
       'name', 'Dr. Jennifer Martinez',
       'type', 'primary_care',
       'phone', '+1-555-0200',
       'email', 'j.martinez@healthcenter.com'
     ),
     JSON_OBJECT(
       'name', 'Dr. Robert Kim',
       'type', 'neurologist',
       'phone', '+1-555-0201',
       'email', 'r.kim@neurocenter.com'
     )
   ),
   'emergency_contacts', JSON_ARRAY(
     JSON_OBJECT(
       'name', 'Emergency Services',
       'phone', '911'
     ),
     JSON_OBJECT(
       'name', 'Sarah Wilson (Primary)',
       'phone', '+1-555-0123'
     )
   )
 )
);

-- Insert sample medical knowledge
INSERT INTO medical_knowledge 
(knowledge_id, title, content, source, keywords, relevance_score, publication_date)
VALUES 
('med_001', 
 'Early Intervention in Alzheimer Care',
 'Early intervention strategies for Alzheimer patients include routine maintenance, environmental modifications, and family support systems. Research shows that maintaining consistent daily routines can reduce confusion episodes by up to 40%. Key interventions include: structured daily activities, familiar environment maintenance, regular sleep schedules, medication adherence monitoring, and proactive family communication.',
 'Journal of Alzheimer Care, 2024',
 'alzheimer early intervention routine confusion prevention family support',
 0.9,
 '2024-01-01'),

('med_002',
 'Crisis Prevention in Dementia Care',
 'Crisis prevention in dementia care focuses on pattern recognition and proactive intervention. Studies indicate that monitoring behavioral changes can predict crisis events 2-5 days in advance, allowing for preventive measures. Effective strategies include: continuous behavioral monitoring, AI-powered pattern analysis, multi-stakeholder care coordination, and evidence-based intervention protocols.',
 'Dementia Care Research, 2024',
 'dementia crisis prevention behavioral patterns monitoring AI coordination',
 0.92,
 '2024-01-15'),

('med_003',
 'Multi-Agent Care Coordination Systems',
 'Multi-agent systems in healthcare demonstrate significant improvements in patient outcomes through coordinated care delivery. Research shows 35% reduction in emergency interventions when AI agents collaborate for predictive care management. Key components include: cognitive pattern analysis, crisis prediction algorithms, automated family communication, and integrated care team coordination.',
 'Healthcare AI Systems Journal, 2024',
 'multi-agent healthcare AI coordination predictive care emergency prevention',
 0.88,
 '2024-02-01');