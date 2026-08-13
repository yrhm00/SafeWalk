export const readUserByEmail = async (SQLClient, { email }) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await SQLClient.query(query, [email]);
    return rows[0];
};

export const readAllUsers = async (SQLClient, limit = 20, offset = 0, search = '') => {
    const searchPattern = `%${search}%`;
    const query = `
        SELECT id, name, username, email, role, created_at
        FROM users
        WHERE name ILIKE $3 OR username ILIKE $3 OR email ILIKE $3
        ORDER BY id
        LIMIT $1 OFFSET $2
    `;
    const { rows } = await SQLClient.query(query, [limit, offset, searchPattern]);

    const countResult = await SQLClient.query(
        "SELECT COUNT(*) FROM users WHERE name ILIKE $1 OR username ILIKE $1 OR email ILIKE $1",
        [searchPattern]
    );
    const total = parseInt(countResult.rows[0].count);

    return { users: rows, total };
};

export const readUserById = async (SQLClient, id) => {
    const query = "SELECT id, name, username, email, role, created_at FROM users WHERE id = $1";
    const { rows } = await SQLClient.query(query, [id]);
    return rows[0];
};

export const readPasswordHashById = async (SQLClient, id) => {
    const query = "SELECT password_hash FROM users WHERE id = $1";
    const { rows } = await SQLClient.query(query, [id]);
    return rows[0]?.password_hash || null;
};

export const createUser = async (SQLClient, { name, username, email, password_hash, role = 'citizen' }) => {
    const query = `
        INSERT INTO users (name, username, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, username, email, role, created_at
    `;
    const { rows } = await SQLClient.query(query, [name, username, email, password_hash, role]);
    return rows[0];
};

export const updateUser = async (SQLClient, id, { name, username, email, password_hash, role }) => {
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
    if (role !== undefined) {
        queryValues.push(role);
        querySet.push(`role = $${queryValues.length}`);
    }

    if (queryValues.length > 0) {
        queryValues.push(id);
        query += `${querySet.join(", ")} WHERE id = $${queryValues.length} RETURNING id, name, username, email, role, created_at`;
        const { rows } = await SQLClient.query(query, queryValues);
        return rows[0];
    } else {
        throw new Error("No field given");
    }
};

export const deleteUser = async (SQLClient, id) => {
    const query = "DELETE FROM users WHERE id = $1";
    const result = await SQLClient.query(query, [id]);
    return result.rowCount > 0;
};
