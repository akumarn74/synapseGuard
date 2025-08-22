from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        'message': 'SynapseGuard API is running!',
        'status': 'success',
        'deployment': 'Railway'
    })

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/test')
def test():
    return jsonify({'test': 'working', 'backend': 'online'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)