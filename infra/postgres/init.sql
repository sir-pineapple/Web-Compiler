CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    stdin TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE 
);