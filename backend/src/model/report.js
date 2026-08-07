/**
 * Lire tous les rapports avec filtres optionnels
 */
export const readAllReports = async (SQLClient, limit = 20, offset = 0, params = {}) => {
    let query = `
        SELECT r.id, r.user_id, r.type_id, r.zone_id, r.title, r.description, r.latitude, r.longitude,
               r.image_url, r.status, r.severity, r.created_at,
               u.name as user_name, rt.label as type_label, z.name as zone_name,
               COUNT(CASE WHEN v.value = TRUE THEN 1 END) as upvotes,
               COUNT(CASE WHEN v.value = FALSE THEN 1 END) as downvotes
        FROM report r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN report_type rt ON r.type_id = rt.id
        LEFT JOIN zone z ON r.zone_id = z.id
        LEFT JOIN vote v ON r.id = v.report_id
        WHERE 1=1
    `;

    const queryParams = [limit, offset];
    let paramCounter = 3;

    if (params.severity) {
        query += ` AND r.severity = $${paramCounter}`;
        queryParams.push(params.severity);
        paramCounter++;
    }

    if (params.type_id) {
        query += ` AND r.type_id = $${paramCounter}`;
        queryParams.push(params.type_id);
        paramCounter++;
    }

    if (params.days) {
        query += ` AND r.created_at >= NOW() - INTERVAL '1 day' * $${paramCounter}`;
        queryParams.push(params.days);
        paramCounter++;
    }

    query += `
        GROUP BY r.id, u.name, rt.label, z.name
        ORDER BY r.created_at DESC
        LIMIT $1 OFFSET $2
    `;

    const reportsResult = await SQLClient.query(query, queryParams);
    const reports = reportsResult.rows;

    const commentsQuery = `
        SELECT c.id, c.content, c.created_at, c.report_id, u.username as user_name
        FROM comment c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at ASC
    `;
    const commentsResult = await SQLClient.query(commentsQuery);
    const allComments = commentsResult.rows;

    for (const report of reports) {
        report.comments = allComments.filter(comment => comment.report_id === report.id);
    }

    return reports;
};

/**
 * Lire un rapport par ID
 */
export const readReportById = async (SQLClient, id) => {
    const query = `
        SELECT r.id, r.user_id, r.type_id, r.zone_id, r.title, r.description, r.latitude, r.longitude,
               r.image_url, r.status, r.severity, r.created_at,
               u.name as user_name, rt.label as type_label, z.name as zone_name
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
        RETURNING id, user_id, type_id, zone_id, title, description, latitude, longitude, image_url, status, severity, created_at
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
        query += `${querySet.join(", ")} WHERE id = $${queryValues.length} RETURNING id, user_id, type_id, zone_id, title, description, latitude, longitude, image_url, status, severity, created_at`;
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

export const readReportsByUserId = async (SQLClient, user_id) => {
    const query = `
        SELECT r.id, r.user_id, r.type_id, r.zone_id, r.title, r.description, r.latitude, r.longitude,
               r.image_url, r.status, r.severity, r.created_at,
               rt.label as type_label, z.name as zone_name
        FROM report r
        LEFT JOIN report_type rt ON r.type_id = rt.id
        LEFT JOIN zone z ON r.zone_id = z.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
    `;
    const { rows } = await SQLClient.query(query, [user_id]);
    return rows;
};
