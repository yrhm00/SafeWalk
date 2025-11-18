-- =============================================
--   EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS postgis;

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
    geom         geometry(Polygon, 4326) NOT NULL
);

-- =============================================
--   TABLE: REPORT
--   (tes colonnes d’origine + FK)
-- =============================================
CREATE TABLE report (
    report_id    SERIAL PRIMARY KEY,
    title        VARCHAR(50)       NOT NULL,
    description  TEXT              NOT NULL,
    point_gps    geometry(Point, 4326) NOT NULL,
    image_url    VARCHAR(255),
    status       report_status     NOT NULL DEFAULT 'pending',
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

-----------------------------------------------------------------------
-- INSERT DB
-----------------------------------------------------------------------
-- USERS
-----------------------------------------------------------------------
INSERT INTO "user" (name, first_name, username, email, password_hash, statut)
VALUES
('Admin', 'SafeWalk', 'admin', 'admin@safewalk.local', 'hash_admin', 'admin'),
('Yassin', 'Rhouma', 'yassin', 'yassin@mail.com', 'hash_yassin', 'citizen'),
('Florian', 'Dupont', 'florian', 'florian@mail.com', 'hash_florian', 'citizen'),
('Abou', 'Bakar', 'aboub', 'aboub@mail.com', 'hash_aboub', 'citizen'),
('Emmanuel', 'Lemoine', 'emma', 'emma@mail.com', 'hash_emma', 'citizen'),
('Yassin', 'Rhouma', 'yassrh', 'yassinadmin@admin.com',
 '$2b$10$tgzU0dC/W4Tlaa1m2eVKBs0WgyMMejlzhSs1ijAJhf3wOVRdre',
 'admin');

-----------------------------------------------------------------------
-- REPORT TYPES  (avec SEVERITY obligatoire dans ton script)
-----------------------------------------------------------------------
INSERT INTO report_type (label, severity) VALUES
('Poor lighting',  'Low'),
('Icy road',       'Medium'),
('Broken sidewalk','Low'),
('Suspicious activity','High'),
('Flooded area',   'Medium');

-----------------------------------------------------------------------
-- ZONES
-----------------------------------------------------------------------
INSERT INTO zone (name, description, geom) VALUES
('City Center', 'Main urban zone',
 ST_GeomFromText('POLYGON((4.35 50.84,4.36 50.84,4.36 50.85,4.35 50.85,4.35 50.84))', 4326)
),
('Train Station', 'Area around the main station',
 ST_GeomFromText('POLYGON((4.33 50.84,4.34 50.84,4.34 50.85,4.33 50.85,4.33 50.84))', 4326)
);

-----------------------------------------------------------------------
-- REPORTS  (important : point_gps + ENUM exacts)
-----------------------------------------------------------------------
INSERT INTO report (title, description, point_gps, image_url, status, severity, type_id, zone_id, user_id)
VALUES
('Lampadaire cassé', 'Aucun éclairage dans la rue principale depuis 3 jours.',
 ST_GeomFromText('POINT(4.355 50.845)',4326), NULL, 'pending', 'Medium', 1, 1, 2),

('Route gelée', 'Très glissante ce matin à cause du gel.',
 ST_GeomFromText('POINT(4.357 50.846)',4326), NULL, 'validated', 'High', 2, 1, 3),

('Personne suspecte', 'Individu tournant autour des voitures la nuit.',
 ST_GeomFromText('POINT(4.338 50.847)',4326), NULL, 'pending', 'Medium', 4, 2, 4),

('Trottoir abîmé', 'Impossible de passer avec une poussette.',
 ST_GeomFromText('POINT(4.334 50.843)',4326), NULL, 'resolved', 'Low', 3, 2, 5),

('Rue inondée', 'Après la pluie, la rue devient impraticable.',
 ST_GeomFromText('POINT(4.352 50.844)',4326), NULL, 'pending', 'High', 5, 1, 2);

-----------------------------------------------------------------------
-- COMMENTS
-----------------------------------------------------------------------
INSERT INTO comment (report_id, user_id, content) VALUES
(1, 3, 'Oui c’est très dangereux, surtout le soir !'),
(2, 4, 'J’ai glissé moi aussi ce matin.'),
(3, 2, 'Alertez la police municipale rapidement.'),
(4, 5, 'J’ai pris une photo, je la joins bientôt.');

-----------------------------------------------------------------------
-- VOTES
-----------------------------------------------------------------------
INSERT INTO vote (report_id, user_id, value) VALUES
(1, 3, TRUE),
(1, 4, TRUE),
(2, 5, TRUE),
(3, 2, FALSE),
(4, 3, TRUE),
(5, 5, TRUE);
