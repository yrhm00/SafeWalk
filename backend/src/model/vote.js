export const readVotesByReportId = async (SQLClient, report_id) => {
    const query = `
        SELECT v.*, u.name as user_name
        FROM vote v
        LEFT JOIN users u ON v.user_id = u.id
        WHERE v.report_id = $1
        ORDER BY v.created_at DESC
    `;
    const { rows } = await SQLClient.query(query, [report_id]);
    return rows;
};

export const getVoteSummary = async (SQLClient, report_id) => {
    const query = `
        SELECT 
            COUNT(CASE WHEN value = TRUE THEN 1 END) as upvotes,
            COUNT(CASE WHEN value = FALSE THEN 1 END) as downvotes,
            COUNT(*) as total_votes
        FROM vote
        WHERE report_id = $1
    `;
    const { rows } = await SQLClient.query(query, [report_id]);
    return rows[0];
};

export const createOrUpdateVote = async (SQLClient, { report_id, user_id, value }) => {
    const query = `
        INSERT INTO vote (report_id, user_id, value)
        VALUES ($1, $2, $3)
        ON CONFLICT (report_id, user_id) 
        DO UPDATE SET value = EXCLUDED.value, created_at = NOW()
        RETURNING id, report_id, user_id, value, created_at
    `;
    const { rows } = await SQLClient.query(query, [report_id, user_id, value]);
    return rows[0];
};

export const deleteVote = async (SQLClient, { report_id, user_id }) => {
    const query = "DELETE FROM vote WHERE report_id = $1 AND user_id = $2";
    const result = await SQLClient.query(query, [report_id, user_id]);
    return result.rowCount > 0;
};

export const getUserVote = async (SQLClient, { report_id, user_id }) => {
    const query = `
        SELECT value
        FROM vote
        WHERE report_id = $1 AND user_id = $2
    `;
    const { rows } = await SQLClient.query(query, [report_id, user_id]);
    return rows[0];
};