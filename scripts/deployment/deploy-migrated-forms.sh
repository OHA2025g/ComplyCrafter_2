#!/bin/bash

# Deploy Migrated Forms Script
# This script deploys all migrated forms to the production environment

set -e

echo "🚀 Starting deployment of migrated forms..."

# Configuration
PROJECT_ROOT="/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply-Crafter"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
SERVICES_DIR="$PROJECT_ROOT/services"
BACKUP_DIR="$PROJECT_ROOT/backups/$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root"
fi

# Create backup directory
log "Creating backup directory..."
mkdir -p "$BACKUP_DIR"
success "Backup directory created: $BACKUP_DIR"

# Backup current deployment
log "Creating backup of current deployment..."
if [ -d "$PROJECT_ROOT/deployments" ]; then
    cp -r "$PROJECT_ROOT/deployments" "$BACKUP_DIR/"
    success "Current deployment backed up"
fi

# Install frontend dependencies
log "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
if [ -f "package.json" ]; then
    npm ci --production
    success "Frontend dependencies installed"
else
    warning "No package.json found in frontend directory"
fi

# Build frontend
log "Building frontend application..."
if [ -f "angular.json" ]; then
    npm run build:production
    success "Frontend application built"
else
    warning "No angular.json found, skipping frontend build"
fi

# Install Python dependencies for services
log "Installing Python dependencies for services..."
cd "$SERVICES_DIR"

# Install dependencies for each service
for service in forms compliance billing gateway jobs; do
    if [ -d "$service" ]; then
        log "Installing dependencies for $service service..."
        cd "$service"
        if [ -f "requirements.txt" ]; then
            pip install -r requirements.txt
            success "Dependencies installed for $service service"
        elif [ -f "pyproject.toml" ]; then
            pip install -e .
            success "Dependencies installed for $service service"
        else
            warning "No requirements.txt or pyproject.toml found for $service service"
        fi
        cd ..
    fi
done

# Run database migrations
log "Running database migrations..."
cd "$SERVICES_DIR/forms"
if [ -f "alembic.ini" ]; then
    alembic upgrade head
    success "Database migrations completed"
else
    warning "No alembic.ini found, skipping database migrations"
fi

# Run tests
log "Running test suite..."
cd "$SERVICES_DIR/forms"
if [ -f "pytest.ini" ] || [ -f "pyproject.toml" ]; then
    python -m pytest tests/ -v --tb=short
    success "All tests passed"
else
    warning "No test configuration found, skipping tests"
fi

# Create deployment directory
log "Creating deployment directory..."
DEPLOY_DIR="$PROJECT_ROOT/deployments/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy frontend build
if [ -d "$FRONTEND_DIR/dist" ]; then
    log "Copying frontend build..."
    cp -r "$FRONTEND_DIR/dist" "$DEPLOY_DIR/frontend"
    success "Frontend build copied to deployment directory"
fi

# Copy services
log "Copying services..."
for service in forms compliance billing gateway jobs; do
    if [ -d "$SERVICES_DIR/$service" ]; then
        cp -r "$SERVICES_DIR/$service" "$DEPLOY_DIR/"
        success "Copied $service service"
    fi
done

# Copy configuration files
log "Copying configuration files..."
if [ -d "$PROJECT_ROOT/ops" ]; then
    cp -r "$PROJECT_ROOT/ops" "$DEPLOY_DIR/"
    success "Configuration files copied"
fi

# Create Docker Compose file for deployment
log "Creating Docker Compose configuration..."
cat > "$DEPLOY_DIR/docker-compose.prod.yml" << 'EOF'
version: '3.8'

