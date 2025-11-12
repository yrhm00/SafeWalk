import pool from "../database/database.js";

// Liste avec recherche + pagination
export async function list({ page = 1, size = 10, q = "" } = {}) {
    const offset = (page - 1) * size;
    const where = q ? `WHERE LOWER(name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1)` : "";
    const params = q ? [`%${q}%`, size, offset] : [size, offset];

    const items = await pool.query(
        `
    SELECT id, name, username, email, role, created_at
    FROM users
    ${where}
    ORDER BY id
    LIMIT $${q ? 2 : 1} OFFSET $${q ? 3 : 2}
    `,
        params
    );
    const count = await pool.query(
        `
    SELECT COUNT(*)::int AS total
    FROM users
    ${where}
    `,
        q ? [`%${q}%`] : []
    );
    return { items: items.rows, total: count.rows[0].total, page, size };
}

export async function findById(id) {
    const r = await pool.query(
        `SELECT id, name, username, email, role, created_at FROM users WHERE id = $1`,
        [id]
    );
    return r.rows[0] || null;
}

export async function create({ name, username, email, password_hash, role = "citizen" }) {
    const r = await pool.query(
        `
    INSERT INTO users (name, username, email, password_hash, role)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id, name, username, email, role, created_at
    `,
        [name, username, email, password_hash, role]
    );
    return r.rows[0];
}

export async function update(id, { name, username, email, role }) {
    const r = await pool.query(
        `
    UPDATE users
    SET name = COALESCE($2, name),
        username = COALESCE($3, username),
        email = COALESCE($4, email),
        role = COALESCE($5, role)
    WHERE id = $1
    RETURNING id, name, username, email, role, created_at
    `,
        [id, name, username, email, role]
    );
    return r.rows[0] || null;
}

export async function remove(id) {
    // Si tu veux la transaction “T1 cascade logique”, fais-la côté service.
    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
}