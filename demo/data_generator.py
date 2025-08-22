import random
import json
from datetime import datetime, timedelta
import numpy as np
from typing import Dict, Any, List

class DemoDataGenerator:
    """Generate realistic demo data for SynapseGuard hackathon demo"""
    
    def __init__(self):
        self.patient_profiles = {
            'margaret_wilson': {
                'name': 'Margaret Wilson',
                'age': 72,
                'diagnosis': 'Early-stage Alzheimers',
                'severity_level': 'mild',
                'baseline_wake_time': 7.0,  # 7:00 AM
                'baseline_routine_completion': 0.95,
                'baseline_activity_level': 0.8
            },
            'robert_chen': {
                'name': 'Robert Chen',
                'age': 68,
                'diagnosis': 'Mild Cognitive Impairment',
                'severity_level': 'mild',
                'baseline_wake_time': 6.5,  # 6:30 AM
                'baseline_routine_completion': 0.90,
                'baseline_activity_level': 0.75
            }
        }
    
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
        """Generate realistic family contact information"""
        contacts = {
            'margaret_wilson': {
                'primary_caregiver': {
                    'name': 'Sarah Wilson',
                    'relationship': 'daughter',
                    'phone': '+1-555-0123',
                    'email': 'sarah.wilson@email.com',
                    'patient_name': 'Margaret Wilson'
                },
                'family_members': [
                    {
                        'name': 'Michael Wilson',
                        'relationship': 'son',
                        'phone': '+1-555-0124',
                        'email': 'michael.wilson@email.com'
                    },
                    {
                        'name': 'Emma Thompson',
                        'relationship': 'granddaughter',
                        'phone': '+1-555-0125',
                        'email': 'emma.thompson@email.com'
                    }
                ],
                'healthcare_providers': [
                    {
                        'name': 'Dr. Jennifer Martinez',
                        'type': 'primary_care',
                        'phone': '+1-555-0200',
                        'email': 'j.martinez@healthcenter.com'
                    },
                    {
                        'name': 'Dr. Robert Kim',
                        'type': 'neurologist',
                        'phone': '+1-555-0201',
                        'email': 'r.kim@neurocenter.com'
                    }
                ],
                'emergency_contacts': [
                    {
                        'name': 'Emergency Services',
                        'phone': '911'
                    },
                    {
                        'name': 'Sarah Wilson (Primary)',
                        'phone': '+1-555-0123'
                    }
                ]
            }
        }
        
        return contacts.get(patient_id, contacts['margaret_wilson'])