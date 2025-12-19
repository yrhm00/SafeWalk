export const readAllZones = async (SQLClient) => {
    const query = "SELECT id, name, description, ST_AsGeoJSON(geom) as geom FROM zone ORDER BY id";
    const { rows } = await SQLClient.query(query);
    return rows;
};

export const readZoneById = async (SQLClient, id) => {
    const query = "SELECT id, name, description, ST_AsGeoJSON(geom) as geom FROM zone WHERE id = $1";
    const { rows } = await SQLClient.query(query, [id]);
    return rows[0];
};

export const createZone = async (SQLClient, { name, description, geom }) => {
    const query = `
        INSERT INTO zone (name, description, geom)
        VALUES ($1, $2, ST_GeomFromGeoJSON($3))
        RETURNING id, name, description, ST_AsGeoJSON(geom) as geom
    `;
    const { rows } = await SQLClient.query(query, [name, description, geom]);
    return rows[0];
};

export const updateZone = async (SQLClient, id, { name, description, geom }) => {
    let query = "UPDATE zone SET ";
    const querySet = [];
    const queryValues = [];

    if (name !== undefined) {
        queryValues.push(name);
        querySet.push(`name = $${queryValues.length}`);
    }
    if (description !== undefined) {
        queryValues.push(description);
        querySet.push(`description = $${queryValues.length}`);
    }
    if (geom !== undefined) {
        queryValues.push(geom);
        querySet.push(`geom = ST_GeomFromGeoJSON($${queryValues.length})`);
    }

    if (queryValues.length > 0) {
        queryValues.push(id);
        query += `${querySet.join(", ")} WHERE id = $${queryValues.length} RETURNING id, name, description, ST_AsGeoJSON(geom) as geom`;
        const { rows } = await SQLClient.query(query, queryValues);
        return rows[0];
    } else {
        throw new Error("No field given");
    }
};

export const deleteZone = async (SQLClient, id) => {
    const query = "DELETE FROM zone WHERE id = $1";
    const result = await SQLClient.query(query, [id]);
    return result.rowCount > 0;
};