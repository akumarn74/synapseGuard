from agents.base_agent import BaseAgent
from typing import Dict, Any, List
import json
from datetime import datetime
import asyncio

class MedicalKnowledgeAgent(BaseAgent):
    def __init__(self, tidb_connection):
        super().__init__("MedicalKnowledge", tidb_connection)
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate or retrieve medical knowledge dynamically using AI
        Input: Medical query, patient condition, research topics
        Output: Evidence-based medical insights, recommendations, research summary
        """
        query = input_data.get('query', '')
        patient_condition = input_data.get('patient_condition', '')
        research_focus = input_data.get('research_focus', [])
        
        # Step 1: Generate comprehensive medical knowledge using AI
        medical_insights = await self._generate_medical_knowledge(
            query, patient_condition, research_focus
        )
        
        # Step 2: Store generated knowledge for future reference
        knowledge_id = await self._store_generated_knowledge(
            medical_insights, query, patient_condition
        )
        
        # Step 3: Cross-reference with existing knowledge
        related_knowledge = await self._find_related_knowledge(
            medical_insights, patient_condition
        )
        
        return {
            'agent': self.name,
            'query': query,
            'patient_condition': patient_condition,
            'medical_insights': medical_insights,
            'knowledge_id': knowledge_id,
            'related_knowledge': related_knowledge,
            'generation_timestamp': datetime.now().isoformat()
        }
    
    async def _generate_medical_knowledge(self, query: str, patient_condition: str, 
                                        research_focus: List[str]) -> Dict[str, Any]:
        """Retrieve evidence-based medical knowledge from real research database"""
        try:
            # Step 1: Search real medical research database
            real_research_insights = await self._search_real_research_database(
                query, patient_condition, research_focus
            )
            
            # Step 2: If we have research papers, use them as the foundation
            if real_research_insights:
                medical_knowledge = await self._synthesize_research_findings(
                    real_research_insights, query, patient_condition
                )
                return self._enhance_medical_knowledge(medical_knowledge, patient_condition)
            
            # Step 3: Fallback to AI only if no research found
            prompt = f"""
            Based on established medical literature, provide evidence-based knowledge for:
            QUERY: {query}
            PATIENT CONDITION: {patient_condition}
            RESEARCH FOCUS: {', '.join(research_focus) if research_focus else 'General care management'}
            
            Note: Prioritize evidence-based interventions from peer-reviewed sources.
            Format as JSON with sections for best_practices, recent_research, clinical_guidelines, prevention, interventions, family_guidance.
            """

            ai_response = await self.generate_ai_response(prompt)
            
            try:
                medical_knowledge = self.safe_json_loads(ai_response)
                return self._enhance_medical_knowledge(medical_knowledge, patient_condition)
            except:
                return self._parse_medical_knowledge_from_text(ai_response, patient_condition)
            
        except Exception as e:
            print(f"Medical knowledge retrieval failed: {e}")
            return await self._generate_fallback_knowledge(query, patient_condition)
    
    async def _enhance_medical_knowledge(self, knowledge: Dict, condition: str) -> Dict[str, Any]:
        """Enhance AI-generated knowledge with additional context"""
        
        # Add condition-specific enhancements
        if 'alzheimer' in condition.lower() or 'dementia' in condition.lower():
            knowledge['specialized_interventions'] = await self._generate_dementia_specific_knowledge()
        elif 'parkinson' in condition.lower():
            knowledge['specialized_interventions'] = await self._generate_parkinson_specific_knowledge()
        
        # Add current date context
        knowledge['knowledge_generation_date'] = datetime.now().strftime('%Y-%m-%d')
        knowledge['evidence_level'] = 'AI_Generated_Clinical_Guidelines'
        
        # Add implementation timeline
        knowledge['implementation_timeline'] = {
            'immediate': 'Safety assessments and environmental modifications',
            'short_term_1_4_weeks': 'Structured intervention implementation',
            'medium_term_1_3_months': 'Progress evaluation and plan adjustments',
            'long_term_3_12_months': 'Outcome assessment and optimization'
        }
        
        return knowledge
    
    async def _generate_dementia_specific_knowledge(self) -> Dict:
        """Generate specialized knowledge for dementia care"""
        try:
            prompt = """
            As a dementia care specialist, provide the latest evidence-based interventions specifically for dementia patients. Include:
            1. Cognitive stimulation protocols
            2. Behavioral management strategies  
            3. Environmental design principles
            4. Family communication techniques
            5. Technology-assisted interventions
            6. Crisis prevention indicators
            
            Provide specific protocols, effectiveness rates, and implementation guidelines.
            Format as JSON with detailed intervention protocols.
            """
            
            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.1
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                return json.loads(ai_response)
            except json.JSONDecodeError:
                return {"specialized_protocols": "AI-generated dementia-specific interventions"}
                
        except Exception as e:
            print(f"Dementia-specific knowledge generation failed: {e}")
            return {"specialized_protocols": "Standard dementia care protocols"}
    
    async def _generate_parkinson_specific_knowledge(self) -> Dict:
        """Generate specialized knowledge for Parkinson's care"""
        try:
            prompt = """
            As a movement disorder specialist, provide evidence-based interventions for Parkinson's disease patients. Include:
            1. Movement therapy protocols
            2. Medication timing optimization
            3. Exercise and physical therapy
            4. Speech and swallowing interventions
            5. Cognitive training for PD-related dementia
            6. Deep brain stimulation considerations
            
            Provide specific protocols, timing recommendations, and contraindications.
            Format as JSON with detailed intervention protocols.
            """
            
            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.1
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                return json.loads(ai_response)
            except json.JSONDecodeError:
                return {"specialized_protocols": "AI-generated Parkinson's-specific interventions"}
                
        except Exception as e:
            print(f"Parkinson's-specific knowledge generation failed: {e}")
            return {"specialized_protocols": "Standard Parkinson's care protocols"}
    
    def _parse_medical_knowledge_from_text(self, text: str, condition: str) -> Dict:
        """Parse medical knowledge from AI text response"""
        # Extract key sections from text
        sections = {
            'best_practices': self._extract_section(text, ['best practices', 'current practices']),
            'recent_research': self._extract_section(text, ['recent research', 'breakthrough studies']),
            'clinical_guidelines': self._extract_section(text, ['guidelines', 'recommendations']),
            'prevention': self._extract_section(text, ['prevention', 'risk factors']),
            'interventions': self._extract_section(text, ['interventions', 'treatment', 'therapy']),
            'family_guidance': self._extract_section(text, ['family', 'caregiver']),
            'technology_applications': self._extract_section(text, ['technology', 'AI', 'digital']),
            'quality_of_life': self._extract_section(text, ['quality of life', 'well-being'])
        }
        
        return {
            'condition': condition,
            'knowledge_sections': sections,
            'generated_from': 'AI_text_parsing',
            'confidence': 0.8
        }
    
    def _extract_section(self, text: str, keywords: List[str]) -> str:
        """Extract relevant section from text based on keywords"""
        sentences = text.split('. ')
        relevant_sentences = []
        
        for sentence in sentences:
            if any(keyword.lower() in sentence.lower() for keyword in keywords):
                relevant_sentences.append(sentence.strip())
        
        return '. '.join(relevant_sentences[:3]) if relevant_sentences else "No specific information available."
    
    async def _generate_fallback_knowledge(self, query: str, condition: str) -> Dict:
        """Generate basic fallback knowledge without AI"""
        return {
            'query': query,
            'condition': condition,
            'basic_recommendations': [
                'Maintain structured daily routines',
                'Ensure safe environment modifications',
                'Provide family support and communication',
                'Monitor for behavioral changes',
                'Coordinate with healthcare providers',
                'Implement cognitive stimulation activities'
            ],
            'evidence_level': 'Standard_Care_Guidelines',
            'generated_method': 'Fallback_Protocol'
        }
    
    async def _store_generated_knowledge(self, knowledge: Dict, query: str, condition: str) -> str:
        """Store AI-generated knowledge in database for future reference"""
        knowledge_id = f"ai_gen_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Create a comprehensive summary for storage
        summary = self._create_knowledge_summary(knowledge, query, condition)
        keywords = self._generate_knowledge_keywords(knowledge, query, condition)
        
        cursor = self.db.cursor()
        cursor.execute("""
            INSERT INTO medical_knowledge 
            (knowledge_id, title, content, source, keywords, relevance_score, publication_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            knowledge_id,
            f"AI-Generated Medical Knowledge: {condition} - {query}",
            summary,
            f"SynapseGuard AI Knowledge Generation, {datetime.now().strftime('%Y')}",
            keywords,
            0.95,  # High relevance for AI-generated, patient-specific knowledge
            datetime.now().strftime('%Y-%m-%d')
        ))
        
        self.db.commit()
        return knowledge_id
    
    def _create_knowledge_summary(self, knowledge: Dict, query: str, condition: str) -> str:
        """Create a comprehensive summary from AI-generated knowledge"""
        summary_parts = []
        
        summary_parts.append(f"AI-generated medical knowledge for {condition} addressing: {query}.")
        
        if 'best_practices' in knowledge:
            summary_parts.append(f"Best Practices: {str(knowledge['best_practices'])[:200]}...")
        
        if 'interventions' in knowledge:
            summary_parts.append(f"Interventions: {str(knowledge['interventions'])[:200]}...")
        
        if 'clinical_guidelines' in knowledge:
            summary_parts.append(f"Guidelines: {str(knowledge['clinical_guidelines'])[:200]}...")
        
        # Add generation metadata
        summary_parts.append(f"Generated on {datetime.now().strftime('%Y-%m-%d')} using advanced medical AI reasoning.")
        
        return ' '.join(summary_parts)
    
    def _generate_knowledge_keywords(self, knowledge: Dict, query: str, condition: str) -> str:
        """Generate keywords for searchability"""
        keywords = set()
        
        # Add base keywords
        keywords.add(condition.lower().replace(' ', '_'))
        keywords.update(query.lower().split())
        keywords.add('ai_generated')
        keywords.add('evidence_based')
        keywords.add('clinical_guidelines')
        
        # Extract keywords from knowledge content
        if isinstance(knowledge, dict):
            for key, value in knowledge.items():
                if isinstance(value, str) and len(value) > 10:
                    # Extract key medical terms
                    medical_terms = ['intervention', 'therapy', 'treatment', 'protocol', 
                                   'assessment', 'prevention', 'management', 'care',
                                   'cognitive', 'behavioral', 'pharmaceutical', 'exercise']
                    
                    for term in medical_terms:
                        if term in value.lower():
                            keywords.add(term)
        
        return ' '.join(list(keywords)[:15])  # Limit to 15 keywords
    
    async def _search_real_research_database(self, query: str, condition: str, research_focus: List[str]) -> List[Dict]:
        """Search real medical research database for relevant papers"""
        try:
            # Combine search terms
            search_terms = [query, condition] + (research_focus or [])
            search_query = ' '.join(search_terms).lower()
            
            # Search medical_knowledge table for real research (exclude AI-generated)
            results = await self.full_text_search(
                search_query,
                'medical_knowledge',
                ['title', 'content', 'keywords'],
                limit=10
            )
            
            # Filter out AI-generated content
            real_research = [
                paper for paper in results 
                if 'AI Knowledge Generation' not in paper.get('source', '')
                and 'ai_gen_' not in paper.get('knowledge_id', '')
            ]
            
            return real_research[:5]  # Top 5 most relevant papers
            
        except Exception as e:
            print(f"Real research database search failed: {e}")
            return []
    
    async def _synthesize_research_findings(self, research_papers: List[Dict], 
                                          query: str, condition: str) -> Dict[str, Any]:
        """Synthesize findings from real research papers"""
        try:
            # Extract key findings from research papers
            synthesized = {
                'research_foundation': [],
                'best_practices': [],
                'recent_research': [],
                'clinical_guidelines': [],
                'prevention': [],
                'interventions': [],
                'family_guidance': [],
                'evidence_level': 'peer_reviewed_research'
            }
            
            for paper in research_papers:
                paper_summary = {
                    'title': paper.get('title', ''),
                    'source': paper.get('source', ''),
                    'relevance_score': paper.get('relevance', 0.0),
                    'key_findings': paper.get('content', '')[:300] + '...'
                }
                synthesized['research_foundation'].append(paper_summary)
                
                # Extract specific recommendations from content
                content = paper.get('content', '').lower()
                if 'intervention' in content:
                    synthesized['interventions'].append(f"From {paper.get('source', 'Research')}: {content[:200]}...")
                if 'family' in content or 'caregiver' in content:
                    synthesized['family_guidance'].append(f"From {paper.get('source', 'Research')}: {content[:200]}...")
                if 'prevention' in content:
                    synthesized['prevention'].append(f"From {paper.get('source', 'Research')}: {content[:200]}...")
            
            return synthesized
            
        except Exception as e:
            print(f"Research synthesis failed: {e}")
            return {'error': 'Research synthesis failed', 'papers_found': len(research_papers)}
    
    async def _find_related_knowledge(self, new_knowledge: Dict, condition: str) -> List[Dict]:
        """Find existing related knowledge using similarity search"""
        try:
            # Search real research database first
            real_research = await self._search_real_research_database(
                condition, condition, ['treatment', 'intervention', 'care']
            )
            
            return real_research[:5]
            
        except Exception as e:
            print(f"Related knowledge search failed: {e}")
            return []

    async def generate_real_time_medical_insights(self, patient_condition: str, 
                                                current_symptoms: List[str],
                                                intervention_history: List[Dict]) -> Dict:
        """Generate real-time medical insights for immediate decision making"""
        try:
            symptom_text = ', '.join(current_symptoms) if current_symptoms else 'No specific symptoms reported'
            history_summary = self._summarize_intervention_history(intervention_history)
            
            prompt = f"""
            You are an emergency medical AI consultant. Provide immediate clinical insights for:
            
            PATIENT CONDITION: {patient_condition}
            CURRENT SYMPTOMS: {symptom_text}
            RECENT INTERVENTION HISTORY: {history_summary}
            
            Provide immediate clinical assessment including:
            1. Urgency level (LOW/MODERATE/HIGH/CRITICAL)
            2. Immediate recommended actions (next 1-4 hours)
            3. Red flag symptoms to monitor
            4. When to escalate to emergency services
            5. Family/caregiver instructions
            6. Medication considerations
            7. Expected timeline for improvement
            
            Be specific, actionable, and evidence-based. Format as JSON for immediate use by care coordination systems.
            """
            
            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.1  # Very low temperature for medical precision
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                insights = json.loads(ai_response)
                insights['generation_timestamp'] = datetime.now().isoformat()
                insights['confidence_level'] = 'high_clinical_ai'
                return insights
            except json.JSONDecodeError:
                return self._parse_real_time_insights(ai_response, patient_condition)
                
        except Exception as e:
            print(f"Real-time medical insights generation failed: {e}")
            return self._emergency_fallback_insights(patient_condition, current_symptoms)
    
    def _summarize_intervention_history(self, history: List[Dict]) -> str:
        """Summarize recent intervention history for AI context"""
        if not history:
            return "No recent interventions recorded"
        
        recent_interventions = []
        for intervention in history[:5]:  # Last 5 interventions
            intervention_type = intervention.get('intervention_type', 'Unknown')
            effectiveness = intervention.get('effectiveness_score', 'N/A')
            recent_interventions.append(f"{intervention_type} (effectiveness: {effectiveness})")
        
        return '; '.join(recent_interventions)
    
    def _parse_real_time_insights(self, text: str, condition: str) -> Dict:
        """Parse real-time insights from AI text"""
        return {
            'urgency_level': 'MODERATE',
            'immediate_actions': self._extract_section(text, ['immediate', 'next', 'now']),
            'red_flags': self._extract_section(text, ['red flag', 'warning', 'emergency']),
            'family_instructions': self._extract_section(text, ['family', 'caregiver']),
            'escalation_criteria': 'Contact healthcare provider if symptoms worsen',
            'condition': condition,
            'parsed_from_text': True
        }
    
    def _emergency_fallback_insights(self, condition: str, symptoms: List[str]) -> Dict:
        """Emergency fallback insights when AI fails"""
        return {
            'urgency_level': 'MODERATE',
            'immediate_actions': [
                'Ensure patient safety and comfort',
                'Monitor vital signs if possible',
                'Contact primary healthcare provider',
                'Stay with patient or arrange supervision'
            ],
            'red_flags': [
                'Difficulty breathing',
                'Chest pain',
                'Severe confusion or agitation',
                'Loss of consciousness',
                'Severe headache'
            ],
            'escalation_criteria': 'Call emergency services (911) if any red flag symptoms appear',
            'condition': condition,
            'generated_method': 'emergency_fallback'
        }