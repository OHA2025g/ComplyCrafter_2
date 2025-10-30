# 🚀 Deployment Architecture
## ComplyCrafter - Infrastructure & Deployment

**Version:** 1.0  
**Date:** October 31, 2025  
**Environment:** Docker-based

---

## 🐳 Current Deployment (Docker Compose)

```mermaid
graph TB
    subgraph "Host Machine"
        DOCKER_ENGINE[Docker Engine]
        
        subgraph "Docker Containers"
            FRONTEND_C[frontend-1<br/>Node:20-slim<br/>Port 4200]
            GATEWAY_C[gateway-1<br/>Python:3.11-slim<br/>Port 8000]
            FORMS_C[forms-1<br/>Python:3.11-slim<br/>Port 8100]
            DB_C[db-1<br/>postgres:15<br/>Port 5432]
        end

        subgraph "Docker Network"
            BRIDGE[Bridge Network<br/>Internal Communication]
        end

        subgraph "Volumes"
            DB_VOL[/var/lib/postgresql/data<br/>Database Persistence]
            FRONTEND_VOL[/usr/src/app<br/>Frontend Code]
            FORMS_VOL[/app<br/>Forms Code]
            LIBS_VOL[/app/libs<br/>Shared Libraries]
        end

        COMPOSE[docker-compose.yml<br/>Orchestration]
    end

    USERS[Users<br/>Browser] -->|http://localhost:4200| FRONTEND_C
    
    FRONTEND_C -->|API Calls| GATEWAY_C
    GATEWAY_C -->|Proxy| FORMS_C
    FORMS_C -->|SQL| DB_C
    
    DOCKER_ENGINE --> FRONTEND_C & GATEWAY_C & FORMS_C & DB_C
    BRIDGE -.->|Connects| FRONTEND_C & GATEWAY_C & FORMS_C & DB_C
    
    DB_VOL -.->|Persist| DB_C
    FRONTEND_VOL -.->|Mount| FRONTEND_C
    FORMS_VOL -.->|Mount| FORMS_C
    LIBS_VOL -.->|Mount| FORMS_C & GATEWAY_C
    
    COMPOSE -.->|Manages| DOCKER_ENGINE

    style FRONTEND_C fill:#6366f1,color:#fff
    style FORMS_C fill:#8b5cf6,color:#fff
    style DB_C fill:#336791,color:#fff
    style GATEWAY_C fill:#10b981,color:#fff
```

---

## ☁️ Production Deployment (Kubernetes)

```mermaid
graph TB
    subgraph "Cloud Provider AWS/Azure/GCP"
        LB[Load Balancer<br/>SSL Termination]
        
        subgraph "Kubernetes Cluster"
            subgraph "Frontend Namespace"
                FE_DEPLOY[Frontend Deployment<br/>Replicas: 2-4]
                FE_POD1[Pod 1]
                FE_POD2[Pod 2]
                FE_SVC[Frontend Service<br/>ClusterIP]
            end

            subgraph "Backend Namespace"
                GATEWAY_DEPLOY[Gateway Deployment<br/>Replicas: 2-4]
                FORMS_DEPLOY[Forms Deployment<br/>Replicas: 2-8]
                BACKEND_SVC[Backend Services<br/>ClusterIP]
            end

            subgraph "Data Namespace"
                DB_STATEFUL[PostgreSQL StatefulSet<br/>Replicas: 1-3]
                REDIS_DEPLOY[Redis Deployment]
                PVC[Persistent Volume Claims]
            end

            subgraph "Monitoring Namespace"
                PROMETHEUS[Prometheus]
                GRAFANA[Grafana]
                LOKI[Loki Logs]
            end

            INGRESS[Ingress Controller<br/>Nginx/Traefik]
        end

        CDN[CDN<br/>CloudFront/Cloudflare]
    end

    USERS[Users] -->|HTTPS| CDN
    CDN --> LB
    LB --> INGRESS
    
    INGRESS --> FE_SVC
    INGRESS --> BACKEND_SVC
    
    FE_DEPLOY --> FE_POD1 & FE_POD2
    FE_SVC -.->|Route| FE_POD1 & FE_POD2
    
    GATEWAY_DEPLOY & FORMS_DEPLOY --> BACKEND_SVC
    
    BACKEND_SVC --> DB_STATEFUL
    BACKEND_SVC --> REDIS_DEPLOY
    
    DB_STATEFUL --> PVC
    
    FE_POD1 & FE_POD2 -.->|Metrics| PROMETHEUS
    GATEWAY_DEPLOY & FORMS_DEPLOY -.->|Metrics| PROMETHEUS
    PROMETHEUS --> GRAFANA
    
    FE_POD1 & FE_POD2 -.->|Logs| LOKI
    GATEWAY_DEPLOY & FORMS_DEPLOY -.->|Logs| LOKI

    style LB fill:#f59e0b,color:#fff
    style FE_SVC fill:#6366f1,color:#fff
    style BACKEND_SVC fill:#8b5cf6,color:#fff
    style DB_STATEFUL fill:#336791,color:#fff
```

