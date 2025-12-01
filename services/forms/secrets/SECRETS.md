# Secrets Management Guide

## 🔐 Overview

This document explains how to securely manage OTP/SMS (Mobilogic) credentials using encrypted `.ini` files. The system uses **Fernet symmetric encryption** to protect sensitive credentials.

### Why This Approach?

- ✅ **Credentials are encrypted at rest** (in `.ini` file)
- ✅ **Encryption key is separate** from encrypted data
- ✅ **Production-ready**: Key stored in environment variables
- ✅ **Developer-friendly**: Key can be stored locally (not in git)
- ✅ **Fallback support**: Can still use plain `.env` or environment variables

---

## 🏗️ Architecture

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│  Application Startup                                     │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  1. Load Encryption Key                                 │
│     ├─ Production: MOBILOGIC_ENC_KEY (env var)         │
│     └─ Development: secrets/mobilogic.key (local file) │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  2. Load Encrypted .ini File                           │
│     ├─ Path: MOBILOGIC_INI_PATH (env var)              │
│     └─ Default: secrets/mobilogic_secrets.ini           │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  3. Decrypt Values                                      │
│     └─ Fernet symmetric encryption                      │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  4. Override Settings                                   │
│     └─ Decrypted values override env/.env              │
└─────────────────────────────────────────────────────────┘
```

### Priority Order

The application loads settings in this priority (highest to lowest):

1. **Encrypted `.ini` file** (if key is available)
2. **Environment variables** (e.g., `MOBILOGIC_USERNAME`)
3. **`.env` file** (development only)
4. **Default values** (if any)

---

## 🛠️ Development Setup

### Step 1: Install Dependencies

```bash
cd services/forms
pip install cryptography
```

Or add to `pyproject.toml`:

```toml
[project]
dependencies = [
    "cryptography>=41.0.0",
    # ... other deps
]
```

### Step 2: Generate Encryption Key

Create a local encryption key (this file should **NOT** be committed to git):

```bash
cd services/forms
python -c "from cryptography.fernet import Fernet; from pathlib import Path; key = Fernet.generate_key(); Path('secrets').mkdir(exist_ok=True); Path('secrets/mobilogic.key').write_bytes(key + b'\n'); print('✅ Key generated: secrets/mobilogic.key')"
```

**Important**: The `secrets/` directory should be in `.gitignore`:

```bash
# Add to services/forms/.gitignore
secrets/
```

### Step 3: Create Encrypted .ini File

Create a Python script to encrypt your credentials:

```python
# scripts/encrypt_mobilogic_secrets.py
from cryptography.fernet import Fernet
from pathlib import Path
import configparser

# Load the key
base_dir = Path(__file__).resolve().parent.parent  # services/forms
key_path = base_dir / "secrets" / "mobilogic.key"
key = key_path.read_bytes().strip()
f = Fernet(key)

# Your actual credentials (replace with real values)
credentials = {
    "base_url": "http://vas.mobilogi.com/api.php",
    "username": "your_dev_username",
    "password": "your_dev_password",
    "route": "1",
    "sender": "CSPLTP",
    "default_template_id": "1207175405837058152",
    "named_template_id": "1207175405379469327",
}

# Encrypt and create .ini
config = configparser.ConfigParser()
config["mobilogic"] = {k: f.encrypt(v.encode("utf-8")).decode("utf-8") for k, v in credentials.items()}

secrets_dir = base_dir / "secrets"
secrets_dir.mkdir(exist_ok=True)
ini_path = secrets_dir / "mobilogic_secrets.ini"

with ini_path.open("w", encoding="utf-8") as f_out:
    config.write(f_out)

print(f"✅ Encrypted .ini created: {ini_path}")
```

Run it:

```bash
cd services/forms
python scripts/encrypt_mobilogic_secrets.py
```

### Step 4: Verify Setup

Test that the configuration loads correctly:

```python
from app.core.config import get_settings

settings = get_settings()
print(f"Username: {settings.mobilogic_username}")
print(f"Base URL: {settings.mobilogic_base_url}")
```

If you see your actual values (not errors), the setup is working! ✅

---

## 🏭 Production Setup

### Step 1: Generate Production Encryption Key

**On a secure machine**, generate a production key:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode('utf-8'))"
```

**Save this key securely** (e.g., in a password manager, secrets vault, or secure environment variable store).

### Step 2: Encrypt Production Credentials

Create the encrypted `.ini` file using the production key:

