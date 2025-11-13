export async function listForReport(SQLClient, { id }) {
    const r = await SQLClient.query(
        `
    SELECT c.id, c.content, c.created_at, c.user_id, u.name AS user_name
    FROM comment c
    JOIN "user" u ON u.id = c.user_id
    WHERE c.report_id = $1
    ORDER BY c.created_at DESC
    `,
        [id]
    );
    return r.rows;
}
export async function createReport(SQLClient, { report_id, user_id, content }) {
    const { rows } = await SQLClient.query(
        `
    INSERT INTO comment (report_id, user_id, content)
    VALUES ($1,$2,$3)
    RETURNING id
    `,
        [report_id, user_id, content]
    );
    return rows[0]?.id ?? null;
}
export async function removeReport(SQLClient, { id }) {
    if (id === undefined || id === null) throw new Error('id manquant');
    const { rows } = await SQLClient.query(`DELETE FROM comment WHERE id = $1 RETURNING id`, [id]);
    return rows[0]?.id ?? null;
}
export async function updateReport(SQLClient, { id, content }) {
    if (id === undefined || id === null) throw new Error('id manquant');
    if (content === undefined || content === null) throw new Error('content manquant');

    const { rows } = await SQLClient.query(
        `UPDATE comment SET content = $2 WHERE id = $1 RETURNING id`,
        [id, content]
    );
    return rows[0]?.id ?? null;
}