---

## 📦 Container Build Pipeline

```mermaid
graph LR
    subgraph "Source Code"
        GIT[Git Repository<br/>GitHub/GitLab]
    end

    subgraph "CI/CD Pipeline"
        TRIGGER[Push/PR Trigger]
        BUILD[Docker Build<br/>Multi-stage]
        TEST[Run Tests<br/>Unit + Integration]
        SCAN[Security Scan<br/>Trivy/Snyk]
        PUSH[Push to Registry<br/>Docker Hub/ECR]
    end

    subgraph "Container Registry"
        FE_IMG[Frontend Image<br/>Tag: latest, v1.0]
        BE_IMG[Backend Image<br/>Tag: latest, v1.0]
    end

    subgraph "Deployment"
        STAGING[Staging Environment]
        PROD[Production Environment]
    end

    GIT --> TRIGGER
    TRIGGER --> BUILD
    BUILD --> TEST
    TEST -->|Pass| SCAN
    SCAN -->|No Vulnerabilities| PUSH
    
    PUSH --> FE_IMG & BE_IMG
    
    FE_IMG & BE_IMG -->|Auto Deploy| STAGING
    FE_IMG & BE_IMG -->|Manual Approve| PROD

    TEST -->|Fail| REJECT[Reject Build]
    SCAN -->|Vulnerabilities| REJECT

    style BUILD fill:#6366f1,color:#fff
    style TEST fill:#10b981,color:#fff
    style PROD fill:#22c55e,color:#fff
    style REJECT fill:#dc2626,color:#fff
```

---

## 🌐 Multi-Environment Strategy

```mermaid
graph TB
    subgraph "Development"
        DEV[Development Environment<br/>Local Docker]
        DEV_DB[(Dev Database<br/>Seed Data)]
    end

    subgraph "Staging"
        STAGE[Staging Environment<br/>Cloud Kubernetes]
        STAGE_DB[(Staging Database<br/>Production-like Data)]
    end

    subgraph "Production"
        PROD[Production Environment<br/>Cloud Kubernetes + HA]
        PROD_DB[(Production Database<br/>Real Data + Backups)]
    end

    CODE[Code Changes]

    CODE --> DEV
    DEV -->|Tests Pass| STAGE
    STAGE -->|UAT Pass| PROD

    DEV --> DEV_DB
    STAGE --> STAGE_DB
    PROD --> PROD_DB

    DEV_DB -.->|Anonymized Copy| STAGE_DB
    STAGE_DB -.->|No Direct Copy| PROD_DB

    style DEV fill:#60a5fa,color:#fff
    style STAGE fill:#f59e0b,color:#fff
    style PROD fill:#22c55e,color:#fff
```

---

## 🔄 Deployment Strategies