```python
from cryptography.fernet import Fernet
import configparser

# Use your production key (from secure storage)
PROD_KEY = "your_production_fernet_key_here"  # Base64 string
f = Fernet(PROD_KEY.encode("utf-8"))

credentials = {
    "base_url": "http://vas.mobilogi.com/api.php",
    "username": "your_prod_username",
    "password": "your_prod_password",
    "route": "1",
    "sender": "CSPLTP",
    "default_template_id": "1207175405837058152",
    "named_template_id": "1207175405379469327",
}

config = configparser.ConfigParser()
config["mobilogic"] = {k: f.encrypt(v.encode("utf-8")).decode("utf-8") for k, v in credentials.items()}

with open("mobilogic_secrets.ini", "w", encoding="utf-8") as f_out:
    config.write(f_out)

print("✅ Production .ini created")
```

### Step 3: Deploy Encrypted .ini File

Deploy the encrypted `.ini` file to your production server:

- **Location**: `/opt/complycrafter/forms/secrets/mobilogic_secrets.ini` (or your preferred path)
- **Permissions**: Restrict access (e.g., `chmod 600`)

### Step 4: Set Environment Variables

In your production environment, set:

```bash
# Encryption key (from Step 1)
export MOBILOGIC_ENC_KEY="your_production_fernet_key_base64_string"

# Optional: Custom .ini path (if not using default)
export MOBILOGIC_INI_PATH="/opt/complycrafter/forms/secrets/mobilogic_secrets.ini"
```

**Docker/Docker Compose:**

```yaml
services:
  forms:
    environment:
      - MOBILOGIC_ENC_KEY=${MOBILOGIC_ENC_KEY}  # From secrets manager
      - MOBILOGIC_INI_PATH=/app/secrets/mobilogic_secrets.ini
    volumes:
      - ./secrets/mobilogic_secrets.ini:/app/secrets/mobilogic_secrets.ini:ro
```

**Kubernetes:**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mobilogic-enc-key
type: Opaque
stringData:
  MOBILOGIC_ENC_KEY: "your_production_fernet_key_base64_string"
---
env:
  - name: MOBILOGIC_ENC_KEY
    valueFrom:
      secretKeyRef:
        name: mobilogic-enc-key
        key: MOBILOGIC_ENC_KEY
```

---

## 📋 File Structure

### Development

```
services/forms/
├── secrets/                          # NOT in git (.gitignore)
│   ├── mobilogic.key                 # Encryption key (local only)
│   └── mobilogic_secrets.ini         # Encrypted credentials
├── app/
│   └── core/
│       └── config.py                 # Loads and decrypts
└── .gitignore                        # Should include: secrets/
```

### Production

```
/opt/complycrafter/forms/
├── secrets/
│   └── mobilogic_secrets.ini         # Encrypted credentials (deployed)
└── app/
    └── core/
        └── config.py

# Environment variables:
# - MOBILOGIC_ENC_KEY (from secrets manager)
# - MOBILOGIC_INI_PATH (optional, defaults to secrets/mobilogic_secrets.ini)
```

---

## 🔒 Security Best Practices

### ✅ DO

- ✅ **Store encryption key separately** from encrypted data
- ✅ **Use strong, randomly generated Fernet keys**
- ✅ **Restrict file permissions** on `.ini` and `.key` files (`chmod 600`)
- ✅ **Never commit** `secrets/` directory to git
- ✅ **Rotate keys periodically** (generate new key, re-encrypt, update)
- ✅ **Use environment variables** for keys in production
- ✅ **Audit access** to secrets directory

### ❌ DON'T

- ❌ **Never commit** encryption keys to git
- ❌ **Never hard-code** credentials in source code
- ❌ **Never share** encryption keys via insecure channels
- ❌ **Never use** the same key for dev and production
- ❌ **Never log** decrypted credentials

---

## 🧪 Testing

### Verify Encryption/Decryption

```python
from cryptography.fernet import Fernet
from pathlib import Path
import configparser

# Load key
key_path = Path("secrets/mobilogic.key")
key = key_path.read_bytes().strip()
f = Fernet(key)

# Test encrypt/decrypt
plain = "test_password"
encrypted = f.encrypt(plain.encode("utf-8")).decode("utf-8")
decrypted = f.decrypt(encrypted.encode("utf-8")).decode("utf-8")

assert plain == decrypted
print("✅ Encryption/Decryption works!")
```

### Verify Configuration Loading

```python
from app.core.config import get_settings

try:
    settings = get_settings()
    assert settings.mobilogic_username is not None
    assert settings.mobilogic_password is not None
    print("✅ Configuration loaded successfully!")
