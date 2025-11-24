-- SafeWalk Database Schema with PostGIS for geospatial features
CREATE EXTENSION IF NOT EXISTS postgis;

-- ========== ENUM ==========
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'citizen');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending', 'validated', 'resolved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE severity_level AS ENUM ('low','medium','high');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ========== TABLE users (renamed from 'user')
DROP TABLE IF EXISTS users CASCADE ;
CREATE TABLE users (
                       id              BIGSERIAL PRIMARY KEY,
                       name            VARCHAR(120)        NOT NULL,
                       username        VARCHAR(60)         UNIQUE,
                       email           VARCHAR(255)        NOT NULL UNIQUE,
                       password_hash   TEXT                NOT NULL,
                       role            user_role           NOT NULL DEFAULT 'citizen',
                       created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- ========== TABLE REPORT_TYPES ==========
DROP TABLE IF EXISTS report_type CASCADE ;
CREATE TABLE report_type (
                             id          SERIAL PRIMARY KEY,
                             label       VARCHAR(80) NOT NULL UNIQUE
);

-- ========== TABLE ZONES ==========
DROP TABLE IF EXISTS zone CASCADE ;
CREATE TABLE zone (
                      id          SERIAL PRIMARY KEY,
                      name        VARCHAR(120) NOT NULL,
                      description TEXT,
                      geom        geometry(POLYGON, 4326)
);

-- ========== TABLE report ==========
DROP TABLE IF EXISTS report CASCADE ;
CREATE TABLE report (
                        id             BIGSERIAL PRIMARY KEY,
                        user_id        BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        type_id        INT          NOT NULL REFERENCES report_type(id),
                        zone_id        INT          REFERENCES zone(id) ON DELETE SET NULL,
                        title          VARCHAR(140) NOT NULL,
                        description    TEXT         NOT NULL,
                        latitude       DOUBLE PRECISION NOT NULL,
                        longitude      DOUBLE PRECISION NOT NULL,
                        point          geometry(POINT, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
                        image_url      TEXT,
                        status         report_status NOT NULL DEFAULT 'pending',
                        severity       severity_level NOT NULL DEFAULT 'medium',
                        created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ========== TABLE comment ==========
DROP TABLE IF EXISTS comment CASCADE ;
CREATE TABLE comment (
                         id          BIGSERIAL PRIMARY KEY,
                         report_id   BIGINT      NOT NULL REFERENCES report(id) ON DELETE CASCADE,
                         user_id     BIGINT      NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
                         content     TEXT        NOT NULL,
                         created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========== TABLE VOTES ==========
DROP TABLE IF EXISTS vote CASCADE ;
CREATE TABLE vote (
                      id          BIGSERIAL PRIMARY KEY,
                      report_id   BIGINT      NOT NULL REFERENCES report(id) ON DELETE CASCADE,
                      user_id     BIGINT      NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
                      value       BOOLEAN     NOT NULL,
                      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                      CONSTRAINT vote_unique_by_user UNIQUE (report_id, user_id)
);


------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------INSERT INDSIDE DB----------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------


-- users (passwords hashed with argon2)
-- Default password for all users: "password"
-- Admin user: email=admin@safewalk.local, password=admin
INSERT INTO users (name, username, email, password_hash, role) VALUES
                                                                   ('Admin SafeWalk', 'admin', 'admin@safewalk.local', '$argon2id$v=19$m=65536,t=3,p=4$CoaYz4UVAP+xWqT4kzh7jA$VZjjHZds8B5OxWYqbKq9BoX2g+/aJHvi7o7t+DJq1sg', 'admin'),
                                                                   ('Yassin Rhouma', 'yassin', 'yassin@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$L2zmHtZW6iQ2zOV1wLUcYw$ZQ1cWfVTjJxdqRpz+sBOZnZvUmLc/m3GNjvB6id6aNA', 'citizen'),
                                                                   ('Florian Dupont', 'florian', 'florian@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$L2zmHtZW6iQ2zOV1wLUcYw$ZQ1cWfVTjJxdqRpz+sBOZnZvUmLc/m3GNjvB6id6aNA', 'citizen'),
                                                                   ('Abou Bakar', 'aboub', 'aboub@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$L2zmHtZW6iQ2zOV1wLUcYw$ZQ1cWfVTjJxdqRpz+sBOZnZvUmLc/m3GNjvB6id6aNA', 'citizen'),
                                                                   ('Emmanuel Lemoine', 'emma', 'emma@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$L2zmHtZW6iQ2zOV1wLUcYw$ZQ1cWfVTjJxdqRpz+sBOZnZvUmLc/m3GNjvB6id6aNA', 'citizen'),
                                                                   ('Yassin Admin', 'yassadmin', 'yassinadmin@admin.com', '$argon2id$v=19$m=65536,t=3,p=4$CoaYz4UVAP+xWqT4kzh7jA$VZjjHZds8B5OxWYqbKq9BoX2g+/aJHvi7o7t+DJq1sg', 'admin');


-- Report_Types
INSERT INTO report_type (label) VALUES
                                    ('Poor lighting'),
                                    ('Icy road'),
                                    ('Broken sidewalk'),
                                    ('Suspicious activity'),
                                    ('Flooded area');

-- Zones with PostGIS polygons
INSERT INTO zone (name, description, geom) VALUES
                                       ('City Center', 'Main urban zone', ST_GeomFromText('POLYGON((4.35 50.84, 4.36 50.84, 4.36 50.85, 4.35 50.85, 4.35 50.84))', 4326)),
                                       ('Train Station', 'Area around the main station', ST_GeomFromText('POLYGON((4.33 50.84, 4.34 50.84, 4.34 50.85, 4.33 50.85, 4.33 50.84))', 4326));

-- report
INSERT INTO report (user_id, type_id, zone_id, title, description, latitude, longitude, image_url, status, severity) VALUES
                                                                                                                        (2, 1, 1, 'Lampadaire cassé', 'Aucun éclairage dans la rue principale depuis 3 jours.', 50.845, 4.355, NULL, 'pending', 'medium'),
                                                                                                                        (3, 2, 1, 'Route gelée', 'Très glissante ce matin à cause du gel.', 50.846, 4.357, NULL, 'validated', 'high'),
                                                                                                                        (4, 4, 2, 'Personne suspecte', 'Individu tournant autour des voitures la nuit.', 50.847, 4.338, NULL, 'pending', 'medium'),
                                                                                                                        (5, 3, 2, 'Trottoir abîmé', 'Impossible de passer avec une poussette.', 50.843, 4.334, NULL, 'resolved', 'low'),
                                                                                                                        (2, 5, 1, 'Rue inondée', 'Après la pluie, la rue devient impraticable.', 50.844, 4.352, NULL, 'pending', 'high');

-- comment
INSERT INTO comment (report_id, user_id, content) VALUES
                                                      (1, 3, 'Oui c’est très dangereux, surtout le soir !'),
                                                      (2, 4, 'J’ai glissé moi aussi ce matin.'),
                                                      (3, 2, 'Alertez la police municipale rapidement.'),
                                                      (4, 5, 'J’ai pris une photo, je la joins bientôt.');

-- Votes
INSERT INTO vote (report_id, user_id, value) VALUES
                                                 (1, 3, TRUE),
                                                 (1, 4, TRUE),
                                                 (2, 5, TRUE),
                                                 (3, 2, FALSE),
                                                 (4, 3, TRUE),
                                                 (5, 5, TRUE);