services:
  # Database
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: complycrafter
      POSTGRES_USER: complycrafter
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U complycrafter"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Forms Service
  forms:
    build: ./forms
    ports:
      - "8001:8000"
    environment:
      - DATABASE_URL=postgresql://complycrafter:${DB_PASSWORD}@postgres:5432/complycrafter
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  # Compliance Service
  compliance:
    build: ./compliance
    ports:
      - "8002:8000"
    environment:
      - DATABASE_URL=postgresql://complycrafter:${DB_PASSWORD}@postgres:5432/complycrafter
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  # Billing Service
  billing:
    build: ./billing
    ports:
      - "8003:8000"
    environment:
      - DATABASE_URL=postgresql://complycrafter:${DB_PASSWORD}@postgres:5432/complycrafter
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  # Gateway Service
  gateway:
    build: ./gateway
    ports:
      - "8000:8000"
    environment:
      - FORMS_SERVICE_URL=http://forms:8000
      - COMPLIANCE_SERVICE_URL=http://compliance:8000
      - BILLING_SERVICE_URL=http://billing:8000
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    depends_on:
      - forms
      - compliance
      - billing
    restart: unless-stopped

  # Jobs Service
  jobs:
    build: ./jobs
    environment:
      - DATABASE_URL=postgresql://complycrafter:${DB_PASSWORD}@postgres:5432/complycrafter
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  # Nginx (Frontend + Reverse Proxy)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./frontend:/usr/share/nginx/html
      - ./ops/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ops/nginx/ssl:/etc/nginx/ssl
    depends_on:
      - gateway
    restart: unless-stopped

volumes:
  postgres_data:
EOF

success "Docker Compose configuration created"

# Create environment file template
log "Creating environment file template..."
cat > "$DEPLOY_DIR/.env.template" << 'EOF'
# Database Configuration
DB_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://complycrafter:your_secure_password_here@localhost:5432/complycrafter

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Service URLs
FORMS_SERVICE_URL=http://localhost:8001
COMPLIANCE_SERVICE_URL=http://localhost:8002
BILLING_SERVICE_URL=http://localhost:8003
GATEWAY_SERVICE_URL=http://localhost:8000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# File Storage
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760  # 10MB

# Logging
LOG_LEVEL=INFO
LOG_FILE=/app/logs/app.log

# Security
CORS_ORIGINS=http://localhost:4200,http://localhost:3000
RATE_LIMIT_PER_MINUTE=100
EOF

success "Environment file template created"

# Create deployment script
log "Creating deployment script..."
cat > "$DEPLOY_DIR/deploy.sh" << 'EOF'
#!/bin/bash

# Production Deployment Script
set -e

echo "🚀 Starting production deployment..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please copy .env.template to .env and configure it."
    exit 1
fi

# Load environment variables
source .env

# Create necessary directories
mkdir -p logs uploads

# Start services
echo "🐳 Starting Docker services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose -f docker-compose.prod.yml ps

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml exec forms alembic upgrade head

# Run tests
echo "🧪 Running tests..."
docker-compose -f docker-compose.prod.yml exec forms python -m pytest tests/ -v

echo "✅ Deployment completed successfully!"
echo "🌐 Application is available at: http://localhost"
echo "📊 API Documentation: http://localhost:8000/docs"
EOF

chmod +x "$DEPLOY_DIR/deploy.sh"
success "Deployment script created"

# Create rollback script
log "Creating rollback script..."
cat > "$DEPLOY_DIR/rollback.sh" << 'EOF'
#!/bin/bash

# Rollback Script
set -e

echo "🔄 Starting rollback..."

# Stop current services
echo "🛑 Stopping current services..."
docker-compose -f docker-compose.prod.yml down

