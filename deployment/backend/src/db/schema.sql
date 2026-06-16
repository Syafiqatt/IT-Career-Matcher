-- Skema database Sistem Rekomendasi Karir IT (IT Career Matcher)

-- Tabel pengguna (untuk autentikasi)
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          TEXT        NOT NULL,
    username      TEXT,
    email         TEXT        NOT NULL UNIQUE,
    password_hash TEXT        NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Username (nullable -> user lama tetap kompatibel; index unik mengizinkan banyak NULL)
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users (username);

CREATE TABLE IF NOT EXISTS recommendations (
    id              SERIAL PRIMARY KEY,
    skills          JSONB        NOT NULL DEFAULT '[]'::jsonb,
    tools           JSONB        NOT NULL DEFAULT '[]'::jsonb,
    databases       JSONB        NOT NULL DEFAULT '[]'::jsonb,
    years_code      NUMERIC      NOT NULL DEFAULT 0,
    education_level INTEGER      NOT NULL DEFAULT 2,
    top_n           INTEGER      NOT NULL DEFAULT 3,
    model_name      TEXT,
    results         JSONB        NOT NULL DEFAULT '[]'::jsonb,
    top_career      TEXT,
    top_score       NUMERIC,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Relasi ke user (nullable -> tetap kompatibel dengan riwayat anonim lama)
ALTER TABLE recommendations
    ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_recommendations_created_at
    ON recommendations (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_id
    ON recommendations (user_id);
