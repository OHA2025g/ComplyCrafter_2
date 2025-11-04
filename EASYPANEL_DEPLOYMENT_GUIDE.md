# 🚀 EasyPanel Deployment Guide for ComplyCrafter

Complete step-by-step guide to deploy ComplyCrafter on EasyPanel with 3 separate services:
- **Frontend**: `menindata.org`
- **Backend**: `api.menindata.org`
- **Database**: Internal service

---

## 📋 Prerequisites

1. **Hostinger VPS** with:
   - Ubuntu 20.04+ or Debian 11+
   - Minimum 4 GB RAM (8 GB recommended)
   - Root or sudo access
   - Domain names configured: `menindata.org` and `api.menindata.org`

2. **EasyPanel** installed on your VPS
   - Installation: `curl -fsSL https://easypanel.io/install.sh | sh`
   - Access: `http://your-vps-ip:3000`

---

## 🎯 Step-by-Step Deployment

### Step 1: Install and Access EasyPanel

#### 1.1 Install EasyPanel
```bash
# SSH into your VPS
ssh root@your-vps-ip

# Install EasyPanel
curl -fsSL https://easypanel.io/install.sh | sh

# Follow the installation prompts
# Note: You'll be asked to create an admin account
```

#### 1.2 Access EasyPanel Dashboard
1. Open your browser: `http://your-vps-ip:3000`
2. Login with your admin credentials
3. You'll see the EasyPanel dashboard

---

### Step 2: Prepare Your Code

#### 2.1 Upload Code to VPS

**Option A: Using Git (Recommended)**
```bash
# On your VPS
cd /opt
git clone https://your-repository-url.git complycrafter
cd complycrafter
```

**Option B: Using SCP (from local machine)**
```bash
# Compress project (excluding node_modules, .git, etc.)
tar -czf complycrafter.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=__pycache__ \
  --exclude=*.pyc \
  .

# Upload to VPS
scp complycrafter.tar.gz root@your-vps-ip:/opt/

# Extract on VPS
ssh root@your-vps-ip
cd /opt
tar -xzf complycrafter.tar.gz
mv Comply-Crafter-code complycrafter
```

---

### Step 3: Deploy Database Service

#### 3.1 Create Database Project in EasyPanel

1. **Click "New Project"** in EasyPanel dashboard
2. **Name**: `complycrafter-database`
3. **Click "Create"**

#### 3.2 Add PostgreSQL Service

