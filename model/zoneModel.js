import pool from "../database/database.js";

export async function list() {
    const r = await pool.query(`SELECT id, name, description, geom FROM zones ORDER BY id`);
    return r.rows;
}

export async function create({ name, description, geom }) {
    const r = await pool.query(
        `INSERT INTO zones (name, description, geom) VALUES ($1,$2,$3) RETURNING id, name, description, geom`,
        [name, description, geom]
    );
    return r.rows[0];
}

export async function update(id, { name, description, geom }) {
    const r = await pool.query(
        `
    UPDATE zones
    SET name = COALESCE($2, name),
        description = COALESCE($3, description),
        geom = COALESCE($4, geom)
    WHERE id = $1
    RETURNING id, name, description, geom
    `,
        [id, name, description, geom]
    );
    return r.rows[0] || null;
}

export async function remove(id) {
    await pool.query(`DELETE FROM zones WHERE id = $1`, [id]);
}