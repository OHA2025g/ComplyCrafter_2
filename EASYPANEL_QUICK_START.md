# ⚡ EasyPanel Quick Start Checklist

Quick reference for deploying ComplyCrafter on EasyPanel.

---

## 🚀 Quick Deployment Steps

### 1️⃣ Install EasyPanel
```bash
ssh root@your-vps-ip
curl -fsSL https://easypanel.io/install.sh | sh
```
Access: `http://your-vps-ip:3000`

---

### 2️⃣ Upload Code
```bash
# On VPS
cd /opt
git clone YOUR_REPO_URL complycrafter
# OR upload via SCP
```

---

### 3️⃣ Create 3 Projects in EasyPanel

#### Project 1: Database
- **Name**: `complycrafter-database`
- **Service**: PostgreSQL
  - Database: `comply`
  - User: `comply`
  - Password: `YOUR_SECURE_PASSWORD`
  - Port: `5432` (internal)
- **Deploy** ✅

#### Project 2: Backend
- **Name**: `complycrafter-backend`
- **Service 1**: Docker (Forms API)
  - Dockerfile: `services/forms/Dockerfile`
  - Build Context: `/opt/complycrafter`
  - Port: `8100`
  - Domain: `api.menindata.org`
  - **Environment Variables**:
    ```
    DATABASE_URL=postgres://comply:be4ebcb019c46ead1a83@complycrafter2_complycrafter-database:5432/comply?sslmode=disable
    CORS_ORIGINS=https://menindata.org,https://www.menindata.org
    ENVIRONMENT=production
    ```
- **Service 2**: Docker (Gateway) - Optional
  - Dockerfile: `services/gateway/Dockerfile`
  - Port: `8000`
- **Deploy** ✅

#### Project 3: Frontend
- **Name**: `complycrafter-frontend`
- **Service**: Docker
  - Dockerfile: `frontend/Dockerfile.prod`
  - Build Context: `/opt/complycrafter/frontend`
  - Port: `80`
  - Domain: `menindata.org` + `www.menindata.org`
  - **Environment Variables**:
    ```
    API_URL=https://api.menindata.org
    FRONTEND_URL=https://menindata.org
    ```
- **Deploy** ✅

---

### 4️⃣ Configure DNS

**Domain Registrar** → DNS Settings:
```
A Record: menindata.org → YOUR_VPS_IP
A Record: www.menindata.org → YOUR_VPS_IP
A Record: api.menindata.org → YOUR_VPS_IP
```

---

### 5️⃣ Enable SSL in EasyPanel

For each service:
1. Service → **Settings** → **SSL**
2. Enable **Let's Encrypt**
3. Add domains
4. Save ✅

---

## ✅ Verification

- [ ] Database running
- [ ] Backend accessible: `https://api.menindata.org/healthz`
- [ ] Frontend accessible: `https://menindata.org`
- [ ] SSL active (green lock)
- [ ] CORS working (check browser console)

---

## 🔧 Common EasyPanel Actions

| Action | How To |
|--------|--------|
| **View Logs** | Service → Logs tab |
| **Restart** | Service → Actions → Restart |
| **Rebuild** | Service → Actions → Rebuild |
| **Update Env Vars** | Service → Environment Variables |
| **Check Status** | Dashboard overview |

---

## 🐛 Quick Fixes

**Service won't start?**
- Check logs in EasyPanel
- Verify environment variables
- Check port conflicts

**CORS errors?**
- Update `CORS_ORIGINS` env var
- Restart backend service

**Database connection failed?**
- Verify service name in `DATABASE_URL`
- Check database is running

---

## 📞 Need Help?

See full guide: `EASYPANEL_DEPLOYMENT_GUIDE.md`

---

**That's it! Your app should be live! 🎉**

