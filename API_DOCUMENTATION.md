# SynapseGuard API Documentation

## 📚 **Complete REST API Reference**

### **Base URL**
```
http://localhost:5001
```

## 🔧 **System Endpoints**

### **Health Check**
```http
GET /health
```
**Description**: System health and status check

**Response**:
```json
{
  "status": "healthy",
  "service": "SynapseGuard Full AI System"
}
```

### **Root Information**
```http
GET /
```
**Response**:
```json
{
  "message": "SynapseGuard API is running!",
  "status": "online"
}
```

## 🎬 **Demo & Setup Endpoints**

### **Initialize Demo Data**
```http
POST /api/setup/demo
```
**Description**: Creates demo patients and medical knowledge base

**Response**:
```json
{
  "success": true,
  "message": "Demo data ready - Both patients created",
  "stats": {
    "patients": 2,
    "knowledge_entries": 1000
  }
}
```

### **Database Cleanup**
```http
POST /api/admin/cleanup
```
**Description**: Clean up problematic intervention records

**Response**:
```json
{
  "success": true,
  "deleted_empty_ids": 0,
  "deleted_demo_entries": 5,
  "message": "Database cleaned up successfully"
}
```

## 🤖 **AI Processing Endpoints**

### **Normal Day Processing**
```http
POST /api/demo/normal
Content-Type: application/json

{
  "patient_id": "margaret_wilson"
}
```

**Description**: Process normal behavioral patterns through all 7 AI agents

**Response**:
```json
{
  "success": true,
  "scenario": "normal_day",
  "input_data": {
    "daily_routine": {
      "wake_time": 7.2,
      "completion_rate": 0.92,
      "activity_level": "normal"
    },
    "cognitive_metrics": {
      "response_time": "normal",
      "recall_accuracy": "good"
    }
  },
  "synapseGuard_result": {
    "patient_id": "margaret_wilson",
    "processing_timestamp": "2025-01-15T10:30:00Z",
    "cognitive_analysis": {
      "deviation_score": 0.15,
      "alert_level": "low",
      "trajectory_prediction": {
        "trend": "stable",
        "confidence": 0.85
      }
    },
    "crisis_analysis": null,
    "care_orchestration": null,
    "therapeutic_intervention": null,
    "family_intelligence": null,
    "pattern_learning": {
      "learning_id": "learn_001",
      "model_improvements": {
        "priority_ranking": ["accuracy", "response_time"]
      }
    },
    "overall_status": "STABLE_PATTERNS",
    "agent_coordination_score": 0.82
  }
}
```

### **Concerning Pattern Detection**
```http
POST /api/demo/concerning
Content-Type: application/json

{
  "patient_id": "margaret_wilson"
}
```

**Description**: Process concerning behavioral changes through AI agents

**Response**:
```json
{
  "success": true,
  "scenario": "concerning_patterns",
  "input_data": {
    "daily_routine": {
      "wake_time": 9.5,
      "completion_rate": 0.65,
      "activity_level": "reduced"
    },
    "cognitive_metrics": {
      "response_time": "slow",
      "recall_accuracy": "poor"
    }
  },
  "synapseGuard_result": {
    "cognitive_analysis": {
      "deviation_score": 0.67,
      "alert_level": "high",
      "recommendations": [
        "Consider scheduling immediate healthcare provider consultation",
        "Increase family supervision and support"
      ]
    },
    "crisis_analysis": {
      "risk_score": 0.72,
      "crisis_type": "cognitive_decline_acceleration",
      "confidence": 0.78,
      "immediate_actions": ["family_notification", "provider_alert"]
    },
    "care_orchestration": {
      "actions_executed": 3,
      "notifications_sent": 2,
      "care_team_activated": true
    },
    "therapeutic_intervention": {
      "intervention_plan": {
        "duration": "2_weeks",
        "focus_areas": ["cognitive_stimulation", "routine_reinforcement"]
      },
      "activities": [
        {
          "type": "memory_exercise",
          "frequency": "daily",
          "duration": 15
        }
      ]
    },
    "family_intelligence": {
      "family_wellness_score": 0.68,
      "communication_strategies": [
        "gentle_reminders",
        "positive_reinforcement"
      ]
    },
    "overall_status": "HIGH_MONITORING_REQUIRED"
  }
}
```

### **Crisis Prevention Activation**
```http
POST /api/demo/crisis
Content-Type: application/json

{
  "patient_id": "margaret_wilson"
}
```

**Description**: Activate full crisis prevention workflow with all agents

