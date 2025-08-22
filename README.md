# SynapseGuard - AI-Powered Neurodegenerative Care System

## 🚀 **Production Ready - TiDB Serverless Powered**

SynapseGuard is an advanced multi-agent AI system for neurodegenerative care, built for the **TiDB AgentX Hackathon 2025**. The system provides real-time behavioral pattern analysis, crisis prevention, and coordinated care management using **TiDB Serverless** as the primary database.

### ✨ **Key Features**

- 🧠 **Multi-Agent AI Architecture** - 7 specialized AI agents for comprehensive care
- 🔍 **Real-time Pattern Analysis** - Behavioral deviation detection and trend prediction  
- 🚨 **Crisis Prevention** - Predictive alerts and automated interventions
- 👥 **Family Intelligence** - Optimized communication and care coordination
- 📊 **Live Dashboard** - Real-time monitoring for providers, families, and admins
- 🌐 **TiDB Serverless** - Cloud-native database with vector search capabilities

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend Layer                          │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Family Portal  │  Patient App    │     Admin Dashboard         │
│   (React)       │   (React)       │        (React)              │
└─────────────────┴─────────────────┴─────────────────────────────┘
                              │
                         API Gateway
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Agent Orchestration Layer                     │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Cognitive      │  Crisis         │  Care Orchestration         │
│  Analyzer       │  Prevention     │  Agent                      │
│  Agent          │  Agent          │                             │
├─────────────────┼─────────────────┼─────────────────────────────┤
│  Therapeutic    │  Family         │  Pattern Learning           │
│  Intervention   │  Intelligence   │  Agent                      │
│  Agent          │  Agent          │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Data Processing Layer                       │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Vector         │  Medical        │  External API               │
│  Embeddings     │  Research       │  Integrations               │
│  Engine         │  Search         │  (SMS, Email, Calendar)     │
└─────────────────┴─────────────────┴─────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       TiDB Serverless                           │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Patient        │  Medical        │  Intervention               │
│  Patterns       │  Knowledge      │  Outcomes                   │
│  (Vector)       │  (Full-text)    │  (Time-series)              │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

## 🚀 **Quick Start**

### **Simple Deployment**

```bash
# Start the system
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### **Access the Application**

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001  
- **Health Check**: http://localhost:5001/health

## 🧪 **Demo Endpoints**

```bash
# Setup demo data
curl -X POST http://localhost:5001/api/setup/demo

# Normal day processing - Margaret Wilson (Alzheimer's)
curl -X POST http://localhost:5001/api/demo/normal \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "margaret_wilson"}'

# Normal day processing - Robert Chen (MCI)
curl -X POST http://localhost:5001/api/demo/normal \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "robert_chen"}'

# Concerning patterns
curl -X POST http://localhost:5001/api/demo/concerning \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "margaret_wilson"}'

# Crisis prevention
curl -X POST http://localhost:5001/api/demo/crisis \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "margaret_wilson"}'

# Patient history
curl http://localhost:5001/api/patient/margaret_wilson/history
```

## 📁 **Project Structure**

```
synapseGuard/
├── 🐳 docker-compose.yml        # Main deployment configuration
├── 📄 Dockerfile                # Backend container configuration
├── 📋 requirements.txt          # Python dependencies
├── 
├── 🎯 app_simple.py             # Main Flask application (TiDB-powered)
├── 
├── 🤖 agents/                   # AI Agent System (7 specialized agents)
│   ├── base_agent.py            # Core agent functionality
│   ├── cognitive_analyzer.py    # Behavioral pattern analysis
│   ├── crisis_prevention.py     # Crisis prediction & prevention
│   ├── medical_knowledge_agent.py # Medical literature analysis
│   ├── family_intelligence.py   # Family communication optimization
│   ├── pattern_learning.py      # Continuous learning system
│   ├── therapeutic_intervention.py # Treatment recommendations
│   └── care_orchestration.py    # Care team coordination
│
├── 🎭 orchestrator/             # Agent Coordination
│   └── agent_orchestrator.py    # Multi-agent workflow management
│
├── 🗄️ database/                 # TiDB Database
│   ├── schema_tidb.sql          # TiDB database schema
│   ├── medical_knowledge_inserts.sql # Medical knowledge data
│   └── medical_knowledge_data.py # Data processing scripts
│
├── 🎬 demo/                     # Demo Data Generation
│   └── data_generator.py        # Realistic sensor data generation
│
└── 🌐 frontend/                 # React Application (Streamlined)
    ├── Dockerfile               # Frontend container
    ├── src/pages/               # Application pages
    │   ├── LandingPage.tsx      # Landing page
    │   ├── LiveDemo.tsx         # Interactive AI demo (Main showcase)
    │   └── PatientApp.tsx       # Patient interface
    └── src/components/          # Reusable UI components
