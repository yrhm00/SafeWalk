/**
 * Lire un utilisateur par son email
 */
export const readUserByEmail = async (SQLClient, { email }) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await SQLClient.query(query, [email]);
    return rows[0];
};

/**
 * Lire tous les utilisateurs
 */
export const readAllUsers = async (SQLClient) => {
    const query = "SELECT id, name, username, email, role, created_at FROM users";
    const { rows } = await SQLClient.query(query);
    return rows;
};

/**
 * Lire un utilisateur par ID
 */
export const readUserById = async (SQLClient, id) => {
    const query = "SELECT id, name, username, email, role, created_at FROM users WHERE id = $1";
    const { rows } = await SQLClient.query(query, [id]);
    return rows[0];
};

/**
 * Créer un nouvel utilisateur
 */
export const createUser = async (SQLClient, { name, username, email, password_hash, role = 'citizen' }) => {
    const query = `
        INSERT INTO users (name, username, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, username, email, role, created_at
    `;
    const { rows } = await SQLClient.query(query, [name, username, email, password_hash, role]);
    return rows[0];
};

/**
 * Mettre à jour un utilisateur (mise à jour partielle)
 */
export const updateUser = async (SQLClient, id, { name, username, email, password_hash }) => {
    let query = "UPDATE users SET ";
    const querySet = [];
    const queryValues = [];

    if (name !== undefined) {
        queryValues.push(name);
        querySet.push(`name = $${queryValues.length}`);
    }
    if (username !== undefined) {
        queryValues.push(username);
        querySet.push(`username = $${queryValues.length}`);
    }
    if (email !== undefined) {
        queryValues.push(email);
        querySet.push(`email = $${queryValues.length}`);
    }
    if (password_hash !== undefined) {
        queryValues.push(password_hash);
        querySet.push(`password_hash = $${queryValues.length}`);
    }

    if (queryValues.length > 0) {
        queryValues.push(id);
        query += `${querySet.join(", ")} WHERE id = $${queryValues.length} RETURNING id, name, username, email, role`;
        const { rows } = await SQLClient.query(query, queryValues);
        return rows[0];
    } else {
        throw new Error("No field given");
    }
};

/**
 * Supprimer un utilisateur
 */
export const deleteUser = async (SQLClient, id) => {
    const query = "DELETE FROM users WHERE id = $1";
    const result = await SQLClient.query(query, [id]);
    return result.rowCount > 0;
};
