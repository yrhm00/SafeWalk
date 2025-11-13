export async function list(SQLClient) {
    const { rows } = await SQLClient.query(`SELECT id, name, description, geom FROM zones ORDER BY id`);
    return rows;
}

export async function create(SQLClient, { name, description, geom }) {
    const { rows } = await SQLClient.query(
        `INSERT INTO zones (name, description, geom) VALUES ($1,$2,$3) RETURNING id`,
        [name, description, geom]
    );
    return rows[0]?.id ?? null;
}

export async function update(SQLClient, { id, name, description, geom }) {
    if (id === undefined || id === null) throw new Error('id manquant');
    const { rows } = await SQLClient.query(
        `
    UPDATE zones
    SET name = COALESCE($2, name),
        description = COALESCE($3, description),
        geom = COALESCE($4, geom)
    WHERE id = $1
    RETURNING id
    `,
        [id, name, description, geom]
    );
    return rows[0]?.id ?? null;
}

export async function remove(SQLClient, { id }) {
    if (id === undefined || id === null) throw new Error('id manquant');
    const { rows } = await SQLClient.query(`DELETE FROM zones WHERE id = $1 RETURNING id`, [id]);
    return rows[0]?.id ?? null;
}