export const readAllReportTypes = async (SQLClient, limit = 20, offset = 0, search = '') => {
    const searchPattern = `%${search}%`;
    const query = "SELECT * FROM report_type WHERE label ILIKE $3 ORDER BY label LIMIT $1 OFFSET $2";
    const { rows } = await SQLClient.query(query, [limit, offset, searchPattern]);

    const countResult = await SQLClient.query(
        "SELECT COUNT(*) FROM report_type WHERE label ILIKE $1",
        [searchPattern]
    );
    const total = parseInt(countResult.rows[0].count);

    return { reportTypes: rows, total };
};

export const readReportTypeById = async (SQLClient, id) => {
    const query = "SELECT * FROM report_type WHERE id = $1";
    const { rows } = await SQLClient.query(query, [id]);
    return rows[0];
};

export const createReportType = async (SQLClient, { label }) => {
    const query = `
        INSERT INTO report_type (label)
        VALUES ($1)
        RETURNING id, label
    `;
    const { rows } = await SQLClient.query(query, [label]);
    return rows[0];
};

export const updateReportType = async (SQLClient, id, { label }) => {
    const query = `
        UPDATE report_type
        SET label = $1
        WHERE id = $2
        RETURNING *
    `;
    const { rows } = await SQLClient.query(query, [label, id]);
    return rows[0];
};

export const deleteReportType = async (SQLClient, id) => {
    const query = "DELETE FROM report_type WHERE id = $1";
    const result = await SQLClient.query(query, [id]);
    return result.rowCount > 0;
};