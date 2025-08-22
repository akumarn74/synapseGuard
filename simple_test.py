#!/usr/bin/env python3
from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': 'SynapseGuard API is online!',
        'status': 'success',
        'port': os.environ.get('PORT', '5000'),
        'host': '0.0.0.0'
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'SynapseGuard'})

@app.route('/test')
def test():
    return jsonify({'test': 'working', 'framework': 'Flask'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Flask app on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)