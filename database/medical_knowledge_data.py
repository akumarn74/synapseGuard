"""
Medical Knowledge Database Generator
Creates comprehensive medical research data for SynapseGuard TiDB integration
"""

import json
import random
from datetime import datetime, timedelta

class MedicalKnowledgeGenerator:
    def __init__(self):
        self.conditions = [
            'Alzheimer Disease', 'Dementia', 'Mild Cognitive Impairment', 
            'Vascular Dementia', 'Lewy Body Dementia', 'Frontotemporal Dementia',
            'Parkinson Disease', 'Huntington Disease', 'Normal Pressure Hydrocephalus'
        ]
        
        self.intervention_types = [
            'cognitive stimulation', 'behavioral intervention', 'family therapy',
            'medication management', 'environmental modification', 'exercise therapy',
            'music therapy', 'art therapy', 'reminiscence therapy', 'reality orientation',
            'validation therapy', 'person-centered care', 'respite care', 'support groups'
        ]
        
        self.research_topics = [
            'early detection', 'biomarkers', 'neuroimaging', 'genetic factors',
            'risk factors', 'prevention strategies', 'quality of life', 'caregiver burden',
            'behavioral symptoms', 'sleep disturbances', 'nutrition', 'social engagement',
            'technology interventions', 'telehealth', 'AI applications', 'predictive modeling'
        ]
        
        self.journals = [
            'Journal of Alzheimer\'s Disease', 'Dementia and Geriatric Cognitive Disorders',
            'International Journal of Geriatric Psychiatry', 'Alzheimer\'s & Dementia',
            'Journal of the American Geriatrics Society', 'Neurology', 'The Lancet Neurology',
            'Nature Reviews Neurology', 'Brain', 'Journal of Neuropsychology',
            'Clinical Interventions in Aging', 'BMC Geriatrics', 'PLOS ONE',
            'Journal of Medical Internet Research', 'Digital Health', 'NPJ Digital Medicine',
            'Frontiers in Aging Neuroscience', 'International Psychogeriatrics'
        ]
        
        self.authors = [
            'Smith, J.', 'Johnson, M.', 'Williams, R.', 'Brown, A.', 'Davis, S.',
            'Miller, K.', 'Wilson, L.', 'Moore, P.', 'Taylor, C.', 'Anderson, B.',
            'Thomas, D.', 'Jackson, E.', 'White, F.', 'Harris, G.', 'Martin, H.',
            'Thompson, I.', 'Garcia, J.', 'Martinez, L.', 'Robinson, N.', 'Clark, O.'
        ]

    def generate_medical_knowledge_entries(self, count=1000):
        """Generate comprehensive medical knowledge entries"""
        entries = []
        
        for i in range(count):
            knowledge_id = f"med_{i+1:06d}"
            condition = random.choice(self.conditions)
            intervention = random.choice(self.intervention_types)
            topic = random.choice(self.research_topics)
            journal = random.choice(self.journals)
            
            # Generate realistic content
            title = self._generate_title(condition, intervention, topic)
            content = self._generate_content(condition, intervention, topic)
            keywords = self._generate_keywords(condition, intervention, topic)
            
            # Generate publication details
            pub_date = self._generate_publication_date()
            relevance_score = round(random.uniform(0.6, 1.0), 2)
            
            entry = {
                'knowledge_id': knowledge_id,
                'title': title,
                'content': content,
                'source': f"{journal}, {pub_date.year}",
                'keywords': keywords,
                'relevance_score': relevance_score,
                'publication_date': pub_date.strftime('%Y-%m-%d'),
                'authors': self._generate_authors()
            }
            
            entries.append(entry)
            
        return entries
    
    def _generate_title(self, condition, intervention, topic):
        """Generate realistic research paper titles"""
        templates = [
            f"Effects of {intervention} on {topic} in {condition} patients",
            f"{topic.title()} in {condition}: A systematic review",
            f"Novel approaches to {intervention} for {condition} management",
            f"Predictive modeling of {topic} in early-stage {condition}",
            f"AI-powered {intervention} for {condition} care optimization",
            f"Family-centered {intervention} improves {topic} in {condition}",
            f"Technology-enhanced {intervention} for {condition} patients",
            f"Longitudinal study of {topic} progression in {condition}",
            f"Biomarkers for {topic} prediction in {condition}",
            f"Comparative effectiveness of {intervention} approaches in {condition}"
        ]
        
        return random.choice(templates)
    
    def _generate_content(self, condition, intervention, topic):
        """Generate realistic medical research content"""
        
        # Introduction
        intro_templates = [
            f"{condition} affects millions worldwide, with {topic} being a critical concern.",
            f"Recent advances in {intervention} show promise for {condition} management.",
            f"Understanding {topic} in {condition} is essential for effective care.",
            f"This study investigates the role of {intervention} in {condition} outcomes."
        ]
        
        # Methods
        method_templates = [
            f"We conducted a randomized controlled trial with {random.randint(50, 500)} participants.",
            f"A longitudinal cohort study followed {random.randint(100, 1000)} patients over {random.randint(12, 60)} months.",
            f"Cross-sectional analysis of {random.randint(200, 2000)} individuals was performed.",
            f"Systematic review and meta-analysis of {random.randint(15, 80)} studies was conducted."
        ]
        
        # Results
        improvement = random.randint(15, 75)
        significance = random.choice(['p<0.001', 'p<0.01', 'p<0.05'])
        result_templates = [
            f"Results showed {improvement}% improvement in {topic} scores ({significance}).",
            f"{intervention.title()} demonstrated significant benefits with {improvement}% reduction in symptoms.",
            f"Participants showed marked improvement in {topic} measures (Cohen's d = {random.uniform(0.3, 1.2):.1f}).",
            f"The intervention group outperformed controls by {improvement}% on primary outcomes."
        ]
        
        # Clinical implications
        implication_templates = [
            f"These findings support implementation of {intervention} in clinical practice.",
            f"Results suggest {intervention} should be considered as first-line treatment.",
            f"Early implementation of {intervention} may prevent {topic} deterioration.",
            f"Healthcare providers should integrate {intervention} into standard care protocols."
        ]
        
        # Combine sections
        content_parts = [
            random.choice(intro_templates),
            random.choice(method_templates),
            random.choice(result_templates),
            random.choice(implication_templates)
        ]
        
        # Add specific clinical details
        if 'AI' in intervention or 'technology' in intervention:
            content_parts.append(f"The AI system achieved {random.randint(80, 95)}% accuracy in predicting {topic} changes.")
        
        if 'family' in intervention:
            content_parts.append(f"Family involvement increased treatment adherence by {random.randint(20, 60)}%.")
        
        if 'early' in topic:
            content_parts.append(f"Early detection enabled intervention {random.randint(3, 12)} months before symptom onset.")
        
        return ' '.join(content_parts)
    
    def _generate_keywords(self, condition, intervention, topic):
        """Generate relevant keywords"""
        base_keywords = [
            condition.lower().replace(' ', '_'),
            intervention.replace(' ', '_'),
            topic.replace(' ', '_')
        ]
        
        additional_keywords = [
            'clinical_trial', 'evidence_based', 'patient_outcomes', 'healthcare_ai',
            'predictive_analytics', 'care_coordination', 'quality_of_life',
            'cognitive_assessment', 'behavioral_analysis', 'family_support',
            'intervention_effectiveness', 'risk_assessment', 'early_detection'
        ]
        
        # Add 3-5 additional relevant keywords
        keywords = base_keywords + random.sample(additional_keywords, random.randint(3, 5))
        return ' '.join(keywords)
    
    def _generate_publication_date(self):
        """Generate realistic publication dates"""
        # Papers from last 10 years, with bias toward recent years
        start_date = datetime.now() - timedelta(days=365*10)
        end_date = datetime.now() - timedelta(days=30)  # Published at least a month ago
        
        # Bias toward more recent publications
        if random.random() < 0.6:  # 60% chance of recent paper (last 3 years)
            start_date = datetime.now() - timedelta(days=365*3)
        
        random_date = start_date + timedelta(
            days=random.randint(0, (end_date - start_date).days)
        )
        
        return random_date
    
    def _generate_authors(self):
        """Generate realistic author lists"""
        num_authors = random.randint(1, 8)
        return ', '.join(random.sample(self.authors, num_authors))
    
    def generate_sql_inserts(self, entries):
        """Generate SQL INSERT statements for TiDB"""
        sql_statements = []
        
        for entry in entries:
            sql = f"""
INSERT INTO medical_knowledge 
(knowledge_id, title, content, source, keywords, relevance_score, publication_date)
VALUES (
    '{entry['knowledge_id']}',
    '{entry['title'].replace("'", "''")}',
    '{entry['content'].replace("'", "''")}',
    '{entry['source'].replace("'", "''")}',
    '{entry['keywords']}',
    {entry['relevance_score']},
    '{entry['publication_date']}'
);"""
            sql_statements.append(sql)
        
        return sql_statements
    
    def save_to_file(self, entries, filename='medical_knowledge_inserts.sql'):
        """Save SQL inserts to file"""
        sql_statements = self.generate_sql_inserts(entries)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("-- SynapseGuard Medical Knowledge Database\n")
            f.write(f"-- Generated {len(entries)} medical research entries\n")
            f.write(f"-- Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            for sql in sql_statements:
                f.write(sql + '\n')
        
        print(f"Generated {len(entries)} medical knowledge entries in {filename}")

# Generate the database
if __name__ == "__main__":
    generator = MedicalKnowledgeGenerator()
    
    # Generate 1000 entries for demo (can scale to 50K+ for production)
    print("Generating medical knowledge database...")
    entries = generator.generate_medical_knowledge_entries(1000)
    
    # Save to SQL file
    generator.save_to_file(entries, '../database/medical_knowledge_inserts.sql')
    
    # Also save as JSON for analysis
    with open('../database/medical_knowledge_data.json', 'w', encoding='utf-8') as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)
    
    print("Medical knowledge database generation complete!")
    print(f"Generated {len(entries)} research papers covering:")
    print(f"- {len(generator.conditions)} neurological conditions")
    print(f"- {len(generator.intervention_types)} intervention types") 
    print(f"- {len(generator.research_topics)} research topics")
    print(f"- {len(generator.journals)} academic journals")