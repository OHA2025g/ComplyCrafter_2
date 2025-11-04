# 🚀 ComplyCrafter Deployment Setup for menindata.org

This guide explains how to deploy ComplyCrafter with 3 separate services:
- **Frontend**: `menindata.org`
- **Backend**: `api.menindata.org`
- **Database**: Internal service

## 📋 Service Architecture

### Frontend Service (`menindata.org`)
- **Domain**: `menindata.org` and `www.menindata.org`
- **Port**: 80 (HTTP) / 443 (HTTPS)
- **Technology**: Angular + Nginx
- **Docker Compose**: `docker-compose.frontend.yml`

### Backend Service (`api.menindata.org`)
- **Domain**: `api.menindata.org`
- **Ports**: 
  - Forms API: 8100
  - Gateway: 8000
- **Technology**: FastAPI (Python)
- **Docker Compose**: `docker-compose.backend.yml`

### Database Service
- **Internal Only**: Not exposed publicly
- **Port**: 5432 (internal only)
- **Technology**: PostgreSQL 15
- **Docker Compose**: `docker-compose.database.yml`

---

## 🔧 Configuration Files

### 1. CORS Configuration

**Backend Services** (`services/forms/app/main.py` and `services/gateway/app/main.py`):
- Configured to allow requests from `https://menindata.org` and `https://www.menindata.org`
- CORS origins can be set via `CORS_ORIGINS` environment variable

**Default CORS Origins**:
```
https://menindata.org
https://www.menindata.org
http://localhost:4200 (for development)
http://localhost:3000 (for development)
```

### 2. Frontend Environment

**Production** (`frontend/apps/portal/src/environments/environment.prod.ts`):
```typescript
apiUrl: 'https://api.menindata.org'
gatewayUrl: 'https://api.menindata.org'
frontendUrl: 'https://menindata.org'
```

**Development** (`frontend/apps/portal/src/environments/environment.ts`):
```typescript
apiUrl: 'http://localhost:8100'
gatewayUrl: 'http://localhost:8000'
frontendUrl: 'http://localhost:4200'
```

### 3. Nginx Configuration

**Frontend** (`frontend/nginx.conf`):
- Server name: `menindata.org` and `www.menindata.org`
- Configured for SPA routing
- Static asset caching enabled

---

## 🚀 Deployment Steps

### Step 1: Deploy Database Service

```bash
cd /path/to/complycrafter
docker compose -f docker-compose.database.yml up -d
```

**Environment Variables** (`.env`):
```bash
POSTGRES_USER=comply
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD
POSTGRES_DB=comply
DB_PORT=5432
```

### Step 2: Deploy Backend Service

```bash
cd /path/to/complycrafter
docker compose -f docker-compose.backend.yml up -d
```

**Environment Variables** (`.env`):
```bash
# Database connection (use internal hostname or IP)
DB_HOST=your-database-host-or-ip
POSTGRES_USER=comply
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD
POSTGRES_DB=comply

# Backend ports
FORMS_PORT=8100
GATEWAY_PORT=8000
REDIS_PORT=6379

# CORS configuration
CORS_ORIGINS=https://menindata.org,https://www.menindata.org,http://localhost:4200

# Other settings
ENVIRONMENT=production
AUTH_ISSUER=http://keycloak:8080/realms/comply
FORMS_BASE_URL=http://forms:8100
```

### Step 3: Deploy Frontend Service

```bash
cd /path/to/complycrafter
docker compose -f docker-compose.frontend.yml up -d
```

**Environment Variables** (`.env`):
```bash
FRONTEND_PORT=80
API_URL=https://api.menindata.org
FRONTEND_URL=https://menindata.org
```

---

## 🌐 DNS Configuration

### Frontend Domain (`menindata.org`)
```
A Record: menindata.org -> YOUR_VPS_IP
A Record: www.menindata.org -> YOUR_VPS_IP
```

### Backend Domain (`api.menindata.org`)
```
A Record: api.menindata.org -> YOUR_VPS_IP
```

---

## 🔒 SSL/TLS Setup

### Option 1: Using Nginx Reverse Proxy (Recommended)

Create Nginx configuration for both domains:

