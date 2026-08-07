export const readCommentsByReportId = async (SQLClient, report_id, limit = 20, offset = 0) => {
    const query = `
        SELECT c.*, u.name as user_name, u.username
        FROM comment c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.report_id = $1
        ORDER BY c.created_at ASC
        LIMIT $2 OFFSET $3
    `;
    const { rows } = await SQLClient.query(query, [report_id, limit, offset]);

    const countResult = await SQLClient.query(
        "SELECT COUNT(*) FROM comment WHERE report_id = $1",
        [report_id]
    );
    const total = parseInt(countResult.rows[0].count);

    return { comments: rows, total };
};

export const readCommentById = async (SQLClient, id) => {
    const query = `
        SELECT c.*, u.name as user_name
        FROM comment c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.id = $1
    `;
    const { rows } = await SQLClient.query(query, [id]);
    return rows[0];
};

export const createComment = async (SQLClient, { report_id, user_id, content }) => {
    const query = `
        INSERT INTO comment (report_id, user_id, content)
        VALUES ($1, $2, $3)
        RETURNING id, report_id, user_id, content, created_at
    `;
    const { rows } = await SQLClient.query(query, [report_id, user_id, content]);
    return rows[0];
};

export const updateComment = async (SQLClient, id, { content }) => {
    const query = `
        UPDATE comment
        SET content = $2
        WHERE id = $1
        RETURNING *
    `;
    const { rows } = await SQLClient.query(query, [id, content]);
    return rows[0];
};

export const deleteComment = async (SQLClient, id) => {
    const query = "DELETE FROM comment WHERE id = $1";
    const result = await SQLClient.query(query, [id]);
    return result.rowCount > 0;
};
