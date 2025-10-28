# Core Module

Core functionality for the Forms service.

---

## 📁 Structure

```
core/
├── config.py              # Configuration management
├── database.py            # Database connection and session
├── security.py            # Authentication and authorization
├── logging.py             # Logging configuration
└── exceptions.py          # Custom exceptions
```

---

## 🎯 Purpose

- Application configuration
- Database session management
- Security (JWT, OAuth2)
- Logging setup
- Custom exception handlers

---

## 📝 Usage

```python
from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_token
```

