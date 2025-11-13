export async function list(SQLClient) {
    const r = await SQLClient.query(`SELECT id, label FROM report_type ORDER BY label`);
    return r.rows;
}

export async function create(SQLClient, { label }) {
    const r = await SQLClient.query(
        `INSERT INTO report_type (label) VALUES ($1) RETURNING id, label`,
        [label]
    );
    return r.rows[0] || null;
}

export async function update(SQLClient, { id, label }) {
    if (id === undefined || id === null) throw new Error('id manquant');
    const r = await SQLClient.query(
        `UPDATE report_type SET label = COALESCE($2, label) WHERE id = $1 RETURNING id, label`,
        [id, label]
    );
    return r.rows[0] || null;
}

export async function remove(SQLClient, { id }) {
    if (id === undefined || id === null) throw new Error('id manquant');
    const { rows } = await SQLClient.query(`DELETE FROM report_type WHERE id = $1 RETURNING id`, [id]);
    return rows[0]?.id ?? null;
}