```

## 🔧 **Technology Stack**

### **Backend**
- **Python 3.11** - Core application runtime
- **Flask** - Web framework with CORS support
- **Gunicorn** - Production WSGI server
- **TiDB Serverless** - Primary database (MySQL-compatible)
- **OpenAI GPT-4o-mini** - AI processing (ready for integration)

### **Frontend**  
- **React 18** - Modern UI framework with TypeScript
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization components
- **Framer Motion** - Smooth animations
- **Nginx** - Production web server

### **Infrastructure**
- **Docker & Docker Compose** - Containerization
- **TiDB Serverless** - Cloud database with global distribution
- **Vector Search** - Advanced similarity matching
- **Production-ready** - Health checks, logging, monitoring

## 🎯 **Current Demo Features**

### ✅ **Working Now**
- **TiDB Integration** - Real cloud database connection
- **Patient Management** - Demo patient with medical history
- **Behavioral Analysis** - Pattern deviation detection
- **Crisis Scenarios** - Emergency response simulation  
- **Medical Knowledge** - 1000+ medical research entries
- **Real-time Dashboard** - Live monitoring interface
- **API Endpoints** - Complete REST API

### 🔬 **AI Agent Capabilities**
- **Pattern Recognition** - Behavioral baseline comparison
- **Risk Scoring** - 0.0-1.0 risk assessment scale
- **Intervention Triggers** - Automated alert generation
- **Care Coordination** - Multi-stakeholder communication
- **Medical Insights** - Literature-backed recommendations

## 🔒 **Security & Production Features**

- ✅ **Container Security** - Non-root user execution
- ✅ **Network Isolation** - Docker network segregation  
- ✅ **Environment Variables** - Secure configuration management
- ✅ **Health Checks** - Container health monitoring
- ✅ **Resource Limits** - Memory and CPU constraints
- ✅ **TiDB SSL** - Encrypted database connections

## 📊 **Database Schema**

### **TiDB Tables**
- `patients` - Patient profiles with JSON baseline patterns
- `medical_knowledge` - Research literature with full-text search
- `interventions` - AI processing history and outcomes  
- `behavioral_patterns` - Time-series pattern analysis
- `family_communications` - Care coordination messages
- `crisis_predictions` - Risk assessments and predictions

### **TiDB Features Used**
- **Vector Search** - `VEC_COSINE_DISTANCE()` for pattern similarity
- **JSON Storage** - Flexible patient data modeling
- **Full-text Search** - `MATCH() AGAINST()` for knowledge retrieval
- **Serverless Scaling** - Automatic capacity management

## 🏆 **Hackathon Highlights**

### **TiDB Integration Excellence**
- ✅ **Real TiDB Serverless** - Not local database simulation
- ✅ **Advanced Features** - Vector search, JSON, full-text search
- ✅ **Production Scale** - Cloud-native architecture
- ✅ **Complex Queries** - Multi-table joins and aggregations

### **AI & Healthcare Innovation**
- ✅ **Multi-Agent System** - Coordinated AI processing
- ✅ **Real-world Application** - Neurodegenerative care focus
- ✅ **Scalable Design** - Production-ready architecture
- ✅ **Demo Excellence** - Interactive scenarios and dashboards

## 🚨 **Troubleshooting**

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart

# Full rebuild
docker-compose down
docker-compose up --build -d

# Test API manually
curl http://localhost:5001/health
```

## 📞 **Support**

For issues or questions:
- Check container logs: `docker-compose logs`
- Verify TiDB connection in logs
- Ensure ports 3000 and 5001 are available
- Review `TIDB_DEPLOYMENT.md` for detailed setup

---

## 🎉 **SynapseGuard is Production-Ready!**

This system demonstrates advanced TiDB integration with real-world healthcare AI applications. The multi-agent architecture, combined with TiDB Serverless capabilities, creates a scalable, cloud-native solution for neurodegenerative care management.

**Built for TiDB AgentX Hackathon 2025** 🏆