import random
import json
from datetime import datetime, timedelta
import numpy as np
from typing import Dict, Any, List

class DemoDataGenerator:
    """Generate realistic demo data for SynapseGuard hackathon demo"""
    
    def __init__(self):
        import os
        
        # Fallback profiles if database is unavailable
        self.fallback_profiles = {
            'margaret_wilson': {
                'name': 'Margaret Wilson',
                'age': 72,
                'diagnosis': 'Early-stage Alzheimers',
                'severity_level': 'mild',
                'baseline_wake_time': 7.0,
                'baseline_routine_completion': 0.95,
                'baseline_activity_level': 0.8
            },
            'robert_chen': {
                'name': 'Robert Chen',
                'age': 68,
                'diagnosis': 'Mild Cognitive Impairment',
                'severity_level': 'mild',
                'baseline_wake_time': 6.5,
                'baseline_routine_completion': 0.90,
                'baseline_activity_level': 0.75
            }
        }
        
        # Dynamic patient profiles loaded from database
        self.patient_profiles = {}
        self.db_config = {
            'host': os.getenv('TIDB_HOST'),
            'user': os.getenv('TIDB_USER'),
            'password': os.getenv('TIDB_PASSWORD'),
            'database': os.getenv('TIDB_DATABASE'),
            'port': 4000,
            'ssl_disabled': False
        }
        self._load_patient_profiles()
    
    def _load_patient_profiles(self):
        """Load patient profiles dynamically from TiDB database"""
        try:
            import mysql.connector
            db = mysql.connector.connect(**self.db_config)
            cursor = db.cursor(dictionary=True)
            
            cursor.execute("""
                SELECT patient_id, name, age, diagnosis, severity_level, baseline_patterns
                FROM patients
            """)
            
            patients = cursor.fetchall()
            for patient in patients:
                baseline = json.loads(patient['baseline_patterns'] or '{}')
                daily_routine = baseline.get('daily_routine', {})
                
                self.patient_profiles[patient['patient_id']] = {
                    'name': patient['name'],
                    'age': patient['age'],
                    'diagnosis': patient['diagnosis'],
                    'severity_level': patient['severity_level'],
                    'baseline_wake_time': daily_routine.get('wake_time', 7.0),
                    'baseline_routine_completion': daily_routine.get('completion_rate', 0.9),
                    'baseline_activity_level': daily_routine.get('activity_level', 0.8)
                }
            
            cursor.close()
            db.close()
            print(f"✅ Loaded {len(self.patient_profiles)} patient profiles from database")
            
        except Exception as e:
            print(f"⚠️  Failed to load patients from database: {e}")
            self.patient_profiles = self.fallback_profiles.copy()
    
    def generate_normal_day_data(self, patient_id: str) -> Dict[str, Any]:
        """Generate data for a normal day"""
        profile = self.patient_profiles.get(patient_id, self.patient_profiles['margaret_wilson'])
        
        return {
            'timestamp': datetime.now().isoformat(),
            'patient_id': patient_id,
            'daily_routine': {
                'wake_time': profile['baseline_wake_time'] + random.uniform(-0.2, 0.2),
                'completion_rate': profile['baseline_routine_completion'] + random.uniform(-0.05, 0.05),
                'activity_level': profile['baseline_activity_level'] + random.uniform(-0.1, 0.1)
            },
            'cognitive_metrics': {
                'response_time': 'normal',
                'recall_accuracy': 'good',
                'orientation_score': 0.95 + random.uniform(-0.05, 0.05)
            },
            'physical_metrics': {
                'movement_variability': 'stable',
                'sleep_score': 0.85 + random.uniform(-0.1, 0.1),
                'heart_rate_variability': 'normal'
            },
            'medication_adherence': {
                'morning_medication': True,
                'timing_accuracy': 0.95 + random.uniform(-0.05, 0.05)
            }
        }
    
    def generate_concerning_day_data(self, patient_id: str) -> Dict[str, Any]:
        """Generate data showing concerning patterns"""
        profile = self.patient_profiles.get(patient_id, self.patient_profiles['margaret_wilson'])
        
        return {
            'timestamp': datetime.now().isoformat(),
            'patient_id': patient_id,
            'daily_routine': {
                'wake_time': profile['baseline_wake_time'] + random.uniform(0.5, 1.5),  # Woke up 30-90 min late
                'completion_rate': profile['baseline_routine_completion'] - random.uniform(0.15, 0.30),  # 15-30% decrease
                'activity_level': profile['baseline_activity_level'] - random.uniform(0.2, 0.4)  # Significant decrease
            },
            'cognitive_metrics': {
                'response_time': 'slower_than_usual',
                'recall_accuracy': 'poor',
                'orientation_score': 0.95 - random.uniform(0.15, 0.25)  # Noticeable decline
            },
            'physical_metrics': {
                'movement_variability': 'increased',
                'sleep_score': 0.85 - random.uniform(0.2, 0.3),  # Poor sleep
                'heart_rate_variability': 'elevated'
            },
            'medication_adherence': {
                'morning_medication': random.choice([True, False]),  # 50% chance missed
                'timing_accuracy': 0.95 - random.uniform(0.2, 0.4)  # Poor timing
            }
        }
    
    def generate_crisis_day_data(self, patient_id: str) -> Dict[str, Any]:
        """Generate data showing crisis-level patterns"""
        profile = self.patient_profiles.get(patient_id, self.patient_profiles['margaret_wilson'])
        
        return {
            'timestamp': datetime.now().isoformat(),
            'patient_id': patient_id,
            'daily_routine': {
                'wake_time': profile['baseline_wake_time'] + random.uniform(1.0, 3.0),  # Woke up 1-3 hours late
                'completion_rate': profile['baseline_routine_completion'] - random.uniform(0.4, 0.6),  # 40-60% decrease
                'activity_level': profile['baseline_activity_level'] - random.uniform(0.4, 0.6)  # Major decrease
            },
            'cognitive_metrics': {
                'response_time': 'significantly_delayed',
                'recall_accuracy': 'very_poor',
                'orientation_score': 0.95 - random.uniform(0.3, 0.5)  # Severe decline
            },
            'physical_metrics': {
                'movement_variability': 'highly_irregular',
                'sleep_score': 0.85 - random.uniform(0.4, 0.5),  # Very poor sleep
                'heart_rate_variability': 'concerning'
            },
            'medication_adherence': {
                'morning_medication': False,  # Missed medication
                'timing_accuracy': 0.95 - random.uniform(0.5, 0.7)  # Very poor timing
            }
        }
    
    def generate_patient_family_contacts(self, patient_id: str) -> Dict[str, Any]:
        """Load family contact information from database or generate realistic data"""
        try:
            import mysql.connector
            db = mysql.connector.connect(**self.db_config)
            cursor = db.cursor(dictionary=True)
            
            cursor.execute("""
                SELECT family_contacts FROM patients WHERE patient_id = %s
            """, (patient_id,))
            
            result = cursor.fetchone()
            cursor.close()
            db.close()
            
            if result and result['family_contacts']:
                return json.loads(result['family_contacts'])
                
        except Exception as e:
            print(f"⚠️  Failed to load family contacts from database: {e}")
        
        # Fallback: Generate realistic family contacts based on patient profile
        profile = self.patient_profiles.get(patient_id, self.patient_profiles.get('margaret_wilson', {}))
        patient_name = profile.get('name', 'Unknown Patient')
        
        # Generate realistic contacts based on patient demographics
        return self._generate_realistic_contacts(patient_id, patient_name)
    
    def _generate_realistic_contacts(self, patient_id: str, patient_name: str) -> Dict[str, Any]:
        """Generate realistic family contacts for any patient"""
        # Extract first and last name
        name_parts = patient_name.split()
        first_name = name_parts[0] if name_parts else 'Patient'
        last_name = name_parts[-1] if len(name_parts) > 1 else 'Unknown'
        
        # Common family names and relationships
        family_names = [
            f"{first_name.lower()}.{last_name.lower()}",
            f"{first_name[0].lower()}{last_name.lower()}",
            f"{last_name.lower()}{first_name[0].lower()}"
        ]
        
        base_phone = random.randint(5550100, 5559999)
        
        return {
            'primary_caregiver': {
                'name': f"{random.choice(['Sarah', 'Michael', 'Jennifer', 'David', 'Lisa'])} {last_name}",
                'relationship': random.choice(['daughter', 'son', 'spouse']),
                'phone': f'+1-{base_phone}',
                'email': f"{family_names[0]}@email.com",
                'patient_name': patient_name
            },
            'family_members': [
                {
                    'name': f"{random.choice(['Alex', 'Emma', 'Jordan', 'Taylor'])} {last_name}",
                    'relationship': random.choice(['child', 'grandchild', 'sibling']),
                    'phone': f'+1-{base_phone + 1}',
                    'email': f"{family_names[1]}@email.com"
                }
            ],
            'healthcare_providers': [
                {
                    'name': f"Dr. {random.choice(['Martinez', 'Kim', 'Johnson', 'Smith', 'Brown'])}",
                    'type': 'primary_care',
                    'phone': f'+1-{base_phone + 100}',
                    'email': f"doctor{random.randint(1,999)}@healthcenter.com"
                }
            ],
            'emergency_contacts': [
                {
                    'name': 'Emergency Services',
                    'phone': '911'
                },
                {
                    'name': f"{random.choice(['Sarah', 'Michael', 'Jennifer'])} {last_name} (Primary)",
                    'phone': f'+1-{base_phone}'
                }
            ]
        }