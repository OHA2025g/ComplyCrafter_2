# Feature Modules

This directory contains all feature modules of the application.

---

## 📁 Structure

```
features/
├── auth/                  # Authentication features
│   ├── login/
│   ├── register/
│   └── forgot-password/
│
├── dashboard/             # Dashboard features
│   ├── overview/
│   └── widgets/
│
├── company/               # Company management
│   ├── profile/
│   ├── directors/
│   └── shareholders/
│
├── forms/                 # Form submissions (51 forms)
│   ├── adt1/
│   ├── charge/
│   ├── dir3/
│   └── [... 48 more forms ...]
│
├── documents/             # Document management
│   └── dms/
│
├── compliance/            # Compliance tracking
│   └── tracker/
│
├── reports/               # Reporting
│   └── analytics/
│
└── settings/              # User settings
    └── profile/
```

---

## 🎯 Feature Modules

Each feature module is self-contained with:
- Components
- Services (feature-specific)
- Models
- Routing
- State management (if needed)

---

## 📋 Current Features

| Feature | Components | Status |
|---------|------------|--------|
| **Auth** | 3 | ✅ Active |
| **Dashboard** | 5 | ✅ Active |
| **Company** | 8 | ✅ Active |
| **Forms** | 51 | ✅ Migrated |
| **Documents** | 3 | ✅ Active |
| **Compliance** | 4 | ✅ Active |
| **Reports** | 6 | ✅ Active |
| **Settings** | 4 | ✅ Active |

---

## ✅ Guidelines

- Each feature is lazy-loaded
- Feature modules import SharedModule
- Feature modules never import other features
- Use services for cross-feature communication

