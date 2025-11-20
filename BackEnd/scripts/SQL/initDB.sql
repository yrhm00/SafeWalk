-- =============================================
--   EXTENSIONS
-- =============================================
--CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================================
--   ENUM TYPES (idempotent)
-- =============================================
DO $$ BEGIN
    CREATE TYPE severity_level AS ENUM ('Low', 'Medium', 'High');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending', 'validated', 'resolved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================
--   DROP TABLES (ordre pour éviter erreurs)
-- =============================================
DROP TABLE IF EXISTS vote CASCADE;
DROP TABLE IF EXISTS comment CASCADE;
DROP TABLE IF EXISTS report CASCADE;
DROP TABLE IF EXISTS zone CASCADE;
DROP TABLE IF EXISTS report_type CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- =============================================
--   TABLE: USER
-- =============================================
CREATE TABLE "user" (
    user_id      SERIAL PRIMARY KEY,
    name         VARCHAR(20)       NOT NULL,
    first_name   VARCHAR(20)       NOT NULL,
    username     VARCHAR(20)       NOT NULL,
    email        VARCHAR(50)       NOT NULL,
    password_hash   TEXT      NOT NULL,
    statut       VARCHAR(20)       NOT NULL,
    created_at   TIMESTAMP         NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_user_username UNIQUE (username),
    CONSTRAINT uq_user_email    UNIQUE (email)
);

-- =============================================
--   TABLE: REPORT TYPE
-- =============================================
CREATE TABLE report_type (
    type_id   SERIAL PRIMARY KEY,
    label     VARCHAR(20)      NOT NULL,
    severity  severity_level   NOT NULL
);

-- =============================================
--   TABLE: ZONE
-- =============================================
CREATE TABLE zone (
    zone_id      SERIAL PRIMARY KEY,
    name         VARCHAR(20)       NOT NULL,
    description  VARCHAR(100),
    geom         TEXT NOT NULL
);

-- =============================================
--   TABLE: REPORT
--   (tes colonnes d’origine + FK)
-- =============================================
CREATE TABLE report (
    report_id    SERIAL PRIMARY KEY,
    title        VARCHAR(50)       NOT NULL,
    description  TEXT              NOT NULL,
    point_gps    TEXT NOT NULL,
    image_url    VARCHAR(255),
    status       report_status     NOT NULL DEFAULT 'pending',
    severity     severity_level    NOT NULL DEFAULT 'Medium',
    created_at   TIMESTAMP         NOT NULL DEFAULT NOW(),

    type_id      INTEGER           NOT NULL,
    zone_id      INTEGER           NOT NULL,
    user_id      INTEGER           NOT NULL,

    CONSTRAINT fk_report_type
        FOREIGN KEY (type_id) REFERENCES report_type(type_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_report_zone
        FOREIGN KEY (zone_id) REFERENCES zone(zone_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_report_user
        FOREIGN KEY (user_id) REFERENCES "user"(user_id)
        ON DELETE CASCADE
);

-- =============================================
--   TABLE: COMMENT
-- =============================================
CREATE TABLE comment (
    comment_id  SERIAL PRIMARY KEY,
    content     TEXT        NOT NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),

    report_id   INTEGER     NOT NULL,
    user_id     INTEGER     NOT NULL,

    CONSTRAINT fk_comment_report
        FOREIGN KEY (report_id) REFERENCES report(report_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id) REFERENCES "user"(user_id)
        ON DELETE CASCADE
);

-- =============================================
--   TABLE: VOTE
-- =============================================
CREATE TABLE vote (
    vote_id     SERIAL PRIMARY KEY,
    value       BOOLEAN     NOT NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),

    report_id   INTEGER     NOT NULL,
    user_id     INTEGER     NOT NULL,

    CONSTRAINT fk_vote_report
        FOREIGN KEY (report_id) REFERENCES report(report_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_vote_user
        FOREIGN KEY (user_id) REFERENCES "user"(user_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_vote_user_report UNIQUE (report_id, user_id)
);