```mermaid
graph LR
    subgraph "Blue-Green Deployment"
        BLUE[Blue Environment<br/>Current Version]
        GREEN[Green Environment<br/>New Version]
        SWITCH[Traffic Switch<br/>Load Balancer]
    end

    subgraph "Rolling Update"
        POD1[Pod 1<br/>Old Version]
        POD2[Pod 2<br/>Old Version]
        UPDATE[Update Process]
        POD1_NEW[Pod 1<br/>New Version]
        POD2_NEW[Pod 2<br/>New Version]
    end

    subgraph "Canary Deployment"
        V1[Version 1<br/>90% Traffic]
        V2[Version 2<br/>10% Traffic]
        MONITOR[Monitor Metrics]
    end

    USERS1[Users] --> SWITCH
    SWITCH -->|100% Traffic| BLUE
    SWITCH -.->|Switch| GREEN
    
    POD1 --> UPDATE
    UPDATE --> POD1_NEW
    POD1_NEW --> POD2
    POD2 --> UPDATE
    UPDATE --> POD2_NEW
    
    USERS2[Users] -->|Split| V1 & V2
    V2 --> MONITOR
    MONITOR -->|Success| FULL[100% V2]
    MONITOR -->|Failure| ROLLBACK[Rollback to V1]

    style BLUE fill:#60a5fa,color:#fff
    style GREEN fill:#22c55e,color:#fff
    style V2 fill:#f59e0b,color:#fff
```

---

## 💾 Backup & Disaster Recovery

```mermaid
graph TB
    subgraph "Production Database"
        PROD_DB[(Primary Database)]
    end

    subgraph "Backup Strategy"
        DAILY[Daily Full Backup<br/>2 AM UTC]
        HOURLY[Hourly Incremental<br/>Every Hour]
        CONTINUOUS[Continuous WAL Archiving<br/>Real-time]
    end

    subgraph "Backup Storage"
        S3_PRIMARY[S3 Primary Region<br/>30 days retention]
        S3_SECONDARY[S3 Secondary Region<br/>90 days retention]
        GLACIER[Glacier<br/>1 year retention]
    end

    subgraph "Recovery"
        PITR[Point-in-Time Recovery<br/>Any point in 30 days]
        FAILOVER[Automated Failover<br/>Read Replica Promotion]
    end

    PROD_DB --> DAILY & HOURLY & CONTINUOUS
    
    DAILY --> S3_PRIMARY
    HOURLY --> S3_PRIMARY
    CONTINUOUS --> S3_PRIMARY
    
    S3_PRIMARY -->|Replicate| S3_SECONDARY
    S3_SECONDARY -->|Archive| GLACIER
    
    S3_PRIMARY --> PITR
    PROD_DB -.->|Failure| FAILOVER

    style PROD_DB fill:#336791,color:#fff
    style S3_PRIMARY fill:#10b981,color:#fff
    style PITR fill:#6366f1,color:#fff
```

---

## 📈 Auto-Scaling Configuration

```mermaid
graph TB
    subgraph "Metrics Collection"
        CPU_METRIC[CPU Usage]
        MEM_METRIC[Memory Usage]
        REQ_METRIC[Request Rate]
        RESP_METRIC[Response Time]
    end

    subgraph "Scaling Rules"
        SCALE_UP[Scale Up Trigger<br/>CPU > 70% or Req > 1000/min]
        SCALE_DOWN[Scale Down Trigger<br/>CPU < 30% for 10min]
    end

    subgraph "Actions"
        ADD_POD[Add Pod<br/>+1 Instance]
        REMOVE_POD[Remove Pod<br/>-1 Instance]
    end

    subgraph "Limits"
        MIN[Minimum: 2 Instances]
        MAX[Maximum: 10 Instances]
    end

    CPU_METRIC & REQ_METRIC --> SCALE_UP
    CPU_METRIC & MEM_METRIC --> SCALE_DOWN
    
    SCALE_UP -->|If < Max| ADD_POD
    SCALE_DOWN -->|If > Min| REMOVE_POD
    
    ADD_POD -.->|Constrained By| MAX
    REMOVE_POD -.->|Constrained By| MIN

    style SCALE_UP fill:#22c55e,color:#fff
    style SCALE_DOWN fill:#f59e0b,color:#fff
    style ADD_POD fill:#6366f1,color:#fff
```

---

## ✅ Deployment Checklist

### **Pre-Deployment**
- [ ] All tests passing
- [ ] Security scan complete
- [ ] Performance benchmarks met
- [ ] Backup created
- [ ] Rollback plan ready

### **Deployment**
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] UAT approval
- [ ] Deploy to production
- [ ] Monitor for 24 hours

### **Post-Deployment**
- [ ] Verify all services
- [ ] Check logs
- [ ] Monitor metrics
- [ ] User feedback
- [ ] Documentation updated

---

**Version:** 1.0  
**Infrastructure:** Docker + Kubernetes  
**Status:** ✅ Ready for Production

