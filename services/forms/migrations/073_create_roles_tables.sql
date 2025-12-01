-- Create roles table for role-based access control
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create junction table for user-role relationships (many-to-many)
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE(user_id, role_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS ix_roles_name ON roles(name);
CREATE INDEX IF NOT EXISTS ix_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS ix_user_roles_role_id ON user_roles(role_id);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('admin', 'Administrator with full system access'),
    ('user', 'Standard user with basic access'),
    ('manager', 'Manager with elevated permissions'),
    ('viewer', 'Read-only access')
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE roles IS 'System roles for access control';
COMMENT ON TABLE user_roles IS 'Junction table linking users to roles (many-to-many)';

