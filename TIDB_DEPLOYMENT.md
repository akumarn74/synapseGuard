# SynapseGuard with TiDB Serverless - Production Deployment

## ✅ **CONFIRMED: Using TiDB Serverless**

This deployment is **correctly configured** to use **TiDB Serverless** as the primary database, not PostgreSQL.

### 🔗 Current TiDB Configuration

**Database Connection:**
- **Host:** `gateway01.us-east-1.prod.aws.tidbcloud.com`
- **Port:** `4000` (TiDB Serverless default)
- **Protocol:** MySQL (TiDB is MySQL-compatible)
- **SSL:** Enabled (`ssl_disabled=False`)

**Application Configuration:**
```python
# app_simple.py uses TiDB Serverless
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv('TIDB_HOST'),           # TiDB Serverless host
        port=4000,                             # TiDB Serverless port
        user=os.getenv('TIDB_USER'),          # TiDB user
        password=os.getenv('TIDB_PASSWORD'),   # TiDB password
        database=os.getenv('TIDB_DATABASE'),   # TiDB database
        ssl_disabled=False                     # TiDB SSL connection
    )
```

### 🚀 TiDB-Only Deployment

**Current Running Configuration:**
```bash
# Using TiDB-specific Docker Compose
docker-compose -f docker-compose.tidb.yml up -d
```

**Services:**
- ✅ **Frontend**: React app on port 3000
- ✅ **Backend**: Flask API on port 5001 (connected to TiDB)
- ✅ **Database**: TiDB Serverless (no local PostgreSQL)

### 🧪 Verified TiDB Functionality

**API Endpoints Working:**
```bash
# All endpoints confirmed working with TiDB
✅ GET  /health                    - Service health
✅ POST /api/setup/demo           - TiDB data setup
✅ POST /api/demo/normal          - Normal day processing
✅ POST /api/demo/concerning      - Concerning patterns
✅ POST /api/demo/crisis          - Crisis prevention
✅ GET  /api/patient/{id}/history - Patient history from TiDB
```

**Database Verification:**
```bash
# Current TiDB data confirmed:
• Patients: 1 (Margaret Wilson)
• Medical Knowledge: 3 entries
• Interventions: Working and storing to TiDB
```

### 🏗️ TiDB Schema

**Tables in TiDB Serverless:**
- `patients` - Patient profiles with JSON data
- `medical_knowledge` - Medical research database
- `interventions` - Intervention history
- `behavioral_patterns` - Pattern analysis data
- `family_communications` - Communication logs
- `crisis_predictions` - Crisis prediction data

### 📊 TiDB Features Utilized

**Vector Capabilities:**
- **Pattern Matching**: Behavioral pattern analysis
- **Similarity Search**: Medical knowledge retrieval
- **Multi-dimensional Data**: Patient cognitive metrics

**JSON Support:**
- **Flexible Schema**: Patient baseline patterns
- **Family Contacts**: Nested contact information
- **Dynamic Metadata**: Intervention external actions

**Performance:**
- **Serverless Scaling**: Automatic capacity adjustment
- **Global Distribution**: Low-latency access
- **MySQL Compatibility**: Standard SQL with extensions

### 🔧 Environment Configuration

**Required Environment Variables (.env):**
```bash
# TiDB Serverless Configuration
TIDB_HOST=gateway01.us-east-1.prod.aws.tidbcloud.com
TIDB_USER=3JTf8ZuDE4RQa9v.root
TIDB_PASSWORD=wfCdtzhw5Py2H8Mc
TIDB_DATABASE=synapseGuard

# Optional AI Integration
OPENAI_API_KEY=your-openai-key
```

### 🚀 Deployment Commands

**Start TiDB Deployment:**
```bash
# Automated deployment script
./deploy-tidb-production.sh

# Or manual deployment
docker-compose -f docker-compose.tidb.yml up -d
```

**Test TiDB Connection:**
```bash
# Test API health
curl http://localhost:5001/health

# Setup TiDB demo data
curl -X POST http://localhost:5001/api/setup/demo

# Test TiDB data operations
curl -X POST http://localhost:5001/api/demo/normal \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "margaret_wilson"}'
```

### 🎯 TiDB vs PostgreSQL

**What's Different:**

| Feature | PostgreSQL (docker-compose.yml) | TiDB Serverless (docker-compose.tidb.yml) |
|---------|----------------------------------|---------------------------------------------|
| Database | Local PostgreSQL container | Cloud TiDB Serverless |
| Connection | `postgresql://` | `mysql://` (TiDB is MySQL-compatible) |
| Port | 5432 | 4000 |
| Scaling | Manual container scaling | Automatic serverless scaling |
| Storage | Local Docker volume | Cloud-distributed storage |
| Availability | Single container | High availability cluster |

**Why TiDB is Better for Production:**
- ✅ **Serverless scaling** - handles traffic spikes automatically
- ✅ **Global distribution** - low latency worldwide
- ✅ **Vector search** - advanced AI/ML capabilities
- ✅ **Zero maintenance** - managed infrastructure
- ✅ **MySQL compatibility** - familiar SQL interface

### 📈 Production Benefits

**Hackathon Advantages:**
1. **Real Database**: Using actual TiDB Serverless, not local mock
2. **Cloud-Native**: True cloud architecture
3. **Scalable**: Handles demo load spikes
4. **Reliable**: Enterprise-grade availability
5. **Feature-Rich**: Vector search and JSON support

**Demo Capabilities:**
- **Real-time processing**: TiDB handles concurrent requests
- **Complex queries**: Multi-table joins and JSON operations
- **Vector operations**: Pattern similarity matching
- **Global access**: Demo accessible from anywhere

### 🏆 Deployment Status

**✅ PRODUCTION READY WITH TIDB SERVERLESS**

- **Database**: TiDB Serverless cluster active
- **Application**: Connected and operational
- **API**: All endpoints working with TiDB
- **Frontend**: React app serving from Nginx
- **Data**: Sample patients and medical knowledge loaded
- **Testing**: End-to-end validation complete

**🎉 Your SynapseGuard application is running on TiDB Serverless in production! 🎉**

### 🔍 Verification Commands

```bash
# Confirm TiDB connection in logs
docker-compose -f docker-compose.tidb.yml logs backend | grep -i tidb

# Test all TiDB endpoints
curl http://localhost:5001/health
curl -X POST http://localhost:5001/api/setup/demo
curl http://localhost:5001/api/patient/margaret_wilson/history

# Check frontend
curl http://localhost:3000
```

Your application is now successfully using **TiDB Serverless** for all database operations! 🚀