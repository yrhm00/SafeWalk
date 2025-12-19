export const readAllReportTypes = async (SQLClient) => {
    const query = "SELECT * FROM report_type ORDER BY label";
    const { rows } = await SQLClient.query(query);
    return rows;
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