**Frontend** (`/etc/nginx/sites-available/menindata.org`):
```nginx
server {
    listen 80;
    server_name menindata.org www.menindata.org;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Backend** (`/etc/nginx/sites-available/api.menindata.org`):
```nginx
server {
    listen 80;
    server_name api.menindata.org;
    
    location / {
        proxy_pass http://localhost:8100;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API Gateway on port 8000
    location /gateway/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable SSL**:
```bash
# Enable sites
ln -s /etc/nginx/sites-available/menindata.org /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/api.menindata.org /etc/nginx/sites-enabled/

# Get SSL certificates
certbot --nginx -d menindata.org -d www.menindata.org
certbot --nginx -d api.menindata.org

# Test and reload
nginx -t
systemctl reload nginx
```

### Option 2: Using EasyPanel SSL

If using EasyPanel, configure SSL certificates through the dashboard for each service.

---

## ✅ Verification

### 1. Check Frontend
```bash
curl -I https://menindata.org
# Should return HTTP 200
```

### 2. Check Backend API
```bash
curl https://api.menindata.org/healthz
# Should return: {"status":"ok","service":"ComplyCrafter Forms Service"}
```

### 3. Check CORS Headers
```bash
curl -H "Origin: https://menindata.org" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://api.menindata.org/healthz \
     -v
# Should see: Access-Control-Allow-Origin: https://menindata.org
```

---

## 🔄 Updating Services

### Update Frontend Only
```bash
cd /path/to/complycrafter
docker compose -f docker-compose.frontend.yml build frontend
docker compose -f docker-compose.frontend.yml up -d frontend
```

### Update Backend Only
```bash
cd /path/to/complycrafter
docker compose -f docker-compose.backend.yml build forms gateway
docker compose -f docker-compose.backend.yml up -d
```

### Update Database (with caution!)
```bash
# Backup first!
docker compose -f docker-compose.database.yml exec db pg_dump -U comply comply > backup.sql

# Then update
docker compose -f docker-compose.database.yml up -d
```

---

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors in browser console:
1. Check `CORS_ORIGINS` environment variable includes your domain
2. Verify backend services are reading the environment variable
3. Check browser console for exact error message

**Fix**:
```bash
# Update CORS_ORIGINS in .env
CORS_ORIGINS=https://menindata.org,https://www.menindata.org

# Restart backend services
docker compose -f docker-compose.backend.yml restart forms gateway
```

### Frontend Not Connecting to Backend

1. Check API URL in browser Network tab
2. Verify `api.menindata.org` DNS points to correct IP
3. Check backend service is running:
   ```bash
   docker compose -f docker-compose.backend.yml ps
   ```

### Database Connection Issues

If backend can't connect to database:
1. Verify `DB_HOST` environment variable is correct
2. Check database is accessible from backend service
3. Test connection:
   ```bash
   docker compose -f docker-compose.backend.yml exec forms \
     python -c "from app.core.database import engine; print('DB OK')"
   ```

---

## 📊 Service Status

### Check All Services:
```bash
# Frontend
docker compose -f docker-compose.frontend.yml ps

# Backend
docker compose -f docker-compose.backend.yml ps

# Database
docker compose -f docker-compose.database.yml ps
```

### View Logs:
```bash
# Frontend logs
docker compose -f docker-compose.frontend.yml logs -f frontend

# Backend logs
docker compose -f docker-compose.backend.yml logs -f forms gateway

# Database logs
docker compose -f docker-compose.database.yml logs -f db
```

---

## 🔐 Security Notes

1. **Database**: Never expose database port publicly. Keep it internal only.
2. **CORS**: Only allow trusted domains in `CORS_ORIGINS`
3. **SSL**: Always use HTTPS in production
4. **Passwords**: Use strong passwords and store them securely
5. **Firewall**: Configure firewall to only allow necessary ports

---

## 📝 Summary

- **Frontend**: `menindata.org` → Serves Angular app via Nginx
- **Backend**: `api.menindata.org` → FastAPI services (Forms + Gateway)
- **Database**: Internal service → PostgreSQL 15
- **CORS**: Configured to allow `menindata.org` → `api.menindata.org`
- **Environment**: Production API URL set to `https://api.menindata.org`

All services are configured and ready for deployment! 🎉

