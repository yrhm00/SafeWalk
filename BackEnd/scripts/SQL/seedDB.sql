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
('Emmanuel', 'Lemoine', 'emma', 'emma@mail.com', 'hash_emma', 'citizen');


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
 'POLYGON((4.35 50.84,4.36 50.84,4.36 50.85,4.35 50.85,4.35 50.84))'
),
('Train Station', 'Area around the main station',
'POLYGON((4.33 50.84,4.34 50.84,4.34 50.85,4.33 50.85,4.33 50.84))' 
);

-----------------------------------------------------------------------
-- REPORTS  (important : point_gps + ENUM exacts)
-----------------------------------------------------------------------
INSERT INTO report (title, description, point_gps, image_url, status, severity, type_id, zone_id, user_id)
VALUES
('Lampadaire cassé', 'Aucun éclairage dans la rue principale depuis 3 jours.',
 'POINT(4.355 50.845)', NULL, 'pending', 'Medium', 1, 1, 2),

('Route gelée', 'Très glissante ce matin à cause du gel.',
 'POINT(4.357 50.846)', NULL, 'validated', 'High', 2, 1, 3),

('Personne suspecte', 'Individu tournant autour des voitures la nuit.',
 'POINT(4.338 50.847)', NULL, 'pending', 'Medium', 4, 2, 4),

('Trottoir abîmé', 'Impossible de passer avec une poussette.',
 'POINT(4.334 50.843)', NULL, 'resolved', 'Low', 3, 2, 5),

('Rue inondée', 'Après la pluie, la rue devient impraticable.',
 'POINT(4.352 50.844)', NULL, 'pending', 'High', 5, 1, 2);

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
