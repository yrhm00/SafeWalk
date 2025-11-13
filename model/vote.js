export async function setVote(SQLClient, { report_id, user_id, value }) {
    // Essaye d'update, sinon insert
    const up = await SQLClient.query(
        `
    UPDATE vote
    SET value = $3, created_at = NOW()
    WHERE report_id = $1 AND user_id = $2
    RETURNING id, report_id, user_id, value, created_at
    `,
        [report_id, user_id, value]
    );
    if (up.rows[0]) return up.rows[0];

    const ins = await SQLClient.query(
        `
    INSERT INTO vote (report_id, user_id, value)
    VALUES ($1,$2,$3)
    RETURNING id, report_id, user_id, value, created_at
    `,
        [report_id, user_id, value]
    );
    return ins.rows[0];
}

export async function removeMyVote(SQLClient, { report_id, user_id }) {
    await SQLClient.query(`DELETE FROM vote WHERE report_id = $1 AND user_id = $2`, [report_id, user_id]);
}

export async function countByReport(SQLClient, report_id) {
    const r = await SQLClient.query(
        `
    SELECT
      SUM(CASE WHEN value = TRUE THEN 1 ELSE 0 END)::int AS upvote,
      SUM(CASE WHEN value = FALSE THEN 1 ELSE 0 END)::int AS downvote,
      COUNT(*)::int AS total
    FROM vote
    WHERE report_id = $1
    `,
        [report_id]
    );
    return r.rows[0];
}