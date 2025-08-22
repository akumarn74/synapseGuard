from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def root():
    return jsonify({
        'message': 'SynapseGuard API is running!', 
        'status': 'online',
        'port': os.environ.get('PORT', 'unknown')
    })

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'service': 'SynapseGuard'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)