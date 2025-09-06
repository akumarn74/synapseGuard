# SynapseGuard Deployment Guide

## 🚀 **Complete Deployment Instructions**

### **Prerequisites Checklist**
- [ ] Docker Engine 20.0+ installed
- [ ] Docker Compose 2.0+ installed  
- [ ] TiDB Serverless account created
- [ ] OpenAI API key (optional)
- [ ] 8GB+ available RAM
- [ ] Ports 3001 and 5001 available

## 📋 **Step-by-Step Deployment**

### **1. Environment Setup**

#### **Clone Repository**
```bash
# Clone the project
git clone https://github.com/your-username/synapseGuard.git
cd synapseGuard

# Verify project structure
ls -la
```

#### **Configure Environment Variables**
```bash
# Copy environment template
cp .env.example .env

# Edit configuration (use your preferred editor)
nano .env
```

**Required Configuration**:
```bash
# TiDB Serverless (Required)
TIDB_HOST=gateway01.us-west-2.prod.aws.tidbcloud.com
TIDB_USER=your-username  
TIDB_PASSWORD=your-password
TIDB_DATABASE=your-database

# OpenAI (Optional - system works with mock responses)
OPENAI_API_KEY=sk-your-openai-api-key

# External Services (Optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
SENDGRID_API_KEY=your-sendgrid-key
```

### **2. TiDB Serverless Setup**

