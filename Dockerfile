# Multi-stage build for Python backend
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Development stage
FROM base as development

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy source code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash synapse && \
    chown -R synapse:synapse /app
USER synapse

# Expose port
EXPOSE 5000

# Start development server
CMD ["python", "app/main.py"]

# Production stage
FROM base as production

# Copy requirements
COPY requirements.txt .

# Install production dependencies only
RUN pip install -r requirements.txt

# Copy source code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash synapse && \
    chown -R synapse:synapse /app
USER synapse

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Expose port
EXPOSE 5000

# Start production server with Flask-SocketIO (WebSocket Support)
EXPOSE $PORT
CMD ["python", "app_simple.py"]