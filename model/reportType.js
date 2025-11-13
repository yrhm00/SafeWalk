export async function list(SQLClient) {
    const r = await SQLClient.query(`SELECT id, label FROM report_types ORDER BY label`);
    return r.rows;
}

export async function create(SQLClient, { label }) {
    const r = await SQLClient.query(
        `INSERT INTO report_types (label) VALUES ($1) RETURNING id, label`,
        [label]
    );
    return r.rows[0] || null;
}

export async function update(SQLClient, id, { label }) {
    const r = await SQLClient.query(
        `UPDATE report_types SET label = COALESCE($2, label) WHERE id = $1 RETURNING id, label`,
        [id, label]
    );
    return r.rows[0] || null;
}

export async function remove(SQLClient, id) {
    const { rows } = await SQLClient.query(`DELETE FROM report_types WHERE id = $1 RETURNING id`, [id]);
    return rows[0]?.id ?? null;
}