#### **Create TiDB Cloud Account**
1. Visit [TiDB Cloud](https://tidb.cloud)
2. Sign up for free account
3. Create new Serverless Tier cluster
4. Note connection details

#### **Initialize Database Schema**
```bash
# Connect to your TiDB instance and run:
mysql -h your-tidb-host -P 4000 -u your-username -p

# Create database
CREATE DATABASE your_database_name;
USE your_database_name;

# Run schema creation
source database/schema_tidb.sql;

# Insert medical knowledge data
source database/medical_knowledge_inserts.sql;
```

### **3. Docker Deployment**

#### **Single Command Deployment**
```bash
# Build and start all services
docker-compose up -d

# Verify deployment
docker-compose ps
```

**Expected Output**:
```
NAME                     COMMAND                  SERVICE             STATUS              PORTS
synapseguard-backend-1   "/app/entrypoint.sh"     backend             running             0.0.0.0:5001->5000/tcp
synapseguard-frontend-1  "/docker-entrypoint.…"   frontend            running             0.0.0.0:3001->80/tcp
```

#### **Monitor Deployment**
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check service health
curl http://localhost:5001/health
```

### **4. System Verification**

#### **Initialize Demo Data**
```bash
# Setup demo patients and medical knowledge
curl -X POST http://localhost:5001/api/setup/demo

# Expected response:
{
  "success": true,
  "message": "Demo data ready - Both patients created",
  "stats": {
    "patients": 2,
    "knowledge_entries": 1000
  }
}
```

#### **Test AI Processing**
```bash
# Test normal day processing
curl -X POST http://localhost:5001/api/demo/normal \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "margaret_wilson"}'

# Test crisis prevention
curl -X POST http://localhost:5001/api/demo/crisis \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "margaret_wilson"}'
```

#### **Access Web Interface**
- **Frontend Dashboard**: http://localhost:3001
- **API Documentation**: http://localhost:5001/health
- **Patient Demo**: http://localhost:3001/demo

## 🔧 **Development Deployment**

### **Local Development Setup**
```bash
# Backend development
pip install -r requirements.txt
python app_simple.py

# Frontend development (separate terminal)
cd frontend
npm install
npm start

# Development URLs:
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

### **Development vs Production Differences**
| Feature | Development | Production |
|---------|-------------|------------|
| Flask Debug | Enabled | Disabled |
| CORS | Allow All | Restricted |
| Error Messages | Detailed | Generic |
| Logging | Verbose | Structured |
| SSL | Optional | Required |

## 🔒 **Production Hardening**

### **Security Configuration**
```bash
# Update docker-compose.yml for production
version: '3.8'
services:
  backend:
    environment:
      - FLASK_ENV=production
      - FLASK_DEBUG=false
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### **SSL/TLS Setup**
```bash
# Add SSL certificates to docker-compose.yml
volumes:
  - ./ssl/cert.pem:/etc/ssl/certs/cert.pem:ro
  - ./ssl/key.pem:/etc/ssl/private/key.pem:ro

# Update nginx configuration
server {
    listen 443 ssl;
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
}
```

### **Environment Security**
```bash
# Use Docker secrets for sensitive data
echo "your-tidb-password" | docker secret create tidb_password -
echo "your-openai-key" | docker secret create openai_key -
```

## 📊 **Monitoring & Maintenance**

### **Health Monitoring**
```bash
# Create health check script
cat > health_check.sh << 'EOF'
#!/bin/bash
HEALTH=$(curl -s http://localhost:5001/health | jq -r '.status')
if [ "$HEALTH" != "healthy" ]; then
    echo "System unhealthy, restarting..."
    docker-compose restart
fi
EOF

# Schedule with cron (every 5 minutes)
crontab -e
*/5 * * * * /path/to/health_check.sh
```

### **Log Management**
```bash
# Configure log rotation in docker-compose.yml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### **Performance Monitoring**
```bash
# Monitor resource usage
docker stats

# Monitor database connections
docker-compose exec backend python -c "
from app_simple import get_db_connection
conn = get_db_connection()
cursor = conn.cursor()
cursor.execute('SHOW STATUS LIKE \"Threads_connected\"')
print(cursor.fetchall())
"
```

## 🚨 **Troubleshooting Guide**

### **Common Issues & Solutions**

#### **Container Startup Issues**
```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs backend

# Restart specific service
docker-compose restart backend

# Complete rebuild
docker-compose down --volumes
docker-compose up --build -d
```

#### **Database Connection Issues**
```bash
# Test TiDB connection
mysql -h your-tidb-host -P 4000 -u your-username -p

# Check environment variables
docker-compose exec backend env | grep TIDB

# Verify network connectivity
docker-compose exec backend ping your-tidb-host
```

#### **Port Conflicts**
```bash
# Check port usage
netstat -tulnp | grep :5001
netstat -tulnp | grep :3001

# Change ports in docker-compose.yml if needed
ports:
  - "5002:5000"  # Backend
  - "3002:80"    # Frontend
```

#### **Memory Issues**
```bash
# Monitor memory usage
docker stats --no-stream

# Increase memory limits
deploy:
  resources:
    limits:
      memory: 1G
```

### **Debug Mode**
```bash
# Enable debug logging
docker-compose down
export FLASK_ENV=development
export FLASK_DEBUG=true
docker-compose up
```

## ⚡ **Performance Optimization**

### **Database Optimization**
```sql
-- Add indexes for better query performance
CREATE INDEX idx_patient_timestamp ON behavioral_patterns(patient_id, timestamp);
CREATE INDEX idx_intervention_patient ON interventions(patient_id, timestamp);

-- Analyze query performance
EXPLAIN SELECT * FROM behavioral_patterns 
WHERE patient_id = 'margaret_wilson' 
ORDER BY timestamp DESC LIMIT 10;
```

### **Application Scaling**
```bash
# Scale backend services
docker-compose up --scale backend=3

# Use load balancer
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### **Caching Configuration**
```bash
# Add Redis for caching (docker-compose.yml)
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    
  backend:
    depends_on:
      - redis
    environment:
      - REDIS_URL=redis://redis:6379
```

## 🌐 **Cloud Deployment**

### **AWS Deployment**
```bash
# Use AWS ECS with Fargate
aws ecs create-cluster --cluster-name synapseguard
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Deploy with Application Load Balancer
aws elbv2 create-load-balancer --name synapseguard-alb
```

### **Google Cloud Run**
```bash
# Build and push to Container Registry
docker build -t gcr.io/your-project/synapseguard-backend .
docker push gcr.io/your-project/synapseguard-backend

# Deploy to Cloud Run
gcloud run deploy synapseguard \
  --image gcr.io/your-project/synapseguard-backend \
  --platform managed \
  --region us-central1
```

### **Azure Container Instances**
```bash
# Create resource group
az group create --name SynapseGuard --location eastus

# Deploy container group
az container create \
  --resource-group SynapseGuard \
  --name synapseguard \
  --image your-registry/synapseguard:latest \
  --ports 5001
```

## 📞 **Support & Maintenance**

### **Regular Maintenance Tasks**
- Weekly: Review system logs and performance
- Monthly: Update dependencies and security patches  
- Quarterly: Review and optimize database queries
- Annually: Full security audit and penetration testing

### **Backup Strategy**
```bash
# Database backup
mysqldump -h your-tidb-host -P 4000 -u your-username -p your_database > backup.sql

# Container data backup
docker-compose exec backend tar -czf /tmp/data-backup.tar.gz /app/data
docker cp synapseguard-backend-1:/tmp/data-backup.tar.gz ./backups/
```

### **Update Procedure**
```bash
# 1. Backup current system
docker-compose down
cp -r . ../synapseguard-backup

# 2. Pull latest code
git pull origin main

# 3. Update containers
docker-compose pull
docker-compose up --build -d

# 4. Verify deployment
curl http://localhost:5001/health
```

## 📝 **Deployment Checklist**

### **Pre-Deployment**
- [ ] TiDB Serverless cluster created and accessible
- [ ] Environment variables configured
- [ ] SSL certificates obtained (for production)
- [ ] Resource requirements verified
- [ ] Backup strategy implemented

### **Post-Deployment**
- [ ] Health checks passing
- [ ] Demo data initialization successful
- [ ] AI processing endpoints tested
- [ ] Frontend interface accessible
- [ ] Monitoring systems configured
- [ ] Documentation updated

### **Production Readiness**
- [ ] Security hardening completed
- [ ] Performance optimization applied
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery tested
- [ ] Load testing completed
- [ ] Documentation finalized

---

## 🎉 **Deployment Complete!**

Your SynapseGuard multi-agent AI healthcare system is now ready for production use. The system provides:

- ✅ **7-Agent AI Orchestration** - Running and coordinated
- ✅ **TiDB Serverless Integration** - Connected and optimized  
- ✅ **Real-time Processing** - Crisis prevention active
- ✅ **Production Security** - Hardened and monitored
- ✅ **Scalable Architecture** - Ready for growth

**Next Steps**: Create your demo video, test all features, and prepare for hackathon judging!

For ongoing support, monitor logs regularly and refer to the troubleshooting section for common issues.