export const readUser = async (SQLClient, { id }) => {
    const { rows } = await SQLClient.query('SELECT id, name, username, email, role, created_at FROM users WHERE id = $1', [id]);
    return rows[0];
};
export const updateUser = async (SQLClient, { name, username, email, password_hash, role, id }) => {
    let query = "UPDATE users SET ";

    const querySet = [];
    const queryValues = [];

    if (name) {
        queryValues.push(name);
        querySet.push(`name = $${queryValues.length}`);
    }
    if (username) {
        queryValues.push(username);
        querySet.push(`username = $${queryValues.length}`);
    }
    if (email) {
        queryValues.push(email);
        querySet.push(`email = $${queryValues.length}`);
    }
    if (password_hash) {
        queryValues.push(password_hash);
        querySet.push(`password_hash = $${queryValues.length}`);
    }
    if (role) {
        queryValues.push(role);
        querySet.push(`role = $${queryValues.length}`);
    }

    if (queryValues.length > 0) {
        queryValues.push(id);
        query +=  `${querySet.join(', ')} WHERE id = $${queryValues.length}`;
        return await SQLClient.query(query, queryValues);
    } else {
        throw new Error("No field given");
    }
};
export const createUser = async (SQLClient, { name = null, username, email, password_hash, role = 'citizen' }) => {
    const { rows } = await SQLClient.query('INSERT INTO users (name, username, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, username, email, password_hash, role]);
    return rows[0]?.id ?? null;
};
export const deleteUser = async (SQLClient, { id }) => {
    const { rows } = await SQLClient.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
};


export const readUserByUsername = async (SQLClient, { username }) => {
    if (!username) throw new Error('username manquant');
    const { rows } = await SQLClient.query('SELECT id, name, username, email, role, created_at FROM users WHERE username = $1', [username]);
    return rows[0] ?? null;
};
export const listUsers = async (SQLClient, { limit = 100, offset = 0 } = {}) => {
    // protège contre des valeurs dangereuses
    limit = Math.min(1000, Math.max(1, Number(limit) || 100));
    offset = Math.max(0, Number(offset) || 0);
    const query = 'SELECT id, name, username, email, role, created_at FROM users ORDER BY id DESC LIMIT $1 OFFSET $2';
    const { rows } = await SQLClient.query(query, [limit, offset]);
    return rows;
};