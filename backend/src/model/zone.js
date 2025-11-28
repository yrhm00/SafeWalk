/**
 * Lire toutes les zones
 */
export const readAllZones = async (SQLClient) => {
    const query = "SELECT * FROM zone ORDER BY id";
    const { rows } = await SQLClient.query(query);
    return rows;
};

/**
 * Lire une zone par ID
 */
export const readZoneById = async (SQLClient, id) => {
    const query = "SELECT * FROM zone WHERE id = $1";
    const { rows } = await SQLClient.query(query, [id]);
    return rows[0];
};

/**
 * Créer une nouvelle zone
 */
export const createZone = async (SQLClient, { name, description, geom }) => {
    const query = `
        INSERT INTO zone (name, description, geom)
        VALUES ($1, $2, ST_GeomFromGeoJSON($3))
        RETURNING id, name, description, ST_AsGeoJSON(geom) as geom
    `;
    const { rows } = await SQLClient.query(query, [name, description, geom]);
    return rows[0];
};

/**
 * Mettre à jour une zone
 */
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

/**
 * Supprimer une zone
 */
export const deleteZone = async (SQLClient, id) => {
    const query = "DELETE FROM zone WHERE id = $1";
    const result = await SQLClient.query(query, [id]);
    return result.rowCount > 0;
};