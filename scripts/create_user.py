#!/usr/bin/env python3
"""
Script to create a user account with hashed password
"""
import hashlib
import os
import sys
from pathlib import Path

# Add parent directory to path to import database utilities
sys.path.insert(0, str(Path(__file__).parent.parent))

def hash_password(password: str, salt: str = None) -> str:
    """Hash password with salt using SHA-256 (matches auth_service.py)"""
    if salt is None:
        salt_bytes = os.urandom(16).hex().encode()
    else:
        salt_bytes = salt.encode()
    
    hashed = hashlib.sha256(salt_bytes + password.encode()).hexdigest()
    return f"{salt_bytes.decode()}${hashed}"

def create_user_sql(username: str, email: str, password: str) -> str:
    """Generate SQL to create a user"""
    password_hash = hash_password(password)
    
    sql = f"""
INSERT INTO user_accounts (username, email, password_hash, is_active, created_at)
VALUES (
    '{username}',
    '{email}',
    '{password_hash}',
    true,
    NOW()
)
ON CONFLICT (username) DO UPDATE SET
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    is_active = EXCLUDED.is_active;

SELECT id, username, email FROM user_accounts WHERE username = '{username}';
"""
    return sql

if __name__ == "__main__":
    # Default user credentials
    username = "admin"
    email = "admin@complycrafter.com"
    password = "admin123"
    
    if len(sys.argv) >= 2:
        username = sys.argv[1]
    if len(sys.argv) >= 3:
        email = sys.argv[2]
    if len(sys.argv) >= 4:
        password = sys.argv[3]
    
    sql = create_user_sql(username, email, password)
    
    # Print SQL to stdout so it can be piped to psql
    print(sql)


