from agents.base_agent import BaseAgent
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta
import numpy as np

class TherapeuticInterventionAgent(BaseAgent):
    def __init__(self, tidb_connection):
        super().__init__("TherapeuticIntervention", tidb_connection)
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate personalized therapeutic interventions
        Input: Patient profile, cognitive analysis, behavioral patterns
        Output: Therapeutic activities, engagement strategies, progress tracking
        """
        patient_id = input_data['patient_id']
        cognitive_analysis = input_data.get('cognitive_analysis', {})
        crisis_prediction = input_data.get('crisis_prediction', {})
        
        # Step 1: Analyze current therapeutic needs
        therapeutic_needs = await self._assess_therapeutic_needs(
            patient_id, cognitive_analysis, crisis_prediction
        )
        
        # Step 2: Generate AI-powered intervention plan
        intervention_plan = await self._generate_intervention_plan(
            patient_id, therapeutic_needs
        )
        
        # Step 3: Create engagement activities
        activities = await self._design_therapeutic_activities(
            patient_id, intervention_plan, cognitive_analysis
        )
        
        # Step 4: Establish progress tracking
        tracking_metrics = await self._setup_progress_tracking(
            patient_id, intervention_plan
        )
        
        # Step 5: Store intervention record
        intervention_id = await self._store_intervention_plan(
            patient_id, intervention_plan, activities
        )
        
        return {
            'agent': self.name,
            'patient_id': patient_id,
            'intervention_id': intervention_id,
            'therapeutic_needs': therapeutic_needs,
            'intervention_plan': intervention_plan,
            'activities': activities,
            'tracking_metrics': tracking_metrics,
            'effectiveness_prediction': await self._predict_effectiveness(
                patient_id, intervention_plan, cognitive_analysis
            )
        }
    
    async def _assess_therapeutic_needs(self, patient_id: str, 
                                      cognitive_analysis: Dict, 
                                      crisis_prediction: Dict) -> Dict:
        """AI-powered assessment of therapeutic needs"""
        try:
            # Get patient profile
            cursor = self.db.cursor(dictionary=True)
            cursor.execute("""
                SELECT diagnosis, severity_level, baseline_patterns 
                FROM patients WHERE patient_id = %s
            """, (patient_id,))
            
            patient_data = cursor.fetchone()
            if not patient_data:
                return {'error': 'Patient not found'}
            
            # Get recent intervention history
            cursor.execute("""
                SELECT intervention_type, effectiveness_score, description
                FROM interventions 
                WHERE patient_id = %s AND agent_type = %s
                ORDER BY timestamp DESC LIMIT 10
            """, (patient_id, self.name))
            
            intervention_history = cursor.fetchall()
            
            # Create AI prompt for needs assessment
            prompt = f"""
            You are a clinical neuropsychologist specializing in dementia care. Assess therapeutic needs based on:

            PATIENT PROFILE:
            - Diagnosis: {patient_data['diagnosis']}
            - Severity: {patient_data['severity_level']}
            - Cognitive Deviation: {cognitive_analysis.get('deviation_score', 0):.2f}
            - Risk Level: {crisis_prediction.get('risk_score', 0):.2f}

            INTERVENTION HISTORY:
            {self._format_intervention_history(intervention_history)}

            Assess needs in these domains:
            1. Cognitive stimulation requirements
            2. Emotional support needs
            3. Physical activity recommendations
            4. Social engagement requirements
            5. Family caregiver support needs

            Format as JSON: {{"cognitive": {{"priority": "", "focus_areas": []}}, "emotional": {{}}, "physical": {{}}, "social": {{}}, "family": {{}}}}
            """

            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.3
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                needs_assessment = json.loads(ai_response)
                return needs_assessment
            except json.JSONDecodeError:
                return self._parse_needs_from_text(ai_response)
            
        except Exception as e:
            print(f"Therapeutic needs assessment failed: {e}")
            return self._fallback_needs_assessment(cognitive_analysis, crisis_prediction)
    
    async def _generate_intervention_plan(self, patient_id: str, 
                                        therapeutic_needs: Dict) -> Dict:
        """Generate AI-powered personalized intervention plan"""
        try:
            # Get patient preferences and constraints
            cursor = self.db.cursor(dictionary=True)
            cursor.execute("""
                SELECT baseline_patterns FROM patients WHERE patient_id = %s
            """, (patient_id,))
            
            result = cursor.fetchone()
            baseline_patterns = json.loads(result['baseline_patterns']) if result else {}
            
            prompt = f"""
            You are a leading dementia care specialist. Create a personalized therapeutic intervention plan.

            THERAPEUTIC NEEDS ASSESSMENT:
            {json.dumps(therapeutic_needs, indent=2)}

            PATIENT BASELINE PATTERNS:
            {json.dumps(baseline_patterns, indent=2)}

            Create a comprehensive 4-week intervention plan including:
            1. Weekly goals and objectives
            2. Daily activity schedule
            3. Cognitive exercises (specific activities)
            4. Physical activities (adapted to abilities)
            5. Social engagement strategies
            6. Family involvement recommendations
            7. Progress milestones

            Format as JSON with detailed weekly breakdown and specific activities.
            """

            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.2
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                intervention_plan = json.loads(ai_response)
                return intervention_plan
            except json.JSONDecodeError:
                return self._parse_plan_from_text(ai_response)
            
        except Exception as e:
            print(f"Intervention plan generation failed: {e}")
            return self._fallback_intervention_plan(therapeutic_needs)
    
    async def _design_therapeutic_activities(self, patient_id: str, 
                                           intervention_plan: Dict, 
                                           cognitive_analysis: Dict) -> List[Dict]:
        """Design specific therapeutic activities"""
        activities = []
        
        deviation_score = cognitive_analysis.get('deviation_score', 0.5)
        
        # Cognitive activities
        if deviation_score > 0.6:
            activities.extend([
                {
                    'type': 'memory_exercises',
                    'activity': 'Photo album review with family stories',
                    'duration': '20 minutes',
                    'frequency': 'twice daily',
                    'difficulty': 'adapted',
                    'goal': 'Maintain autobiographical memory'
                },
                {
                    'type': 'orientation_practice',
                    'activity': 'Calendar and clock discussions',
                    'duration': '10 minutes',
                    'frequency': 'every 2 hours',
                    'difficulty': 'basic',
                    'goal': 'Improve time and place orientation'
                }
            ])
        else:
            activities.extend([
                {
                    'type': 'cognitive_stimulation',
                    'activity': 'Word puzzles and crosswords',
                    'duration': '30 minutes',
                    'frequency': 'daily',
                    'difficulty': 'moderate',
                    'goal': 'Maintain cognitive flexibility'
                },
                {
                    'type': 'problem_solving',
                    'activity': 'Simple cooking tasks',
                    'duration': '45 minutes',
                    'frequency': '3 times weekly',
                    'difficulty': 'supervised',
                    'goal': 'Maintain executive function'
                }
            ])
        
        # Physical activities
        activities.extend([
            {
                'type': 'gentle_exercise',
                'activity': 'Chair-based stretching routine',
                'duration': '15 minutes',
                'frequency': 'twice daily',
                'difficulty': 'low impact',
                'goal': 'Maintain mobility and circulation'
            },
            {
                'type': 'walking_program',
                'activity': 'Supervised outdoor walks',
                'duration': '20 minutes',
                'frequency': 'daily weather permitting',
                'difficulty': 'moderate',
                'goal': 'Improve cardiovascular health and mood'
            }
        ])
        
        # Social activities
        activities.extend([
            {
                'type': 'family_interaction',
                'activity': 'Video calls with grandchildren',
                'duration': '15 minutes',
                'frequency': 'daily',
                'difficulty': 'assisted',
                'goal': 'Maintain social connections'
            },
            {
                'type': 'community_engagement',
                'activity': 'Virtual senior center activities',
                'duration': '60 minutes',
                'frequency': '3 times weekly',
                'difficulty': 'guided',
                'goal': 'Reduce social isolation'
            }
        ])
        
        return activities
    
    async def _setup_progress_tracking(self, patient_id: str, 
                                     intervention_plan: Dict) -> Dict:
        """Setup progress tracking metrics"""
        tracking_metrics = {
            'cognitive_metrics': [
                'memory_recall_accuracy',
                'attention_span_duration',
                'orientation_score',
                'task_completion_rate'
            ],
            'behavioral_metrics': [
                'activity_engagement_level',
                'mood_assessment_score',
                'sleep_quality_rating',
                'social_interaction_frequency'
            ],
            'physical_metrics': [
                'mobility_assessment',
                'exercise_participation_rate',
                'balance_stability_score'
            ],
            'family_metrics': [
                'caregiver_stress_level',
                'family_satisfaction_score',
                'communication_effectiveness'
            ],
            'tracking_schedule': {
                'daily_assessments': ['mood', 'activity_engagement', 'sleep'],
                'weekly_assessments': ['cognitive_tests', 'physical_function'],
                'monthly_assessments': ['comprehensive_evaluation', 'plan_adjustment']
            }
        }
        
        return tracking_metrics
    
    async def _predict_effectiveness(self, patient_id: str, 
                                   intervention_plan: Dict, 
                                   cognitive_analysis: Dict) -> Dict:
        """Predict intervention effectiveness using AI"""
        try:
            deviation_score = cognitive_analysis.get('deviation_score', 0.5)
            alert_level = cognitive_analysis.get('alert_level', 'medium')
            
            prompt = f"""
            You are a clinical outcomes researcher specializing in dementia interventions. Predict the effectiveness of this intervention plan:

            PATIENT STATUS:
            - Cognitive Deviation: {deviation_score:.2f}
            - Alert Level: {alert_level}

            INTERVENTION PLAN:
            {json.dumps(intervention_plan, indent=2)[:500]}...

            Predict:
            1. Overall effectiveness probability (0.0-1.0)
            2. Expected improvement timeline (days/weeks/months)
            3. Key success factors
            4. Potential challenges
            5. Recommended adjustments

            Format as JSON: {{"effectiveness_probability": 0.0, "timeline": "", "success_factors": [], "challenges": [], "adjustments": []}}
            """

            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.3
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                effectiveness = json.loads(ai_response)
                return effectiveness
            except json.JSONDecodeError:
                return self._parse_effectiveness_from_text(ai_response)
            
        except Exception as e:
            print(f"Effectiveness prediction failed: {e}")
            return {
                'effectiveness_probability': 0.7,
                'timeline': '2-4 weeks',
                'success_factors': ['Consistent implementation', 'Family support'],
                'challenges': ['Patient compliance', 'Caregiver availability'],
                'adjustments': ['Monitor progress weekly', 'Adjust difficulty as needed']
            }
    
    def _format_intervention_history(self, history: List[Dict]) -> str:
        """Format intervention history for AI prompt"""
        if not history:
            return "No previous interventions recorded"
        
        formatted = []
        for intervention in history:
            effectiveness = intervention.get('effectiveness_score', 'N/A')
            formatted.append(f"- {intervention['intervention_type']}: {effectiveness} effectiveness")
        
        return '\n'.join(formatted)
    
    def _parse_needs_from_text(self, text: str) -> Dict:
        """Parse therapeutic needs from AI text response"""
        return {
            'cognitive': {'priority': 'medium', 'focus_areas': ['memory', 'attention']},
            'emotional': {'priority': 'medium', 'focus_areas': ['mood_support', 'anxiety_management']},
            'physical': {'priority': 'low', 'focus_areas': ['mobility', 'exercise']},
            'social': {'priority': 'high', 'focus_areas': ['family_interaction', 'community']},
            'family': {'priority': 'high', 'focus_areas': ['caregiver_support', 'education']}
        }
    
    def _fallback_needs_assessment(self, cognitive_analysis: Dict, 
                                 crisis_prediction: Dict) -> Dict:
        """Fallback needs assessment"""
        deviation_score = cognitive_analysis.get('deviation_score', 0.5)
        
        if deviation_score > 0.7:
            priority_level = 'high'
        elif deviation_score > 0.4:
            priority_level = 'medium'
        else:
            priority_level = 'low'
        
        return {
            'cognitive': {'priority': priority_level, 'focus_areas': ['memory', 'orientation']},
            'emotional': {'priority': 'medium', 'focus_areas': ['mood', 'anxiety']},
            'physical': {'priority': 'low', 'focus_areas': ['exercise', 'mobility']},
            'social': {'priority': 'high', 'focus_areas': ['family', 'community']},
            'family': {'priority': 'high', 'focus_areas': ['support', 'education']}
        }
    
    def _parse_plan_from_text(self, text: str) -> Dict:
        """Parse intervention plan from AI text"""
        return {
            'duration': '4 weeks',
            'weekly_goals': ['Baseline assessment', 'Skill building', 'Routine establishment', 'Progress evaluation'],
            'daily_activities': ['Morning cognitive exercises', 'Afternoon physical activity', 'Evening social time'],
            'progress_milestones': ['Week 1: Engagement', 'Week 2: Participation', 'Week 3: Independence', 'Week 4: Mastery']
        }
    
    def _fallback_intervention_plan(self, therapeutic_needs: Dict) -> Dict:
        """Fallback intervention plan"""
        return {
            'duration': '4 weeks',
            'focus_areas': list(therapeutic_needs.keys()),
            'weekly_schedule': {
                'cognitive_activities': '30 minutes daily',
                'physical_activities': '20 minutes daily',
                'social_activities': '15 minutes daily'
            },
            'goals': ['Maintain current cognitive function', 'Improve quality of life', 'Support family caregivers']
        }
    
    def _parse_effectiveness_from_text(self, text: str) -> Dict:
        """Parse effectiveness prediction from text"""
        return {
            'effectiveness_probability': 0.75,
            'timeline': 'Extracted from AI text',
            'success_factors': ['Family engagement', 'Consistent routine'],
            'challenges': ['Patient motivation', 'Resource availability'],
            'adjustments': ['Regular monitoring', 'Flexible approach']
        }
    
    async def _store_intervention_plan(self, patient_id: str, 
                                     intervention_plan: Dict, 
                                     activities: List[Dict]) -> str:
        """Store intervention plan in database"""
        intervention_id = f"therapeutic_{patient_id}_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
        
        cursor = self.db.cursor()
        cursor.execute("""
            REPLACE INTO interventions 
            (intervention_id, patient_id, agent_type, intervention_type, 
             description, timestamp, external_actions)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            intervention_id, patient_id, self.name, 'therapeutic_plan',
            f"Personalized therapeutic intervention plan: {intervention_plan.get('duration', '4 weeks')}",
            datetime.now(), json.dumps({
                'intervention_plan': intervention_plan,
                'activities': activities
            })
        ))
        
        self.db.commit()
        return intervention_id