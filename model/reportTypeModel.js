import pool from "../database/database.js";

export async function list() {
    const r = await pool.query(`SELECT id, label FROM report_types ORDER BY label`);
    return r.rows;
}

export async function create({ label }) {
    const r = await pool.query(
        `INSERT INTO report_types (label) VALUES ($1) RETURNING id, label`,
        [label]
    );
    return r.rows[0];
}

export async function update(id, { label }) {
    const r = await pool.query(
        `UPDATE report_types SET label = COALESCE($2, label) WHERE id = $1 RETURNING id, label`,
        [id, label]
    );
    return r.rows[0] || null;
}

export async function remove(id) {
    await pool.query(`DELETE FROM report_types WHERE id = $1`, [id]);
}