from agents.base_agent import BaseAgent
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta
import numpy as np

class InterventionOutcomeTracker(BaseAgent):
    """
    Active intervention outcome tracking and learning system
    Tracks effectiveness of interventions and learns from results
    """
    
    def __init__(self, tidb_connection):
        super().__init__("OutcomeTracker", tidb_connection)
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Track intervention outcomes and update effectiveness scores
        """
        intervention_id = input_data.get('intervention_id')
        patient_id = input_data.get('patient_id')
        outcome_data = input_data.get('outcome_data', {})
        follow_up_days = input_data.get('follow_up_days', 7)
        
        # Step 1: Record the outcome
        outcome_record = await self._record_intervention_outcome(
            intervention_id, patient_id, outcome_data
        )
        
        # Step 2: Analyze effectiveness patterns
        effectiveness_analysis = await self._analyze_intervention_effectiveness(
            patient_id, intervention_id, follow_up_days
        )
        
        # Step 3: Update intervention effectiveness scores
        updated_scores = await self._update_effectiveness_scores(
            intervention_id, effectiveness_analysis
        )
        
        # Step 4: Learn patterns for future predictions
        pattern_insights = await self._extract_outcome_patterns(
            patient_id, effectiveness_analysis
        )
        
        # Step 5: Generate recommendations for similar cases
        recommendations = await self._generate_outcome_based_recommendations(
            pattern_insights, effectiveness_analysis
        )
        
        return {
            'agent': self.name,
            'intervention_id': intervention_id,
            'patient_id': patient_id,
            'outcome_record': outcome_record,
            'effectiveness_analysis': effectiveness_analysis,
            'updated_scores': updated_scores,
            'pattern_insights': pattern_insights,
            'recommendations': recommendations,
            'tracking_timestamp': datetime.now().isoformat()
        }
    
    async def _record_intervention_outcome(self, intervention_id: str, 
                                         patient_id: str, outcome_data: Dict) -> Dict:
        """Record detailed intervention outcome"""
        
        # Calculate overall effectiveness score from outcome data
        effectiveness_score = self._calculate_effectiveness_score(outcome_data)
        
        # Update the intervention record with outcome
        cursor = self.db.cursor()
        cursor.execute("""
            UPDATE interventions 
            SET effectiveness_score = %s, 
                external_actions = JSON_SET(
                    COALESCE(external_actions, '{}'), 
                    '$.outcome_data', %s,
                    '$.outcome_recorded_at', %s
                )
            WHERE intervention_id = %s
        """, (
            effectiveness_score,
            json.dumps(outcome_data),
            datetime.now().isoformat(),
            intervention_id
        ))
        
        self.db.commit()
        
        return {
            'intervention_id': intervention_id,
            'effectiveness_score': effectiveness_score,
            'outcome_data': outcome_data,
            'recorded_at': datetime.now().isoformat()
        }
    
    def _calculate_effectiveness_score(self, outcome_data: Dict) -> float:
        """Calculate effectiveness score from outcome data"""
        
        effectiveness_factors = []
        
        # Symptom improvement
        if 'symptom_improvement' in outcome_data:
            improvement = outcome_data['symptom_improvement']
            if isinstance(improvement, (int, float)):
                effectiveness_factors.append(improvement / 100.0)  # Convert percentage to 0-1
            elif improvement in ['significant', 'major']:
                effectiveness_factors.append(0.9)
            elif improvement in ['moderate', 'good']:
                effectiveness_factors.append(0.7)
            elif improvement in ['mild', 'slight']:
                effectiveness_factors.append(0.5)
            elif improvement in ['none', 'no_change']:
                effectiveness_factors.append(0.3)
            elif improvement in ['worse', 'deteriorated']:
                effectiveness_factors.append(0.1)
        
        # Patient satisfaction
        if 'patient_satisfaction' in outcome_data:
            satisfaction = outcome_data['patient_satisfaction']
            if isinstance(satisfaction, (int, float)):
                effectiveness_factors.append(satisfaction / 10.0)  # Convert 1-10 scale to 0-1
            elif satisfaction in ['very_satisfied', 'excellent']:
                effectiveness_factors.append(0.95)
            elif satisfaction in ['satisfied', 'good']:
                effectiveness_factors.append(0.8)
            elif satisfaction in ['neutral', 'okay']:
                effectiveness_factors.append(0.6)
            elif satisfaction in ['dissatisfied', 'poor']:
                effectiveness_factors.append(0.3)
        
        # Family feedback
        if 'family_feedback' in outcome_data:
            feedback = outcome_data['family_feedback']
            if feedback in ['very_positive', 'excellent']:
                effectiveness_factors.append(0.9)
            elif feedback in ['positive', 'good']:
                effectiveness_factors.append(0.75)
            elif feedback in ['neutral', 'mixed']:
                effectiveness_factors.append(0.5)
            elif feedback in ['negative', 'poor']:
                effectiveness_factors.append(0.2)
        
        # Behavioral changes
        if 'behavioral_changes' in outcome_data:
            changes = outcome_data['behavioral_changes']
            if changes in ['significant_improvement', 'major_improvement']:
                effectiveness_factors.append(0.95)
            elif changes in ['moderate_improvement']:
                effectiveness_factors.append(0.8)
            elif changes in ['slight_improvement']:
                effectiveness_factors.append(0.6)
            elif changes in ['no_change']:
                effectiveness_factors.append(0.4)
            elif changes in ['deterioration']:
                effectiveness_factors.append(0.1)
        
        # Side effects (negative factor)
        if 'side_effects' in outcome_data:
            side_effects = outcome_data['side_effects']
            if side_effects in ['severe']:
                effectiveness_factors.append(0.1)
            elif side_effects in ['moderate']:
                effectiveness_factors.append(0.3)
            elif side_effects in ['mild']:
                effectiveness_factors.append(0.7)
            elif side_effects in ['none', 'minimal']:
                effectiveness_factors.append(1.0)
        
        # Compliance/adherence
        if 'compliance_rate' in outcome_data:
            compliance = outcome_data['compliance_rate']
            if isinstance(compliance, (int, float)):
                effectiveness_factors.append(compliance / 100.0)
        
        # Calculate weighted average
        if effectiveness_factors:
            return round(sum(effectiveness_factors) / len(effectiveness_factors), 2)
        else:
            return 0.5  # Default neutral score
    
    async def _analyze_intervention_effectiveness(self, patient_id: str, 
                                                intervention_id: str, 
                                                follow_up_days: int) -> Dict:
        """Analyze intervention effectiveness patterns"""
        
        # Get the specific intervention details
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM interventions 
            WHERE intervention_id = %s
        """, (intervention_id,))
        
        intervention = cursor.fetchone()
        
        if not intervention:
            return {'error': 'Intervention not found'}
        
        # Get similar interventions for comparison
        cursor.execute("""
            SELECT 
                intervention_type,
                agent_type,
                effectiveness_score,
                description,
                timestamp,
                external_actions
            FROM interventions 
            WHERE patient_id = %s 
            AND intervention_type = %s
            AND effectiveness_score IS NOT NULL
            AND timestamp >= DATE_SUB(NOW(), INTERVAL %s DAY)
            ORDER BY timestamp DESC
        """, (patient_id, intervention['intervention_type'], follow_up_days * 2))
        
        similar_interventions = cursor.fetchall()
        
        # Analyze effectiveness patterns
        effectiveness_scores = [i['effectiveness_score'] for i in similar_interventions 
                              if i['effectiveness_score'] is not None]
        
        analysis = {
            'intervention_type': intervention['intervention_type'],
            'agent_type': intervention['agent_type'],
            'current_effectiveness': intervention.get('effectiveness_score'),
            'similar_interventions_count': len(similar_interventions),
            'effectiveness_scores': effectiveness_scores,
            'avg_effectiveness': np.mean(effectiveness_scores) if effectiveness_scores else None,
            'effectiveness_std': np.std(effectiveness_scores) if len(effectiveness_scores) > 1 else None,
            'effectiveness_trend': self._calculate_effectiveness_trend(similar_interventions),
            'best_effectiveness': max(effectiveness_scores) if effectiveness_scores else None,
            'worst_effectiveness': min(effectiveness_scores) if effectiveness_scores else None
        }
        
        # Compare with population averages
        cursor.execute("""
            SELECT 
                AVG(effectiveness_score) as population_avg,
                COUNT(*) as population_count,
                STDDEV(effectiveness_score) as population_std
            FROM interventions 
            WHERE intervention_type = %s
            AND effectiveness_score IS NOT NULL
            AND timestamp >= DATE_SUB(NOW(), INTERVAL 90 DAY)
        """, (intervention['intervention_type'],))
        
        population_stats = cursor.fetchone()
        
        if population_stats:
            analysis['population_comparison'] = {
                'population_avg': population_stats['population_avg'],
                'population_count': population_stats['population_count'],
                'population_std': population_stats['population_std'],
                'patient_vs_population': (analysis['avg_effectiveness'] - population_stats['population_avg']) 
                                       if analysis['avg_effectiveness'] else None
            }
        
        return analysis
    
    def _calculate_effectiveness_trend(self, interventions: List[Dict]) -> str:
        """Calculate trend in intervention effectiveness over time"""
        
        if len(interventions) < 3:
            return 'insufficient_data'
        
        # Sort by timestamp and get effectiveness scores
        sorted_interventions = sorted(interventions, key=lambda x: x['timestamp'])
        scores = [i['effectiveness_score'] for i in sorted_interventions 
                 if i['effectiveness_score'] is not None]
        
        if len(scores) < 3:
            return 'insufficient_data'
        
        # Calculate linear trend
        x = list(range(len(scores)))
        trend_slope = np.polyfit(x, scores, 1)[0]
        
        if trend_slope > 0.1:
            return 'improving'
        elif trend_slope < -0.1:
            return 'declining'
        else:
            return 'stable'
    
    async def _update_effectiveness_scores(self, intervention_id: str, 
                                         effectiveness_analysis: Dict) -> Dict:
        """Update effectiveness scores based on analysis"""
        
        current_score = effectiveness_analysis.get('current_effectiveness')
        avg_effectiveness = effectiveness_analysis.get('avg_effectiveness')
        trend = effectiveness_analysis.get('effectiveness_trend')
        
        if current_score is None:
            return {'no_update': 'No current effectiveness score'}
        
        # Calculate adjusted score based on trend and context
        adjusted_score = current_score
        
        # Adjust based on trend
        if trend == 'improving':
            adjusted_score = min(current_score * 1.1, 1.0)
        elif trend == 'declining':
            adjusted_score = max(current_score * 0.9, 0.0)
        
        # Adjust based on population comparison
        population_comparison = effectiveness_analysis.get('population_comparison')
        if population_comparison:
            patient_vs_pop = population_comparison.get('patient_vs_population', 0)
            if patient_vs_pop > 0.2:  # Patient doing much better than average
                adjusted_score = min(adjusted_score * 1.05, 1.0)
            elif patient_vs_pop < -0.2:  # Patient doing much worse than average
                adjusted_score = max(adjusted_score * 0.95, 0.0)
        
        # Update the score in database
        cursor = self.db.cursor()
        cursor.execute("""
            UPDATE interventions 
            SET effectiveness_score = %s,
                external_actions = JSON_SET(
                    COALESCE(external_actions, '{}'),
                    '$.adjusted_effectiveness_score', %s,
                    '$.effectiveness_analysis', %s,
                    '$.score_updated_at', %s
                )
            WHERE intervention_id = %s
        """, (
            adjusted_score,
            adjusted_score,
            json.dumps(effectiveness_analysis),
            datetime.now().isoformat(),
            intervention_id
        ))
        
        self.db.commit()
        
        return {
            'original_score': current_score,
            'adjusted_score': adjusted_score,
            'adjustment_factors': {
                'trend': trend,
                'population_comparison': population_comparison
            },
            'updated_at': datetime.now().isoformat()
        }
    
    async def _extract_outcome_patterns(self, patient_id: str, 
                                      effectiveness_analysis: Dict) -> Dict:
        """Extract patterns from intervention outcomes"""
        
        # Get all interventions with outcomes for this patient
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                intervention_type,
                agent_type,
                effectiveness_score,
                description,
                timestamp,
                trigger_pattern_id,
                external_actions
            FROM interventions 
            WHERE patient_id = %s 
            AND effectiveness_score IS NOT NULL
            ORDER BY timestamp DESC
            LIMIT 50
        """, (patient_id,))
        
        interventions = cursor.fetchall()
        
        if not interventions:
            return {'no_patterns': 'Insufficient intervention data'}
        
        # Group by intervention type
        type_patterns = {}
        for intervention in interventions:
            int_type = intervention['intervention_type']
            if int_type not in type_patterns:
                type_patterns[int_type] = []
            type_patterns[int_type].append(intervention)
        
        # Analyze patterns for each type
        pattern_analysis = {}
        
        for int_type, type_interventions in type_patterns.items():
            scores = [i['effectiveness_score'] for i in type_interventions]
            agents = [i['agent_type'] for i in type_interventions]
            
            pattern_analysis[int_type] = {
                'total_applications': len(type_interventions),
                'avg_effectiveness': np.mean(scores),
                'effectiveness_std': np.std(scores) if len(scores) > 1 else 0,
                'success_rate': len([s for s in scores if s > 0.7]) / len(scores),
                'failure_rate': len([s for s in scores if s < 0.3]) / len(scores),
                'primary_agents': list(set(agents)),
                'best_performance': max(scores),
                'worst_performance': min(scores),
                'consistency_score': 1.0 - (np.std(scores) if len(scores) > 1 else 0)
            }
        
        # Find best and worst performing interventions
        best_intervention = max(pattern_analysis.items(), 
                              key=lambda x: x[1]['avg_effectiveness'])
        worst_intervention = min(pattern_analysis.items(), 
                               key=lambda x: x[1]['avg_effectiveness'])
        
        # Identify success patterns
        success_patterns = {
            k: v for k, v in pattern_analysis.items() 
            if v['success_rate'] > 0.6 and v['total_applications'] >= 3
        }
        
        return {
            'total_interventions_analyzed': len(interventions),
            'intervention_types_count': len(type_patterns),
            'pattern_analysis': pattern_analysis,
            'best_performing_intervention': {
                'type': best_intervention[0],
                'metrics': best_intervention[1]
            },
            'worst_performing_intervention': {
                'type': worst_intervention[0], 
                'metrics': worst_intervention[1]
            },
            'success_patterns': success_patterns,
            'analysis_timestamp': datetime.now().isoformat()
        }
    
    async def _generate_outcome_based_recommendations(self, pattern_insights: Dict, 
                                                    effectiveness_analysis: Dict) -> List[Dict]:
        """Generate recommendations based on outcome patterns"""
        
        recommendations = []
        
        if pattern_insights.get('no_patterns'):
            return [{'recommendation': 'Continue collecting intervention outcome data to establish patterns'}]
        
        # Recommend best performing interventions
        success_patterns = pattern_insights.get('success_patterns', {})
        
        for intervention_type, metrics in success_patterns.items():
            if metrics['avg_effectiveness'] > 0.8:
                recommendations.append({
                    'type': 'prioritize_intervention',
                    'intervention_type': intervention_type,
                    'reason': f"High success rate ({metrics['success_rate']:.1%}) with average effectiveness {metrics['avg_effectiveness']:.2f}",
                    'priority': 'high',
                    'evidence': f"Based on {metrics['total_applications']} applications"
                })
        
        # Warning about poor performing interventions
        worst_intervention = pattern_insights.get('worst_performing_intervention')
        if worst_intervention and worst_intervention['metrics']['avg_effectiveness'] < 0.4:
            recommendations.append({
                'type': 'avoid_intervention',
                'intervention_type': worst_intervention['type'],
                'reason': f"Poor effectiveness ({worst_intervention['metrics']['avg_effectiveness']:.2f}) and high failure rate",
                'priority': 'medium',
                'evidence': f"Based on {worst_intervention['metrics']['total_applications']} applications"
            })
        
        # Recommend agent specialization
        for intervention_type, metrics in pattern_insights.get('pattern_analysis', {}).items():
            if len(metrics['primary_agents']) == 1 and metrics['avg_effectiveness'] > 0.7:
                agent = metrics['primary_agents'][0]
                recommendations.append({
                    'type': 'agent_specialization',
                    'intervention_type': intervention_type,
                    'recommended_agent': agent,
                    'reason': f"Agent {agent} shows excellent results for {intervention_type}",
                    'priority': 'medium',
                    'evidence': f"Effectiveness: {metrics['avg_effectiveness']:.2f}"
                })
        
        # Recommend consistency improvements
        inconsistent_interventions = [
            (int_type, metrics) for int_type, metrics in pattern_insights.get('pattern_analysis', {}).items()
            if metrics['consistency_score'] < 0.6 and metrics['total_applications'] >= 5
        ]
        
        for int_type, metrics in inconsistent_interventions:
            recommendations.append({
                'type': 'improve_consistency',
                'intervention_type': int_type,
                'reason': f"High variability in outcomes (consistency: {metrics['consistency_score']:.2f})",
                'priority': 'low',
                'suggestion': 'Standardize intervention protocols and implementation'
            })
        
        return recommendations
    
    async def get_effectiveness_trends(self, patient_id: str, 
                                     time_window_days: int = 90) -> Dict:
        """Get effectiveness trends over time for a patient"""
        
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                DATE(timestamp) as intervention_date,
                intervention_type,
                agent_type,
                AVG(effectiveness_score) as daily_avg_effectiveness,
                COUNT(*) as daily_interventions
            FROM interventions 
            WHERE patient_id = %s 
            AND effectiveness_score IS NOT NULL
            AND timestamp >= DATE_SUB(NOW(), INTERVAL %s DAY)
            GROUP BY DATE(timestamp), intervention_type
            ORDER BY intervention_date DESC
        """, (patient_id, time_window_days))
        
        daily_trends = cursor.fetchall()
        
        # Calculate overall trend
        effectiveness_by_date = {}
        for trend in daily_trends:
            date = trend['intervention_date']
            if date not in effectiveness_by_date:
                effectiveness_by_date[date] = []
            effectiveness_by_date[date].append(trend['daily_avg_effectiveness'])
        
        # Average effectiveness per date
        date_averages = {
            date: np.mean(scores) 
            for date, scores in effectiveness_by_date.items()
        }
        
        # Calculate trend direction
        sorted_dates = sorted(date_averages.keys())
        if len(sorted_dates) >= 3:
            recent_avg = np.mean([date_averages[d] for d in sorted_dates[-7:]])  # Last week
            older_avg = np.mean([date_averages[d] for d in sorted_dates[:7]])    # First week
            
            if recent_avg > older_avg + 0.1:
                trend_direction = 'improving'
            elif recent_avg < older_avg - 0.1:
                trend_direction = 'declining'
            else:
                trend_direction = 'stable'
        else:
            trend_direction = 'insufficient_data'
        
        return {
            'patient_id': patient_id,
            'time_window_days': time_window_days,
            'daily_trends': daily_trends,
            'date_averages': date_averages,
            'trend_direction': trend_direction,
            'total_interventions': len(daily_trends),
            'analysis_timestamp': datetime.now().isoformat()
        }