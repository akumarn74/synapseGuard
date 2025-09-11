import asyncio
from typing import Dict, Any, List
from agents.cognitive_analyzer import CognitiveAnalyzerAgent
from agents.crisis_prevention import CrisisPreventionAgent
from agents.care_orchestration import CareOrchestrationAgent
from agents.therapeutic_intervention import TherapeuticInterventionAgent
from agents.family_intelligence import FamilyIntelligenceAgent
from agents.pattern_learning import PatternLearningAgent
from agents.medical_knowledge_agent import MedicalKnowledgeAgent
import json
import numpy as np
from datetime import datetime

class AgentOrchestrator:
    def __init__(self, tidb_connection):
        self.db = tidb_connection
        self.agents = {
            'cognitive_analyzer': CognitiveAnalyzerAgent(tidb_connection),
            'crisis_prevention': CrisisPreventionAgent(tidb_connection),
            'care_orchestration': CareOrchestrationAgent(tidb_connection),
            'therapeutic_intervention': TherapeuticInterventionAgent(tidb_connection),
            'family_intelligence': FamilyIntelligenceAgent(tidb_connection),
            'pattern_learning': PatternLearningAgent(tidb_connection),
            'medical_knowledge': MedicalKnowledgeAgent(tidb_connection)
        }
        
        # Load dynamic thresholds from database or use defaults
        self.thresholds = self._load_thresholds()
    
    def _load_thresholds(self) -> Dict[str, float]:
        """Load dynamic thresholds from database or use intelligent defaults"""
        try:
            cursor = self.db.cursor(dictionary=True)
            cursor.execute("""
                SELECT threshold_name, threshold_value 
                FROM system_config 
                WHERE config_type = 'orchestrator_thresholds'
            """)
            
            db_thresholds = {row['threshold_name']: row['threshold_value'] for row in cursor.fetchall()}
            cursor.close()
            
            if db_thresholds:
                print(f"✅ Loaded {len(db_thresholds)} dynamic thresholds from database")
                return db_thresholds
                
        except Exception as e:
            print(f"⚠️  Could not load thresholds from database: {e}")
        
        # Intelligent defaults based on medical research and system performance
        return {
            'crisis_analysis_threshold': 0.3,
            'crisis_action_threshold': 0.5, 
            'therapeutic_intervention_threshold': 0.4,
            'family_coordination_threshold': 0.3,
            'critical_status_threshold': 0.8,
            'high_monitoring_threshold': 0.6,
            'moderate_changes_threshold': 0.4,
            'significant_deviation_threshold': 0.6,
            'moderate_deviation_threshold': 0.4,
            'high_risk_threshold': 0.8,
            'moderate_risk_threshold': 0.6
        }
    
    def _make_serializable(self, obj):
        """Convert complex objects to JSON-serializable format"""
        if isinstance(obj, dict):
            return {key: self._make_serializable(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [self._make_serializable(item) for item in obj]
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, (np.int32, np.int64, np.float32, np.float64)):
            return obj.item()
        elif isinstance(obj, datetime):
            return obj.isoformat()
        else:
            return obj
        
    async def process_patient_data(self, patient_id: str, sensor_data: Dict[str, Any]) -> Dict[str, Any]:
        """Main orchestration method - processes patient data through all agents"""
        
        print(f"🔄 Starting SynapseGuard processing for patient {patient_id}")
        
        # Step 1: Cognitive Pattern Analysis
        print("🧠 Step 1: Analyzing cognitive patterns...")
        cognitive_input = {
            'patient_id': patient_id,
            'sensor_data': sensor_data
        }
        
        cognitive_result = await self.agents['cognitive_analyzer'].process(cognitive_input)
        print(f"   ✓ Deviation score: {cognitive_result['deviation_score']:.2f}")
        print(f"   ✓ Alert level: {cognitive_result['alert_level']}")
        
        # Step 2: Crisis Prevention Analysis (only if concerning patterns)
        crisis_result = None
        if cognitive_result['deviation_score'] > self.thresholds['crisis_analysis_threshold']:
            print("⚠️  Step 2: Analyzing crisis risk...")
            crisis_input = {
                'patient_id': patient_id,
                'cognitive_analysis': cognitive_result
            }
            
            crisis_result = await self.agents['crisis_prevention'].process(crisis_input)
            print(f"   ✓ Risk score: {crisis_result['risk_score']:.2f}")
            print(f"   ✓ Crisis type: {crisis_result['crisis_type']}")
        
        # Step 3: Care Orchestration (if high risk or immediate actions needed)
        orchestration_result = None
        if crisis_result and (crisis_result['risk_score'] > self.thresholds['crisis_action_threshold'] or crisis_result['immediate_actions']):
            print("🤝 Step 3: Orchestrating care coordination...")
            orchestration_input = {
                'patient_id': patient_id,
                'crisis_prediction': crisis_result,
                'immediate_actions': crisis_result['immediate_actions']
            }
            
            orchestration_result = await self.agents['care_orchestration'].process(orchestration_input)
            print(f"   ✓ Actions executed: {orchestration_result['actions_executed']}")
            print(f"   ✓ Notifications sent: {orchestration_result['notifications_sent']}")

        # Step 4: Therapeutic Intervention (for moderate to high risk)
        therapeutic_result = None
        if cognitive_result['deviation_score'] > self.thresholds['therapeutic_intervention_threshold']:
            print("🎯 Step 4: Generating therapeutic interventions...")
            therapeutic_input = {
                'patient_id': patient_id,
                'cognitive_analysis': cognitive_result,
                'crisis_prediction': crisis_result
            }
            
            therapeutic_result = await self.agents['therapeutic_intervention'].process(therapeutic_input)
            print(f"   ✓ Intervention plan created: {therapeutic_result.get('intervention_plan', {}).get('duration', 'N/A')}")
            print(f"   ✓ Activities designed: {len(therapeutic_result.get('activities', []))}")

        # Step 5: Family Intelligence (optimize family dynamics)
        family_result = None
        if orchestration_result or cognitive_result['deviation_score'] > self.thresholds['family_coordination_threshold']:
            print("👨‍👩‍👧‍👦 Step 5: Optimizing family coordination...")
            family_input = {
                'patient_id': patient_id,
                'care_situation': {
                    'risk_level': crisis_result.get('risk_score', 0) if crisis_result else 0,
                    'intervention_needed': therapeutic_result is not None
                },
                'communication_context': {
                    'urgent_communication': orchestration_result is not None,
                    'care_updates_needed': True
                }
            }
            
            family_result = await self.agents['family_intelligence'].process(family_input)
            print(f"   ✓ Family wellness score: {family_result.get('family_wellness_score', 'N/A')}")
            print(f"   ✓ Communication strategies: {len(family_result.get('communication_strategies', []))}")

        # Step 6: Pattern Learning (continuous improvement)
        learning_result = None
        print("🧠 Step 6: Updating pattern learning models...")
        learning_input = {
            'patient_id': patient_id,
            'scope': 'patient_specific',
            'objectives': ['pattern_accuracy', 'intervention_effectiveness']
        }
        
        learning_result = await self.agents['pattern_learning'].process(learning_input)
        print(f"   ✓ Learning insights generated: {learning_result.get('learning_id', 'N/A')}")
        print(f"   ✓ Model improvements identified: {len(learning_result.get('model_improvements', {}).get('priority_ranking', []))}")
        
        # Compile final result
        final_result = {
            'patient_id': patient_id,
            'processing_timestamp': datetime.now().isoformat(),
            'cognitive_analysis': cognitive_result,
            'crisis_analysis': crisis_result,
            'care_orchestration': orchestration_result,
            'therapeutic_intervention': therapeutic_result,
            'family_intelligence': family_result,
            'pattern_learning': learning_result,
            'overall_status': self._determine_overall_status(
                cognitive_result, crisis_result, orchestration_result
            ),
            'summary': self._create_summary(
                cognitive_result, crisis_result, orchestration_result, 
                therapeutic_result, family_result, learning_result
            ),
            'agent_coordination_score': self._calculate_coordination_score(
                cognitive_result, crisis_result, orchestration_result,
                therapeutic_result, family_result, learning_result
            )
        }
        
        # Store complete processing record
        await self._store_processing_record(final_result)
        
        print("✅ SynapseGuard processing complete!")
        return final_result
    
    def _determine_overall_status(self, cognitive_result: Dict, 
                                crisis_result: Dict, orchestration_result: Dict) -> str:
        """Determine overall patient status"""
        if crisis_result and crisis_result['risk_score'] > self.thresholds['critical_status_threshold']:
            return 'CRITICAL_ATTENTION_NEEDED'
        elif crisis_result and crisis_result['risk_score'] > self.thresholds['high_monitoring_threshold']:
            return 'HIGH_MONITORING_REQUIRED'
        elif cognitive_result['deviation_score'] > self.thresholds['moderate_changes_threshold']:
            return 'MODERATE_CHANGES_DETECTED'
        else:
            return 'STABLE_PATTERNS'
    
    def _create_summary(self, cognitive_result: Dict, crisis_result: Dict, 
                       orchestration_result: Dict, therapeutic_result: Dict = None,
                       family_result: Dict = None, learning_result: Dict = None) -> str:
        """Create human-readable summary of all agent activities"""
        summary_parts = []
        
        # Cognitive analysis summary
        deviation = cognitive_result['deviation_score']
        if deviation > self.thresholds['significant_deviation_threshold']:
            summary_parts.append(f"Significant behavioral changes detected (deviation: {deviation:.1f})")
        elif deviation > self.thresholds['moderate_deviation_threshold']:
            summary_parts.append(f"Moderate pattern changes observed (deviation: {deviation:.1f})")
        else:
            summary_parts.append(f"Patterns within normal range (deviation: {deviation:.1f})")
        
        # Crisis analysis summary
        if crisis_result:
            risk_score = crisis_result['risk_score']
            if risk_score > self.thresholds['high_risk_threshold']:
                summary_parts.append(f"High crisis risk identified ({risk_score:.1f}/1.0)")
            elif risk_score > self.thresholds['moderate_risk_threshold']:
                summary_parts.append(f"Moderate crisis risk detected ({risk_score:.1f}/1.0)")
        
        # Orchestration summary
        if orchestration_result:
            actions = orchestration_result['actions_executed']
            notifications = orchestration_result['notifications_sent']
            summary_parts.append(f"Care team activated: {actions} actions, {notifications} notifications")
        
        # Therapeutic intervention summary
        if therapeutic_result:
            activities = len(therapeutic_result.get('activities', []))
            summary_parts.append(f"Therapeutic plan created with {activities} personalized activities")
        
        # Family intelligence summary
        if family_result:
            wellness_score = family_result.get('family_wellness_score', 0)
            strategies = len(family_result.get('communication_strategies', []))
            summary_parts.append(f"Family coordination optimized (wellness: {wellness_score}, {strategies} strategies)")
        
        # Pattern learning summary
        if learning_result:
            improvements = len(learning_result.get('model_improvements', {}).get('priority_ranking', []))
            summary_parts.append(f"AI models updated with {improvements} improvements")
        
        return ". ".join(summary_parts)
    
    def _calculate_coordination_score(self, cognitive_result: Dict, crisis_result: Dict,
                                    orchestration_result: Dict, therapeutic_result: Dict = None,
                                    family_result: Dict = None, learning_result: Dict = None) -> float:
        """Calculate overall agent coordination effectiveness score"""
        scores = []
        
        # Base cognitive analysis score
        deviation = cognitive_result.get('deviation_score', 0.5)
        confidence = cognitive_result.get('trajectory_prediction', {}).get('confidence', 0.5)
        scores.append(confidence)
        
        # Crisis prevention effectiveness
        if crisis_result:
            crisis_confidence = crisis_result.get('confidence', 0.5)
            scores.append(crisis_confidence)
        
        # Care orchestration success rate
        if orchestration_result:
            actions_executed = orchestration_result.get('actions_executed', 0)
            notifications_sent = orchestration_result.get('notifications_sent', 0)
            care_score = min(1.0, (actions_executed + notifications_sent) / 10.0)
            scores.append(care_score)
        
        # Therapeutic intervention effectiveness prediction
        if therapeutic_result:
            therapeutic_score = therapeutic_result.get('effectiveness_prediction', {}).get('effectiveness_probability', 0.7)
            scores.append(therapeutic_score)
        
        # Family wellness contribution
        if family_result:
            family_wellness = family_result.get('family_wellness_score', 0.7)
            scores.append(family_wellness)
        
        # Learning system performance
        if learning_result:
            learning_metrics = learning_result.get('learning_metrics', {})
            model_performance = learning_metrics.get('model_performance', {})
            learning_score = model_performance.get('accuracy', 0.75)
            scores.append(learning_score)
        
        # Calculate weighted average
        return round(sum(scores) / len(scores) if scores else 0.75, 2)
    
    async def _store_processing_record(self, result: Dict[str, Any]):
        """Store complete processing record for audit and learning"""
        import uuid
        
        # Use UUID for guaranteed uniqueness instead of timestamp
        record_id = f"proc_{result['patient_id']}_{uuid.uuid4().hex[:12]}"
        
        # Make result serializable before JSON conversion
        serializable_result = self._make_serializable(result)
        
        cursor = self.db.cursor()
        try:
            # Use INSERT IGNORE to avoid duplicate key errors
            cursor.execute("""
                INSERT IGNORE INTO interventions 
                (intervention_id, patient_id, agent_type, intervention_type, 
                 description, effectiveness_score, timestamp, external_actions)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                record_id, result['patient_id'], 'orchestrator', 'full_processing',
                result['summary'][:500] if result['summary'] else 'AI processing completed', 
                result.get('agent_coordination_score'), datetime.now(), json.dumps(serializable_result)
            ))
            
            self.db.commit()
            print(f"   ✓ Processing record stored: {record_id}")
        except Exception as e:
            print(f"   ⚠️  Warning: Could not store processing record - {str(e)}")
            # Don't fail the entire processing if storage fails
            self.db.rollback()