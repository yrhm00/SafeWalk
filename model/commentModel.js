import pool from "../database/database.js";

export async function listForReport(report_id) {
    const r = await pool.query(
        `
    SELECT c.id, c.content, c.created_at, c.user_id, u.name AS user_name
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.report_id = $1
    ORDER BY c.created_at DESC
    `,
        [report_id]
    );
    return r.rows;
}

export async function create({ report_id, user_id, content }) {
    const r = await pool.query(
        `
    INSERT INTO comments (report_id, user_id, content)
    VALUES ($1,$2,$3)
    RETURNING id, report_id, user_id, content, created_at
    `,
        [report_id, user_id, content]
    );
    return r.rows[0];
}

export async function remove(id) {
    await pool.query(`DELETE FROM comments WHERE id = $1`, [id]);
}