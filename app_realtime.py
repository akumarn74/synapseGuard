"""
Real-time API endpoints for live frontend integration
"""
from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime, timedelta
import os
import json
import asyncio
import time

# Get database connection details
TIDB_CONFIG = {
    'host': os.getenv('TIDB_HOST'),
    'user': os.getenv('TIDB_USER'),
    'password': os.getenv('TIDB_PASSWORD'),
    'database': os.getenv('TIDB_DATABASE'),
    'port': 4000,
    'ssl_disabled': False,
    'autocommit': True
}

def get_db_connection():
    """Get database connection"""
    try:
        return mysql.connector.connect(**TIDB_CONFIG)
    except Exception as e:
        print(f"Database connection failed: {e}")
        return None

def add_realtime_routes(app):
    """Add real-time API routes to the Flask app"""
    
    @app.route('/api/realtime/agent-status', methods=['GET'])
    def get_agent_status():
        """Get real-time agent processing status"""
        try:
            db = get_db_connection()
            if not db:
                return jsonify({'error': 'Database connection failed'}), 500
                
            cursor = db.cursor(dictionary=True)
            
            # Get recent interventions (agent activity)
            cursor.execute("""
                SELECT agent_type, COUNT(*) as count, MAX(timestamp) as last_activity
                FROM interventions 
                WHERE timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR)
                GROUP BY agent_type
                ORDER BY last_activity DESC
            """)
            recent_activity = cursor.fetchall()
            
            # Get system stats
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_patients,
                    (SELECT COUNT(*) FROM behavioral_patterns) as total_patterns,
                    (SELECT COUNT(*) FROM interventions) as total_interventions,
                    (SELECT COUNT(*) FROM medical_knowledge) as knowledge_entries
                FROM patients
            """)
            stats = cursor.fetchone()
            
            # Agent status mapping
            agent_map = {
                'cognitive_analyzer': {'name': 'Cognitive Analyzer', 'icon': '🧠'},
                'crisis_prevention': {'name': 'Crisis Prevention', 'icon': '⚠️'},
                'care_orchestration': {'name': 'Care Orchestration', 'icon': '🤝'},
                'therapeutic_intervention': {'name': 'Therapeutic Intervention', 'icon': '🎯'},
                'family_intelligence': {'name': 'Family Intelligence', 'icon': '👨‍👩‍👧‍👦'},
                'pattern_learning': {'name': 'Pattern Learning', 'icon': '🧠'},
                'medical_knowledge': {'name': 'Medical Knowledge', 'icon': '📚'},
                'orchestrator': {'name': 'Agent Orchestrator', 'icon': '🎛️'}
            }
            
            agents = []
            for agent_key, agent_info in agent_map.items():
                activity = next((a for a in recent_activity if a['agent_type'] == agent_key), None)
                
                agents.append({
                    'name': agent_info['name'],
                    'icon': agent_info['icon'],
                    'status': 'active' if activity and activity['count'] > 0 else 'idle',
                    'last_activity': activity['last_activity'].isoformat() if activity and activity['last_activity'] else 'Never',
                    'processing_count': activity['count'] if activity else 0
                })
            
            cursor.close()
            db.close()
            
            return jsonify({
                'success': True,
                'agents': agents,
                'system_stats': stats,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/realtime/patient-metrics', methods=['GET'])
    def get_patient_metrics():
        """Get real-time patient metrics and patterns"""
        try:
            db = get_db_connection()
            if not db:
                return jsonify({'error': 'Database connection failed'}), 500
                
            cursor = db.cursor(dictionary=True)
            
            # Get recent patterns by patient
            cursor.execute("""
                SELECT 
                    p.patient_id,
                    p.name,
                    COUNT(bp.pattern_id) as pattern_count,
                    AVG(bp.deviation_score) as avg_deviation,
                    MAX(bp.timestamp) as last_pattern,
                    bp.pattern_type
                FROM patients p
                LEFT JOIN behavioral_patterns bp ON p.patient_id = bp.patient_id 
                GROUP BY p.patient_id, p.name, bp.pattern_type
                ORDER BY last_pattern DESC
                LIMIT 20
            """)
            patient_metrics = cursor.fetchall()
            
            # Get recent interventions
            cursor.execute("""
                SELECT 
                    patient_id,
                    agent_type,
                    intervention_type,
                    effectiveness_score,
                    timestamp
                FROM interventions 
                ORDER BY timestamp DESC
                LIMIT 20
            """)
            recent_interventions = cursor.fetchall()
            
            # Get crisis predictions
            cursor.execute("""
                SELECT 
                    patient_id,
                    risk_score,
                    prediction_timestamp as timestamp
                FROM crisis_predictions 
                ORDER BY prediction_timestamp DESC
                LIMIT 10
            """)
            crisis_predictions = cursor.fetchall()
            
            cursor.close()
            db.close()
            
            return jsonify({
                'success': True,
                'patient_metrics': patient_metrics,
                'recent_interventions': recent_interventions,
                'crisis_predictions': crisis_predictions,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/realtime/tidb-stats', methods=['GET'])
    def get_tidb_stats():
        """Get real-time TiDB database statistics"""
        try:
            db = get_db_connection()
            if not db:
                return jsonify({'error': 'Database connection failed'}), 500
                
            cursor = db.cursor(dictionary=True)
            
            # Vector operations stats
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_vectors,
                    AVG(LENGTH(pattern_vector)) as avg_vector_size,
                    COUNT(CASE WHEN pattern_vector IS NOT NULL THEN 1 END) as non_null_vectors
                FROM behavioral_patterns
            """)
            vector_stats = cursor.fetchone()
            
            # Database growth over time
            cursor.execute("""
                SELECT 
                    DATE(timestamp) as date,
                    COUNT(*) as daily_patterns,
                    AVG(deviation_score) as avg_deviation
                FROM behavioral_patterns 
                GROUP BY DATE(timestamp)
                ORDER BY date DESC
                LIMIT 7
            """)
            growth_stats = cursor.fetchall()
            
            # Query performance simulation (TiDB would have real metrics)
            performance_stats = {
                'vector_search_avg_ms': 42.3,
                'json_query_avg_ms': 15.7,
                'fulltext_search_avg_ms': 28.9,
                'connection_pool_size': 10,
                'active_connections': 3
            }
            
            cursor.close()
            db.close()
            
            return jsonify({
                'success': True,
                'vector_stats': vector_stats,
                'growth_stats': growth_stats,
                'performance_stats': performance_stats,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/realtime/processing-feed', methods=['GET'])  
    def get_processing_feed():
        """Get live processing activity feed"""
        try:
            db = get_db_connection()
            if not db:
                return jsonify({'error': 'Database connection failed'}), 500
                
            cursor = db.cursor(dictionary=True)
            
            # Get recent processing activity
            cursor.execute("""
                SELECT 
                    i.agent_type,
                    i.intervention_type,
                    i.description,
                    i.timestamp,
                    p.name as patient_name
                FROM interventions i
                JOIN patients p ON i.patient_id = p.patient_id
                ORDER BY i.timestamp DESC
                LIMIT 15
            """)
            processing_feed = cursor.fetchall()
            
            # Format for frontend
            formatted_feed = []
            for item in processing_feed:
                formatted_feed.append({
                    'agent': item['agent_type'].replace('_', ' ').title(),
                    'action': item['intervention_type'] or 'processing',
                    'description': item['description'][:100] + '...' if len(item['description']) > 100 else item['description'],
                    'patient': item['patient_name'],
                    'timestamp': item['timestamp'].strftime('%H:%M:%S'),
                    'status': 'completed'
                })
            
            cursor.close()
            db.close()
            
            return jsonify({
                'success': True,
                'feed': formatted_feed,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app = Flask(__name__)
    CORS(app)
    add_realtime_routes(app)
    app.run(debug=True, port=5002)