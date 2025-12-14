/**
 * Lire tous les rapports
 */
export const readAllReports = async (SQLClient) => {
    const query = `
        SELECT r.*, u.name as user_name, rt.label as type_label, z.name as zone_name,
               COALESCE(SUM(CASE WHEN v.value = TRUE THEN 1 ELSE 0 END), 0) as upvotes,
               COALESCE(SUM(CASE WHEN v.value = FALSE THEN 1 ELSE 0 END), 0) as downvotes,
               COALESCE(
                   json_agg(
                       json_build_object(
                           'id', c.id,
                           'content', c.content,
                           'user_name', cu.username,
                           'created_at', c.created_at
                       ) ORDER BY c.created_at ASC
                   ) FILTER (WHERE c.id IS NOT NULL),
                   '[]'
               ) as comments
        FROM report r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN report_type rt ON r.type_id = rt.id
        LEFT JOIN zone z ON r.zone_id = z.id
        LEFT JOIN comment c ON r.id = c.report_id
        LEFT JOIN users cu ON c.user_id = cu.id
        LEFT JOIN vote v ON r.id = v.report_id
        GROUP BY r.id, u.name, rt.label, z.name
        ORDER BY r.created_at DESC
    `;
    const { rows } = await SQLClient.query(query);
    return rows;
};

/**
 * Lire un rapport par ID
 */
export const readReportById = async (SQLClient, id) => {
    const query = `
        SELECT r.*, u.name as user_name, rt.label as type_label, z.name as zone_name
        FROM report r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN report_type rt ON r.type_id = rt.id
        LEFT JOIN zone z ON r.zone_id = z.id
        WHERE r.id = $1
    `;
    const { rows } = await SQLClient.query(query, [id]);
    return rows[0];
};

/**
 * Créer un nouveau rapport
 */
export const createReport = async (SQLClient, { user_id, type_id, zone_id, title, description, latitude, longitude, image_url, severity = 'medium' }) => {
    const query = `
        INSERT INTO report (user_id, type_id, zone_id, title, description, latitude, longitude, image_url, severity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;
    const { rows } = await SQLClient.query(query, [user_id, type_id, zone_id, title, description, latitude, longitude, image_url, severity]);
    return rows[0];
};

/**
 * Mettre à jour un rapport (mise à jour partielle)
 */
export const updateReport = async (SQLClient, id, { title, description, status, severity, type_id, zone_id }) => {
    let query = "UPDATE report SET ";
    const querySet = [];
    const queryValues = [];

    if (title !== undefined) {
        queryValues.push(title);
        querySet.push(`title = $${queryValues.length}`);
    }
    if (description !== undefined) {
        queryValues.push(description);
        querySet.push(`description = $${queryValues.length}`);
    }
    if (status !== undefined) {
        queryValues.push(status);
        querySet.push(`status = $${queryValues.length}`);
    }
    if (severity !== undefined) {
        queryValues.push(severity);
        querySet.push(`severity = $${queryValues.length}`);
    }
    if (type_id !== undefined) {
        queryValues.push(type_id);
        querySet.push(`type_id = $${queryValues.length}`);
    }
    if (zone_id !== undefined) {
        queryValues.push(zone_id);
        querySet.push(`zone_id = $${queryValues.length}`);
    }

    if (queryValues.length > 0) {
        queryValues.push(id);
        query += `${querySet.join(", ")} WHERE id = $${queryValues.length} RETURNING *`;
        const { rows } = await SQLClient.query(query, queryValues);
        return rows[0];
    } else {
        throw new Error("No field given");
    }
};

/**
 * Supprimer un rapport
 */
export const deleteReport = async (SQLClient, id) => {
    const query = "DELETE FROM report WHERE id = $1";
    const result = await SQLClient.query(query, [id]);
    return result.rowCount > 0;
};

/**
 * Lire les rapports par utilisateur
 */
export const readReportsByUserId = async (SQLClient, user_id) => {
    const query = `
        SELECT r.*, rt.label as type_label, z.name as zone_name
        FROM report r
        LEFT JOIN report_type rt ON r.type_id = rt.id
        LEFT JOIN zone z ON r.zone_id = z.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
    `;
    const { rows } = await SQLClient.query(query, [user_id]);
    return rows;
};

/**
 * Rechercher les rapports dans un rayon donné (en mètres)
 * Utilise PostGIS pour calculer la distance
 */
export const searchReportsNearby = async (SQLClient, { latitude, longitude, radiusMeters = 5000 }) => {
    const query = `
        SELECT r.*, u.name as user_name, rt.label as type_label, z.name as zone_name,
               ST_Distance(
                   r.point::geography,
                   ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
               ) as distance_meters,
               COALESCE(SUM(CASE WHEN v.value = TRUE THEN 1 ELSE 0 END), 0) as upvotes,
               COALESCE(SUM(CASE WHEN v.value = FALSE THEN 1 ELSE 0 END), 0) as downvotes,
               COALESCE(
                   json_agg(
                       json_build_object(
                           'id', c.id,
                           'content', c.content,
                           'user_name', cu.username,
                           'created_at', c.created_at
                       ) ORDER BY c.created_at ASC
                   ) FILTER (WHERE c.id IS NOT NULL),
                   '[]'
               ) as comments
        FROM report r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN report_type rt ON r.type_id = rt.id
        LEFT JOIN zone z ON r.zone_id = z.id
        LEFT JOIN comment c ON r.id = c.report_id
        LEFT JOIN users cu ON c.user_id = cu.id
        LEFT JOIN vote v ON r.id = v.report_id
        WHERE ST_DWithin(
            r.point::geography,
            ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
            $3
        )
        GROUP BY r.id, u.name, rt.label, z.name
        ORDER BY distance_meters ASC
    `;
    const { rows } = await SQLClient.query(query, [latitude, longitude, radiusMeters]);
    return rows;
};