**Response**:
```json
{
  "success": true,
  "scenario": "crisis_prevention",
  "synapseGuard_result": {
    "cognitive_analysis": {
      "deviation_score": 0.89,
      "alert_level": "critical"
    },
    "crisis_analysis": {
      "risk_score": 0.92,
      "crisis_type": "severe_disorientation_risk",
      "confidence": 0.88,
      "recommended_actions": [
        "immediate_supervision",
        "emergency_contact_notification",
        "medical_intervention_consideration"
      ]
    },
    "care_orchestration": {
      "emergency_protocol_activated": true,
      "actions_executed": 7,
      "notifications_sent": 4
    },
    "overall_status": "CRITICAL_ATTENTION_NEEDED"
  }
}
```

## 👤 **Patient Management Endpoints**

### **Get Patient History**
```http
GET /api/patient/{patient_id}/history
```

**Description**: Retrieve patient's intervention history and AI processing records

**Example**:
```http
GET /api/patient/margaret_wilson/history
```

**Response**:
```json
{
  "success": true,
  "patient_id": "margaret_wilson",
  "history": [
    {
      "intervention_id": "proc_margaret_wilson_abc123def456",
      "agent_type": "orchestrator",
      "intervention_type": "full_processing",
      "description": "Significant behavioral changes detected...",
      "effectiveness_score": 0.82,
      "timestamp": "2025-01-15T10:30:00Z",
      "external_actions": {
        "cognitive_analysis": {...},
        "crisis_analysis": {...}
      }
    }
  ]
}
```

## 🎯 **Available Patient IDs**

### **Demo Patients**
- `margaret_wilson` - 72-year-old with Early-stage Alzheimer's
- `robert_chen` - 68-year-old with Mild Cognitive Impairment

## 📊 **Response Patterns**

### **Success Response**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### **Error Response**
```json
{
  "success": false,
  "error": "Error description",
  "details": "Additional error information"
}
```

## 🧠 **AI Agent Response Structure**

### **Cognitive Analyzer Agent**
```json
{
  "agent": "CognitiveAnalyzer",
  "patient_id": "margaret_wilson",
  "deviation_score": 0.45,
  "trajectory_prediction": {
    "trend": "stable|improving|deteriorating",
    "urgency": "low|medium|high|critical",
    "confidence": 0.85,
    "intervention_timeframe": "days|weeks"
  },
  "alert_level": "low|medium|high|critical",
  "recommendations": [...],
  "vector_analysis": {
    "similar_patterns_found": 5,
    "vector_similarity_score": 0.78
  }
}
```

### **Crisis Prevention Agent**
```json
{
  "agent": "CrisisPreventionAgent",
  "risk_score": 0.72,
  "crisis_type": "cognitive_decline_acceleration",
  "confidence": 0.88,
  "time_horizon": "24_hours|days|weeks",
  "recommended_actions": [...],
  "immediate_actions": [...]
}
```

### **Care Orchestration Agent**
```json
{
  "agent": "CareOrchestrationAgent",
  "actions_executed": 3,
  "notifications_sent": 2,
  "care_team_activated": true,
  "emergency_protocol_activated": false,
  "coordination_summary": "..."
}
```

## 🔐 **Authentication & Security**

Currently, the API runs in demo mode without authentication. For production deployment, implement:

- JWT token authentication
- Rate limiting
- Request validation
- HTTPS encryption
- API key management

## 🐛 **Error Codes**

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 500 | Internal Server Error - System failure |

## 📝 **Usage Examples**

### **Complete Workflow Test**
```bash
# 1. Initialize system
curl -X POST http://localhost:5001/api/setup/demo

# 2. Test normal processing
curl -X POST http://localhost:5001/api/demo/normal \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "margaret_wilson"}'

# 3. Test crisis prevention
curl -X POST http://localhost:5001/api/demo/crisis \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "margaret_wilson"}'

# 4. Check history
curl http://localhost:5001/api/patient/margaret_wilson/history
```

### **Monitor System Performance**
```bash
# Check system health
curl http://localhost:5001/health

# Clean database if needed
curl -X POST http://localhost:5001/api/admin/cleanup
```

## 🚀 **Integration Examples**

### **JavaScript/React Integration**
```javascript
const processPatientData = async (patientId, scenario = 'normal') => {
  try {
    const response = await fetch(`http://localhost:5001/api/demo/${scenario}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patient_id: patientId })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Usage
const result = await processPatientData('margaret_wilson', 'concerning');
console.log('AI Analysis:', result.synapseGuard_result);
```

### **Python Integration**
```python
import requests
import json

def process_patient(patient_id, scenario='normal'):
    url = f"http://localhost:5001/api/demo/{scenario}"
    payload = {"patient_id": patient_id}
    
    response = requests.post(url, json=payload)
    return response.json()

# Usage
result = process_patient('margaret_wilson', 'crisis')
print(f"Risk Score: {result['synapseGuard_result']['crisis_analysis']['risk_score']}")
```

## 📞 **Support**

For API support:
- Check endpoint responses for error details
- Verify TiDB connection in logs: `docker-compose logs backend`
- Ensure all required environment variables are set
- Review complete request/response cycle in browser developer tools