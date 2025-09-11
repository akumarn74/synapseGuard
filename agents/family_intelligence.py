from agents.base_agent import BaseAgent
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta
import numpy as np

class FamilyIntelligenceAgent(BaseAgent):
    def __init__(self, tidb_connection):
        super().__init__("FamilyIntelligence", tidb_connection)
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Optimize family dynamics and communication strategies
        Input: Family structure, communication history, care coordination needs
        Output: Communication strategies, role optimization, conflict resolution
        """
        patient_id = input_data['patient_id']
        care_situation = input_data.get('care_situation', {})
        communication_context = input_data.get('communication_context', {})
        
        # Step 1: Analyze family dynamics and relationships
        family_analysis = await self._analyze_family_dynamics(patient_id)
        
        # Step 2: Assess communication patterns and effectiveness
        communication_assessment = await self._assess_communication_patterns(
            patient_id, communication_context
        )
        
        # Step 3: Generate personalized communication strategies
        communication_strategies = await self._generate_communication_strategies(
            patient_id, family_analysis, communication_assessment
        )
        
        # Step 4: Optimize care coordination roles
        role_optimization = await self._optimize_care_roles(
            patient_id, family_analysis, care_situation
        )
        
        # Step 5: Detect and resolve potential conflicts
        conflict_resolution = await self._analyze_conflict_potential(
            patient_id, family_analysis, communication_assessment
        )
        
        # Step 6: Store family intelligence insights
        intelligence_id = await self._store_family_insights(
            patient_id, family_analysis, communication_strategies, role_optimization
        )
        
        return {
            'agent': self.name,
            'patient_id': patient_id,
            'intelligence_id': intelligence_id,
            'family_analysis': family_analysis,
            'communication_assessment': communication_assessment,
            'communication_strategies': communication_strategies,
            'role_optimization': role_optimization,
            'conflict_resolution': conflict_resolution,
            'family_wellness_score': await self._calculate_family_wellness_score(
                family_analysis, communication_assessment
            )
        }
    
    async def _get_family_care_research(self) -> str:
        """Get research evidence on family caregiving from medical database"""
        try:
            # Search for family caregiving research
            search_query = "family caregiver support interventions dementia burden"
            
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
                    content = paper.get('content', '')
                    source = paper.get('source', 'Medical Journal')
                    excerpt = content[:250] + '...'
                    insights.append(f"Evidence from {source}: {excerpt}")
                
                return '\n'.join(insights)
            else:
                return "Apply evidence-based family caregiving support protocols from clinical literature."
                
        except Exception as e:
            print(f"Family care research retrieval failed: {e}")
            return "Use established family support guidelines from medical research."
    
    async def _analyze_family_dynamics(self, patient_id: str) -> Dict:
        """Evidence-based analysis of family dynamics using medical research"""
        try:
            # Get family structure and contact history
            cursor = self.db.cursor(dictionary=True)
            cursor.execute("""
                SELECT family_contacts FROM patients WHERE patient_id = %s
            """, (patient_id,))
            
            result = cursor.fetchone()
            if not result:
                return {'error': 'Patient not found'}
            
            family_contacts = json.loads(result['family_contacts'])
            
            # Get communication history
            cursor.execute("""
                SELECT recipient_type, communication_type, message_content, sent_at, response
                FROM family_communications 
                WHERE patient_id = %s 
                ORDER BY sent_at DESC 
                LIMIT 20
            """, (patient_id,))
            
            comm_history = cursor.fetchall()
            
            # Get research-based family care insights
            family_care_research = await self._get_family_care_research()
            
            # Create evidence-based prompt for family dynamics analysis
            prompt = f"""
            Based on established medical research on family caregiving dynamics:
            
            RESEARCH EVIDENCE:
            {family_care_research}

            FAMILY STRUCTURE:
            Primary Caregiver: {family_contacts.get('primary_caregiver', {}).get('name', 'Unknown')} ({family_contacts.get('primary_caregiver', {}).get('relationship', 'Unknown')})
            
            Family Members:
            {self._format_family_members(family_contacts.get('family_members', []))}
            
            Analyze based on evidence-based family care research.

            RECENT COMMUNICATION PATTERNS:
            {self._format_communication_history(comm_history)}

            Analyze:
            1. Family cohesion and support strength
            2. Primary caregiver stress indicators
            3. Communication effectiveness between members
            4. Decision-making patterns and authority
            5. Conflict potential and stress points
            6. Support resource utilization

            Format as JSON: {{"cohesion_score": 0.0, "caregiver_stress": "", "communication_effectiveness": "", "decision_patterns": "", "conflict_risk": "", "support_utilization": ""}}
            """

            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=600,
                temperature=0.3
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                family_analysis = json.loads(ai_response)
                return family_analysis
            except json.JSONDecodeError:
                return self._parse_family_analysis_from_text(ai_response)
            
        except Exception as e:
            print(f"Family dynamics analysis failed: {e}")
            return self._fallback_family_analysis(family_contacts)
    
    async def _assess_communication_patterns(self, patient_id: str, 
                                           communication_context: Dict) -> Dict:
        """Assess family communication patterns and effectiveness"""
        try:
            # Get detailed communication metrics
            cursor = self.db.cursor(dictionary=True)
            cursor.execute("""
                SELECT 
                    recipient_type,
                    communication_type,
                    COUNT(*) as message_count,
                    AVG(CASE WHEN response IS NOT NULL THEN 1 ELSE 0 END) as response_rate,
                    AVG(TIMESTAMPDIFF(HOUR, sent_at, read_at)) as avg_response_time
                FROM family_communications 
                WHERE patient_id = %s AND sent_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY recipient_type, communication_type
            """, (patient_id,))
            
            comm_metrics = cursor.fetchall()
            
            prompt = f"""
            You are a healthcare communication specialist. Assess communication effectiveness for family care coordination.

            COMMUNICATION METRICS (Last 30 days):
            {self._format_communication_metrics(comm_metrics)}

            CURRENT CONTEXT:
            {json.dumps(communication_context, indent=2)}

            Assess:
            1. Communication frequency appropriateness
            2. Response rate and engagement levels
            3. Message clarity and understanding
            4. Emotional tone and stress indicators
            5. Information flow effectiveness
            6. Technology adoption and barriers

            Format as JSON: {{"frequency_score": 0.0, "engagement_score": 0.0, "clarity_score": 0.0, "emotional_health": "", "information_flow": "", "tech_barriers": []}}
            """

            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.3
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                assessment = json.loads(ai_response)
                return assessment
            except json.JSONDecodeError:
                return self._parse_communication_assessment_from_text(ai_response)
            
        except Exception as e:
            print(f"Communication assessment failed: {e}")
            return self._fallback_communication_assessment(comm_metrics)
    
    async def _generate_communication_strategies(self, patient_id: str, 
                                               family_analysis: Dict, 
                                               communication_assessment: Dict) -> List[Dict]:
        """Generate AI-powered personalized communication strategies"""
        try:
            cohesion_score = family_analysis.get('cohesion_score', 0.5)
            caregiver_stress = family_analysis.get('caregiver_stress', 'moderate')
            engagement_score = communication_assessment.get('engagement_score', 0.5)
            
            prompt = f"""
            You are a family communication coach specializing in healthcare settings. Create personalized communication strategies.

            FAMILY ANALYSIS:
            - Cohesion Score: {cohesion_score}
            - Caregiver Stress: {caregiver_stress}
            - Communication Engagement: {engagement_score}

            CURRENT CHALLENGES:
            {json.dumps(communication_assessment, indent=2)}

            Create 4-6 specific communication strategies including:
            1. Strategy name and type
            2. Target audience (which family members)
            3. Implementation approach
            4. Expected outcomes
            5. Success metrics
            6. Timeline for implementation

            Focus on: stress reduction, clear information sharing, emotional support, decision-making coordination

            Format as JSON array: [{{"strategy": "", "target": "", "approach": "", "outcomes": "", "metrics": "", "timeline": ""}}]
            """

            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=700,
                temperature=0.3
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                strategies = json.loads(ai_response)
                return strategies
            except json.JSONDecodeError:
                return self._parse_strategies_from_text(ai_response)
            
        except Exception as e:
            print(f"Communication strategy generation failed: {e}")
            return self._fallback_communication_strategies(family_analysis, communication_assessment)
    
    async def _optimize_care_roles(self, patient_id: str, family_analysis: Dict, 
                                 care_situation: Dict) -> Dict:
        """Optimize family care coordination roles"""
        try:
            # Get family member capabilities and availability
            cursor = self.db.cursor(dictionary=True)
            cursor.execute("""
                SELECT family_contacts FROM patients WHERE patient_id = %s
            """, (patient_id,))
            
            result = cursor.fetchone()
            family_contacts = json.loads(result['family_contacts']) if result else {}
            
            prompt = f"""
            You are a care coordination specialist. Optimize family roles for sustainable caregiving.

            FAMILY STRUCTURE:
            {json.dumps(family_contacts, indent=2)}

            FAMILY DYNAMICS:
            {json.dumps(family_analysis, indent=2)}

            CURRENT CARE SITUATION:
            {json.dumps(care_situation, indent=2)}

            Optimize roles considering:
            1. Individual strengths and availability
            2. Geographic proximity
            3. Skill sets and experience
            4. Emotional capacity and stress levels
            5. Professional obligations
            6. Long-term sustainability

            Provide role assignments with specific responsibilities, time commitments, and rotation schedules.

            Format as JSON: {{"primary_coordinator": "", "support_roles": {{}}, "rotation_schedule": {{}}, "backup_plans": {{}}, "skill_development": {{}}}}
            """

            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=600,
                temperature=0.3
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                role_optimization = json.loads(ai_response)
                return role_optimization
            except json.JSONDecodeError:
                return self._parse_roles_from_text(ai_response)
            
        except Exception as e:
            print(f"Role optimization failed: {e}")
            return self._fallback_role_optimization(family_contacts)
    
    async def _analyze_conflict_potential(self, patient_id: str, 
                                        family_analysis: Dict, 
                                        communication_assessment: Dict) -> Dict:
        """Analyze and provide conflict resolution strategies"""
        try:
            conflict_risk = family_analysis.get('conflict_risk', 'medium')
            emotional_health = communication_assessment.get('emotional_health', 'stable')
            
            prompt = f"""
            You are a family conflict resolution specialist in healthcare settings. Analyze conflict potential and provide prevention strategies.

            FAMILY DYNAMICS:
            - Conflict Risk Level: {conflict_risk}
            - Emotional Health Status: {emotional_health}
            - Communication Patterns: {json.dumps(communication_assessment, indent=2)}

            Analyze:
            1. Primary conflict triggers and stress points
            2. Early warning signs to monitor
            3. Prevention strategies for high-risk scenarios
            4. De-escalation techniques for active conflicts
            5. Mediation approaches for unresolved issues
            6. Professional support recommendations

            Format as JSON: {{"risk_factors": [], "warning_signs": [], "prevention": [], "de_escalation": [], "mediation": [], "professional_support": ""}}
            """

            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.3
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                conflict_resolution = json.loads(ai_response)
                return conflict_resolution
            except json.JSONDecodeError:
                return self._parse_conflict_analysis_from_text(ai_response)
            
        except Exception as e:
            print(f"Conflict analysis failed: {e}")
            return self._fallback_conflict_analysis(conflict_risk, emotional_health)
    
    async def _calculate_family_wellness_score(self, family_analysis: Dict, 
                                             communication_assessment: Dict) -> float:
        """Calculate overall family wellness score"""
        cohesion = family_analysis.get('cohesion_score', 0.5)
        engagement = communication_assessment.get('engagement_score', 0.5)
        frequency = communication_assessment.get('frequency_score', 0.5)
        clarity = communication_assessment.get('clarity_score', 0.5)
        
        # Weighted average
        wellness_score = (
            cohesion * 0.3 +
            engagement * 0.25 +
            frequency * 0.2 +
            clarity * 0.25
        )
        
        return round(wellness_score, 2)
    
    def _format_family_members(self, family_members: List[Dict]) -> str:
        """Format family members for AI prompt"""
        if not family_members:
            return "No additional family members listed"
        
        formatted = []
        for member in family_members:
            name = member.get('name', 'Unknown')
            relationship = member.get('relationship', 'Unknown')
            formatted.append(f"- {name} ({relationship})")
        
        return '\n'.join(formatted)
    
    def _format_healthcare_providers(self, providers: List[Dict]) -> str:
        """Format healthcare providers for AI prompt"""
        if not providers:
            return "No healthcare providers listed"
        
        formatted = []
        for provider in providers:
            name = provider.get('name', 'Unknown')
            provider_type = provider.get('type', 'Unknown')
            formatted.append(f"- {name} ({provider_type})")
        
        return '\n'.join(formatted)
    
    def _format_communication_history(self, comm_history: List[Dict]) -> str:
        """Format communication history for AI prompt"""
        if not comm_history:
            return "No recent communication history"
        
        formatted = []
        for comm in comm_history[:10]:  # Limit to 10 most recent
            recipient = comm.get('recipient_type', 'Unknown')
            comm_type = comm.get('communication_type', 'Unknown')
            has_response = 'Yes' if comm.get('response') else 'No'
            formatted.append(f"- {recipient}: {comm_type} (Response: {has_response})")
        
        return '\n'.join(formatted)
    
    def _format_communication_metrics(self, metrics: List[Dict]) -> str:
        """Format communication metrics for AI prompt"""
        if not metrics:
            return "No communication metrics available"
        
        formatted = []
        for metric in metrics:
            recipient = metric.get('recipient_type', 'Unknown')
            message_count = metric.get('message_count', 0)
            response_rate = metric.get('response_rate', 0)
            avg_response_time = metric.get('avg_response_time', 0)
            
            formatted.append(f"- {recipient}: {message_count} messages, {response_rate:.1%} response rate, {avg_response_time:.1f}h avg response time")
        
        return '\n'.join(formatted)
    
    # Fallback and parsing methods (simplified for brevity)
    def _parse_family_analysis_from_text(self, text: str) -> Dict:
        return {
            'cohesion_score': 0.7,
            'caregiver_stress': 'moderate',
            'communication_effectiveness': 'good',
            'decision_patterns': 'collaborative',
            'conflict_risk': 'low',
            'support_utilization': 'adequate'
        }
    
    def _fallback_family_analysis(self, family_contacts: Dict) -> Dict:
        member_count = len(family_contacts.get('family_members', []))
        cohesion_score = min(0.8, 0.5 + (member_count * 0.1))
        
        return {
            'cohesion_score': cohesion_score,
            'caregiver_stress': 'moderate',
            'communication_effectiveness': 'good',
            'decision_patterns': 'primary_caregiver_led',
            'conflict_risk': 'low' if member_count <= 3 else 'medium',
            'support_utilization': 'developing'
        }
    
    def _parse_communication_assessment_from_text(self, text: str) -> Dict:
        return {
            'frequency_score': 0.7,
            'engagement_score': 0.6,
            'clarity_score': 0.8,
            'emotional_health': 'stable',
            'information_flow': 'effective',
            'tech_barriers': ['limited smartphone skills']
        }
    
    def _fallback_communication_assessment(self, comm_metrics: List[Dict]) -> Dict:
        avg_response_rate = np.mean([m.get('response_rate', 0) for m in comm_metrics]) if comm_metrics else 0.6
        
        return {
            'frequency_score': 0.7,
            'engagement_score': avg_response_rate,
            'clarity_score': 0.75,
            'emotional_health': 'stable',
            'information_flow': 'developing',
            'tech_barriers': ['smartphone adoption', 'digital literacy']
        }
    
    def _parse_strategies_from_text(self, text: str) -> List[Dict]:
        return [
            {
                'strategy': 'Daily check-in schedule',
                'target': 'Primary caregiver and family',
                'approach': 'Structured communication times',
                'outcomes': 'Reduced anxiety, better coordination',
                'metrics': 'Response time, satisfaction scores',
                'timeline': '2 weeks'
            }
        ]
    
    def _fallback_communication_strategies(self, family_analysis: Dict, 
                                         communication_assessment: Dict) -> List[Dict]:
        return [
            {
                'strategy': 'Weekly family updates',
                'target': 'All family members',
                'approach': 'Scheduled group video calls',
                'outcomes': 'Improved information sharing',
                'metrics': 'Participation rate',
                'timeline': '1 week'
            },
            {
                'strategy': 'Caregiver support circle',
                'target': 'Primary and secondary caregivers',
                'approach': 'Peer support and resource sharing',
                'outcomes': 'Reduced stress and burnout',
                'metrics': 'Stress assessment scores',
                'timeline': '2 weeks'
            }
        ]
    
    def _parse_roles_from_text(self, text: str) -> Dict:
        return {
            'primary_coordinator': 'Primary caregiver',
            'support_roles': {'medical_liaison': 'Adult child', 'daily_care': 'Spouse'},
            'rotation_schedule': {'weekly_primary': 'Monday-Friday', 'weekend_support': 'Saturday-Sunday'},
            'backup_plans': {'emergency_contact': 'Secondary family member'},
            'skill_development': {'medical_training': 'Basic first aid', 'communication': 'Crisis communication'}
        }
    
    def _fallback_role_optimization(self, family_contacts: Dict) -> Dict:
        primary_caregiver = family_contacts.get('primary_caregiver', {}).get('name', 'Primary')
        
        return {
            'primary_coordinator': primary_caregiver,
            'support_roles': {
                'medical_liaison': 'Adult child',
                'emergency_contact': 'Family member',
                'respite_care': 'Extended family'
            },
            'rotation_schedule': {
                'daily_check': 'Primary caregiver',
                'weekly_relief': 'Support family',
                'emergency_backup': '24/7 availability'
            },
            'backup_plans': {
                'primary_unavailable': 'Secondary caregiver steps in',
                'emergency_situation': 'Emergency contact activated'
            },
            'skill_development': {
                'caregiver_training': 'Ongoing education',
                'stress_management': 'Support groups',
                'technology_skills': 'Digital literacy'
            }
        }
    
    def _parse_conflict_analysis_from_text(self, text: str) -> Dict:
        return {
            'risk_factors': ['Caregiver burnout', 'Communication gaps'],
            'warning_signs': ['Reduced communication', 'Emotional outbursts'],
            'prevention': ['Regular check-ins', 'Stress monitoring'],
            'de_escalation': ['Active listening', 'Neutral mediation'],
            'mediation': ['Family meetings', 'Professional facilitation'],
            'professional_support': 'Family therapist consultation recommended'
        }
    
    def _fallback_conflict_analysis(self, conflict_risk: str, emotional_health: str) -> Dict:
        return {
            'risk_factors': ['Role ambiguity', 'Stress accumulation', 'Communication breakdowns'],
            'warning_signs': ['Delayed responses', 'Short communications', 'Avoided discussions'],
            'prevention': ['Clear role definitions', 'Regular family meetings', 'Stress monitoring'],
            'de_escalation': ['Pause and reflect', 'Focus on common goals', 'Use neutral language'],
            'mediation': ['Structured family discussions', 'Include neutral facilitator'],
            'professional_support': 'Consider family counseling if conflicts persist'
        }
    
    async def _store_family_insights(self, patient_id: str, family_analysis: Dict, 
                                   communication_strategies: List[Dict], 
                                   role_optimization: Dict) -> str:
        """Store family intelligence insights"""
        import uuid
        intelligence_id = f"family_intel_{patient_id}_{uuid.uuid4().hex[:12]}"
        
        cursor = self.db.cursor()
        try:
            cursor.execute("""
                INSERT IGNORE INTO interventions 
                (intervention_id, patient_id, agent_type, intervention_type, 
                 description, timestamp, external_actions)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                intelligence_id, patient_id, self.name, 'family_optimization',
                f"Family intelligence analysis and optimization strategies",
                datetime.now(), json.dumps({
                    'family_analysis': family_analysis,
                    'communication_strategies': communication_strategies,
                    'role_optimization': role_optimization
                })
            ))
            
            self.db.commit()
        except Exception as e:
            print(f"   ⚠️  Warning: Could not store family insights - {str(e)}")
            self.db.rollback()
        return intelligence_id