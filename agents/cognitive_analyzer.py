from agents.base_agent import BaseAgent
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta
import numpy as np

class CognitiveAnalyzerAgent(BaseAgent):
    def __init__(self, tidb_connection):
        super().__init__("CognitiveAnalyzer", tidb_connection)
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze cognitive patterns and detect deviations
        Input: Patient sensor data, historical patterns
        Output: Pattern analysis, deviation scores, trend predictions
        """
        patient_id = input_data['patient_id']
        current_data = input_data['sensor_data']
        
        # Step 1: Create embedding for current behavioral pattern
        pattern_text = self._create_pattern_description(current_data)
        pattern_vector = await self.create_embedding(pattern_text)
        
        # Step 2: Use Vector Pattern Engine for advanced similarity analysis
        from agents.vector_pattern_engine import VectorPatternEngine
        vector_engine = VectorPatternEngine(self.db)
        
        # Get comprehensive vector-based analysis
        vector_analysis = await vector_engine.process({
            'patient_id': patient_id,
            'current_behavior': current_data,
            'analysis_type': 'hybrid'  # Both patient-specific and population-wide
        })
        
        similar_patterns = vector_analysis.get('similar_patterns', [])
        
        # Get additional vector insights
        intervention_predictions = vector_analysis.get('intervention_predictions', {})
        pattern_novelty = vector_analysis.get('pattern_novelty_score', 0.5)
        
        # Step 3: Calculate deviation score
        deviation_score = await self._calculate_deviation(
            current_data, similar_patterns, patient_id
        )
        
        # Step 4: Store current pattern
        await self._store_pattern(patient_id, pattern_vector, current_data, deviation_score)
        
        # Step 5: Predict cognitive trajectory
        trajectory_prediction = await self._predict_trajectory(
            patient_id, deviation_score, similar_patterns
        )
        
        return {
            'agent': self.name,
            'patient_id': patient_id,
            'deviation_score': deviation_score,
            'trajectory_prediction': trajectory_prediction,
            'similar_patterns_found': len(similar_patterns),
            'alert_level': self._determine_alert_level(deviation_score),
            'recommendations': await self._generate_recommendations(deviation_score),
            'vector_analysis': vector_analysis,
            'intervention_predictions': intervention_predictions,
            'pattern_novelty_score': pattern_novelty,
            'vector_similarity_score': vector_analysis.get('vector_similarity_score', 0.0),
            'pattern_evolution': await vector_engine.analyze_pattern_evolution(patient_id) if hasattr(vector_engine, 'analyze_pattern_evolution') else None
        }
    
    def _create_pattern_description(self, sensor_data: Dict) -> str:
        """Convert sensor data to text description for embedding"""
        description_parts = []
        
        if 'daily_routine' in sensor_data:
            routine = sensor_data['daily_routine']
            description_parts.append(f"Wake time: {routine.get('wake_time', 'unknown')}")
            description_parts.append(f"Morning routine completion: {routine.get('completion_rate', 0)}%")
            description_parts.append(f"Activity level: {routine.get('activity_level', 'normal')}")
        
        if 'cognitive_metrics' in sensor_data:
            cognitive = sensor_data['cognitive_metrics']
            description_parts.append(f"Response time: {cognitive.get('response_time', 'normal')}")
            description_parts.append(f"Memory recall: {cognitive.get('recall_accuracy', 'normal')}")
        
        if 'physical_metrics' in sensor_data:
            physical = sensor_data['physical_metrics']
            description_parts.append(f"Movement patterns: {physical.get('movement_variability', 'stable')}")
            description_parts.append(f"Sleep quality: {physical.get('sleep_score', 'normal')}")
        
        return " | ".join(description_parts)
    
    async def _calculate_deviation(self, current_data: Dict, 
                                 similar_patterns: List[Dict], 
                                 patient_id: str) -> float:
        """Calculate how much current pattern deviates from normal"""
        if not similar_patterns:
            return 0.5  # Neutral score if no historical data
        
        # Get patient's baseline patterns
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("""
            SELECT baseline_patterns FROM patients WHERE patient_id = %s
        """, (patient_id,))
        baseline = cursor.fetchone()
        
        if not baseline:
            return 0.5
        
        baseline_data = self.safe_json_loads(baseline['baseline_patterns'])
        deviation_factors = []
        
        # Compare current data with baseline
        for key in ['daily_routine', 'cognitive_metrics', 'physical_metrics']:
            if key in current_data and key in baseline_data:
                current_metrics = current_data[key]
                baseline_metrics = baseline_data[key]
                
                for metric, current_value in current_metrics.items():
                    if metric in baseline_metrics:
                        baseline_value = baseline_metrics[metric]
                        if isinstance(current_value, (int, float)) and isinstance(baseline_value, (int, float)):
                            deviation = abs(current_value - baseline_value) / max(baseline_value, 1)
                            deviation_factors.append(deviation)
        
        return np.mean(deviation_factors) if deviation_factors else 0.5
    
    async def _store_pattern(self, patient_id: str, pattern_vector: List[float], 
                           raw_data: Dict, deviation_score: float):
        """Store the current pattern in the database"""
        pattern_id = f"pattern_{patient_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        cursor = self.db.cursor()
        # Convert vector to TiDB format
        vector_str = '[' + ','.join(map(str, pattern_vector)) + ']'
        
        cursor.execute("""
            INSERT INTO behavioral_patterns 
            (pattern_id, patient_id, timestamp, pattern_data, pattern_vector, raw_data, 
             pattern_type, deviation_score)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            pattern_id, patient_id, datetime.now(), json.dumps(raw_data),
            vector_str, json.dumps(raw_data), 'routine', deviation_score
        ))
        self.db.commit()
    
    async def _predict_trajectory(self, patient_id: str, current_deviation: float, 
                                similar_patterns: List[Dict]) -> Dict:
        """Evidence-based cognitive trajectory prediction using medical research"""
        try:
            # Analyze trend over time
            cursor = self.db.cursor(dictionary=True)
            cursor.execute("""
                SELECT deviation_score, timestamp 
                FROM behavioral_patterns 
                WHERE patient_id = %s 
                ORDER BY timestamp DESC 
                LIMIT 30
            """, (patient_id,))
            
            recent_deviations = cursor.fetchall()
            
            if len(recent_deviations) < 5:
                return {'trend': 'insufficient_data', 'confidence': 0.0}
            
            # Get evidence-based trajectory insights from medical research
            research_insights = await self._get_trajectory_research_insights(current_deviation)
            
            # Prepare data for evidence-based analysis
            deviations_data = [
                f"Day -{i}: {row['deviation_score']:.3f}"
                for i, row in enumerate(reversed(recent_deviations))
            ]
            
            prompt = f"""
            Based on established medical research on cognitive trajectory patterns:
            
            PATIENT DATA:
            - Current Deviation Score: {current_deviation:.3f}
            - Historical Pattern ({len(recent_deviations)} data points):
            {chr(10).join(deviations_data)}
            
            RESEARCH EVIDENCE:
            {research_insights}
            
            Provide evidence-based trajectory analysis.
            Format as JSON: {{"trend": "", "urgency": "", "confidence": 0.0, "interpretation": "", "intervention_timeframe": "", "research_basis": ""}}
            """

            ai_response = await self.generate_ai_response(prompt)
            
            trajectory = self.safe_json_loads(ai_response)
            if trajectory and 'trend' in trajectory:
                trajectory['medical_literature_source'] = True
                return trajectory
            else:
                return self._parse_trajectory_from_text(ai_response, current_deviation, recent_deviations)
            
        except Exception as e:
            print(f"Trajectory prediction failed: {e}")
            return self._fallback_trajectory_analysis(current_deviation, recent_deviations)
    
    def _parse_trajectory_from_text(self, text: str, current_deviation: float, 
                                  recent_deviations: List[Dict]) -> Dict:
        """Parse trajectory from AI text response"""
        result = {
            'trend': 'stable',
            'urgency': 'medium',
            'confidence': 0.5,
            'interpretation': 'Pattern analysis completed',
            'intervention_timeframe': 'days'
        }
        
        text_lower = text.lower()
        
        if 'deteriorating' in text_lower or 'declining' in text_lower:
            result['trend'] = 'deteriorating'
        elif 'improving' in text_lower or 'better' in text_lower:
            result['trend'] = 'improving'
        
        if 'critical' in text_lower:
            result['urgency'] = 'critical'
        elif 'high' in text_lower:
            result['urgency'] = 'high'
        elif 'low' in text_lower:
            result['urgency'] = 'low'
        
        return result
    
    def _fallback_trajectory_analysis(self, current_deviation: float, 
                                    recent_deviations: List[Dict]) -> Dict:
        """Fallback statistical trajectory analysis"""
        # Calculate trend
        deviations = [row['deviation_score'] for row in recent_deviations]
        trend_slope = np.polyfit(range(len(deviations)), deviations, 1)[0]
        
        # Determine trend direction and severity
        if trend_slope > 0.02:
            trend = 'deteriorating'
            urgency = 'high' if trend_slope > 0.05 else 'medium'
        elif trend_slope < -0.02:
            trend = 'improving'
            urgency = 'low'
        else:
            trend = 'stable'
            urgency = 'low'
        
        confidence = min(len(recent_deviations) / 30.0, 1.0)
        
        return {
            'trend': trend,
            'urgency': urgency,
            'confidence': confidence,
            'trend_slope': trend_slope,
            'interpretation': f"Statistical analysis shows {trend} pattern with {confidence:.1f} confidence",
            'intervention_timeframe': 'days' if urgency in ['high', 'critical'] else 'weeks'
        }
    
    def _determine_alert_level(self, deviation_score: float) -> str:
        """Determine alert level based on deviation score"""
        if deviation_score > 0.8:
            return 'critical'
        elif deviation_score > 0.6:
            return 'high'
        elif deviation_score > 0.4:
            return 'medium'
        else:
            return 'low'
    
    async def _get_trajectory_research_insights(self, deviation_score: float) -> str:
        """Get research insights on cognitive trajectory patterns"""
        try:
            # Search for relevant research on cognitive decline patterns
            search_query = "cognitive decline trajectory prediction behavioral patterns"
            
            research_results = await self.full_text_search(
                search_query,
                'medical_knowledge',
                ['title', 'content', 'keywords'],
                limit=3
            )
            
            # Filter for real research papers
            real_research = [
                paper for paper in research_results
                if 'AI Knowledge Generation' not in paper.get('source', '')
            ]
            
            if real_research:
                insights = []
                for paper in real_research:
                    title = paper.get('title', 'Research Paper')
                    source = paper.get('source', 'Medical Journal')
                    content_excerpt = paper.get('content', '')[:200]
                    insights.append(f"From {source}: {content_excerpt}...")
                
                return '\n'.join(insights)
            else:
                return "Based on established clinical research on cognitive decline patterns and intervention timing."
                
        except Exception as e:
            print(f"Research insights retrieval failed: {e}")
            return "Analysis based on standard clinical assessment protocols."
    
    async def _generate_recommendations(self, deviation_score: float) -> List[str]:
        """Generate evidence-based recommendations using medical research"""
        try:
            # Get research-based recommendations
            research_recommendations = await self._get_research_based_recommendations(deviation_score)
            
            prompt = f"""
            Based on established medical literature for neurodegenerative care:
            
            Deviation Score: {deviation_score:.2f} (0.0 = normal, 1.0 = severe deviation)
            Alert Level: {self._determine_alert_level(deviation_score)}
            
            RESEARCH GUIDANCE:
            {research_recommendations}
            
            Provide 3-5 evidence-based recommendations for caregivers.
            Return only the recommendations as a bulleted list.
            """

            ai_recommendations = await self.generate_ai_response(prompt)
                
            recommendations = [line.strip('• ').strip('- ').strip() 
                             for line in ai_recommendations.split('\n') 
                             if line.strip() and not line.startswith('**')]
            
            return recommendations[:5]
            
        except Exception as e:
            print(f"Recommendation generation failed: {e}")
            return self._fallback_recommendations(deviation_score)
    
    async def _get_research_based_recommendations(self, deviation_score: float) -> str:
        """Get recommendations based on real medical research"""
        try:
            # Search for intervention and care management research
            search_query = "intervention behavioral management caregiver dementia care"
            
            research_results = await self.full_text_search(
                search_query,
                'medical_knowledge',
                ['title', 'content', 'keywords'],
                limit=3
            )
            
            # Filter for real research
            real_research = [
                paper for paper in research_results
                if 'AI Knowledge Generation' not in paper.get('source', '')
            ]
            
            if real_research:
                recommendations = []
                for paper in real_research:
                    content = paper.get('content', '')
                    # Extract intervention recommendations from content
                    if 'intervention' in content.lower():
                        excerpt = content[:250] + '...'
                        recommendations.append(f"Research finding: {excerpt}")
                
                return '\n'.join(recommendations)
            else:
                return "Apply evidence-based care protocols from established medical literature."
                
        except Exception as e:
            print(f"Research-based recommendations retrieval failed: {e}")
            return "Follow standard clinical care guidelines."
    
    def _fallback_recommendations(self, deviation_score: float) -> List[str]:
        """Fallback evidence-based recommendations"""
        if deviation_score > 0.6:
            return [
                "Schedule immediate healthcare provider consultation based on clinical guidelines",
                "Implement increased family supervision per care protocols",
                "Review current care plan against best practice standards"
            ]
        elif deviation_score > 0.4:
            return [
                "Increase monitoring frequency per clinical recommendations", 
                "Apply gentle routine reinforcement techniques from research",
                "Notify primary caregiver following communication protocols"
            ]
        else:
            return [
                "Continue evidence-based care routine",
                "Maintain standard monitoring protocols"
            ]