except Exception as e:
    print(f"❌ Error: {e}")
```

---

## 🔧 Troubleshooting

### Issue: "cryptography library is required"

**Solution**: Install the cryptography library:

```bash
pip install cryptography
```

### Issue: "No key configured"

**Symptoms**: Application falls back to env/.env (no decryption happens)

**Solutions**:
- Check that `MOBILOGIC_ENC_KEY` is set (production)
- Check that `secrets/mobilogic.key` exists (development)
- Verify file permissions

### Issue: "Invalid token" or "Decryption failed"

**Solutions**:
- Verify the encryption key matches the one used to encrypt
- Check that the `.ini` file wasn't corrupted
- Ensure the key is base64-encoded correctly

### Issue: ".ini file not found"

**Solutions**:
- Check `MOBILOGIC_INI_PATH` environment variable
- Verify default path: `secrets/mobilogic_secrets.ini` (relative to forms service root)
- Ensure file exists and has correct permissions

### Issue: "Section 'mobilogic' not found"

**Solutions**:
- Verify `.ini` file has `[mobilogic]` section
- Check file format (should be valid INI format)

---

## 📝 Helper Scripts

### Generate Key Script

Save as `scripts/generate_key.py`:

```python
#!/usr/bin/env python3
"""Generate a new Fernet encryption key."""
from cryptography.fernet import Fernet
from pathlib import Path
import sys

if __name__ == "__main__":
    key = Fernet.generate_key()
    
    if len(sys.argv) > 1:
        output_path = Path(sys.argv[1])
    else:
        base_dir = Path(__file__).resolve().parent.parent
        output_path = base_dir / "secrets" / "mobilogic.key"
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(key + b"\n")
    
    print(f"✅ Key generated: {output_path}")
    print(f"🔑 Key value: {key.decode('utf-8')}")
    print("\n⚠️  Keep this key secure and never commit it to git!")
```

### Encrypt Credentials Script

Save as `scripts/encrypt_credentials.py`:

```python
#!/usr/bin/env python3
"""Encrypt Mobilogic credentials into .ini file."""
from cryptography.fernet import Fernet
from pathlib import Path
import configparser
import sys

def encrypt_credentials(key_path: Path, credentials: dict, output_path: Path):
    """Encrypt credentials and write to .ini file."""
    key = key_path.read_bytes().strip()
    f = Fernet(key)
    
    config = configparser.ConfigParser()
    config["mobilogic"] = {
        k: f.encrypt(v.encode("utf-8")).decode("utf-8")
        for k, v in credentials.items()
    }
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f_out:
        config.write(f_out)
    
    print(f"✅ Encrypted .ini created: {output_path}")

if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parent.parent
    key_path = base_dir / "secrets" / "mobilogic.key"
    output_path = base_dir / "secrets" / "mobilogic_secrets.ini"
    
    if not key_path.exists():
        print(f"❌ Key file not found: {key_path}")
        sys.exit(1)
    
    # Prompt for credentials (or read from secure input)
    print("Enter Mobilogic credentials:")
    credentials = {
        "base_url": input("Base URL: ").strip(),
        "username": input("Username: ").strip(),
        "password": input("Password: ").strip(),
        "route": input("Route (default: 1): ").strip() or "1",
        "sender": input("Sender (default: CSPLTP): ").strip() or "CSPLTP",
        "default_template_id": input("Default Template ID: ").strip(),
        "named_template_id": input("Named Template ID: ").strip(),
    }
    
    encrypt_credentials(key_path, credentials, output_path)
```

---

## 🔄 Key Rotation

If you need to rotate the encryption key:

1. **Generate new key**
2. **Re-encrypt all credentials** with new key
3. **Update environment variable** (`MOBILOGIC_ENC_KEY`) or key file
4. **Deploy new `.ini` file**
5. **Restart application**

---

## 📚 Additional Resources

- [Fernet (Symmetric Encryption)](https://cryptography.io/en/latest/fernet/)
- [Python cryptography library](https://cryptography.io/)
- [ConfigParser documentation](https://docs.python.org/3/library/configparser.html)

---

## ⚠️ Important Notes

- **This documentation is safe to commit** - it doesn't contain actual secrets
- **Never commit** `secrets/` directory or `.key` files
- **Always use different keys** for development and production
- **Rotate keys periodically** for enhanced security
- **Monitor access** to secrets directory

---

**Last Updated**: 2024  
**Maintained By**: Forms Service Team

