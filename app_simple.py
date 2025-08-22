from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
import uuid
import asyncio
import sys
import json
from datetime import datetime
sys.path.append('/app')
from orchestrator.agent_orchestrator import AgentOrchestrator
from demo.data_generator import DemoDataGenerator

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize AI components
data_generator = DemoDataGenerator()

# TiDB Serverless Connection
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv('TIDB_HOST'),
        port=4000,
        user=os.getenv('TIDB_USER'),
        password=os.getenv('TIDB_PASSWORD'),
        database=os.getenv('TIDB_DATABASE'),
        ssl_disabled=False
    )

@app.route('/')
def root():
    """Root endpoint"""
    return jsonify({'message': 'SynapseGuard API is running!', 'status': 'online'})

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'SynapseGuard Full AI System'})

@app.route('/api/admin/cleanup', methods=['POST'])
def cleanup_interventions():
    """Clean up problematic intervention records"""
    try:
        db_conn = get_db_connection()
        cursor = db_conn.cursor()
        
        # Delete any records with NULL or empty intervention_id
        cursor.execute("DELETE FROM interventions WHERE intervention_id = '' OR intervention_id IS NULL")
        deleted_empty = cursor.rowcount
        
        # Delete all DemoAgent entries to start fresh
        cursor.execute("DELETE FROM interventions WHERE agent_type = 'DemoAgent'")  
        deleted_demo = cursor.rowcount
        
        db_conn.commit()
        db_conn.close()
        
        return jsonify({
            'success': True,
            'deleted_empty_ids': deleted_empty,
            'deleted_demo_entries': deleted_demo,
            'message': 'Database cleaned up successfully'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/setup/demo', methods=['POST'])
def setup_demo():
    """Set up demo data in TiDB"""
    try:
        db_conn = get_db_connection()
        cursor = db_conn.cursor()
        
        # Create both demo patients
        patients_to_create = [
            {
                'patient_id': 'margaret_wilson',
                'profile': data_generator.patient_profiles['margaret_wilson']
            },
            {
                'patient_id': 'robert_chen', 
                'profile': data_generator.patient_profiles['robert_chen']
            }
        ]
        
        for patient_data in patients_to_create:
            patient_id = patient_data['patient_id']
            profile = patient_data['profile']
            
            # Generate family contacts for this patient
            family_contacts = data_generator.generate_patient_family_contacts(patient_id)
            
            # Create baseline patterns
            baseline_patterns = {
                'daily_routine': {
                    'wake_time': profile['baseline_wake_time'],
                    'completion_rate': profile['baseline_routine_completion'],
                    'activity_level': profile['baseline_activity_level']
                },
                'cognitive_metrics': {
                    'orientation_score': 0.95,
                    'response_time': 'normal'
                }
            }
            
            # Insert or update patient
            cursor.execute("""
                INSERT INTO patients 
                (patient_id, name, age, diagnosis, severity_level, baseline_patterns, family_contacts)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                baseline_patterns = VALUES(baseline_patterns),
                family_contacts = VALUES(family_contacts)
            """, (
                patient_id, profile['name'], profile['age'], profile['diagnosis'],
                profile['severity_level'], json.dumps(baseline_patterns), 
                json.dumps(family_contacts)
            ))
        
        db_conn.commit()
        
        # Get final counts
        cursor.execute("SELECT COUNT(*) FROM patients")
        patient_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM medical_knowledge") 
        knowledge_count = cursor.fetchone()[0]
        
        db_conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Demo data ready - Both patients created',
            'stats': {
                'patients': patient_count,
                'knowledge_entries': knowledge_count
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/demo/normal', methods=['POST'])
def demo_normal_day():
    """Real AI-driven endpoint for normal day processing"""
    try:
        patient_id = request.json.get('patient_id', 'margaret_wilson') if request.json else 'margaret_wilson'
        
        # Generate real sensor data using AI data generator
        sensor_data = data_generator.generate_normal_day_data(patient_id)
        
        # Process through real SynapseGuard AI system
        db_conn = get_db_connection()
        orchestrator = AgentOrchestrator(db_conn)
        
        # Run AI analysis asynchronously
        result = asyncio.run(orchestrator.process_patient_data(patient_id, sensor_data))
        
        db_conn.close()
        
        return jsonify({
            'success': True,
            'scenario': 'normal_day',
            'input_data': sensor_data,
            'synapseGuard_result': result,
            'note': 'Real AI analysis with live TiDB data processing'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/demo/concerning', methods=['POST'])
def demo_concerning_patterns():
    """Real AI-driven endpoint for concerning patterns"""
    try:
        patient_id = request.json.get('patient_id', 'margaret_wilson') if request.json else 'margaret_wilson'
        
        # Generate real concerning sensor data using AI data generator
        sensor_data = data_generator.generate_concerning_day_data(patient_id)
        
        # Process through real SynapseGuard AI system
        db_conn = get_db_connection()
        orchestrator = AgentOrchestrator(db_conn)
        
        # Run AI analysis asynchronously
        result = asyncio.run(orchestrator.process_patient_data(patient_id, sensor_data))
        
        db_conn.close()
        
        return jsonify({
            'success': True,
            'scenario': 'concerning_patterns',
            'input_data': sensor_data,
            'synapseGuard_result': result,
            'note': 'Real AI analysis with live TiDB data processing'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/demo/crisis', methods=['POST'])
def demo_crisis_prevention():
    """Real AI-driven endpoint for crisis prevention"""
    try:
        patient_id = request.json.get('patient_id', 'margaret_wilson') if request.json else 'margaret_wilson'
        
        # Generate real crisis-level sensor data using AI data generator
        sensor_data = data_generator.generate_crisis_day_data(patient_id)
        
        # Process through real SynapseGuard AI system
        db_conn = get_db_connection()
        orchestrator = AgentOrchestrator(db_conn)
        
        # Run AI analysis asynchronously
        result = asyncio.run(orchestrator.process_patient_data(patient_id, sensor_data))
        
        db_conn.close()
        
        return jsonify({
            'success': True,
            'scenario': 'crisis_prevention',
            'input_data': sensor_data,
            'synapseGuard_result': result,
            'note': 'Real AI analysis with live TiDB data processing'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/patient/<patient_id>/history', methods=['GET'])
def get_patient_history(patient_id):
    """Get patient processing history"""
    try:
        db_conn = get_db_connection()
        cursor = db_conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT * FROM interventions 
            WHERE patient_id = %s 
            ORDER BY timestamp DESC 
            LIMIT 20
        """, (patient_id,))
        
        history = cursor.fetchall()
        db_conn.close()
        
        return jsonify({
            'success': True,
            'patient_id': patient_id,
            'history': history
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting SynapseGuard API...")
    print(f"Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"Database: {os.getenv('TIDB_HOST', 'localhost')}")
    app.run(debug=False, host='0.0.0.0', port=5000)