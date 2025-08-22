from agents.base_agent import BaseAgent
from typing import Dict, Any, List, Tuple
import json
from datetime import datetime, timedelta
import numpy as np

class VectorPatternEngine(BaseAgent):
    """
    Advanced Vector Pattern Analysis Engine
    Actively uses behavioral pattern vectors and intervention outcomes for intelligent matching
    """
    
    def __init__(self, tidb_connection):
        super().__init__("VectorPatternEngine", tidb_connection)
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Advanced vector-based pattern analysis and outcome prediction
        """
        patient_id = input_data['patient_id']
        current_behavior = input_data.get('current_behavior', {})
        analysis_type = input_data.get('analysis_type', 'similarity_search')
        
        # Step 1: Create vector embedding for current behavior
        current_vector = await self._create_behavior_vector(current_behavior)
        
        # Step 2: Find similar patterns using vector search
        similar_patterns = await self._find_similar_patterns(
            patient_id, current_vector, analysis_type
        )
        
        # Step 3: Analyze intervention outcomes for similar patterns
        outcome_analysis = await self._analyze_intervention_outcomes(
            similar_patterns, patient_id
        )
        
        # Step 4: Predict optimal interventions based on vector similarity
        intervention_predictions = await self._predict_optimal_interventions(
            current_vector, similar_patterns, outcome_analysis
        )
        
        # Step 5: Store current pattern vector for future learning
        pattern_id = await self._store_pattern_vector(
            patient_id, current_vector, current_behavior
        )
        
        return {
            'agent': self.name,
            'patient_id': patient_id,
            'pattern_id': pattern_id,
            'current_vector_embedding': current_vector,
            'similar_patterns': similar_patterns,
            'outcome_analysis': outcome_analysis,
            'intervention_predictions': intervention_predictions,
            'vector_similarity_score': self._calculate_overall_similarity(similar_patterns),
            'pattern_novelty_score': await self._calculate_pattern_novelty(current_vector, patient_id)
        }
    
    async def _create_behavior_vector(self, behavior_data: Dict) -> List[float]:
        """Create 512-dimensional vector embedding from behavioral data"""
        
        # Create comprehensive text description for embedding
        behavior_description = self._create_behavioral_description(behavior_data)
        
        # Generate vector embedding
        vector_embedding = await self.create_embedding(behavior_description)
        
        # Ensure 512 dimensions (pad or truncate if needed)
        if len(vector_embedding) < 512:
            # Pad with zeros
            vector_embedding.extend([0.0] * (512 - len(vector_embedding)))
        elif len(vector_embedding) > 512:
            # Truncate to 512
            vector_embedding = vector_embedding[:512]
        
        return vector_embedding
    
    def _create_behavioral_description(self, behavior_data: Dict) -> str:
        """Create detailed behavioral description for vector embedding"""
        description_parts = []
        
        # Daily routine patterns
        if 'daily_routine' in behavior_data:
            routine = behavior_data['daily_routine']
            wake_time = routine.get('wake_time', 'unknown')
            completion_rate = routine.get('completion_rate', 0)
            activity_level = routine.get('activity_level', 'normal')
            
            description_parts.extend([
                f"wake time {wake_time}",
                f"routine completion {completion_rate * 100}percent",
                f"activity level {activity_level}"
            ])
        
        # Cognitive metrics
        if 'cognitive_metrics' in behavior_data:
            cognitive = behavior_data['cognitive_metrics']
            response_time = cognitive.get('response_time', 'normal')
            recall_accuracy = cognitive.get('recall_accuracy', 'normal')
            orientation = cognitive.get('orientation_score', 1.0)
            
            description_parts.extend([
                f"cognitive response time {response_time}",
                f"memory recall {recall_accuracy}",
                f"orientation score {orientation}"
            ])
        
        # Physical metrics
        if 'physical_metrics' in behavior_data:
            physical = behavior_data['physical_metrics']
            movement = physical.get('movement_variability', 'stable')
            sleep_score = physical.get('sleep_score', 'normal')
            
            description_parts.extend([
                f"movement patterns {movement}",
                f"sleep quality {sleep_score}"
            ])
        
        # Social engagement
        if 'social_metrics' in behavior_data:
            social = behavior_data['social_metrics']
            interaction_frequency = social.get('interaction_frequency', 'normal')
            engagement_quality = social.get('engagement_quality', 'good')
            
            description_parts.extend([
                f"social interaction {interaction_frequency}",
                f"engagement quality {engagement_quality}"
            ])
        
        # Emotional indicators
        if 'emotional_state' in behavior_data:
            emotional = behavior_data['emotional_state']
            mood = emotional.get('mood', 'stable')
            anxiety_level = emotional.get('anxiety_level', 'low')
            
            description_parts.extend([
                f"emotional mood {mood}",
                f"anxiety level {anxiety_level}"
            ])
        
        # Environmental factors
        if 'environmental_factors' in behavior_data:
            environment = behavior_data['environmental_factors']
            location_familiarity = environment.get('location_familiarity', 'high')
            noise_level = environment.get('noise_level', 'normal')
            
            description_parts.extend([
                f"environment familiarity {location_familiarity}",
                f"noise level {noise_level}"
            ])
        
        return " ".join(description_parts)
    
    async def _find_similar_patterns(self, patient_id: str, current_vector: List[float], 
                                   analysis_type: str) -> List[Dict]:
        """Find similar behavioral patterns using vector cosine similarity"""
        
        if analysis_type == 'patient_specific':
            # Find similar patterns for this specific patient
            similar_patterns = await self.vector_search(
                current_vector,
                'behavioral_patterns',
                'pattern_vector',
                limit=10
            )
            
            # Filter for this patient
            patient_patterns = [p for p in similar_patterns if p.get('patient_id') == patient_id]
            return patient_patterns
            
        elif analysis_type == 'population_wide':
            # Find similar patterns across all patients
            similar_patterns = await self.vector_search(
                current_vector,
                'behavioral_patterns', 
                'pattern_vector',
                limit=20
            )
            return similar_patterns
            
        else:  # hybrid approach
            # Get both patient-specific and population patterns
            all_patterns = await self.vector_search(
                current_vector,
                'behavioral_patterns',
                'pattern_vector', 
                limit=15
            )
            
            # Separate patient-specific and population patterns
            patient_patterns = [p for p in all_patterns if p.get('patient_id') == patient_id]
            population_patterns = [p for p in all_patterns if p.get('patient_id') != patient_id]
            
            # Combine with preference for patient-specific
            return patient_patterns[:8] + population_patterns[:7]
    
    async def _analyze_intervention_outcomes(self, similar_patterns: List[Dict], 
                                          patient_id: str) -> Dict:
        """Analyze intervention outcomes for similar behavioral patterns"""
        
        if not similar_patterns:
            return {'no_similar_patterns': True}
        
        # Get intervention history for similar patterns
        pattern_ids = [p.get('pattern_id') for p in similar_patterns if p.get('pattern_id')]
        
        if not pattern_ids:
            return {'no_pattern_ids': True}
        
        # Query interventions that were triggered by similar patterns
        cursor = self.db.cursor(dictionary=True)
        pattern_ids_str = "','".join(pattern_ids)
        
        cursor.execute(f"""
            SELECT 
                i.intervention_type,
                i.agent_type,
                i.effectiveness_score,
                i.description,
                i.timestamp,
                i.trigger_pattern_id,
                bp.deviation_score,
                bp.pattern_type
            FROM interventions i
            JOIN behavioral_patterns bp ON i.trigger_pattern_id = bp.pattern_id
            WHERE i.trigger_pattern_id IN ('{pattern_ids_str}')
            AND i.effectiveness_score IS NOT NULL
            ORDER BY i.effectiveness_score DESC
        """)
        
        intervention_outcomes = cursor.fetchall()
        
        # Analyze outcomes by intervention type
        outcome_analysis = {}
        
        for outcome in intervention_outcomes:
            intervention_type = outcome['intervention_type']
            effectiveness = outcome.get('effectiveness_score', 0)
            agent_type = outcome.get('agent_type', 'unknown')
            deviation_score = outcome.get('deviation_score', 0)
            
            if intervention_type not in outcome_analysis:
                outcome_analysis[intervention_type] = {
                    'total_applications': 0,
                    'effectiveness_scores': [],
                    'agent_types': set(),
                    'deviation_contexts': []
                }
            
            outcome_analysis[intervention_type]['total_applications'] += 1
            outcome_analysis[intervention_type]['effectiveness_scores'].append(effectiveness)
            outcome_analysis[intervention_type]['agent_types'].add(agent_type)
            outcome_analysis[intervention_type]['deviation_contexts'].append(deviation_score)
        
        # Calculate summary statistics
        for intervention_type, data in outcome_analysis.items():
            scores = data['effectiveness_scores']
            data['avg_effectiveness'] = np.mean(scores) if scores else 0
            data['effectiveness_std'] = np.std(scores) if len(scores) > 1 else 0
            data['max_effectiveness'] = max(scores) if scores else 0
            data['min_effectiveness'] = min(scores) if scores else 0
            data['agent_types'] = list(data['agent_types'])
            data['avg_deviation_context'] = np.mean(data['deviation_contexts']) if data['deviation_contexts'] else 0
        
        # Rank interventions by effectiveness
        ranked_interventions = sorted(
            outcome_analysis.items(),
            key=lambda x: x[1]['avg_effectiveness'],
            reverse=True
        )
        
        return {
            'total_similar_patterns': len(similar_patterns),
            'total_interventions_analyzed': len(intervention_outcomes),
            'outcome_analysis': outcome_analysis,
            'ranked_interventions': ranked_interventions[:10],  # Top 10 most effective
            'analysis_timestamp': datetime.now().isoformat()
        }
    
    async def _predict_optimal_interventions(self, current_vector: List[float],
                                          similar_patterns: List[Dict],
                                          outcome_analysis: Dict) -> Dict:
        """Predict optimal interventions based on vector similarity and historical outcomes"""
        
        predictions = {}
        
        if not outcome_analysis.get('ranked_interventions'):
            return {'no_historical_data': True}
        
        # Calculate vector similarity weights
        similarity_weights = {}
        for pattern in similar_patterns:
            pattern_vector = pattern.get('pattern_vector', [])
            if pattern_vector and len(pattern_vector) == len(current_vector):
                # Calculate cosine similarity
                similarity = self._cosine_similarity(current_vector, pattern_vector)
                similarity_weights[pattern.get('pattern_id')] = similarity
        
        # Weight intervention effectiveness by pattern similarity
        weighted_predictions = {}
        
        for intervention_type, ranking_data in outcome_analysis.get('ranked_interventions', []):
            intervention_data = outcome_analysis['outcome_analysis'][intervention_type]
            
            # Calculate weighted effectiveness based on pattern similarity
            total_weighted_score = 0
            total_weight = 0
            
            for i, effectiveness in enumerate(intervention_data['effectiveness_scores']):
                # Find corresponding pattern similarity weight
                pattern_weight = 1.0  # Default weight
                if len(similar_patterns) > i:
                    pattern_id = similar_patterns[i].get('pattern_id')
                    pattern_weight = similarity_weights.get(pattern_id, 1.0)
                
                total_weighted_score += effectiveness * pattern_weight
                total_weight += pattern_weight
            
            weighted_effectiveness = total_weighted_score / total_weight if total_weight > 0 else 0
            
            weighted_predictions[intervention_type] = {
                'predicted_effectiveness': weighted_effectiveness,
                'confidence': min(intervention_data['total_applications'] / 10.0, 1.0),  # More data = higher confidence
                'historical_avg': intervention_data['avg_effectiveness'],
                'historical_applications': intervention_data['total_applications'],
                'recommended_agents': intervention_data['agent_types'],
                'similarity_weighted': True
            }
        
        # Rank predictions by weighted effectiveness
        ranked_predictions = sorted(
            weighted_predictions.items(),
            key=lambda x: x[1]['predicted_effectiveness'],
            reverse=True
        )
        
        return {
            'vector_weighted_predictions': weighted_predictions,
            'top_5_recommendations': ranked_predictions[:5],
            'prediction_methodology': 'vector_similarity_weighted_historical_outcomes',
            'total_patterns_analyzed': len(similar_patterns),
            'average_pattern_similarity': np.mean(list(similarity_weights.values())) if similarity_weights else 0
        }
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        try:
            vec1_np = np.array(vec1)
            vec2_np = np.array(vec2)
            
            dot_product = np.dot(vec1_np, vec2_np)
            norm1 = np.linalg.norm(vec1_np)
            norm2 = np.linalg.norm(vec2_np)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            return dot_product / (norm1 * norm2)
        except:
            return 0.0
    
    async def _store_pattern_vector(self, patient_id: str, pattern_vector: List[float], 
                                  behavior_data: Dict) -> str:
        """Store behavioral pattern vector in database"""
        
        pattern_id = f"vec_pattern_{patient_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Determine pattern type from behavior data
        pattern_type = 'routine'  # Default
        if 'cognitive_metrics' in behavior_data:
            pattern_type = 'cognitive'
        elif 'physical_metrics' in behavior_data:
            pattern_type = 'physical'
        elif 'social_metrics' in behavior_data:
            pattern_type = 'social'
        
        # Calculate deviation score from behavior data
        deviation_score = self._calculate_deviation_from_behavior(behavior_data)
        
        cursor = self.db.cursor()
        # Convert vector to TiDB format
        vector_str = '[' + ','.join(map(str, pattern_vector)) + ']'
        
        cursor.execute("""
            INSERT INTO behavioral_patterns 
            (pattern_id, patient_id, timestamp, pattern_data, pattern_vector, raw_data, pattern_type, deviation_score)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            pattern_id, patient_id, datetime.now(), json.dumps(behavior_data),
            vector_str, json.dumps(behavior_data),
            pattern_type, deviation_score
        ))
        
        self.db.commit()
        return pattern_id
    
    def _calculate_deviation_from_behavior(self, behavior_data: Dict) -> float:
        """Calculate deviation score from behavioral data"""
        deviation_factors = []
        
        # Check routine completion
        if 'daily_routine' in behavior_data:
            routine = behavior_data['daily_routine']
            completion = routine.get('completion_rate', 1.0)
            if completion < 0.8:
                deviation_factors.append(1.0 - completion)
        
        # Check cognitive metrics
        if 'cognitive_metrics' in behavior_data:
            cognitive = behavior_data['cognitive_metrics']
            if cognitive.get('response_time') in ['slow', 'very_slow']:
                deviation_factors.append(0.6)
            if cognitive.get('recall_accuracy') in ['poor', 'very_poor']:
                deviation_factors.append(0.7)
        
        # Check activity levels
        if 'daily_routine' in behavior_data:
            activity = behavior_data['daily_routine'].get('activity_level', 'normal')
            if activity in ['low', 'very_low']:
                deviation_factors.append(0.5)
            elif activity in ['high', 'very_high']:
                deviation_factors.append(0.4)
        
        return np.mean(deviation_factors) if deviation_factors else 0.2
    
    def _calculate_overall_similarity(self, similar_patterns: List[Dict]) -> float:
        """Calculate overall similarity score for matched patterns"""
        if not similar_patterns:
            return 0.0
        
        distances = [p.get('distance', 1.0) for p in similar_patterns]
        similarities = [1.0 - d for d in distances if isinstance(d, (int, float))]
        
        return np.mean(similarities) if similarities else 0.0
    
    async def _calculate_pattern_novelty(self, current_vector: List[float], patient_id: str) -> float:
        """Calculate how novel/unique this pattern is"""
        
        # Find closest patterns
        closest_patterns = await self.vector_search(
            current_vector,
            'behavioral_patterns',
            'pattern_vector',
            limit=5
        )
        
        if not closest_patterns:
            return 1.0  # Completely novel
        
        # Calculate average distance to closest patterns
        distances = [p.get('distance', 1.0) for p in closest_patterns]
        avg_distance = np.mean(distances)
        
        # Convert distance to novelty score (higher distance = more novel)
        novelty_score = min(avg_distance, 1.0)
        
        return novelty_score
    
    async def analyze_pattern_evolution(self, patient_id: str, time_window_days: int = 30) -> Dict:
        """Analyze how behavioral patterns are evolving over time using vectors"""
        
        # Get recent patterns for the patient
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("""
            SELECT pattern_id, pattern_vector, timestamp, deviation_score, pattern_type
            FROM behavioral_patterns 
            WHERE patient_id = %s 
            AND timestamp > DATE_SUB(NOW(), INTERVAL %s DAY)
            ORDER BY timestamp DESC
        """, (patient_id, time_window_days))
        
        patterns = cursor.fetchall()
        
        if len(patterns) < 2:
            return {'insufficient_data': True}
        
        # Analyze vector drift over time
        vector_evolution = []
        
        for i in range(1, len(patterns)):
            current_pattern = patterns[i-1]  # More recent
            previous_pattern = patterns[i]   # Older
            
            # Safely parse pattern vectors with null checking
            current_vector_str = current_pattern['pattern_vector']
            previous_vector_str = previous_pattern['pattern_vector']
            
            if not current_vector_str or not previous_vector_str:
                continue  # Skip this comparison if either vector is None/empty
                
            current_vector = json.loads(current_vector_str)
            previous_vector = json.loads(previous_vector_str)
            
            # Calculate similarity between consecutive patterns
            similarity = self._cosine_similarity(current_vector, previous_vector)
            time_diff = (current_pattern['timestamp'] - previous_pattern['timestamp']).days
            
            vector_evolution.append({
                'similarity': similarity,
                'time_diff_days': time_diff,
                'drift_rate': (1.0 - similarity) / max(time_diff, 1),  # Drift per day
                'current_deviation': current_pattern['deviation_score'],
                'previous_deviation': previous_pattern['deviation_score']
            })
        
        # Calculate overall trends
        avg_similarity = np.mean([ve['similarity'] for ve in vector_evolution])
        avg_drift_rate = np.mean([ve['drift_rate'] for ve in vector_evolution])
        
        # Determine trend direction
        recent_deviations = [p['deviation_score'] for p in patterns[:5]]  # Last 5 patterns
        older_deviations = [p['deviation_score'] for p in patterns[-5:]] # First 5 patterns
        
        trend_direction = 'stable'
        if np.mean(recent_deviations) > np.mean(older_deviations) + 0.1:
            trend_direction = 'deteriorating'
        elif np.mean(recent_deviations) < np.mean(older_deviations) - 0.1:
            trend_direction = 'improving'
        
        return {
            'patient_id': patient_id,
            'time_window_days': time_window_days,
            'total_patterns_analyzed': len(patterns),
            'average_pattern_similarity': avg_similarity,
            'average_drift_rate_per_day': avg_drift_rate,
            'trend_direction': trend_direction,
            'stability_score': avg_similarity,  # Higher similarity = more stable
            'recent_avg_deviation': np.mean(recent_deviations),
            'baseline_avg_deviation': np.mean(older_deviations),
            'vector_evolution_timeline': vector_evolution,
            'analysis_timestamp': datetime.now().isoformat()
        }