# Restore from backup
if [ -d "../backups" ]; then
    echo "📦 Restoring from backup..."
    LATEST_BACKUP=$(ls -t ../backups | head -n1)
    if [ -n "$LATEST_BACKUP" ]; then
        cp -r "../backups/$LATEST_BACKUP"/* .
        echo "✅ Rollback completed from backup: $LATEST_BACKUP"
    else
        echo "❌ No backup found for rollback"
        exit 1
    fi
else
    echo "❌ No backup directory found"
    exit 1
fi

echo "✅ Rollback completed successfully!"
EOF

chmod +x "$DEPLOY_DIR/rollback.sh"
success "Rollback script created"

# Create health check script
log "Creating health check script..."
cat > "$DEPLOY_DIR/health-check.sh" << 'EOF'
#!/bin/bash

# Health Check Script
set -e

echo "🔍 Performing health checks..."

# Check if services are running
echo "Checking Docker services..."
docker-compose -f docker-compose.prod.yml ps

# Check database connectivity
echo "Checking database connectivity..."
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U complycrafter

# Check API endpoints
echo "Checking API endpoints..."
curl -f http://localhost:8000/health || echo "❌ Gateway service not responding"
curl -f http://localhost:8001/health || echo "❌ Forms service not responding"
curl -f http://localhost:8002/health || echo "❌ Compliance service not responding"
curl -f http://localhost:8003/health || echo "❌ Billing service not responding"

# Check frontend
echo "Checking frontend..."
curl -f http://localhost/ || echo "❌ Frontend not responding"

echo "✅ Health checks completed!"
EOF

chmod +x "$DEPLOY_DIR/health-check.sh"
success "Health check script created"

# Create monitoring script
log "Creating monitoring script..."
cat > "$DEPLOY_DIR/monitor.sh" << 'EOF'
#!/bin/bash

# Monitoring Script
set -e

echo "📊 Starting monitoring..."

# Show service status
echo "=== Service Status ==="
docker-compose -f docker-compose.prod.yml ps

# Show resource usage
echo "=== Resource Usage ==="
docker stats --no-stream

# Show logs
echo "=== Recent Logs ==="
docker-compose -f docker-compose.prod.yml logs --tail=50

# Show disk usage
echo "=== Disk Usage ==="
df -h

echo "✅ Monitoring completed!"
EOF

chmod +x "$DEPLOY_DIR/monitor.sh"
success "Monitoring script created"

# Create README for deployment
log "Creating deployment README..."
cat > "$DEPLOY_DIR/README.md" << 'EOF'
# ComplyCrafter Production Deployment

This directory contains the production deployment of the ComplyCrafter application with all migrated forms.

## Quick Start

1. **Configure Environment**
   ```bash
   cp .env.template .env
   # Edit .env with your configuration
   ```

2. **Deploy Application**
   ```bash
   ./deploy.sh
   ```

3. **Check Health**
   ```bash
   ./health-check.sh
   ```

4. **Monitor Application**
   ```bash
   ./monitor.sh
   ```

## Services

- **Frontend**: Angular application served by Nginx
- **Gateway**: API Gateway (Port 8000)
- **Forms**: Forms service (Port 8001)
- **Compliance**: Compliance service (Port 8002)
- **Billing**: Billing service (Port 8003)
- **Jobs**: Background jobs service
- **Database**: PostgreSQL database

## API Documentation

- Gateway API: http://localhost:8000/docs
- Forms API: http://localhost:8001/docs
- Compliance API: http://localhost:8002/docs
- Billing API: http://localhost:8003/docs

## Management Commands

- **Start Services**: `docker-compose -f docker-compose.prod.yml up -d`
- **Stop Services**: `docker-compose -f docker-compose.prod.yml down`
- **View Logs**: `docker-compose -f docker-compose.prod.yml logs -f`
- **Restart Service**: `docker-compose -f docker-compose.prod.yml restart <service_name>`

## Rollback

If you need to rollback to a previous version:

```bash
./rollback.sh
```

## Troubleshooting

1. **Check service status**: `docker-compose -f docker-compose.prod.yml ps`
2. **View logs**: `docker-compose -f docker-compose.prod.yml logs <service_name>`
3. **Check health**: `./health-check.sh`
4. **Monitor resources**: `./monitor.sh`

## Support

For issues or questions, please contact the development team.
EOF

success "Deployment README created"

# Create symlink to current deployment
log "Creating symlink to current deployment..."
if [ -L "$PROJECT_ROOT/deployments/current" ]; then
    rm "$PROJECT_ROOT/deployments/current"
fi
ln -s "$(basename "$DEPLOY_DIR")" "$PROJECT_ROOT/deployments/current"
success "Symlink created to current deployment"

# Final summary
echo ""
echo "🎉 Deployment preparation completed successfully!"
echo ""
echo "📁 Deployment Directory: $DEPLOY_DIR"
echo "🔗 Current Deployment: $PROJECT_ROOT/deployments/current"
echo "📦 Backup Directory: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. cd $DEPLOY_DIR"
echo "2. cp .env.template .env"
echo "3. Edit .env with your configuration"
echo "4. ./deploy.sh"
echo ""
echo "For monitoring:"
echo "- ./health-check.sh"
echo "- ./monitor.sh"
echo ""
echo "For rollback:"
echo "- ./rollback.sh"
echo ""

success "All migrated forms are ready for production deployment!"
