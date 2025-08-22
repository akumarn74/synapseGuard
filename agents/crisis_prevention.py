from agents.base_agent import BaseAgent
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta
import numpy as np

class CrisisPreventionAgent(BaseAgent):
    def __init__(self, tidb_connection):
        super().__init__("CrisisPrevention", tidb_connection)
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict and prevent crisis situations
        Input: Cognitive analysis results, historical crisis data
        Output: Risk assessment, prevention actions, alert notifications
        """
        patient_id = input_data['patient_id']
        cognitive_analysis = input_data['cognitive_analysis']
        
        # Step 1: Calculate current risk score
        risk_assessment = await self._calculate_risk_score(patient_id, cognitive_analysis)
        
        # Step 2: Search medical literature for similar cases
        medical_insights = await self._search_medical_literature(
            patient_id, cognitive_analysis
        )
        
        # Step 3: Generate prevention strategies
        prevention_actions = await self._generate_prevention_strategies(
            risk_assessment, medical_insights
        )
        
        # Step 4: Store prediction for tracking
        prediction_id = await self._store_prediction(
            patient_id, risk_assessment, prevention_actions
        )
        
        # Step 5: Determine immediate actions
        immediate_actions = await self._determine_immediate_actions(
            risk_assessment, prevention_actions
        )
        
        return {
            'agent': self.name,
            'patient_id': patient_id,
            'prediction_id': prediction_id,
            'risk_score': risk_assessment['risk_score'],
            'crisis_type': risk_assessment['predicted_crisis_type'],
            'confidence': risk_assessment['confidence'],
            'prevention_actions': prevention_actions,
            'immediate_actions': immediate_actions,
            'medical_insights': len(medical_insights)
        }
    
    async def _calculate_risk_score(self, patient_id: str, 
                                  cognitive_analysis: Dict) -> Dict[str, Any]:
        """Calculate crisis risk score based on multiple factors"""
        # Get historical crisis data
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM crisis_predictions 
            WHERE patient_id = %s 
            ORDER BY prediction_timestamp DESC 
            LIMIT 10
        """, (patient_id,))
        
        historical_predictions = cursor.fetchall()
        
        # Base risk factors
        deviation_score = cognitive_analysis.get('deviation_score', 0.5)
        trajectory = cognitive_analysis.get('trajectory_prediction', {})
        trend = trajectory.get('trend', 'stable')
        urgency = trajectory.get('urgency', 'low')
        
        # Calculate weighted risk score
        risk_components = {
            'deviation_weight': deviation_score * 0.4,
            'trend_weight': self._get_trend_weight(trend) * 0.3,
            'urgency_weight': self._get_urgency_weight(urgency) * 0.2,
            'historical_weight': self._get_historical_weight(historical_predictions) * 0.1
        }
        
        total_risk = sum(risk_components.values())
        
        # Predict crisis type based on patterns
        predicted_crisis_type = self._predict_crisis_type(cognitive_analysis)
        
        # Calculate confidence based on data quality
        confidence = self._calculate_confidence(cognitive_analysis, historical_predictions)
        
        return {
            'risk_score': min(total_risk, 1.0),
            'predicted_crisis_type': predicted_crisis_type,
            'confidence': confidence,
            'risk_components': risk_components
        }
    
    def _get_trend_weight(self, trend: str) -> float:
        """Convert trend to numerical weight"""
        trend_weights = {
            'deteriorating': 0.9,
            'stable': 0.3,
            'improving': 0.1,
            'insufficient_data': 0.5
        }
        return trend_weights.get(trend, 0.5)
    
    def _get_urgency_weight(self, urgency: str) -> float:
        """Convert urgency to numerical weight"""
        urgency_weights = {
            'high': 0.9,
            'medium': 0.6,
            'low': 0.3
        }
        return urgency_weights.get(urgency, 0.5)
    
    def _get_historical_weight(self, historical_data: List[Dict]) -> float:
        """Calculate weight based on historical crisis patterns"""
        if not historical_data:
            return 0.5
        
        recent_crises = [p for p in historical_data if p['risk_score'] > 0.7]
        if len(recent_crises) > 0:
            return 0.8  # Higher risk if recent high-risk predictions
        
        return 0.3
    
    def _predict_crisis_type(self, cognitive_analysis: Dict) -> str:
        """Predict the type of crisis based on cognitive patterns"""
        deviation_score = cognitive_analysis.get('deviation_score', 0.5)
        alert_level = cognitive_analysis.get('alert_level', 'low')
        
        if deviation_score > 0.8 and alert_level == 'critical':
            return 'severe_confusion_episode'
        elif deviation_score > 0.6:
            return 'moderate_disorientation'
        elif deviation_score > 0.4:
            return 'routine_disruption'
        else:
            return 'mild_cognitive_fluctuation'
    
    def _calculate_confidence(self, cognitive_analysis: Dict, 
                            historical_data: List[Dict]) -> float:
        """Calculate confidence in prediction"""
        factors = []
        
        # Data completeness
        if 'trajectory_prediction' in cognitive_analysis:
            trajectory = cognitive_analysis['trajectory_prediction']
            if trajectory.get('confidence', 0) > 0.7:
                factors.append(0.8)
            else:
                factors.append(0.5)
        
        # Historical data availability
        if len(historical_data) > 5:
            factors.append(0.9)
        elif len(historical_data) > 0:
            factors.append(0.6)
        else:
            factors.append(0.3)
        
        # Pattern consistency
        if cognitive_analysis.get('similar_patterns_found', 0) > 5:
            factors.append(0.8)
        else:
            factors.append(0.4)
        
        return sum(factors) / len(factors) if factors else 0.5
    
    async def _search_medical_literature(self, patient_id: str, 
                                       cognitive_analysis: Dict) -> List[Dict]:
        """Generate dynamic medical knowledge using AI for patient-specific interventions"""
        # Get patient information
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("""
            SELECT diagnosis, severity_level FROM patients WHERE patient_id = %s
        """, (patient_id,))
        patient_info = cursor.fetchone()
        
        if not patient_info:
            return []
        
        # Import medical knowledge agent for dynamic generation
        from agents.medical_knowledge_agent import MedicalKnowledgeAgent
        medical_agent = MedicalKnowledgeAgent(self.db)
        
        # Generate AI-powered medical knowledge for this specific case
        deviation_score = cognitive_analysis.get('deviation_score', 0.5)
        alert_level = cognitive_analysis.get('alert_level', 'medium')
        
        # Create specific medical query based on current situation
        medical_query = f"crisis prevention interventions for {alert_level} risk {patient_info['diagnosis']} patient"
        
        try:
            # Generate real-time medical insights
            ai_knowledge = await medical_agent.process({
                'query': medical_query,
                'patient_condition': patient_info['diagnosis'],
                'research_focus': [
                    'crisis_prevention',
                    'behavioral_interventions', 
                    'risk_management',
                    'family_coordination'
                ]
            })
            
            # Also get real-time clinical insights for immediate action
            current_symptoms = self._extract_symptoms_from_analysis(cognitive_analysis)
            real_time_insights = await medical_agent.generate_real_time_medical_insights(
                patient_info['diagnosis'],
                current_symptoms,
                []  # Could pass intervention history here
            )
            
            # Combine AI-generated knowledge with any existing knowledge
            ai_results = [{
                'knowledge_id': ai_knowledge.get('knowledge_id', 'ai_generated'),
                'title': f"AI-Generated Crisis Prevention for {patient_info['diagnosis']}",
                'content': self._format_ai_knowledge_for_search(ai_knowledge['medical_insights']),
                'source': 'SynapseGuard AI Medical Knowledge Generation',
                'relevance_score': 0.98,  # Very high relevance for patient-specific AI knowledge
                'real_time_insights': real_time_insights
            }]
            
            # Also search existing knowledge as backup/supplementary
            search_terms = [
                patient_info['diagnosis'],
                alert_level,
                'intervention',
                'prevention',
                'crisis management'
            ]
            
            search_query = ' '.join(search_terms)
            existing_results = await self.full_text_search(
                search_query,
                'medical_knowledge',
                ['content', 'keywords'],
                limit=3
            )
            
            # Combine AI-generated and existing knowledge (AI first due to higher relevance)
            combined_results = ai_results + existing_results
            
            return combined_results
            
        except Exception as e:
            print(f"AI medical knowledge generation failed, falling back to search: {e}")
            
            # Fallback to traditional search if AI fails
            search_terms = [
                patient_info['diagnosis'],
                alert_level,
                'intervention',
                'prevention',
                'crisis management'
            ]
            
            search_query = ' '.join(search_terms)
            medical_results = await self.full_text_search(
                search_query,
                'medical_knowledge',
                ['content', 'keywords'],
                limit=5
            )
            
            return medical_results
    
    def _extract_symptoms_from_analysis(self, cognitive_analysis: Dict) -> List[str]:
        """Extract current symptoms from cognitive analysis"""
        symptoms = []
        
        deviation_score = cognitive_analysis.get('deviation_score', 0)
        alert_level = cognitive_analysis.get('alert_level', 'low')
        
        if deviation_score > 0.8:
            symptoms.extend(['severe_cognitive_changes', 'significant_behavioral_deviation'])
        elif deviation_score > 0.6:
            symptoms.extend(['moderate_cognitive_changes', 'behavioral_pattern_disruption'])
        elif deviation_score > 0.4:
            symptoms.extend(['mild_cognitive_changes', 'routine_variations'])
        
        if alert_level == 'critical':
            symptoms.extend(['critical_risk_indicators', 'immediate_intervention_needed'])
        elif alert_level == 'high':
            symptoms.extend(['high_risk_patterns', 'increased_monitoring_required'])
        
        # Add trajectory-based symptoms
        trajectory = cognitive_analysis.get('trajectory_prediction', {})
        if trajectory.get('trend') == 'deteriorating':
            symptoms.append('declining_cognitive_trajectory')
        if trajectory.get('urgency') == 'high':
            symptoms.append('urgent_intervention_recommended')
        
        return symptoms
    
    def _format_ai_knowledge_for_search(self, medical_insights: Dict) -> str:
        """Format AI-generated medical insights for use in search results"""
        content_parts = []
        
        if isinstance(medical_insights, dict):
            for section, content in medical_insights.items():
                if isinstance(content, str) and len(content) > 10:
                    content_parts.append(f"{section.replace('_', ' ').title()}: {content}")
                elif isinstance(content, list):
                    content_parts.append(f"{section.replace('_', ' ').title()}: {'; '.join(content)}")
                elif isinstance(content, dict):
                    # Flatten nested dictionaries
                    for subsection, subcontent in content.items():
                        if isinstance(subcontent, str):
                            content_parts.append(f"{subsection.replace('_', ' ').title()}: {subcontent}")
        
        # Combine all content
        formatted_content = '. '.join(content_parts)
        
        # Add AI generation metadata
        ai_metadata = f"This knowledge was generated in real-time by SynapseGuard's medical AI system based on current patient condition and latest clinical guidelines. Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}."
        
        return formatted_content + '. ' + ai_metadata if formatted_content else ai_metadata
    
    async def _generate_prevention_strategies(self, risk_assessment: Dict, 
                                            medical_insights: List[Dict]) -> List[Dict]:
        """Generate AI-powered, personalized prevention strategies"""
        try:
            risk_score = risk_assessment['risk_score']
            crisis_type = risk_assessment['predicted_crisis_type']
            confidence = risk_assessment['confidence']
            
            # Create context from medical insights
            medical_context = ""
            if medical_insights:
                medical_context = "\n".join([
                    f"- {insight['title']}: {insight['content'][:200]}..."
                    for insight in medical_insights[:3]
                ])
            
            prompt = f"""
            You are a leading expert in dementia care and crisis prevention. Generate specific, actionable prevention strategies based on the following analysis:

            RISK ASSESSMENT:
            - Risk Score: {risk_score:.2f}/1.0
            - Predicted Crisis Type: {crisis_type}
            - Confidence Level: {confidence:.2f}

            RELEVANT MEDICAL INSIGHTS:
            {medical_context or "No specific medical insights available"}

            Generate 4-6 evidence-based prevention strategies. For each strategy, provide:
            1. Strategy type/category
            2. Detailed description (specific actions to take)
            3. Priority level (critical/high/medium/low)
            4. Timeline for implementation
            5. Expected outcome/benefit

            Format as JSON array with objects containing: type, description, priority, timeline, outcome
            """

            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.2
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            # Try to parse AI response as JSON
            try:
                import json
                strategies = json.loads(ai_response)
                return strategies[:6]  # Limit to 6 strategies
            except json.JSONDecodeError:
                # If JSON parsing fails, extract strategies from text
                strategies = self._parse_strategies_from_text(ai_response)
                return strategies
            
        except Exception as e:
            print(f"AI strategy generation failed: {e}")
            # Fallback to rule-based strategies
            return self._generate_fallback_strategies(risk_assessment, medical_insights)
    
    def _parse_strategies_from_text(self, text: str) -> List[Dict]:
        """Parse strategies from AI text response"""
        strategies = []
        lines = text.split('\n')
        current_strategy = {}
        
        for line in lines:
            line = line.strip()
            if 'type:' in line.lower() or 'strategy:' in line.lower():
                if current_strategy:
                    strategies.append(current_strategy)
                current_strategy = {'type': line.split(':')[1].strip()}
            elif 'description:' in line.lower():
                current_strategy['description'] = line.split(':', 1)[1].strip()
            elif 'priority:' in line.lower():
                current_strategy['priority'] = line.split(':')[1].strip().lower()
            elif 'timeline:' in line.lower():
                current_strategy['timeline'] = line.split(':', 1)[1].strip()
        
        if current_strategy:
            strategies.append(current_strategy)
        
        return strategies[:6]
    
    def _generate_fallback_strategies(self, risk_assessment: Dict, 
                                    medical_insights: List[Dict]) -> List[Dict]:
        """Fallback rule-based strategies"""
        risk_score = risk_assessment['risk_score']
        crisis_type = risk_assessment['predicted_crisis_type']
        
        strategies = []
        
        # Base strategies based on risk level
        if risk_score > 0.8:
            strategies.extend([
                {
                    'type': 'immediate_supervision',
                    'description': 'Arrange immediate family member or caregiver presence',
                    'priority': 'critical',
                    'timeline': 'within 1 hour'
                },
                {
                    'type': 'medical_consultation',
                    'description': 'Contact healthcare provider for emergency assessment',
                    'priority': 'critical',
                    'timeline': 'within 2 hours'
                }
            ])
        
        elif risk_score > 0.6:
            strategies.extend([
                {
                    'type': 'increased_monitoring',
                    'description': 'Monitor patient every 2 hours for next 24 hours',
                    'priority': 'high',
                    'timeline': 'immediately'
                },
                {
                    'type': 'routine_reinforcement',
                    'description': 'Implement structured routine activities',
                    'priority': 'medium',
                    'timeline': 'within 4 hours'
                }
            ])
        
        # Crisis-type specific strategies
        if crisis_type == 'severe_confusion_episode':
            strategies.append({
                'type': 'environmental_modification',
                'description': 'Remove potential hazards, ensure safe environment',
                'priority': 'critical',
                'timeline': 'immediately'
            })
        
        elif crisis_type == 'routine_disruption':
            strategies.append({
                'type': 'gentle_redirection',
                'description': 'Use familiar cues to guide back to routine',
                'priority': 'medium',
                'timeline': 'within 30 minutes'
            })
        
        # Add evidence-based strategies from medical literature
        for insight in medical_insights[:2]:  # Top 2 most relevant
            strategies.append({
                'type': 'evidence_based',
                'description': f"Based on research: {insight['title'][:100]}...",
                'priority': 'medium',
                'timeline': 'within 6 hours',
                'source': insight['source']
            })
        
        return strategies
    
    async def _store_prediction(self, patient_id: str, risk_assessment: Dict, 
                              prevention_actions: List[Dict]) -> str:
        """Store crisis prediction for tracking"""
        prediction_id = f"pred_{patient_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        cursor = self.db.cursor()
        cursor.execute("""
            INSERT INTO crisis_predictions 
            (prediction_id, patient_id, risk_score, predicted_crisis_type, 
             confidence_level, contributing_factors, recommended_actions, 
             prediction_timestamp)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            prediction_id, patient_id, risk_assessment['risk_score'],
            risk_assessment['predicted_crisis_type'], risk_assessment['confidence'],
            json.dumps(risk_assessment['risk_components']),
            json.dumps(prevention_actions), datetime.now()
        ))
        
        self.db.commit()
        return prediction_id
    
    async def _determine_immediate_actions(self, risk_assessment: Dict, 
                                         prevention_actions: List[Dict]) -> List[Dict]:
        """Determine which actions need immediate execution"""
        immediate_actions = []
        
        critical_actions = [action for action in prevention_actions 
                           if action.get('priority') == 'critical']
        
        high_priority_actions = [action for action in prevention_actions 
                               if action.get('priority') == 'high']
        
        # Add critical actions
        immediate_actions.extend(critical_actions)
        
        # Add high priority actions if risk is elevated
        if risk_assessment['risk_score'] > 0.6:
            immediate_actions.extend(high_priority_actions[:2])  # Top 2 high priority
        
        return immediate_actions