1. **Click "Add Service"** in your project
2. **Select "PostgreSQL"** from the list
3. **Configure**:
   - **Name**: `db`
   - **Version**: `15` (or latest)
   - **Database**: `comply`
   - **Username**: `comply`
   - **Password**: `YOUR_SECURE_PASSWORD` (save this!)
   - **Port**: `5432` (internal only, don't expose publicly)
4. **Click "Deploy"**

#### 3.3 Note Database Connection Details

After deployment, note:
- **Internal Hostname**: `complycrafter-database-db` (or similar)
- **Port**: `5432`
- **Database**: `comply`
- **Username**: `comply`
- **Password**: (the one you set)

---

### Step 4: Deploy Backend Service

#### 4.1 Create Backend Project

1. **Click "New Project"** (or use existing)
2. **Name**: `complycrafter-backend`
3. **Click "Create"**

#### 4.2 Add Forms API Service

1. **Click "Add Service"**
2. **Select "Docker"** or **"App"** → **"Docker Compose"**
3. **Configure**:

**If using Docker Compose option:**
- **Name**: `forms-api`
- **Docker Compose File**: Upload or paste content from `docker-compose.backend.yml`
- **Or use "Custom Dockerfile"** option

**If using Docker option:**
- **Name**: `forms-api`
- **Dockerfile Path**: `services/forms/Dockerfile`
- **Build Context**: `/opt/complycrafter` (or your project path)
- **Port**: `8100`

4. **Environment Variables** (add these):
   ```
   DATABASE_URL=postgresql+asyncpg://comply:YOUR_PASSWORD@complycrafter-database-db:5432/comply
   PYTHONPATH=/app:/app/libs
   ENVIRONMENT=production
   REDIS_URL=redis://redis:6379
   CORS_ORIGINS=https://menindata.org,https://www.menindata.org,http://localhost:4200
   ```

5. **Domain Configuration**:
   - **Domain**: `api.menindata.org`
   - **Path**: `/` (or leave empty)
   - **Port**: `8100`

6. **Click "Deploy"**

#### 4.3 Add Gateway Service (Optional, or combine with Forms)

1. **Click "Add Service"** in same project
2. **Select "Docker"**
3. **Configure**:
   - **Name**: `gateway`
   - **Dockerfile Path**: `services/gateway/Dockerfile`
   - **Build Context**: `/opt/complycrafter`
   - **Port**: `8000`
   - **Environment Variables**:
     ```
     DATABASE_URL=postgresql+asyncpg://comply:YOUR_PASSWORD@complycrafter-database-db:5432/comply
     AUTH_ISSUER=http://keycloak:8080/realms/comply
     FORMS_BASE_URL=http://forms-api:8100
     PYTHONPATH=/app:/app/libs
     ENVIRONMENT=production
     CORS_ORIGINS=https://menindata.org,https://www.menindata.org,http://localhost:4200
     ```

#### 4.4 Add Redis Service (Optional but Recommended)

1. **Click "Add Service"**
2. **Select "Redis"**
3. **Configure**:
   - **Name**: `redis`
   - **Version**: `7-alpine`
   - **Port**: `6379` (internal)
4. **Click "Deploy"**

---

### Step 5: Deploy Frontend Service

#### 5.1 Create Frontend Project

1. **Click "New Project"**
2. **Name**: `complycrafter-frontend`
3. **Click "Create"**

#### 5.2 Add Frontend Service

1. **Click "Add Service"**
2. **Select "Docker"** or **"App"**
3. **Configure**:

**Using Docker option:**
- **Name**: `frontend`
- **Dockerfile Path**: `frontend/Dockerfile.prod`
- **Build Context**: `/opt/complycrafter/frontend`
- **Port**: `80`

**Environment Variables**:
```
API_URL=https://api.menindata.org
FRONTEND_URL=https://menindata.org
```

4. **Domain Configuration**:
   - **Domain**: `menindata.org`
   - **Additional Domains**: `www.menindata.org`
   - **Path**: `/`
   - **Port**: `80`

5. **Click "Deploy"**

---

### Step 6: Configure DNS

#### 6.1 Point Domains to Your VPS

In your domain registrar's DNS settings:

**For `menindata.org`**:
```
A Record: menindata.org -> YOUR_VPS_IP
A Record: www.menindata.org -> YOUR_VPS_IP
```

**For `api.menindata.org`**:
```
A Record: api.menindata.org -> YOUR_VPS_IP
```

#### 6.2 Verify DNS Propagation
```bash
# Check DNS resolution
nslookup menindata.org
nslookup api.menindata.org

# Should return your VPS IP
```

---

### Step 7: Configure SSL Certificates

EasyPanel can automatically handle SSL certificates via Let's Encrypt:

#### 7.1 Enable SSL in EasyPanel

1. Go to your **Frontend Service** → **Settings** → **SSL**
2. **Enable "Let's Encrypt"**
3. **Add domains**:
   - `menindata.org`
   - `www.menindata.org`
4. **Click "Save"** (EasyPanel will automatically get certificates)

#### 7.2 Enable SSL for Backend

1. Go to your **Backend Service** → **Settings** → **SSL**
2. **Enable "Let's Encrypt"**
3. **Add domain**:
   - `api.menindata.org`
4. **Click "Save"**

---

### Step 8: Configure Service Connections

#### 8.1 Update Backend Database Connection

After database is deployed, update backend environment variables:

1. Go to **Backend Service** → **Environment Variables**
2. Update `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql+asyncpg://comply:YOUR_PASSWORD@complycrafter-database-db:5432/comply
   ```
   Note: Use the internal service name from EasyPanel (usually `project-service-name`)

3. **Restart** the service

#### 8.2 Verify Service Communication

EasyPanel services in the same project can communicate using service names. Check EasyPanel's service discovery for exact names.

---

## 🔧 EasyPanel-Specific Configuration

### Using Docker Compose in EasyPanel

If EasyPanel supports Docker Compose:

1. **Create New Project**: `complycrafter-full`
2. **Add Service** → **Docker Compose**
3. **Upload** `docker-compose.prod.yml` or paste content
4. **Update environment variables** in EasyPanel UI
5. **Deploy**

### Environment Variables in EasyPanel

EasyPanel allows you to set environment variables per service:

**For Backend Services:**
```
CORS_ORIGINS=https://menindata.org,https://www.menindata.org
DATABASE_URL=postgresql+asyncpg://comply:PASSWORD@db:5432/comply
ENVIRONMENT=production
```

**For Frontend:**
```
API_URL=https://api.menindata.org
FRONTEND_URL=https://menindata.org
```

---

## 📊 Monitoring and Management

### View Service Logs

1. Go to your **Service** in EasyPanel
2. Click **"Logs"** tab
3. View real-time logs

### Check Service Status

1. Dashboard shows service status (Running/Stopped)
2. Click on service to see details
3. Check health endpoints:
   - Frontend: `https://menindata.org/health`
   - Backend: `https://api.menindata.org/healthz`

### Restart Services

1. Go to service → **Actions** → **Restart**
2. Or use terminal: `docker restart service-name`

---

## 🔄 Updating Services

### Update Frontend

1. **Push code changes** to your repository
2. **Pull on VPS**: `cd /opt/complycrafter && git pull`
3. In EasyPanel: **Service** → **Actions** → **Rebuild**
4. **Deploy**

### Update Backend

1. **Pull latest code**
2. In EasyPanel: **Service** → **Actions** → **Rebuild**
3. **Deploy**
4. Services will automatically restart

### Update Database

⚠️ **Warning**: Always backup first!

1. **Backup Database**:
   ```bash
   docker exec complycrafter-database-db pg_dump -U comply comply > backup.sql
   ```
2. Update database service in EasyPanel
3. Restore if needed

---

## 🐛 Troubleshooting

### Service Won't Start

1. **Check Logs** in EasyPanel
2. **Verify Environment Variables** are set correctly
3. **Check Port Conflicts**: Ensure ports aren't already in use
4. **Check Resource Limits**: Ensure VPS has enough RAM/CPU

### CORS Errors

1. **Verify CORS_ORIGINS** includes your domain:
   ```
   CORS_ORIGINS=https://menindata.org,https://www.menindata.org
   ```
2. **Restart Backend Services**
3. **Check Browser Console** for exact error

### Database Connection Failed

1. **Verify Database Service Name** in EasyPanel
2. **Check DATABASE_URL** format:
   ```
   postgresql+asyncpg://username:password@service-name:5432/database
   ```
3. **Test Connection**:
   ```bash
   docker exec -it backend-service-name python -c "from app.core.database import engine; print('OK')"
   ```

### Domain Not Working

1. **Check DNS** propagation (can take up to 48 hours)
2. **Verify Domain** in EasyPanel service settings
3. **Check SSL Certificate** status
4. **Check Nginx/Proxy** configuration in EasyPanel

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Database service is running
- [ ] Backend services (Forms + Gateway) are running
- [ ] Frontend service is running
- [ ] `https://menindata.org` loads frontend
- [ ] `https://api.menindata.org/healthz` returns OK
- [ ] CORS headers are correct (check browser Network tab)
- [ ] SSL certificates are active (green lock in browser)
- [ ] Frontend can make API calls to backend
- [ ] Login functionality works

---

## 📝 Quick Reference

### Service URLs
- **Frontend**: `https://menindata.org`
- **Backend API**: `https://api.menindata.org`
- **API Docs**: `https://api.menindata.org/docs`
- **Health Check**: `https://api.menindata.org/healthz`

### Important Files
- `docker-compose.prod.yml` - Full stack
- `docker-compose.frontend.yml` - Frontend only
- `docker-compose.backend.yml` - Backend only
- `docker-compose.database.yml` - Database only

### Environment Variables Summary
```bash
# Database
POSTGRES_USER=comply
POSTGRES_PASSWORD=YOUR_PASSWORD
POSTGRES_DB=comply

# Backend
DATABASE_URL=postgresql+asyncpg://comply:PASSWORD@db:5432/comply
CORS_ORIGINS=https://menindata.org,https://www.menindata.org
ENVIRONMENT=production

# Frontend
API_URL=https://api.menindata.org
FRONTEND_URL=https://menindata.org
```

---

## 🎉 Success!

Your ComplyCrafter application should now be live at:
- **Frontend**: https://menindata.org
- **Backend**: https://api.menindata.org

All services are running on EasyPanel and can be managed through the dashboard! 🚀

---

## 📞 Additional Resources

- **EasyPanel Docs**: https://easypanel.io/docs
- **Docker Documentation**: https://docs.docker.com
- **Project Documentation**: See `docs/` directory

Need help? Check the troubleshooting section or review EasyPanel logs!
