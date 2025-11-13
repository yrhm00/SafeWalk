export async function list(SQLClient, { page = 1, size = 10, q = "", status, type_id, from, to } = {}) {
    const offset = (page - 1) * size;
    const clauses = [];
    const params = [];
    let i = 1;

    if (q) {
        clauses.push(`(LOWER(title) LIKE LOWER($${i}) OR LOWER(description) LIKE LOWER($${i}))`);
        params.push(`%${q}%`);
        i++;
    }
    if (status) {
        clauses.push(`status = $${i}`);
        params.push(status);
        i++;
    }
    if (type_id) {
        clauses.push(`type_id = $${i}`);
        params.push(type_id);
        i++;
    }
    if (from) {
        clauses.push(`created_at >= $${i}`);
        params.push(from);
        i++;
    }
    if (to) {
        clauses.push(`created_at <= $${i}`);
        params.push(to);
        i++;
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

    // Construire la requête SQL par concaténation pour éviter des template literals complexes
    const limitPlaceholder = `$${i}`;
    const offsetPlaceholder = `$${i + 1}`;

    const sql =
        'SELECT r.id, r.title, r.description, r.point, r.image_url, r.status, r.severity, r.created_at, ' +
        'r.user_id, u.name AS user_name, ' +
        'r.type_id, t.label AS type_label, ' +
        'r.zone_id ' +
        'FROM reports r ' +
        'JOIN users u ON u.id = r.user_id ' +
        'JOIN report_types t ON t.id = r.type_id ' +
        (where ? where + ' ' : '') +
        'ORDER BY r.created_at DESC ' +
        'LIMIT ' + limitPlaceholder + ' OFFSET ' + offsetPlaceholder;

    const items = await SQLClient.query(sql, [...params, size, offset]);

    const countSql = 'SELECT COUNT(*)::int AS total FROM reports r ' + (where ? where : '');
    const count = await SQLClient.query(countSql, params);

    return { items: items.rows, total: count.rows[0].total, page, size };
}

export async function create(SQLClient, { user_id, type_id, zone_id = null, title, description, point, image_url = null, status = "pending", severity = "medium" }) {
    const r = await SQLClient.query(
        `
    INSERT INTO reports (user_id, type_id, zone_id, title, description, point, image_url, status, severity)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `,
        [user_id, type_id, zone_id, title, description, point, image_url, status, severity]
    );
    return r.rows[0] || null;
}

export async function findById(SQLClient, id) {
    const r = await SQLClient.query(
        `
    SELECT r.*, u.name AS user_name, t.label AS type_label
    FROM reports r
    JOIN users u ON u.id = r.user_id
    JOIN report_types t ON t.id = r.type_id
    WHERE r.id = $1
    `,
        [id]
    );
    return r.rows[0] || null;
}

export async function update(SQLClient, id, { title, description, point, image_url, status, severity, type_id, zone_id }) {
    const r = await SQLClient.query(
        `
    UPDATE reports
    SET title = COALESCE($2, title),
        description = COALESCE($3, description),
        point = COALESCE($4, point),
        image_url = COALESCE($5, image_url),
        status = COALESCE($6, status),
        severity = COALESCE($7, severity),
        type_id = COALESCE($8, type_id),
        zone_id = COALESCE($9, zone_id)
    WHERE id = $1
    RETURNING *
    `,
        [id, title, description, point, image_url, status, severity, type_id, zone_id]
    );
    return r.rows[0] || null;
}

export async function remove(SQLClient, id) {
    const { rows } = await SQLClient.query(`DELETE FROM reports WHERE id = $1 RETURNING id`, [id]);
    return rows[0]?.id ?? null;
}